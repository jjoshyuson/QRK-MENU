begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

select has_table('public','user_profiles','global user profile table exists');
select col_is_pk('public','user_profiles','user_id','user profile is keyed to Auth user');
select throws_ok(
  $$insert into public.user_profiles(user_id,username,display_name) values ('30000000-0000-4000-8000-000000000001','kusina-admin','Duplicate')$$,
  '23505', null, 'username is globally unique'
);

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000102","role":"authenticated"}',true);
select is(public.get_my_access_context()->>'role','order_staff','staff resolves to its tenant role');
select is((public.get_my_access_context()#>>'{permissions,viewOrders}')::boolean,true,'staff can view active orders');
select is((public.get_my_access_context()#>>'{permissions,cancelOrders}')::boolean,false,'staff cancellation is independently denied');
reset role;
select is(private.has_business_permission('10000000-0000-4000-8000-000000000001','edit_menu'),false,'database enforces denied menu editing');

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"21000000-0000-4000-8000-000000000101","role":"authenticated"}',true);
select is(public.get_my_access_context()->>'businessSlug','salamat','Salamat admin resolves to the second tenant');
select is(public.get_my_access_context()->>'serviceMode','table','Salamat resolves to QRK Table mode');
reset role;

select * from finish();
rollback;
