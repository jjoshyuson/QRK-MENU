-- Keep Open Tab table sessions visible to their customer device long enough to archive the settled visit.

create or replace function public.get_table_sessions(p_destination_slug text, p_device_id uuid, p_device_secret text)
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
  ) order by s.table_number::integer) from public.table_sessions s where s.business_id=target_business_id and s.clear_batch_id is null and (s.status in ('pending','active','bill_requested') or (s.status='settled' and exists(select 1 from public.table_session_participants p where p.session_id=s.id and p.device_id=p_device_id)))),'[]'::jsonb);
end;
$$;

create or replace function public.change_table_session(p_destination_slug text,p_session_id uuid,p_action text,p_device_id uuid,p_device_secret text,p_request_id uuid default null,p_permission text default 'direct')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_business_id uuid; target_session public.table_sessions%rowtype; is_staff boolean; is_device boolean; join_device uuid; join_name text;
begin
  select business_id into target_business_id from public.public_destinations where slug=p_destination_slug and active;
  select * into target_session from public.table_sessions where id=p_session_id and business_id=target_business_id and clear_batch_id is null for update;
  if target_session.id is null then raise exception 'table session not found' using errcode='P0002'; end if;
  is_staff:=private.can_manage_orders(target_business_id); is_device:=private.device_matches(target_business_id,p_device_id,p_device_secret);
  if p_action in ('accept','clean','paid') then
    if not is_staff then raise exception 'staff access required' using errcode='42501'; end if;
    update public.table_sessions set status=case when p_action='accept' then 'active' when p_action='paid' then 'settled' else 'cleaned' end,expires_at=null,updated_at=now() where id=p_session_id;
    if p_action='paid' then update public.open_tabs set status='settled',updated_at=now() where session_id=p_session_id and clear_batch_id is null and status in ('open','bill_requested'); end if;
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
