-- Menu background settings are tenant-written text: whitelist and clamp here, leave fallback rules to the client.
create or replace function public.get_public_business_cosmetics(p_destination_slug text)
returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'accentColor',profile.accent_color,
    'logoUrl',coalesce(profile.settings #>> '{menuCosmetics,logoUrl}',''),
    'backgroundUrl',coalesce(profile.settings #>> '{menuCosmetics,backgroundUrl}',''),
    'coverUrl',coalesce(profile.settings #>> '{menuCosmetics,coverUrl}',''),
    'backgroundOpacity',coalesce((profile.settings #>> '{menuCosmetics,backgroundOpacity}')::numeric,.72),
    'backgroundStyle',case when profile.settings #>> '{menuCosmetics,background,style}' in ('photo','pattern','pattern-moving','glow','plain')
      then profile.settings #>> '{menuCosmetics,background,style}' else 'glow' end,
    'backgroundPattern',case when profile.settings #>> '{menuCosmetics,background,pattern}' in ('filipino','cafe','ramen','pizza','dessert')
      then to_jsonb(profile.settings #>> '{menuCosmetics,background,pattern}') else 'null'::jsonb end,
    'backgroundStrength',case when profile.settings #>> '{menuCosmetics,background,strength}' ~ '^\s*-?\d+(\.\d+)?\s*$'
      then greatest(0,least(100,round((profile.settings #>> '{menuCosmetics,background,strength}')::numeric)::integer)) else 50 end
  )
  from public.public_destinations destination
  join public.business_profiles profile on profile.business_id=destination.business_id
  where destination.slug=lower(trim(p_destination_slug)) and destination.active;
$$;

grant execute on function public.get_public_business_cosmetics(text) to anon,authenticated;
