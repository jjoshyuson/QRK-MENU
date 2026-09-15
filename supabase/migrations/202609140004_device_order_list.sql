-- Let a registered customer device restore only its own order rounds without staff access.

create function public.list_device_orders(p_destination_slug text,p_device_id uuid,p_device_secret text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare target_business_id uuid;
begin
  select business_id into target_business_id from public.public_destinations where slug=p_destination_slug and active;
  if target_business_id is null or not private.device_matches(target_business_id,p_device_id,p_device_secret) then raise exception 'device identity rejected' using errcode='28000'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id',o.id,
    'orderNumber',o.order_number,
    'verificationToken',o.verification_token,
    'createdAt',o.created_at,
    'updatedAt',o.updated_at,
    'fulfillmentType',o.fulfillment_type,
    'tableNumber',o.table_number,
    'customerLabel',o.customer_label,
    'status',o.status,
    'subtotalMinor',o.subtotal_minor,
    'handoffVerifiedAt',o.handoff_verified_at,
    'notes',o.notes,
    'tableSessionId',o.table_session_id,
    'openTabId',o.open_tab_id,
    'items',coalesce((select jsonb_agg(jsonb_build_object(
      'itemId',i.id,'name',i.item_name,'quantity',i.quantity,'unitPriceMinor',i.unit_price_minor,
      'lineTotalMinor',i.line_total_minor,'notes',i.notes,
      'selectedOptions',coalesce((select jsonb_agg(case when x.price_delta_minor<>0 then x.option_name||' +'||x.price_delta_minor::text else x.option_name end order by x.id) from public.order_item_options x where x.order_item_id=i.id),'[]'::jsonb)
    ) order by i.id) from public.order_items i where i.order_id=o.id),'[]'::jsonb),
    'events',coalesce((select jsonb_agg(jsonb_build_object('status',e.to_status,'label',e.label,'at',e.created_at) order by e.id) from public.order_status_events e where e.order_id=o.id),'[]'::jsonb)
  ) order by o.created_at) from public.orders o where o.business_id=target_business_id and o.device_id=p_device_id and o.clear_batch_id is null),'[]'::jsonb);
end;
$$;

grant execute on function public.list_device_orders(text,uuid,text) to anon,authenticated;
