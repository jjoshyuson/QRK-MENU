-- Versioned, independent Quick and Table experience configuration.
-- Existing single-mode records are normalized in place without duplicating tenants,
-- menus, identities, orders, or table sessions. Rollback can remove the version and
-- experiences keys plus orders.service_experience; the legacy foundation/settings remain.

alter table public.orders add column service_experience text
  check (service_experience in ('quick','table'));

update public.business_service_configs config
set gates=config.gates || jsonb_build_object(
  'version',2,
  'serviceModes',coalesce(config.gates->'serviceModes',jsonb_build_array(config.foundation)),
  'experiences',
    (case when coalesce(config.gates->'serviceModes',jsonb_build_array(config.foundation)) ? 'quick'
      then jsonb_build_object('quick',jsonb_build_object(
        'preset','quick',
        'gates',coalesce(config.gates->'gateOrder'->'quick','["consumption","fulfillment","quick_payment","locator"]'::jsonb),
        'settings',profile.settings || jsonb_build_object('serviceMode','quick')
      )) else '{}'::jsonb end) ||
    (case when coalesce(config.gates->'serviceModes',jsonb_build_array(config.foundation)) ? 'table'
      then jsonb_build_object('table',jsonb_build_object(
        'preset',case when config.gates->>'preset'='quick' then 'traditional' else coalesce(config.gates->>'preset','traditional') end,
        'gates',coalesce(config.gates->'gateOrder'->'table','["table_entry","payment_timing","bill_closure","inactivity"]'::jsonb),
        'settings',profile.settings || jsonb_build_object('serviceMode','table')
      )) else '{}'::jsonb end)
),updated_at=now()
from public.business_profiles profile
where profile.business_id=config.business_id;

create function public.get_public_service_profile(p_destination_slug text)
returns jsonb language sql stable security definer set search_path='' as $$
  select config.gates || jsonb_build_object('locationName',profile.address)
  from public.public_destinations destination
  join public.businesses business on business.id=destination.business_id and business.active
  join public.business_profiles profile on profile.business_id=business.id
  join public.business_service_configs config on config.business_id=business.id
  where destination.slug=p_destination_slug and destination.active
  limit 1
$$;
revoke all on function public.get_public_service_profile(text) from public;
grant execute on function public.get_public_service_profile(text) to anon,authenticated,service_role;

create function public.create_device_order(
  p_destination_slug text, p_request_id uuid, p_fulfillment text, p_table_number text,
  p_customer_label text, p_order_notes text, p_line_items jsonb,
  p_device_id uuid, p_device_secret text, p_table_session_id uuid default null,
  p_open_tab_id uuid default null, p_experience text default 'quick'
) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; target_business_id uuid; experience jsonb;
begin
  if p_experience not in ('quick','table') then raise exception 'invalid service experience' using errcode='22023'; end if;
  select destination.business_id,config.gates->'experiences'->p_experience
    into target_business_id,experience
  from public.public_destinations destination
  join public.business_service_configs config on config.business_id=destination.business_id
  where destination.slug=p_destination_slug and destination.active;
  if experience is null then raise exception 'service experience is not enabled' using errcode='22023'; end if;
  if p_experience='table' and p_fulfillment<>'table' then raise exception 'table experience requires table fulfillment' using errcode='22023'; end if;
  if p_experience='quick' and not (coalesce(experience->'settings'->'fulfillmentModes','["pickup"]'::jsonb) ? p_fulfillment)
    then raise exception 'fulfillment is not enabled for quick experience' using errcode='22023'; end if;
  result:=public.create_device_order(p_destination_slug,p_request_id,p_fulfillment,p_table_number,p_customer_label,p_order_notes,p_line_items,p_device_id,p_device_secret,p_table_session_id,p_open_tab_id);
  update public.orders set service_experience=p_experience where id=(result->>'id')::uuid and service_experience is null;
  return result || jsonb_build_object('experience',p_experience);
end;
$$;

revoke all on function public.create_device_order(text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid,text) from public;
grant execute on function public.create_device_order(text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid,text) to anon,authenticated,service_role;
