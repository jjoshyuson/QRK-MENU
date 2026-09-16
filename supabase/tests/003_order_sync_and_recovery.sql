begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

select set_config('test.current_menu_item_id',(select mi.id::text from public.menu_items mi join public.menu_revisions mr on mr.id=mi.revision_id where mi.business_id='10000000-0000-4000-8000-000000000001' and mr.state='published' order by mi.sort_order limit 1),true);

set local role anon;
select lives_ok($$select public.register_customer_device('kusina-manila','40000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001-secret-value','Test phone','{}')$$,'anonymous customer registers a random device identity');
select throws_ok($$select public.register_customer_device('kusina-manila','40000000-0000-4000-8000-000000000001','different-secret-value-that-is-long-enough','Other phone','{}')$$,'28000','device identity rejected','an existing device ID cannot be claimed with another secret');
select lives_ok($$select public.create_device_order('kusina-manila','40000000-0000-4000-8000-000000000101','pickup',null,'Device test','',jsonb_build_array(jsonb_build_object('itemId',current_setting('test.current_menu_item_id'),'quantity',1,'optionIds','[]'::jsonb)),'40000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001-secret-value')$$,'registered device creates an order from the current published catalog');
select throws_ok($$select public.create_device_order('kusina-manila','40000000-0000-4000-8000-000000000102','pickup',null,'Wrong device','',jsonb_build_array(jsonb_build_object('itemId',current_setting('test.current_menu_item_id'),'quantity',1,'optionIds','[]'::jsonb)),'40000000-0000-4000-8000-000000000001','wrong-secret-value-that-is-long-enough')$$,'28000','device identity rejected','wrong device secret cannot create an order');
reset role;

select is((select device_id from public.orders where idempotency_key='40000000-0000-4000-8000-000000000101'),'40000000-0000-4000-8000-000000000001'::uuid,'order is attached to its device');

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000101","role":"authenticated"}',true);
select lives_ok($$select public.clear_order_activity('10000000-0000-4000-8000-000000000001')$$,'owner clears operational data');
select is((select count(*)::integer from public.orders),0,'cleared orders disappear from staff reads');
select is((public.list_order_clear_batches('10000000-0000-4000-8000-000000000001')->0->>'restorable')::boolean,true,'newest clear is restorable');
select lives_ok($$select public.restore_order_activity((public.list_order_clear_batches('10000000-0000-4000-8000-000000000001')->0->>'id')::uuid)$$,'owner restores the latest clear');
select is((select count(*)::integer from public.orders where idempotency_key='40000000-0000-4000-8000-000000000101'),1,'restored order is visible again');
reset role;

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"21000000-0000-4000-8000-000000000101","role":"authenticated"}',true);
select throws_ok($$select public.clear_order_activity('10000000-0000-4000-8000-000000000001')$$,'P0002','business not found','tenant B cannot clear tenant A');
select is(jsonb_array_length(public.list_order_clear_batches('10000000-0000-4000-8000-000000000001')),0,'tenant B cannot list tenant A clear history');
reset role;

insert into public.table_sessions(id,business_id,table_number,status,guest_count)
values('40000000-0000-4000-8000-000000000201','21000000-0000-4000-8000-000000000001','999','active',1);
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"21000000-0000-4000-8000-000000000101","role":"authenticated"}',true);
select lives_ok($$select public.change_table_session('salamat','40000000-0000-4000-8000-000000000201','paid',null,null,null,'direct')$$,'staff can settle a Table session after payment');
reset role;
select is((select status from public.table_sessions where id='40000000-0000-4000-8000-000000000201'),'settled','paid Table session persists the settled lifecycle state');

select * from finish();
rollback;
