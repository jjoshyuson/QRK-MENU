-- DEVELOPMENT ONLY: Kusina Manila sample data.
-- Never apply this file to production (`supabase db push --include-seed` is for
-- disposable development/staging environments only).

insert into public.businesses (id, name, public_slug, currency_code, active)
values ('10000000-0000-4000-8000-000000000001', 'Kusina Manila', 'kusina-manila', 'PHP', true);

insert into public.business_profiles (
  business_id, description, address, phone, open_for_orders, order_prefix, next_order_number, settings
) values (
  '10000000-0000-4000-8000-000000000001',
  'Filipino comfort food for dine-in and pickup.',
  'Development sample address, Metro Manila',
  '+63 900 000 0000', true, 'KM', 1049, '{"serviceMode":"quick"}'
);

-- Local-only Auth users. These repeatable credentials are for Docker development,
-- are documented locally, and must never be copied into hosted environments.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change, phone_change,
  phone_change_token, reauthentication_token, email_change_token_current,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000101','authenticated','authenticated','kusina-admin@accounts.qrkmenu.invalid',extensions.crypt('QRK-local-admin-2026!',extensions.gen_salt('bf')),now(),'','','','','','','','',
   '{"provider":"email","providers":["email"]}','{}',now(),now()),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-4000-8000-000000000102','authenticated','authenticated','kusina-staff@accounts.qrkmenu.invalid',extensions.crypt('QRK-local-staff-2026!',extensions.gen_salt('bf')),now(),'','','','','','','','',
   '{"provider":"email","providers":["email"]}','{}',now(),now());
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000101','10000000-0000-4000-8000-000000000101','{"sub":"10000000-0000-4000-8000-000000000101","email":"kusina-admin@accounts.qrkmenu.invalid"}','email',now(),now(),now()),
  ('10000000-0000-4000-8000-000000000102','10000000-0000-4000-8000-000000000102','{"sub":"10000000-0000-4000-8000-000000000102","email":"kusina-staff@accounts.qrkmenu.invalid"}','email',now(),now(),now());
insert into public.user_profiles (user_id, username, display_name) values
  ('10000000-0000-4000-8000-000000000101','kusina-admin','Jonathan Yuson'),
  ('10000000-0000-4000-8000-000000000102','kusina-staff','Daniel Lim');

insert into public.business_members (business_id, user_id, role, can_manage_orders, can_manage_menu, can_manage_staff,
  can_view_orders, can_accept_orders, can_prepare_orders, can_mark_ready, can_complete_orders,
  can_cancel_orders, can_change_availability, can_edit_menu, can_view_order_history, can_view_sales)
values
  ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000101', 'owner', true, true, true, true,true,true,true,true,true,true,true,true,true),
  ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000102', 'order_staff', true, false, false, true,true,true,true,true,false,true,false,true,false);

insert into public.menus (id, business_id, name)
values ('10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000001', 'Main menu');

insert into public.menu_revisions (id, business_id, menu_id, version, state, published_at, created_by)
values (
  '10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000201', 1, 'published', now(), '10000000-0000-4000-8000-000000000101'
);
update public.menus set published_revision_id = '10000000-0000-4000-8000-000000000301'
where id = '10000000-0000-4000-8000-000000000201';

insert into public.categories (id, business_id, menu_id, revision_id, name, public_slug, sort_order)
values
  ('10000000-0000-4000-8000-000000000401', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000301', 'Mains', 'mains', 0),
  ('10000000-0000-4000-8000-000000000402', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000301', 'Sides', 'sides', 1),
  ('10000000-0000-4000-8000-000000000403', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000301', 'Drinks', 'drinks', 2);

insert into public.menu_items (id, business_id, revision_id, category_id, stable_key, name, description, price_minor, available, sort_order)
values
  ('10000000-0000-4000-8000-000000000501', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000401', '10000000-0000-4000-8000-000000000901', 'Chicken adobo', 'Soy-vinegar braised chicken with steamed rice.', 18000, true, 0),
  ('10000000-0000-4000-8000-000000000502', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000401', '10000000-0000-4000-8000-000000000902', 'Sinigang na baboy', 'Pork and vegetables in tamarind broth.', 22000, true, 1),
  ('10000000-0000-4000-8000-000000000503', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000402', '10000000-0000-4000-8000-000000000903', 'Lumpiang shanghai', 'Crisp pork spring rolls.', 12000, false, 0),
  ('10000000-0000-4000-8000-000000000504', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000403', '10000000-0000-4000-8000-000000000904', 'Calamansi iced tea', 'House-brewed calamansi tea.', 6500, true, 0);

insert into public.item_option_groups (id, business_id, menu_item_id, name, required, min_selections, max_selections, sort_order)
values
  ('10000000-0000-4000-8000-000000000601', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000501', 'Serving', true, 1, 1, 0),
  ('10000000-0000-4000-8000-000000000602', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000501', 'Add-ons', false, 0, 2, 1);

insert into public.item_options (id, business_id, option_group_id, name, price_delta_minor, available, sort_order)
values
  ('10000000-0000-4000-8000-000000000701', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000601', 'Regular', 0, true, 0),
  ('10000000-0000-4000-8000-000000000702', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000601', 'Large', 6500, true, 1),
  ('10000000-0000-4000-8000-000000000703', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000602', 'Extra rice', 3000, true, 0);

insert into public.public_destinations (id, business_id, menu_id, slug)
values ('10000000-0000-4000-8000-000000000801', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', 'kusina-manila');

-- Salamat is the second local tenant and demonstrates the QRK Table experience.
insert into public.businesses (id, name, public_slug, currency_code, active)
values ('21000000-0000-4000-8000-000000000001', 'Salamat', 'salamat', 'PHP', true);

insert into public.business_profiles (business_id, description, address, phone, open_for_orders, order_prefix, next_order_number, settings)
values ('21000000-0000-4000-8000-000000000001', 'Filipino food and attentive table service.', 'Development sample address, Makati', '+63 900 000 0001', true, 'SL', 201, '{"serviceMode":"table"}');

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change, phone_change,
  phone_change_token, reauthentication_token, email_change_token_current,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000','21000000-0000-4000-8000-000000000101','authenticated','authenticated','salamat-admin@accounts.qrkmenu.invalid',extensions.crypt('QRK-local-salamat-admin-2026!',extensions.gen_salt('bf')),now(),'','','','','','','','',
   '{"provider":"email","providers":["email"]}','{}',now(),now()),
  ('00000000-0000-0000-0000-000000000000','21000000-0000-4000-8000-000000000102','authenticated','authenticated','salamat-staff@accounts.qrkmenu.invalid',extensions.crypt('QRK-local-salamat-staff-2026!',extensions.gen_salt('bf')),now(),'','','','','','','','',
   '{"provider":"email","providers":["email"]}','{}',now(),now());

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  ('21000000-0000-4000-8000-000000000101','21000000-0000-4000-8000-000000000101','{"sub":"21000000-0000-4000-8000-000000000101","email":"salamat-admin@accounts.qrkmenu.invalid"}','email',now(),now(),now()),
  ('21000000-0000-4000-8000-000000000102','21000000-0000-4000-8000-000000000102','{"sub":"21000000-0000-4000-8000-000000000102","email":"salamat-staff@accounts.qrkmenu.invalid"}','email',now(),now(),now());

insert into public.user_profiles (user_id, username, display_name) values
  ('21000000-0000-4000-8000-000000000101','salamat-admin','Maya Santos'),
  ('21000000-0000-4000-8000-000000000102','salamat-staff','Paolo Reyes');

insert into public.business_members (business_id, user_id, role, can_manage_orders, can_manage_menu, can_manage_staff,
  can_view_orders, can_accept_orders, can_prepare_orders, can_mark_ready, can_complete_orders,
  can_cancel_orders, can_change_availability, can_edit_menu, can_view_order_history, can_view_sales)
values
  ('21000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000101', 'owner', true, true, true, true,true,true,true,true,true,true,true,true,true),
  ('21000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000102', 'order_staff', true, false, false, true,true,true,true,true,false,true,false,true,false);

insert into public.menus (id, business_id, name)
values ('21000000-0000-4000-8000-000000000201', '21000000-0000-4000-8000-000000000001', 'Table menu');
insert into public.menu_revisions (id, business_id, menu_id, version, state, published_at, created_by)
values ('21000000-0000-4000-8000-000000000301', '21000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000201', 1, 'published', now(), '21000000-0000-4000-8000-000000000101');
update public.menus set published_revision_id='21000000-0000-4000-8000-000000000301' where id='21000000-0000-4000-8000-000000000201';

insert into public.categories (id, business_id, menu_id, revision_id, name, public_slug, sort_order) values
  ('21000000-0000-4000-8000-000000000401','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000201','21000000-0000-4000-8000-000000000301','Mains','mains',0),
  ('21000000-0000-4000-8000-000000000402','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000201','21000000-0000-4000-8000-000000000301','Sides','sides',1),
  ('21000000-0000-4000-8000-000000000403','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000201','21000000-0000-4000-8000-000000000301','Drinks','drinks',2);

insert into public.menu_items (id, business_id, revision_id, category_id, stable_key, name, description, price_minor, available, sort_order) values
  ('21000000-0000-4000-8000-000000000501','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000301','21000000-0000-4000-8000-000000000401','21000000-0000-4000-8000-000000000901','Chicken adobo','Soy-vinegar braised chicken with steamed rice.',18000,true,0),
  ('21000000-0000-4000-8000-000000000502','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000301','21000000-0000-4000-8000-000000000401','21000000-0000-4000-8000-000000000902','Sinigang na baboy','Pork and vegetables in tamarind broth.',22000,true,1),
  ('21000000-0000-4000-8000-000000000503','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000301','21000000-0000-4000-8000-000000000402','21000000-0000-4000-8000-000000000903','Lumpiang shanghai','Crisp pork spring rolls.',12000,true,0),
  ('21000000-0000-4000-8000-000000000504','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000301','21000000-0000-4000-8000-000000000403','21000000-0000-4000-8000-000000000904','Calamansi iced tea','House-brewed calamansi tea.',6500,true,0);

insert into public.public_destinations (id, business_id, menu_id, slug)
values ('21000000-0000-4000-8000-000000000801','21000000-0000-4000-8000-000000000001','21000000-0000-4000-8000-000000000201','salamat');
