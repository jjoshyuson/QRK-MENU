-- Only the trusted platform-clients Edge Function uses these service-role grants.
grant select,insert,update,delete on public.businesses,public.business_profiles,public.business_service_configs,public.user_profiles,public.business_members to service_role;
