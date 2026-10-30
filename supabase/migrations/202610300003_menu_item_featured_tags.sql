-- Featured flag and fixed-vocabulary tags drive the customer Popular row and dish tags.
alter table public.menu_items
  add column featured boolean not null default false,
  add column tags text[] not null default '{}',
  add constraint menu_items_tags_known check (tags <@ array['spicy','sharing','slow_cooked','vegetarian']::text[]);

create or replace function public.get_public_menu(p_destination_slug text)
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
                  'featured', item.featured,
                  'tags', item.tags,
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

grant execute on function public.get_public_menu(text) to anon, authenticated, service_role;
