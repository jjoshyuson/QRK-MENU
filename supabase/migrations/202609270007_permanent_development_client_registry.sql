-- Reconcile the ten canonical development businesses into the hosted QRK Admin registry.
--
-- This migration is deliberately additive. It never creates or deletes a business,
-- membership, Auth identity, menu, order, receipt, or provider record. It only adds
-- platform_clients metadata for canonical businesses that already exist. On a fresh
-- local rebuild without a platform administrator it is a safe no-op; the hosted
-- development project has an allowlisted administrator and receives all ten rows.
--
-- Rollback: delete only these ten platform_clients rows by business_id. The underlying
-- businesses, profiles, service settings, menus, Auth identities, and operational data
-- are independent and remain intact. Never include the R&L business UUID in rollback.

with canonical(
  business_id, username_prefix, location_name, admin_email, admin_username
) as (
  values
    ('10000000-0000-4000-8000-000000000001'::uuid,'kusina','Ermita','owner@kusinamanila.example','kusina-admin'),
    ('21000000-0000-4000-8000-000000000001'::uuid,'salamat','Makati','maya@salamat.example','salamat-admin'),
    ('31000000-0000-4000-8000-000000000001'::uuid,'salo','Quezon City','ana@salo.example','salo-admin'),
    ('41000000-0000-4000-8000-000000000001'::uuid,'tambay','Pasig','luis@tambay.example','tambay-admin'),
    ('51000000-0000-4000-8000-000000000001'::uuid,'ihaw','Taguig','bea@ihaw.example','ihaw-admin'),
    ('61000000-0000-4000-8000-000000000001'::uuid,'hapag','Mandaluyong','carlo@hapag.example','hapag-admin'),
    ('71000000-0000-4000-8000-000000000001'::uuid,'oras','Pasay','nina@oras.example','oras-admin'),
    ('81000000-0000-4000-8000-000000000001'::uuid,'pito','Paranaque','marco@pito.example','pito-admin'),
    ('91000000-0000-4000-8000-000000000001'::uuid,'sulit','BGC','ella@sulit.example','sulit-admin'),
    ('11000000-0000-4000-8000-000000000001'::uuid,'tiwala','Makati','paolo@tiwala.example','tiwala-admin')
), authority as (
  select user_id
  from public.platform_admins
  where active
  order by created_at, user_id
  limit 1
)
insert into public.platform_clients (
  business_id, username_prefix, location_name, initial_admin_user_id,
  initial_admin_email, service_profile, provider, provider_config,
  created_by, created_at, updated_at
)
select
  canonical.business_id,
  canonical.username_prefix,
  canonical.location_name,
  profile.user_id,
  canonical.admin_email,
  coalesce(service.gates,'{}'::jsonb) || jsonb_build_object(
    'locationName',canonical.location_name,
    'settings',coalesce(business_profile.settings,'{}'::jsonb)
  ),
  'qrk',
  '{}'::jsonb,
  authority.user_id,
  '2026-09-13 00:00:00+00'::timestamptz,
  now()
from canonical
join public.businesses business on business.id=canonical.business_id
join public.business_profiles business_profile on business_profile.business_id=canonical.business_id
join public.business_service_configs service on service.business_id=canonical.business_id
cross join authority
left join public.user_profiles profile on profile.username=canonical.admin_username
on conflict (business_id) do update set
  username_prefix=excluded.username_prefix,
  location_name=excluded.location_name,
  initial_admin_user_id=coalesce(public.platform_clients.initial_admin_user_id,excluded.initial_admin_user_id),
  initial_admin_email=excluded.initial_admin_email,
  service_profile=excluded.service_profile,
  provider='qrk',
  provider_config='{}'::jsonb,
  updated_at=now();
