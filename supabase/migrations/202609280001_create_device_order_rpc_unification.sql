-- Keep one public create_device_order signature. The service-experience wrapper
-- previously called the original 11-argument overload positionally; because the
-- wrapper's twelfth argument has a default, PostgreSQL could match both functions
-- and raised 42725 before creating an order.

alter function public.create_device_order(
  text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid
) set schema private;

alter function private.create_device_order(
  text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid
) rename to create_device_order_core;

revoke all on function private.create_device_order_core(
  text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid
) from public, anon, authenticated, service_role;

create or replace function public.create_device_order(
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
  result:=private.create_device_order_core(
    p_destination_slug,p_request_id,p_fulfillment,p_table_number,p_customer_label,
    p_order_notes,p_line_items,p_device_id,p_device_secret,p_table_session_id,p_open_tab_id
  );
  update public.orders set service_experience=p_experience where id=(result->>'id')::uuid and service_experience is null;
  return result || jsonb_build_object('experience',p_experience);
end;
$$;

revoke all on function public.create_device_order(
  text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid,text
) from public;
grant execute on function public.create_device_order(
  text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid,text
) to anon,authenticated,service_role;

