-- Hosted, device-authenticated table sessions for cross-device staging.

create function public.get_table_sessions(p_destination_slug text, p_device_id uuid, p_device_secret text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_business_id uuid;
begin
  select business_id into target_business_id from public.public_destinations where slug=p_destination_slug and active;
  if target_business_id is null then raise exception 'menu not found' using errcode='P0002'; end if;
  if not private.can_manage_orders(target_business_id) and not private.device_matches(target_business_id,p_device_id,p_device_secret) then raise exception 'table access rejected' using errcode='28000'; end if;
  update public.table_sessions set status='expired',updated_at=now() where business_id=target_business_id and status='pending' and expires_at<=now();
  update public.table_join_requests set status='expired',resolved_at=now() where business_id=target_business_id and status='pending' and expires_at<=now();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id',s.id,'table',s.table_number,'status',s.status,'guestCount',s.guest_count,'packageId',s.package_id,
    'createdAt',s.created_at,'updatedAt',s.updated_at,'expiresAt',s.expires_at,
    'participants',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'deviceId',p.device_id,'name',p.name,'role',p.role,'permission',p.permission,'joinedAt',p.joined_at) order by p.joined_at) from public.table_session_participants p where p.session_id=s.id),'[]'::jsonb),
    'joinRequests',coalesce((select jsonb_agg(jsonb_build_object('id',j.id,'deviceId',j.device_id,'name',j.name,'status',j.status,'approvalBy',j.approval_by,'requestedAt',j.requested_at,'expiresAt',j.expires_at,'resolvedAt',j.resolved_at) order by j.requested_at) from public.table_join_requests j where j.session_id=s.id),'[]'::jsonb)
  ) order by s.table_number::integer) from public.table_sessions s where s.business_id=target_business_id and s.clear_batch_id is null and s.status in ('pending','active','bill_requested')),'[]'::jsonb);
end;
$$;

create function public.request_table_session(p_destination_slug text,p_device_id uuid,p_device_secret text,p_table_number text,p_name text,p_guest_count integer,p_package_id text,p_staff_acceptance boolean,p_timeout_seconds integer,p_join_policy text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_business_id uuid; target_session public.table_sessions%rowtype;
begin
  select business_id into target_business_id from public.public_destinations where slug=p_destination_slug and active;
  if target_business_id is null or not private.device_matches(target_business_id,p_device_id,p_device_secret) then raise exception 'device identity rejected' using errcode='28000'; end if;
  if p_table_number !~ '^[0-9]{1,3}$' or char_length(coalesce(btrim(p_name),'')) not between 1 and 60 then raise exception 'invalid table request' using errcode='22023'; end if;
  select * into target_session from public.table_sessions where business_id=target_business_id and table_number=p_table_number and clear_batch_id is null and status in ('pending','active','bill_requested') for update;
  if target_session.id is null then
    insert into public.table_sessions(business_id,table_number,status,guest_count,package_id,expires_at)
    values(target_business_id,p_table_number,case when p_staff_acceptance then 'pending' else 'active' end,greatest(1,least(50,coalesce(p_guest_count,1))),nullif(p_package_id,''),case when p_staff_acceptance then now()+make_interval(secs=>greatest(30,least(600,coalesce(p_timeout_seconds,90)))) end)
    returning * into target_session;
    insert into public.table_session_participants(business_id,session_id,device_id,name,role,permission) values(target_business_id,target_session.id,p_device_id,btrim(p_name),'host','approve');
  elsif not exists(select 1 from public.table_session_participants where session_id=target_session.id and device_id=p_device_id) and not exists(select 1 from public.table_join_requests where session_id=target_session.id and device_id=p_device_id and status='pending') then
    insert into public.table_join_requests(business_id,session_id,device_id,name,approval_by,expires_at)
    values(target_business_id,target_session.id,p_device_id,btrim(p_name),case when p_join_policy='staff' then 'staff' else 'host' end,now()+make_interval(secs=>greatest(30,least(600,coalesce(p_timeout_seconds,90)))));
  end if;
  perform realtime.send(jsonb_build_object('sessionId',target_session.id,'action','requested'),'table_changed','business:'||target_business_id::text||':tables',true);
  return (select value from jsonb_array_elements(public.get_table_sessions(p_destination_slug,p_device_id,p_device_secret)) value where value->>'id'=target_session.id::text);
end;
$$;

create function public.change_table_session(p_destination_slug text,p_session_id uuid,p_action text,p_device_id uuid,p_device_secret text,p_request_id uuid default null,p_permission text default 'direct')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_business_id uuid; target_session public.table_sessions%rowtype; is_staff boolean; is_device boolean; join_device uuid; join_name text;
begin
  select business_id into target_business_id from public.public_destinations where slug=p_destination_slug and active;
  select * into target_session from public.table_sessions where id=p_session_id and business_id=target_business_id and clear_batch_id is null for update;
  if target_session.id is null then raise exception 'table session not found' using errcode='P0002'; end if;
  is_staff:=private.can_manage_orders(target_business_id); is_device:=private.device_matches(target_business_id,p_device_id,p_device_secret);
  if p_action in ('accept','clean') then
    if not is_staff then raise exception 'staff access required' using errcode='42501'; end if;
    update public.table_sessions set status=case when p_action='accept' then 'active' else 'cleaned' end,expires_at=null,updated_at=now() where id=p_session_id;
  elsif p_action='cancel' then
    if not is_device then raise exception 'device access required' using errcode='28000'; end if;
    update public.table_join_requests set status='cancelled',resolved_at=now() where session_id=p_session_id and device_id=p_device_id and status='pending';
    if not found then update public.table_sessions set status='cancelled',updated_at=now() where id=p_session_id and status='pending' and exists(select 1 from public.table_session_participants p where p.session_id=p_session_id and p.device_id=p_device_id and p.role='host'); end if;
  elsif p_action='approve-join' then
    if not is_device or not exists(select 1 from public.table_session_participants p where p.session_id=p_session_id and p.device_id=p_device_id and p.role='host') then raise exception 'host access required' using errcode='42501'; end if;
    update public.table_join_requests set status='approved',resolved_at=now() where id=p_request_id and session_id=p_session_id and status='pending' returning device_id,name into join_device,join_name;
    if not found then raise exception 'join request not found' using errcode='P0002'; end if;
    insert into public.table_session_participants(business_id,session_id,device_id,name,role,permission) values(target_business_id,p_session_id,join_device,join_name,'guest',left(coalesce(p_permission,'direct'),30));
  else raise exception 'unknown table action' using errcode='22023'; end if;
  perform realtime.send(jsonb_build_object('sessionId',p_session_id,'action',p_action),'table_changed','business:'||target_business_id::text||':tables',true);
  return jsonb_build_object('id',p_session_id,'status',(select status from public.table_sessions where id=p_session_id));
end;
$$;

grant execute on function public.get_table_sessions(text,uuid,text) to anon,authenticated;
grant execute on function public.request_table_session(text,uuid,text,text,text,integer,text,boolean,integer,text) to anon,authenticated;
grant execute on function public.change_table_session(text,uuid,text,uuid,text,uuid,text) to anon,authenticated;
