begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

-- Cosmetics are read through the anonymous public RPC; settings are written as the table owner.
create function pg_temp.set_background(p_background jsonb) returns void language sql as $$
  update public.business_profiles
  set settings=coalesce(settings,'{}'::jsonb)||jsonb_build_object('menuCosmetics',(coalesce(settings->'menuCosmetics','{}'::jsonb)-'background')||case when p_background is null then '{}'::jsonb else jsonb_build_object('background',p_background) end)
  where business_id='10000000-0000-4000-8000-000000000001'
$$;

select pg_temp.set_background(null);
set local role anon;
select is(public.get_public_business_cosmetics('kusina-manila')->'backgroundStyle','null'::jsonb,'missing background leaves style null for the legacy photo rule');
select is(public.get_public_business_cosmetics('kusina-manila')->'backgroundPattern','null'::jsonb,'missing background has no pattern');
select is(public.get_public_business_cosmetics('kusina-manila')->'backgroundStrength','null'::jsonb,'missing background leaves strength null');
reset role;

select pg_temp.set_background('{"pattern":"cafe"}');
set local role anon;
select is(public.get_public_business_cosmetics('kusina-manila')->'backgroundStyle','null'::jsonb,'absent style stays null even when a pattern is stored');
reset role;

select pg_temp.set_background('{"style":"<script>","pattern":"../x","strength":"999"}');
set local role anon;
select is(public.get_public_business_cosmetics('kusina-manila')->>'backgroundStyle','glow','cosmetics whitelist rejects unknown style');
select is(public.get_public_business_cosmetics('kusina-manila')->'backgroundPattern','null'::jsonb,'cosmetics whitelist rejects unknown pattern');
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,100,'strength is clamped to 100');
reset role;

select pg_temp.set_background('{"style":"pattern","pattern":"ramen","strength":35}');
set local role anon;
select is(public.get_public_business_cosmetics('kusina-manila')->>'backgroundStyle','pattern','valid style is returned unchanged');
select is(public.get_public_business_cosmetics('kusina-manila')->>'backgroundPattern','ramen','valid pattern is returned unchanged');
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,35,'valid strength is returned unchanged');
reset role;

select pg_temp.set_background('{"style":"plain","strength":"99999999999"}');
set local role anon;
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,100,'huge strength string clamps to 100 without overflow');
reset role;

select pg_temp.set_background('{"style":"plain","strength":1e10}');
set local role anon;
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,100,'huge strength number clamps to 100 without overflow');
reset role;

select pg_temp.set_background('{"style":"plain","strength":"abc"}');
set local role anon;
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,50,'non-numeric strength falls back to 50');
reset role;

select pg_temp.set_background('{"style":"plain","strength":-5}');
set local role anon;
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,0,'negative strength clamps to 0');
reset role;

-- Featured flag and tags on menu items.
select throws_ok($$update public.menu_items set tags='{spicy,unknown}' where id='10000000-0000-4000-8000-000000000501'$$,'23514',null,'menu item tags reject unknown values');
select lives_ok($$update public.menu_items set featured=true,tags='{spicy,sharing}' where id='10000000-0000-4000-8000-000000000501'$$,'known tags and featured flag are accepted');
select is((select featured from public.menu_items where id='10000000-0000-4000-8000-000000000502'),false,'featured defaults to false');
select is((select tags from public.menu_items where id='10000000-0000-4000-8000-000000000502'),'{}'::text[],'tags default to empty');
set local role anon;
select is((select i->'featured' from jsonb_path_query(public.get_public_menu('kusina-manila'),'$.menu.categories[*].items[*]') i where i->>'name'='Chicken adobo'),'true'::jsonb,'public menu returns featured');
select is((select i->'tags' from jsonb_path_query(public.get_public_menu('kusina-manila'),'$.menu.categories[*].items[*]') i where i->>'name'='Chicken adobo'),'["spicy","sharing"]'::jsonb,'public menu returns tags');
reset role;

select * from finish();
rollback;
