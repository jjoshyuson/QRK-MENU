begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

-- Cosmetics are read through the anonymous public RPC; settings are written as the table owner.
create function pg_temp.set_background(p_background jsonb) returns void language sql as $$
  update public.business_profiles
  set settings=coalesce(settings,'{}'::jsonb)||jsonb_build_object('menuCosmetics',(coalesce(settings->'menuCosmetics','{}'::jsonb)-'background')||case when p_background is null then '{}'::jsonb else jsonb_build_object('background',p_background) end)
  where business_id='10000000-0000-4000-8000-000000000001'
$$;

select pg_temp.set_background(null);
set local role anon;
select is(public.get_public_business_cosmetics('kusina-manila')->>'backgroundStyle','glow','missing background defaults to glow');
select is(public.get_public_business_cosmetics('kusina-manila')->'backgroundPattern','null'::jsonb,'missing background has no pattern');
select is((public.get_public_business_cosmetics('kusina-manila')->>'backgroundStrength')::integer,50,'missing background defaults to strength 50');
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

select * from finish();
rollback;
