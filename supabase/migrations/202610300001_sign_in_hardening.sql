-- Sign-in hardening: the database, not the browser, enforces first-login
-- password changes; paused businesses lose data access; and issuing a new
-- temporary password ends the account's existing sessions.

create table private.temporary_passwords (
  user_id uuid primary key references auth.users(id) on delete cascade,
  password_hash text not null,
  issued_at timestamptz not null default now()
);
revoke all on table private.temporary_passwords from public, anon, authenticated;

-- Identities provisioned before this migration carried only the user-editable metadata flag.
insert into private.temporary_passwords (user_id, password_hash)
select id, encrypted_password from auth.users
where raw_user_meta_data->>'must_change_password' = 'true' and encrypted_password is not null
on conflict (user_id) do nothing;

-- True while the signed-in user still holds the password QRK issued. Any
-- password change through Supabase Auth replaces the hash and clears it.
create function private.password_change_pending()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from private.temporary_passwords issued
    join auth.users account on account.id = issued.user_id
    where issued.user_id = (select auth.uid()) and account.encrypted_password = issued.password_hash
  );
$$;

create or replace function private.is_business_member(target_business_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    join public.businesses business on business.id = member.business_id and business.active
    where member.business_id = target_business_id
      and member.user_id = (select auth.uid())
      and member.active
  ) and not private.password_change_pending();
$$;

create or replace function private.has_business_role(target_business_id uuid, allowed_roles public.business_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    join public.businesses business on business.id = member.business_id and business.active
    where member.business_id = target_business_id
      and member.user_id = (select auth.uid())
      and member.active
      and member.role = any(allowed_roles)
  ) and not private.password_change_pending();
$$;

create or replace function private.has_business_permission(target_business_id uuid, permission_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    join public.businesses business on business.id = member.business_id and business.active
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
  ) and not private.password_change_pending();
$$;

create or replace function public.get_my_access_context()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'userId', profile.user_id, 'username', profile.username, 'displayName', profile.display_name,
    'businessId', business.id, 'businessName', business.name, 'businessSlug', business.public_slug,
    'serviceMode', coalesce(business_profile.settings->>'serviceMode', 'quick'),
    'role', member.role, 'active', member.active,
    'mustChangePassword', private.password_change_pending(),
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
  join public.business_profiles business_profile on business_profile.business_id = business.id
  where profile.user_id = (select auth.uid())
  order by member.created_at limit 1;
$$;

-- Called by the platform-clients Edge Function right after it sets a temporary
-- password: records it as pending and signs the account out everywhere.
create function public.issue_temporary_password(p_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into private.temporary_passwords (user_id, password_hash)
  select id, encrypted_password from auth.users where id = p_user_id and encrypted_password is not null
  on conflict (user_id) do update set password_hash = excluded.password_hash, issued_at = now();
  if not found then raise exception 'user not found' using errcode = 'P0002'; end if;
  delete from auth.sessions where user_id = p_user_id;
end;
$$;

revoke all on function private.password_change_pending(), public.issue_temporary_password(uuid) from public, anon, authenticated;
grant execute on function public.issue_temporary_password(uuid) to service_role;
