-- Reconnect the hosted R&L public slug to the catalog imported in 202609270003.
-- The original upsert preserved an older destination's business/menu foreign keys
-- on slug conflict, which left the imported catalog unreachable through public RPCs.
update public.public_destinations
set business_id = '20000000-0000-4000-8000-000000000001',
    menu_id = '20000000-0000-4000-8000-000000000002',
    active = true
where slug = 'rnl';

insert into public.public_destinations(id,business_id,menu_id,slug,active)
select
  '20000000-0000-4000-8000-000000000004',
  '20000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  'rnl',
  true
where not exists (
  select 1 from public.public_destinations where slug = 'rnl'
);
