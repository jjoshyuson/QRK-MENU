-- Expose the configured demo service mode through the existing tenant-scoped
-- access context. The settings JSON remains the flexible, location-ready seam.
create or replace function public.get_my_access_context()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'userId', profile.user_id, 'username', profile.username, 'displayName', profile.display_name,
    'businessId', business.id, 'businessName', business.name, 'businessSlug', business.public_slug,
    'serviceMode', coalesce(business_profile.settings->>'serviceMode', 'quick'),
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
  join public.business_profiles business_profile on business_profile.business_id = business.id
  where profile.user_id = (select auth.uid())
  order by member.created_at limit 1;
$$;
