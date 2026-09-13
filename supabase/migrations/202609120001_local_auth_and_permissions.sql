-- Local Auth milestone: global usernames, tenant context and granular staff permissions.

create table public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9][a-z0-9._-]{2,39}$'),
  display_name text not null check (char_length(display_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_members
  add column can_view_orders boolean not null default false,
  add column can_accept_orders boolean not null default false,
  add column can_prepare_orders boolean not null default false,
  add column can_mark_ready boolean not null default false,
  add column can_complete_orders boolean not null default false,
  add column can_cancel_orders boolean not null default false,
  add column can_change_availability boolean not null default false,
  add column can_edit_menu boolean not null default false,
  add column can_view_order_history boolean not null default false,
  add column can_view_sales boolean not null default false;

update public.business_members set
  can_view_orders = can_manage_orders,
  can_accept_orders = can_manage_orders,
  can_prepare_orders = can_manage_orders,
  can_mark_ready = can_manage_orders,
  can_complete_orders = can_manage_orders,
  can_cancel_orders = can_manage_orders,
  can_change_availability = can_manage_menu,
  can_edit_menu = can_manage_menu,
  can_view_order_history = can_manage_orders,
  can_view_sales = role in ('owner','admin','manager');

create or replace function private.has_business_permission(target_business_id uuid, permission_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    where member.business_id = target_business_id and member.user_id = (select auth.uid()) and member.active
      and (member.role in ('owner','admin') or case permission_name
        when 'view_orders' then member.can_view_orders
        when 'accept_orders' then member.can_accept_orders
        when 'prepare_orders' then member.can_prepare_orders
        when 'mark_ready' then member.can_mark_ready
        when 'complete_orders' then member.can_complete_orders
        when 'cancel_orders' then member.can_cancel_orders
        when 'change_availability' then member.can_change_availability
        when 'edit_menu' then member.can_edit_menu
        when 'view_order_history' then member.can_view_order_history
        when 'view_sales' then member.can_view_sales
        when 'manage_staff' then member.can_manage_staff
        else false end)
  );
$$;

create or replace function private.can_manage_orders(target_business_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.has_business_permission(target_business_id, 'view_orders');
$$;

create or replace function private.can_manage_menu(target_business_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.has_business_permission(target_business_id, 'edit_menu')
      or private.has_business_permission(target_business_id, 'change_availability');
$$;

create function public.get_my_access_context()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'userId', profile.user_id, 'username', profile.username, 'displayName', profile.display_name,
    'businessId', business.id, 'businessName', business.name, 'businessSlug', business.public_slug,
    'role', member.role, 'active', member.active,
    'permissions', jsonb_build_object(
      'viewOrders', member.role in ('owner','admin') or member.can_view_orders,
      'acceptOrders', member.role in ('owner','admin') or member.can_accept_orders,
      'prepareOrders', member.role in ('owner','admin') or member.can_prepare_orders,
      'markReady', member.role in ('owner','admin') or member.can_mark_ready,
      'completeOrders', member.role in ('owner','admin') or member.can_complete_orders,
      'cancelOrders', member.role in ('owner','admin') or member.can_cancel_orders,
      'changeAvailability', member.role in ('owner','admin') or member.can_change_availability,
      'editMenu', member.role in ('owner','admin') or member.can_edit_menu,
      'viewOrderHistory', member.role in ('owner','admin') or member.can_view_order_history,
      'viewSales', member.role in ('owner','admin') or member.can_view_sales,
      'manageStaff', member.role in ('owner','admin') or member.can_manage_staff
    )
  )
  from public.user_profiles profile
  join public.business_members member on member.user_id = profile.user_id and member.active
  join public.businesses business on business.id = member.business_id and business.active
  where profile.user_id = (select auth.uid())
  order by member.created_at limit 1;
$$;

create or replace function public.transition_order_status(
  p_order_id uuid, p_expected_status public.order_status, p_next_status public.order_status, p_handoff_token text default null
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_order public.orders%rowtype; event_label text; required_permission text;
begin
  select * into target_order from public.orders where id = p_order_id for update;
  required_permission := case p_next_status when 'preparing' then 'prepare_orders' when 'ready' then 'mark_ready' when 'completed' then 'complete_orders' when 'cancelled' then 'cancel_orders' else '' end;
  if target_order.id is null or not private.has_business_permission(target_order.business_id, required_permission) then raise exception 'order not found' using errcode = 'P0002'; end if;
  if p_next_status = 'preparing' and not private.has_business_permission(target_order.business_id, 'accept_orders') then raise exception 'order not found' using errcode = 'P0002'; end if;
  if target_order.status <> p_expected_status then raise exception 'order status changed; refresh and try again' using errcode = '40001'; end if;
  if p_next_status = 'completed' then
    if p_expected_status <> 'ready' or upper(btrim(coalesce(p_handoff_token, ''))) <> target_order.verification_token then raise exception 'handoff token does not match' using errcode = '22023'; end if;
    event_label := 'Handoff completed';
  elsif p_next_status = 'cancelled' then event_label := 'Order cancelled';
  elsif p_next_status = 'preparing' and p_expected_status = 'received' then event_label := 'Started preparing';
  elsif p_next_status = 'ready' and p_expected_status = 'preparing' then event_label := 'Marked ready';
  else raise exception 'invalid target status' using errcode = '22023';
  end if;
  update public.orders set status = p_next_status, handoff_verified_at = case when p_next_status = 'completed' then now() else handoff_verified_at end where id = target_order.id returning * into target_order;
  insert into public.order_status_events (business_id, order_id, from_status, to_status, actor_user_id, label)
  values (target_order.business_id, target_order.id, p_expected_status, p_next_status, (select auth.uid()), event_label);
  return jsonb_build_object('id', target_order.id, 'orderNumber', target_order.order_number, 'status', target_order.status, 'updatedAt', target_order.updated_at);
end;
$$;

alter table public.user_profiles enable row level security;
create policy profile_self_read on public.user_profiles for select to authenticated using (user_id = (select auth.uid()));
grant select on public.user_profiles to authenticated;
grant execute on function public.get_my_access_context() to authenticated;
