-- Supabase integration boundary: Auth helpers, RLS, narrow RPCs, private
-- Realtime Broadcast, and Storage policies. A plain PostgreSQL/VPS migration
-- replaces this file while retaining the tables and constraints from 0001.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create function private.is_business_member(target_business_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    where member.business_id = target_business_id
      and member.user_id = (select auth.uid())
      and member.active
  );
$$;

create function private.has_business_role(target_business_id uuid, allowed_roles public.business_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    where member.business_id = target_business_id
      and member.user_id = (select auth.uid())
      and member.active
      and member.role = any(allowed_roles)
  );
$$;

create function private.can_manage_menu(target_business_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    where member.business_id = target_business_id
      and member.user_id = (select auth.uid()) and member.active
      and (member.can_manage_menu or member.role in ('owner', 'admin', 'manager', 'menu_editor'))
  );
$$;

create function private.can_manage_orders(target_business_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members member
    where member.business_id = target_business_id
      and member.user_id = (select auth.uid()) and member.active
      and (member.can_manage_orders or member.role in ('owner', 'admin', 'manager', 'order_staff'))
  );
$$;

create function private.path_business_id(object_name text)
returns uuid language plpgsql immutable security definer set search_path = '' as $$
begin
  return split_part(object_name, '/', 1)::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

create function private.is_published_photo(target_bucket text, target_path text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.photo_assets asset
    join public.menu_items item on item.photo_asset_id = asset.id
    join public.menu_revisions revision on revision.id = item.revision_id and revision.state = 'published'
    join public.menus menu on menu.published_revision_id = revision.id
    join public.businesses business on business.id = asset.business_id and business.active
    where asset.bucket_id = target_bucket and asset.object_path = target_path
      and asset.visibility = 'published' and not item.hidden
  );
$$;

create function private.generate_handoff_token()
returns text language plpgsql volatile security definer set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea := extensions.gen_random_bytes(6);
  token text := '';
begin
  for position in 0..5 loop
    token := token || substr(alphabet, (get_byte(bytes, position) % length(alphabet)) + 1, 1);
  end loop;
  return token;
end;
$$;

-- The API returns only published customer fields. Base tables remain unavailable
-- to anon so drafts, membership data, internal settings, and order tokens cannot
-- be selected through generated table endpoints.
create function public.get_public_menu(p_destination_slug text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'business', jsonb_build_object(
      'id', business.id,
      'name', business.name,
      'slug', destination.slug,
      'currencyCode', business.currency_code,
      'description', profile.description,
      'openForOrders', profile.open_for_orders
    ),
    'menu', jsonb_build_object(
      'id', menu.id,
      'name', menu.name,
      'revision', revision.version,
      'publishedAt', revision.published_at,
      'categories', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', category.id,
            'name', category.name,
            'slug', category.public_slug,
            'sortOrder', category.sort_order,
            'items', coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'id', item.id,
                  'stableKey', item.stable_key,
                  'name', item.name,
                  'description', item.description,
                  'priceMinor', item.price_minor,
                  'available', item.available,
                  'photo', case when asset.visibility = 'published' then jsonb_build_object(
                    'provider', asset.provider,
                    'bucket', asset.bucket_id,
                    'path', asset.object_path,
                    'variant', asset.variant,
                    'width', asset.width,
                    'height', asset.height,
                    'alt', asset.alt_text
                  ) end,
                  'optionGroups', coalesce((
                    select jsonb_agg(jsonb_build_object(
                      'id', option_group.id,
                      'name', option_group.name,
                      'required', option_group.required,
                      'minSelections', option_group.min_selections,
                      'maxSelections', option_group.max_selections,
                      'options', coalesce((
                        select jsonb_agg(jsonb_build_object(
                          'id', option_value.id,
                          'name', option_value.name,
                          'priceDeltaMinor', option_value.price_delta_minor
                        ) order by option_value.sort_order, option_value.id)
                        from public.item_options option_value
                        where option_value.option_group_id = option_group.id and option_value.available
                      ), '[]'::jsonb)
                    ) order by option_group.sort_order, option_group.id)
                    from public.item_option_groups option_group
                    where option_group.menu_item_id = item.id
                  ), '[]'::jsonb)
                ) order by item.sort_order, item.id)
              from public.menu_items item
              left join public.photo_assets asset on asset.id = item.photo_asset_id
              where item.category_id = category.id and not item.hidden
            ), '[]'::jsonb)
          ) order by category.sort_order, category.id)
        from public.categories category
        where category.revision_id = revision.id
          and exists (select 1 from public.menu_items visible_item where visible_item.category_id = category.id and not visible_item.hidden)
      ), '[]'::jsonb)
    )
  )
  from public.public_destinations destination
  join public.businesses business on business.id = destination.business_id
  join public.business_profiles profile on profile.business_id = business.id
  join public.menus menu on menu.id = destination.menu_id
  join public.menu_revisions revision on revision.id = menu.published_revision_id and revision.state = 'published'
  where destination.slug = p_destination_slug and destination.active and business.active;
$$;

create function public.create_public_order(
  p_destination_slug text,
  p_request_id uuid,
  p_fulfillment text,
  p_table_number text,
  p_customer_label text,
  p_order_notes text,
  p_line_items jsonb
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  target_business public.businesses%rowtype;
  target_profile public.business_profiles%rowtype;
  target_revision_id uuid;
  existing_order public.orders%rowtype;
  created_order public.orders%rowtype;
  requested_line jsonb;
  current_item public.menu_items%rowtype;
  current_group public.item_option_groups%rowtype;
  current_option public.item_options%rowtype;
  current_order_item_id uuid;
  selected_ids uuid[];
  selected_count integer;
  line_index integer := 0;
  option_index integer;
  quantity_value integer;
  unit_total integer;
  subtotal_value integer := 0;
  sequence_value bigint;
  verification_value text;
  tracking_value text;
begin
  if p_request_id is null then raise exception 'request_id is required' using errcode = '22023'; end if;
  if p_fulfillment not in ('table', 'pickup') then raise exception 'invalid fulfillment' using errcode = '22023'; end if;
  if p_fulfillment = 'table' and coalesce(p_table_number, '') !~ '^[0-9]{1,3}$' then raise exception 'valid table number required' using errcode = '22023'; end if;
  if p_fulfillment = 'pickup' then p_table_number := null; end if;
  if char_length(coalesce(p_customer_label, '')) > 40 or char_length(coalesce(p_order_notes, '')) > 180 then raise exception 'order text too long' using errcode = '22023'; end if;
  if jsonb_typeof(p_line_items) <> 'array' or jsonb_array_length(p_line_items) not between 1 and 50 then raise exception 'line_items must contain 1 to 50 items' using errcode = '22023'; end if;

  select business.* into target_business
  from public.public_destinations destination
  join public.businesses business on business.id = destination.business_id
  where destination.slug = p_destination_slug and destination.active and business.active;
  if target_business.id is null then raise exception 'menu not found' using errcode = 'P0002'; end if;
  select * into target_profile from public.business_profiles where business_id = target_business.id;
  if not target_profile.open_for_orders then raise exception 'business is not accepting orders' using errcode = '55000'; end if;

  select revision.id into target_revision_id
  from public.public_destinations destination
  join public.menus menu on menu.id = destination.menu_id
  join public.menu_revisions revision on revision.id = menu.published_revision_id and revision.state = 'published'
  where destination.slug = p_destination_slug and destination.active;
  if target_revision_id is null then raise exception 'published menu not found' using errcode = 'P0002'; end if;

  select * into existing_order from public.orders
  where business_id = target_business.id and idempotency_key = p_request_id;
  if existing_order.id is not null then
    return jsonb_build_object('id', existing_order.id, 'orderNumber', existing_order.order_number,
      'trackingToken', existing_order.tracking_token, 'verificationToken', existing_order.verification_token,
      'status', existing_order.status, 'subtotalMinor', existing_order.subtotal_minor, 'idempotentReplay', true);
  end if;

  -- Serialize order numbering per business. This also makes concurrent idempotent
  -- retries converge on the unique (business_id, idempotency_key) constraint.
  select next_order_number into sequence_value from public.business_profiles
  where business_id = target_business.id for update;
  select * into existing_order from public.orders
  where business_id = target_business.id and idempotency_key = p_request_id;
  if existing_order.id is not null then
    return jsonb_build_object('id', existing_order.id, 'orderNumber', existing_order.order_number,
      'trackingToken', existing_order.tracking_token, 'verificationToken', existing_order.verification_token,
      'status', existing_order.status, 'subtotalMinor', existing_order.subtotal_minor, 'idempotentReplay', true);
  end if;
  update public.business_profiles set next_order_number = next_order_number + 1 where business_id = target_business.id;
  verification_value := private.generate_handoff_token();
  tracking_value := encode(extensions.gen_random_bytes(16), 'hex');

  insert into public.orders (
    business_id, order_sequence, order_number, tracking_token, verification_token,
    idempotency_key, fulfillment_type, table_number, customer_label, notes,
    currency_code, subtotal_minor
  ) values (
    target_business.id, sequence_value, target_profile.order_prefix || '-' || lpad(sequence_value::text, 4, '0'),
    tracking_value, verification_value, p_request_id, p_fulfillment::public.order_fulfillment,
    p_table_number, nullif(btrim(p_customer_label), ''), coalesce(btrim(p_order_notes), ''),
    target_business.currency_code, 0
  ) returning * into created_order;

  for requested_line in select value from jsonb_array_elements(p_line_items) loop
    line_index := line_index + 1;
    quantity_value := coalesce((requested_line->>'quantity')::integer, 0);
    if quantity_value not between 1 and 20 then raise exception 'invalid quantity at line %', line_index using errcode = '22023'; end if;
    if char_length(coalesce(requested_line->>'notes', '')) > 140 then raise exception 'line note too long at line %', line_index using errcode = '22023'; end if;

    select * into current_item from public.menu_items
    where id = (requested_line->>'itemId')::uuid and revision_id = target_revision_id
      and business_id = target_business.id and available and not hidden;
    if current_item.id is null then raise exception 'item unavailable at line %', line_index using errcode = '22023'; end if;
    if requested_line ? 'optionIds' and jsonb_typeof(requested_line->'optionIds') <> 'array' then raise exception 'optionIds must be an array' using errcode = '22023'; end if;
    select coalesce(array_agg(value::uuid), '{}'::uuid[]) into selected_ids
    from jsonb_array_elements_text(coalesce(requested_line->'optionIds', '[]'::jsonb));

    unit_total := current_item.price_minor;
    for current_group in select * from public.item_option_groups where menu_item_id = current_item.id loop
      select count(*) into selected_count from public.item_options option_value
      where option_value.option_group_id = current_group.id and option_value.available and option_value.id = any(selected_ids);
      if selected_count < current_group.min_selections or selected_count > current_group.max_selections then
        raise exception 'invalid option count for group %', current_group.name using errcode = '22023';
      end if;
    end loop;
    if exists (
      select 1 from unnest(selected_ids) chosen_id
      left join public.item_options option_value on option_value.id = chosen_id and option_value.available
      left join public.item_option_groups option_group on option_group.id = option_value.option_group_id
      where option_value.id is null or option_group.menu_item_id <> current_item.id
    ) then raise exception 'invalid option at line %', line_index using errcode = '22023'; end if;
    select unit_total + coalesce(sum(price_delta_minor), 0) into unit_total
    from public.item_options where id = any(selected_ids);

    insert into public.order_items (business_id, order_id, menu_item_id, item_name, unit_price_minor, quantity, line_total_minor, notes, sort_order)
    values (target_business.id, created_order.id, current_item.id, current_item.name, unit_total, quantity_value,
      unit_total * quantity_value, coalesce(btrim(requested_line->>'notes'), ''), line_index - 1)
    returning id into current_order_item_id;
    option_index := 0;
    for current_option in
      select option_value.* from public.item_options option_value
      join public.item_option_groups option_group on option_group.id = option_value.option_group_id
      where option_value.id = any(selected_ids) order by option_group.sort_order, option_value.sort_order, option_value.id
    loop
      insert into public.order_item_options (business_id, order_item_id, item_option_id, group_name, option_name, price_delta_minor, sort_order)
      select target_business.id, current_order_item_id, current_option.id, option_group.name, current_option.name,
        current_option.price_delta_minor, option_index
      from public.item_option_groups option_group where option_group.id = current_option.option_group_id;
      option_index := option_index + 1;
    end loop;
    subtotal_value := subtotal_value + unit_total * quantity_value;
  end loop;

  update public.orders set subtotal_minor = subtotal_value where id = created_order.id returning * into created_order;
  insert into public.order_status_events (business_id, order_id, from_status, to_status, label)
  values (target_business.id, created_order.id, null, 'received', 'Order received');
  return jsonb_build_object('id', created_order.id, 'orderNumber', created_order.order_number,
    'trackingToken', created_order.tracking_token, 'verificationToken', created_order.verification_token,
    'status', created_order.status, 'subtotalMinor', created_order.subtotal_minor, 'idempotentReplay', false);
end;
$$;

create function public.get_public_order_status(p_destination_slug text, p_order_number text, p_tracking_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', customer_order.id,
    'orderNumber', customer_order.order_number,
    'status', customer_order.status,
    'subtotalMinor', customer_order.subtotal_minor,
    'createdAt', customer_order.created_at,
    'updatedAt', customer_order.updated_at,
    'events', coalesce((select jsonb_agg(jsonb_build_object(
      'status', event.to_status, 'label', event.label, 'at', event.created_at
    ) order by event.id) from public.order_status_events event where event.order_id = customer_order.id), '[]'::jsonb)
  )
  from public.orders customer_order
  join public.public_destinations destination on destination.business_id = customer_order.business_id
  where destination.slug = p_destination_slug and destination.active
    and customer_order.order_number = p_order_number
    and customer_order.tracking_token = p_tracking_token;
$$;

create function public.transition_order_status(
  p_order_id uuid,
  p_expected_status public.order_status,
  p_next_status public.order_status,
  p_handoff_token text default null
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target_order public.orders%rowtype; event_label text;
begin
  select * into target_order from public.orders where id = p_order_id for update;
  if target_order.id is null or not private.can_manage_orders(target_order.business_id) then raise exception 'order not found' using errcode = 'P0002'; end if;
  if target_order.status <> p_expected_status then raise exception 'order status changed; refresh and try again' using errcode = '40001'; end if;
  if p_next_status = 'completed' then
    if p_expected_status <> 'ready' or upper(btrim(coalesce(p_handoff_token, ''))) <> target_order.verification_token then raise exception 'handoff token does not match' using errcode = '22023'; end if;
    event_label := 'Handoff completed';
  elsif p_next_status = 'cancelled' then event_label := 'Order cancelled';
  elsif p_next_status = 'preparing' then event_label := 'Started preparing';
  elsif p_next_status = 'ready' then event_label := 'Marked ready';
  else raise exception 'invalid target status' using errcode = '22023';
  end if;
  update public.orders set status = p_next_status,
    handoff_verified_at = case when p_next_status = 'completed' then now() else handoff_verified_at end
  where id = target_order.id returning * into target_order;
  insert into public.order_status_events (business_id, order_id, from_status, to_status, actor_user_id, label)
  values (target_order.business_id, target_order.id, p_expected_status, p_next_status, (select auth.uid()), event_label);
  return jsonb_build_object('id', target_order.id, 'orderNumber', target_order.order_number,
    'status', target_order.status, 'updatedAt', target_order.updated_at);
end;
$$;

create function public.set_business_ordering_open(p_business_id uuid, p_open boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not private.has_business_role(p_business_id, array['owner','admin','manager']::public.business_role[]) then raise exception 'business not found' using errcode = 'P0002'; end if;
  update public.business_profiles set open_for_orders = p_open where business_profiles.business_id = p_business_id;
  return found;
end;
$$;

-- Deny generated table endpoints by default, then add only authenticated
-- least-privilege grants. Policies still scope every granted operation by tenant.
revoke all on all tables in schema public from public, anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant execute on function public.get_public_menu(text) to anon, authenticated;
grant execute on function public.create_public_order(text, uuid, text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.get_public_order_status(text, text, text) to anon, authenticated;
grant execute on function public.transition_order_status(uuid, public.order_status, public.order_status, text) to authenticated;
grant execute on function public.set_business_ordering_open(uuid, boolean) to authenticated;

grant select on public.businesses, public.business_profiles, public.business_members,
  public.menus, public.menu_revisions, public.categories, public.menu_items,
  public.item_option_groups, public.item_options, public.photo_assets,
  public.public_destinations, public.orders, public.order_items,
  public.order_item_options, public.order_status_events to authenticated;
grant insert, update, delete on public.menus, public.menu_revisions, public.categories,
  public.menu_items, public.item_option_groups, public.item_options, public.photo_assets,
  public.public_destinations to authenticated;
grant update on public.businesses, public.business_profiles to authenticated;
grant insert, update, delete on public.business_members to authenticated;

alter table public.businesses enable row level security;
alter table public.business_profiles enable row level security;
alter table public.business_members enable row level security;
alter table public.menus enable row level security;
alter table public.menu_revisions enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.item_option_groups enable row level security;
alter table public.item_options enable row level security;
alter table public.photo_assets enable row level security;
alter table public.public_destinations enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_options enable row level security;
alter table public.order_status_events enable row level security;

create policy business_member_read on public.businesses for select to authenticated using (private.is_business_member(id));
create policy business_admin_update on public.businesses for update to authenticated using (private.has_business_role(id, array['owner','admin']::public.business_role[])) with check (private.has_business_role(id, array['owner','admin']::public.business_role[]));
create policy profile_member_read on public.business_profiles for select to authenticated using (private.is_business_member(business_id));
create policy profile_manager_update on public.business_profiles for update to authenticated using (private.has_business_role(business_id, array['owner','admin','manager']::public.business_role[])) with check (private.has_business_role(business_id, array['owner','admin','manager']::public.business_role[]));
create policy membership_member_read on public.business_members for select to authenticated using (private.is_business_member(business_id));
create policy membership_admin_insert on public.business_members for insert to authenticated with check (private.has_business_role(business_id, array['owner','admin']::public.business_role[]));
create policy membership_admin_update on public.business_members for update to authenticated using (private.has_business_role(business_id, array['owner','admin']::public.business_role[])) with check (private.has_business_role(business_id, array['owner','admin']::public.business_role[]));
create policy membership_admin_delete on public.business_members for delete to authenticated using (private.has_business_role(business_id, array['owner','admin']::public.business_role[]));

create policy menu_member_read on public.menus for select to authenticated using (private.is_business_member(business_id));
create policy menu_editor_write on public.menus for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy revision_member_read on public.menu_revisions for select to authenticated using (private.is_business_member(business_id));
create policy revision_editor_write on public.menu_revisions for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy category_member_read on public.categories for select to authenticated using (private.is_business_member(business_id));
create policy category_editor_write on public.categories for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy item_member_read on public.menu_items for select to authenticated using (private.is_business_member(business_id));
create policy item_editor_write on public.menu_items for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy group_member_read on public.item_option_groups for select to authenticated using (private.is_business_member(business_id));
create policy group_editor_write on public.item_option_groups for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy option_member_read on public.item_options for select to authenticated using (private.is_business_member(business_id));
create policy option_editor_write on public.item_options for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy asset_member_read on public.photo_assets for select to authenticated using (private.is_business_member(business_id));
create policy asset_editor_write on public.photo_assets for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));
create policy destination_member_read on public.public_destinations for select to authenticated using (private.is_business_member(business_id));
create policy destination_editor_write on public.public_destinations for all to authenticated using (private.can_manage_menu(business_id)) with check (private.can_manage_menu(business_id));

create policy order_staff_read on public.orders for select to authenticated using (private.can_manage_orders(business_id));
create policy order_item_staff_read on public.order_items for select to authenticated using (private.can_manage_orders(business_id));
create policy order_option_staff_read on public.order_item_options for select to authenticated using (private.can_manage_orders(business_id));
create policy order_event_staff_read on public.order_status_events for select to authenticated using (private.can_manage_orders(business_id));

-- Private Broadcast is a change hint, never the authoritative state. The client
-- performs an initial fetch and refetches after every hint/reconnect/focus event.
create function private.broadcast_order_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform realtime.send(
    jsonb_build_object('orderId', new.id, 'status', new.status, 'updatedAt', new.updated_at),
    'order_changed', 'business:' || new.business_id::text || ':orders', true
  );
  return null;
end;
$$;
create trigger broadcast_order_change after insert or update of status on public.orders
for each row execute function private.broadcast_order_change();

create policy qrk_staff_receive_order_broadcasts on realtime.messages
for select to authenticated using (
  realtime.messages.extension = 'broadcast'
  and (select realtime.topic()) ~ '^business:[0-9a-f-]{36}:orders$'
  and private.can_manage_orders(split_part((select realtime.topic()), ':', 2)::uuid)
);

-- Private menu-photo bucket. Object paths begin with the owning business UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-photos', 'menu-photos', false, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy qrk_members_read_menu_photos on storage.objects for select to authenticated using (
  bucket_id = 'menu-photos' and private.is_business_member(private.path_business_id(name))
);
create policy qrk_public_read_published_menu_photos on storage.objects for select to anon using (
  bucket_id = 'menu-photos' and private.is_published_photo(bucket_id, name)
);
create policy qrk_editors_upload_menu_photos on storage.objects for insert to authenticated with check (
  bucket_id = 'menu-photos' and private.can_manage_menu(private.path_business_id(name))
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','avif')
);
create policy qrk_editors_update_menu_photos on storage.objects for update to authenticated using (
  bucket_id = 'menu-photos' and private.can_manage_menu(private.path_business_id(name))
) with check (
  bucket_id = 'menu-photos' and private.can_manage_menu(private.path_business_id(name))
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','avif')
);
create policy qrk_editors_delete_menu_photos on storage.objects for delete to authenticated using (
  bucket_id = 'menu-photos' and private.can_manage_menu(private.path_business_id(name))
);
