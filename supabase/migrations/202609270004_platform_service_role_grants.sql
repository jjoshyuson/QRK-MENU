-- Trusted Edge Functions use the service role after caller authorization.
grant select,insert,update,delete on public.platform_admins,public.platform_clients to service_role;
