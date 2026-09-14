-- Durable device-scoped ordering, table sessions, and reversible operational clears.
-- Portable tables stay in public; Supabase Auth/Realtime are used only at the RPC edge.

create table public.customer_devices (
  id uuid not null,
  business_id uuid not null references public.businesses(id) on delete restrict,
  secret_hash text not null,
  label text not null default 'Customer device' check (char_length(label) between 1 and 80),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (business_id, id),
  unique (id, business_id)
);

create table public.data_clear_batches (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  cleared_by uuid not null,
  cleared_at timestamptz not null default now(),
  restored_by uuid,
  restored_at timestamptz,
  restorable boolean not null default true,
  affected_counts jsonb not null default '{}'::jsonb check (jsonb_typeof(affected_counts) = 'object'),
  unique (id, business_id)
);
create index data_clear_batches_business_idx on public.data_clear_batches(business_id, cleared_at desc);

create table public.table_sessions (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  table_number text not null check (table_number ~ '^[0-9]{1,3}$'),
  status text not null default 'pending' check (status in ('pending','active','bill_requested','cleaned','cancelled','expired')),
  guest_count smallint not null default 1 check (guest_count between 1 and 50),
  package_id text,
  expires_at timestamptz,
  clear_batch_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (clear_batch_id, business_id) references public.data_clear_batches(id, business_id) on delete restrict,
  unique (id, business_id)
);
create unique index table_sessions_one_live_table_idx on public.table_sessions(business_id, table_number)
  where clear_batch_id is null and status in ('pending','active','bill_requested');

create table public.table_session_participants (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null,
  session_id uuid not null,
  device_id uuid not null,
  name text not null default 'Guest' check (char_length(name) between 1 and 60),
  role text not null check (role in ('host','guest')),
  permission text not null default 'direct' check (char_length(permission) between 1 and 30),
  joined_at timestamptz not null default now(),
  foreign key (session_id, business_id) references public.table_sessions(id, business_id) on delete restrict,
  foreign key (device_id, business_id) references public.customer_devices(id, business_id) on delete restrict,
  unique (session_id, device_id)
);

create table public.table_join_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null,
  session_id uuid not null,
  device_id uuid not null,
  name text not null default 'Guest' check (char_length(name) between 1 and 60),
  status text not null default 'pending' check (status in ('pending','approved','cancelled','expired')),
  approval_by text not null default 'host' check (approval_by in ('host','staff')),
  requested_at timestamptz not null default now(),
  expires_at timestamptz,
  resolved_at timestamptz,
  foreign key (session_id, business_id) references public.table_sessions(id, business_id) on delete restrict,
  foreign key (device_id, business_id) references public.customer_devices(id, business_id) on delete restrict
);
create unique index table_join_requests_pending_idx on public.table_join_requests(session_id, device_id) where status = 'pending';

create table public.open_tabs (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null,
  session_id uuid not null,
  status text not null default 'open' check (status in ('open','bill_requested','settled','closed','cancelled')),
  clear_batch_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (session_id, business_id) references public.table_sessions(id, business_id) on delete restrict,
  foreign key (clear_batch_id, business_id) references public.data_clear_batches(id, business_id) on delete restrict,
  unique (session_id)
);

alter table public.orders add column device_id uuid;
alter table public.orders add column table_session_id uuid;
alter table public.orders add column open_tab_id uuid;
alter table public.orders add column clear_batch_id uuid;
alter table public.orders add foreign key (device_id, business_id) references public.customer_devices(id, business_id) on delete restrict;
alter table public.orders add foreign key (table_session_id, business_id) references public.table_sessions(id, business_id) on delete restrict;
alter table public.orders add foreign key (open_tab_id, business_id) references public.open_tabs(id, business_id) on delete restrict;
alter table public.orders add foreign key (clear_batch_id, business_id) references public.data_clear_batches(id, business_id) on delete restrict;
create index orders_business_visible_idx on public.orders(business_id, status, created_at) where clear_batch_id is null;

create function private.device_matches(target_business_id uuid, target_device_id uuid, supplied_secret text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.customer_devices device
    where device.business_id = target_business_id and device.id = target_device_id
      and device.secret_hash = encode(extensions.digest(supplied_secret, 'sha256'), 'hex')
  );
$$;

create function public.register_customer_device(
  p_destination_slug text, p_device_id uuid, p_device_secret text,
  p_label text default 'Customer device', p_metadata jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_business_id uuid;
begin
  if char_length(p_device_secret) < 32 then raise exception 'invalid device secret' using errcode = '22023'; end if;
  select destination.business_id into target_business_id from public.public_destinations destination
    join public.businesses business on business.id = destination.business_id
    where destination.slug = p_destination_slug and destination.active and business.active;
  if target_business_id is null then raise exception 'menu not found' using errcode = 'P0002'; end if;
  insert into public.customer_devices(id,business_id,secret_hash,label,metadata)
  values(p_device_id,target_business_id,encode(extensions.digest(p_device_secret,'sha256'),'hex'),left(coalesce(nullif(btrim(p_label),''),'Customer device'),80),coalesce(p_metadata,'{}'::jsonb))
  on conflict (business_id,id) do update set last_seen_at=now(), metadata=excluded.metadata
    where public.customer_devices.secret_hash=excluded.secret_hash;
  if not private.device_matches(target_business_id,p_device_id,p_device_secret) then raise exception 'device identity rejected' using errcode='28000'; end if;
  return jsonb_build_object('deviceId',p_device_id,'businessId',target_business_id,'registered',true);
end;
$$;

create function public.create_device_order(
  p_destination_slug text, p_request_id uuid, p_fulfillment text, p_table_number text,
  p_customer_label text, p_order_notes text, p_line_items jsonb,
  p_device_id uuid, p_device_secret text, p_table_session_id uuid default null, p_open_tab_id uuid default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb; target_business_id uuid;
begin
  select business_id into target_business_id from public.public_destinations where slug=p_destination_slug and active;
  if not private.device_matches(target_business_id,p_device_id,p_device_secret) then raise exception 'device identity rejected' using errcode='28000'; end if;
  if p_table_session_id is not null and not exists(select 1 from public.table_session_participants p where p.business_id=target_business_id and p.session_id=p_table_session_id and p.device_id=p_device_id) then raise exception 'device is not in table session' using errcode='42501'; end if;
  result := public.create_public_order(p_destination_slug,p_request_id,p_fulfillment,p_table_number,p_customer_label,p_order_notes,p_line_items);
  update public.orders set device_id=p_device_id,table_session_id=p_table_session_id,open_tab_id=p_open_tab_id where id=(result->>'id')::uuid and clear_batch_id is null;
  return result;
end;
$$;

create function public.list_order_clear_batches(p_business_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',b.id,'clearedAt',b.cleared_at,'restoredAt',b.restored_at,'restorable',b.restorable,'affectedCounts',b.affected_counts) order by b.cleared_at desc),'[]'::jsonb)
  from public.data_clear_batches b where b.business_id=p_business_id and private.has_business_role(p_business_id,array['owner','admin']::public.business_role[]);
$$;

create function public.clear_order_activity(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare batch_id uuid; order_count integer; session_count integer; tab_count integer; counts jsonb;
begin
  if not private.has_business_role(p_business_id,array['owner','admin']::public.business_role[]) then raise exception 'business not found' using errcode='P0002'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_business_id::text,39127));
  select count(*) into order_count from public.orders where business_id=p_business_id and clear_batch_id is null;
  select count(*) into session_count from public.table_sessions where business_id=p_business_id and clear_batch_id is null;
  select count(*) into tab_count from public.open_tabs where business_id=p_business_id and clear_batch_id is null;
  counts:=jsonb_build_object('orders',order_count,'tableSessions',session_count,'openTabs',tab_count);
  insert into public.data_clear_batches(business_id,cleared_by,affected_counts) values(p_business_id,(select auth.uid()),counts) returning id into batch_id;
  update public.orders set clear_batch_id=batch_id where business_id=p_business_id and clear_batch_id is null;
  update public.open_tabs set clear_batch_id=batch_id where business_id=p_business_id and clear_batch_id is null;
  update public.table_sessions set clear_batch_id=batch_id where business_id=p_business_id and clear_batch_id is null;
  update public.data_clear_batches set restorable=false where business_id=p_business_id and restored_at is null and id not in
    (select id from public.data_clear_batches where business_id=p_business_id and restored_at is null order by cleared_at desc limit 2);
  perform realtime.send(jsonb_build_object('batchId',batch_id,'action','cleared'),'order_changed','business:'||p_business_id::text||':orders',true);
  return jsonb_build_object('id',batch_id,'affectedCounts',counts,'clearedAt',now());
end;
$$;

create function public.restore_order_activity(p_batch_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare batch public.data_clear_batches%rowtype;
begin
  select * into batch from public.data_clear_batches where id=p_batch_id for update;
  if batch.id is null or not private.has_business_role(batch.business_id,array['owner','admin']::public.business_role[]) then raise exception 'clear batch not found' using errcode='P0002'; end if;
  if not batch.restorable or batch.restored_at is not null then raise exception 'clear batch is not restorable' using errcode='55000'; end if;
  perform pg_advisory_xact_lock(hashtextextended(batch.business_id::text,39127));
  update public.orders set clear_batch_id=null where clear_batch_id=batch.id;
  update public.open_tabs set clear_batch_id=null where clear_batch_id=batch.id;
  update public.table_sessions set clear_batch_id=null where clear_batch_id=batch.id;
  update public.data_clear_batches set restored_at=now(),restored_by=(select auth.uid()),restorable=false where id=batch.id;
  perform realtime.send(jsonb_build_object('batchId',batch.id,'action','restored'),'order_changed','business:'||batch.business_id::text||':orders',true);
  return jsonb_build_object('id',batch.id,'restoredAt',now(),'affectedCounts',batch.affected_counts);
end;
$$;

grant execute on function public.register_customer_device(text,uuid,text,text,jsonb) to anon,authenticated;
grant execute on function public.create_device_order(text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid) to anon,authenticated;
grant execute on function public.list_order_clear_batches(uuid) to authenticated;
grant execute on function public.clear_order_activity(uuid) to authenticated;
grant execute on function public.restore_order_activity(uuid) to authenticated;
grant select on public.customer_devices,public.data_clear_batches,public.table_sessions,public.table_session_participants,public.table_join_requests,public.open_tabs to authenticated;

alter table public.customer_devices enable row level security;
alter table public.data_clear_batches enable row level security;
alter table public.table_sessions enable row level security;
alter table public.table_session_participants enable row level security;
alter table public.table_join_requests enable row level security;
alter table public.open_tabs enable row level security;
create policy customer_devices_staff_read on public.customer_devices for select to authenticated using(private.can_manage_orders(business_id));
create policy clear_batches_admin_read on public.data_clear_batches for select to authenticated using(private.has_business_role(business_id,array['owner','admin']::public.business_role[]));
create policy table_sessions_staff_read on public.table_sessions for select to authenticated using(private.can_manage_orders(business_id));
create policy table_participants_staff_read on public.table_session_participants for select to authenticated using(private.can_manage_orders(business_id));
create policy table_join_requests_staff_read on public.table_join_requests for select to authenticated using(private.can_manage_orders(business_id));
create policy open_tabs_staff_read on public.open_tabs for select to authenticated using(private.can_manage_orders(business_id));

-- Hide cleared records from ordinary staff REST reads and customer tracking.
drop policy order_staff_read on public.orders;
create policy order_staff_read on public.orders for select to authenticated using(private.can_manage_orders(business_id) and clear_batch_id is null);

create or replace function public.get_public_order_status(p_destination_slug text, p_order_number text, p_tracking_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', customer_order.id, 'orderNumber', customer_order.order_number,
    'status', customer_order.status, 'subtotalMinor', customer_order.subtotal_minor,
    'createdAt', customer_order.created_at, 'updatedAt', customer_order.updated_at,
    'events', coalesce((select jsonb_agg(jsonb_build_object('status',event.to_status,'label',event.label,'at',event.created_at) order by event.id)
      from public.order_status_events event where event.order_id=customer_order.id),'[]'::jsonb)
  ) from public.orders customer_order
  join public.public_destinations destination on destination.business_id=customer_order.business_id
  where destination.slug=p_destination_slug and destination.active and customer_order.order_number=p_order_number
    and customer_order.tracking_token=p_tracking_token and customer_order.clear_batch_id is null;
$$;

create or replace function public.transition_order_status(
  p_order_id uuid,p_expected_status public.order_status,p_next_status public.order_status,p_handoff_token text default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_order public.orders%rowtype; event_label text;
begin
  select * into target_order from public.orders where id=p_order_id and clear_batch_id is null for update;
  if target_order.id is null or not private.can_manage_orders(target_order.business_id) then raise exception 'order not found' using errcode='P0002'; end if;
  if target_order.status<>p_expected_status then raise exception 'order status changed; refresh and try again' using errcode='40001'; end if;
  if p_next_status='completed' then
    if p_expected_status<>'ready' or upper(btrim(coalesce(p_handoff_token,'')))<>target_order.verification_token then raise exception 'handoff token does not match' using errcode='22023'; end if;
    event_label:='Handoff completed';
  elsif p_next_status='cancelled' then event_label:='Order cancelled';
  elsif p_next_status='preparing' then event_label:='Started preparing';
  elsif p_next_status='ready' then event_label:='Marked ready';
  else raise exception 'invalid target status' using errcode='22023'; end if;
  update public.orders set status=p_next_status,handoff_verified_at=case when p_next_status='completed' then now() else handoff_verified_at end where id=target_order.id returning * into target_order;
  insert into public.order_status_events(business_id,order_id,from_status,to_status,actor_user_id,label)
  values(target_order.business_id,target_order.id,p_expected_status,p_next_status,(select auth.uid()),event_label);
  return jsonb_build_object('id',target_order.id,'orderNumber',target_order.order_number,'status',target_order.status,'updatedAt',target_order.updated_at);
end;
$$;
