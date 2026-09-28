-- Consumption (where the order is eaten) is independent from fulfillment
-- (how it is handed over). Existing orders remain valid with a null value.
alter table public.orders add column consumption_type text
  check (consumption_type in ('dine_in','takeaway'));

create function public.create_device_order(
  p_destination_slug text, p_request_id uuid, p_consumption text, p_fulfillment text,
  p_table_number text, p_customer_label text, p_order_notes text, p_line_items jsonb,
  p_device_id uuid, p_device_secret text, p_table_session_id uuid default null,
  p_open_tab_id uuid default null, p_experience text default 'quick'
) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; experience jsonb; consumption_modes jsonb; fulfillment_modes jsonb;
begin
  if p_experience not in ('quick','table') then raise exception 'invalid service experience' using errcode='22023'; end if;
  select config.gates->'experiences'->p_experience into experience
  from public.public_destinations destination
  join public.business_service_configs config on config.business_id=destination.business_id
  where destination.slug=p_destination_slug and destination.active;
  if experience is null then raise exception 'service experience is not enabled' using errcode='22023'; end if;

  if p_experience='table' then
    if p_consumption<>'dine_in' then raise exception 'table experience requires dine-in consumption' using errcode='22023'; end if;
    if p_fulfillment<>'table' then raise exception 'table experience requires table fulfillment' using errcode='22023'; end if;
  else
    consumption_modes:=coalesce(experience->'settings'->'consumptionModes','["dine_in"]'::jsonb);
    fulfillment_modes:=coalesce(experience->'settings'->'fulfillmentModes','["pickup"]'::jsonb);
    if not (consumption_modes ? p_consumption) then raise exception 'consumption is not enabled for quick experience' using errcode='22023'; end if;
    if not (fulfillment_modes ? p_fulfillment) then raise exception 'fulfillment is not enabled for quick experience' using errcode='22023'; end if;
    if p_consumption='takeaway' and p_fulfillment<>'pickup' then raise exception 'takeaway requires pickup fulfillment' using errcode='22023'; end if;
  end if;

  result:=public.create_device_order(p_destination_slug,p_request_id,p_fulfillment,p_table_number,p_customer_label,p_order_notes,p_line_items,p_device_id,p_device_secret,p_table_session_id,p_open_tab_id);
  update public.orders set service_experience=p_experience,consumption_type=p_consumption
    where id=(result->>'id')::uuid;
  return result || jsonb_build_object('experience',p_experience,'consumptionType',p_consumption);
end;
$$;

revoke all on function public.create_device_order(text,uuid,text,text,text,text,text,jsonb,uuid,text,uuid,uuid,text) from public;
grant execute on function public.create_device_order(text,uuid,text,text,text,text,text,jsonb,uuid,text,uuid,uuid,text) to anon,authenticated,service_role;
