begin;
create extension if not exists pgtap with schema extensions;
select plan(19);

-- Two isolated tenants and authenticated identities.
insert into public.businesses (id, name, public_slug) values
  ('20000000-0000-4000-8000-000000000001', 'Tenant A', 'test-tenant-a'),
  ('20000000-0000-4000-8000-000000000002', 'Tenant B', 'test-tenant-b');
insert into public.business_profiles (business_id, open_for_orders, order_prefix) values
  ('20000000-0000-4000-8000-000000000001', true, 'TA'),
  ('20000000-0000-4000-8000-000000000002', true, 'TB');
insert into public.business_members (business_id, user_id, role, can_manage_orders) values
  ('20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000101', 'owner', true),
  ('20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000102', 'owner', true);
insert into public.menus (id, business_id, name) values
  ('20000000-0000-4000-8000-000000000201', '20000000-0000-4000-8000-000000000001', 'A menu'),
  ('20000000-0000-4000-8000-000000000202', '20000000-0000-4000-8000-000000000002', 'B menu');
insert into public.menu_revisions (id, business_id, menu_id, version, state, published_at) values
  ('20000000-0000-4000-8000-000000000301', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', 1, 'published', now()),
  ('20000000-0000-4000-8000-000000000302', '20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000202', 1, 'published', now());
update public.menus set published_revision_id = case id
  when '20000000-0000-4000-8000-000000000201' then '20000000-0000-4000-8000-000000000301'::uuid
  else '20000000-0000-4000-8000-000000000302'::uuid end
where id in ('20000000-0000-4000-8000-000000000201', '20000000-0000-4000-8000-000000000202');
insert into public.categories (id, business_id, menu_id, revision_id, name, public_slug) values
  ('20000000-0000-4000-8000-000000000401', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', '20000000-0000-4000-8000-000000000301', 'Food', 'food'),
  ('20000000-0000-4000-8000-000000000402', '20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000202', '20000000-0000-4000-8000-000000000302', 'Food', 'food');
insert into public.menu_items (id, business_id, revision_id, category_id, name, price_minor, available, hidden) values
  ('20000000-0000-4000-8000-000000000501', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000301', '20000000-0000-4000-8000-000000000401', 'Public A', 10000, true, false),
  ('20000000-0000-4000-8000-000000000502', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000301', '20000000-0000-4000-8000-000000000401', 'Hidden A', 90000, true, true),
  ('20000000-0000-4000-8000-000000000503', '20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000302', '20000000-0000-4000-8000-000000000402', 'Public B', 20000, true, false);
insert into public.public_destinations (business_id, menu_id, slug) values
  ('20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', 'test-tenant-a'),
  ('20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000202', 'test-tenant-b');

select is(has_table_privilege('anon', 'public.orders', 'select'), false, 'anon cannot select orders');
select is(has_table_privilege('anon', 'public.menu_items', 'select'), false, 'anon cannot select base menu rows');

set local role anon;
select is((public.get_public_menu('test-tenant-a') #>> '{business,name}'), 'Tenant A', 'public RPC returns requested tenant');
select is((public.get_public_menu('test-tenant-a') #>> '{menu,categories,0,items,0,name}'), 'Public A', 'public RPC returns published visible item');
select is((public.get_public_menu('test-tenant-a')::text like '%Hidden A%'), false, 'public RPC hides hidden items');
select is((public.get_public_menu('test-tenant-a')::text like '%Public B%'), false, 'public RPC does not leak another tenant');
select lives_ok($$select public.create_public_order(
  'test-tenant-a', '20000000-0000-4000-8000-000000000601', 'pickup', null, 'Test', '',
  '[{"itemId":"20000000-0000-4000-8000-000000000501","quantity":2,"optionIds":[]}]'::jsonb
)$$, 'anon can create a validated order through RPC');
select is((public.create_public_order(
  'test-tenant-a', '20000000-0000-4000-8000-000000000601', 'pickup', null, 'Test', '',
  '[{"itemId":"20000000-0000-4000-8000-000000000501","quantity":2,"optionIds":[]}]'::jsonb
) ->> 'idempotentReplay')::boolean, true, 'same request ID replays without duplicate');
select is((public.get_public_order_status(
  'test-tenant-a',
  public.create_public_order('test-tenant-a', '20000000-0000-4000-8000-000000000601', 'pickup', null, 'Test', '', '[{"itemId":"20000000-0000-4000-8000-000000000501","quantity":2,"optionIds":[]}]'::jsonb)->>'orderNumber',
  public.create_public_order('test-tenant-a', '20000000-0000-4000-8000-000000000601', 'pickup', null, 'Test', '', '[{"itemId":"20000000-0000-4000-8000-000000000501","quantity":2,"optionIds":[]}]'::jsonb)->>'trackingToken'
) ->> 'status'), 'received', 'customer can track only with matching token');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000101","role":"authenticated"}', true);
select is((select count(*)::integer from public.businesses), 1, 'tenant A member sees one business');
select is((select name from public.businesses), 'Tenant A', 'tenant A member sees only tenant A');
select is((select count(*)::integer from public.orders), 1, 'tenant A order staff sees tenant A order');
select lives_ok($$select public.transition_order_status(
  (select id from public.orders limit 1), 'received', 'preparing', null
)$$, 'permitted staff can advance an order');
select lives_ok($$select public.transition_order_status(
  (select id from public.orders limit 1), 'preparing', 'ready', null
)$$, 'ordered status transition reaches ready');
select throws_ok($$select public.transition_order_status(
  (select id from public.orders limit 1), 'ready', 'completed', 'WRONG1'
)$$, '22023', 'handoff token does not match', 'wrong handoff token cannot complete an order');
select lives_ok($$select public.transition_order_status(
  (select id from public.orders limit 1), 'ready', 'completed', (select verification_token from public.orders limit 1)
)$$, 'matching handoff token completes a ready order');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000102","role":"authenticated"}', true);
select is((select count(*)::integer from public.orders), 0, 'tenant B cannot read tenant A order');
select throws_ok($$select public.transition_order_status(
  (select id from public.orders where business_id = '20000000-0000-4000-8000-000000000001'), 'completed', 'cancelled', null
)$$, 'P0002', 'order not found', 'tenant B cannot mutate tenant A order');
reset role;

select is((select count(*)::integer from public.orders where idempotency_key = '20000000-0000-4000-8000-000000000601'), 1, 'idempotency created exactly one order');
select * from finish();
rollback;
