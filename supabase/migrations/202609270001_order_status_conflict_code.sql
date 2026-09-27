-- A stale UI status is an application conflict, not a PostgreSQL serialization
-- failure. SQLSTATE 40001 is retryable and caused PostgREST/Supabase clients to
-- repeatedly execute the same rejected transition until the database saturated.
create or replace function public.transition_order_status(
  p_order_id uuid,
  p_expected_status public.order_status,
  p_next_status public.order_status,
  p_handoff_token text default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  target_order public.orders%rowtype;
  event_label text;
begin
  select * into target_order
  from public.orders
  where id = p_order_id and clear_batch_id is null
  for update;

  if target_order.id is null or not private.can_manage_orders(target_order.business_id) then
    raise exception 'order not found' using errcode = 'P0002';
  end if;

  if target_order.status <> p_expected_status then
    raise exception 'order status changed; refresh and try again' using errcode = 'P0001';
  end if;

  if p_next_status = 'completed' then
    if p_expected_status <> 'ready'
      or upper(btrim(coalesce(p_handoff_token, ''))) <> target_order.verification_token then
      raise exception 'handoff token does not match' using errcode = '22023';
    end if;
    event_label := 'Handoff completed';
  elsif p_next_status = 'cancelled' then
    event_label := 'Order cancelled';
  elsif p_next_status = 'preparing' then
    event_label := 'Started preparing';
  elsif p_next_status = 'ready' then
    event_label := 'Marked ready';
  else
    raise exception 'invalid target status' using errcode = '22023';
  end if;

  update public.orders
  set status = p_next_status,
      handoff_verified_at = case
        when p_next_status = 'completed' then now()
        else handoff_verified_at
      end
  where id = target_order.id
  returning * into target_order;

  insert into public.order_status_events(
    business_id,
    order_id,
    from_status,
    to_status,
    actor_user_id,
    label
  ) values (
    target_order.business_id,
    target_order.id,
    p_expected_status,
    p_next_status,
    (select auth.uid()),
    event_label
  );

  return jsonb_build_object(
    'id', target_order.id,
    'orderNumber', target_order.order_number,
    'status', target_order.status,
    'updatedAt', target_order.updated_at
  );
end;
$$;
