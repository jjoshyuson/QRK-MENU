-- The trusted R&L forwarding Edge Function validates catalog and creates the
-- QRK order before invoking the provider. No browser receives service access.
grant execute on function public.get_public_menu(text) to service_role;
grant execute on function public.create_device_order(text,uuid,text,text,text,text,jsonb,uuid,text,uuid,uuid) to service_role;
