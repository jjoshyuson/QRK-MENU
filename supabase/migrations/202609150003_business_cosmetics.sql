-- Public-menu cosmetics are tenant-owned, manager-written, and anonymously readable.
alter table public.business_profiles alter column accent_color set default '#1683ff';
update public.business_profiles set accent_color='#1683ff' where accent_color='#f36f21';

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('business-cosmetics','business-cosmetics',true,6291456,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy business_cosmetics_manager_insert on storage.objects for insert to authenticated
with check (bucket_id='business-cosmetics' and private.has_business_role(((storage.foldername(name))[1])::uuid,array['owner','admin','manager']::public.business_role[]));
create policy business_cosmetics_manager_update on storage.objects for update to authenticated
using (bucket_id='business-cosmetics' and private.has_business_role(((storage.foldername(name))[1])::uuid,array['owner','admin','manager']::public.business_role[]))
with check (bucket_id='business-cosmetics' and private.has_business_role(((storage.foldername(name))[1])::uuid,array['owner','admin','manager']::public.business_role[]));
create policy business_cosmetics_manager_delete on storage.objects for delete to authenticated
using (bucket_id='business-cosmetics' and private.has_business_role(((storage.foldername(name))[1])::uuid,array['owner','admin','manager']::public.business_role[]));

create function public.get_public_business_cosmetics(p_destination_slug text)
returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'accentColor',profile.accent_color,
    'logoUrl',coalesce(profile.settings #>> '{menuCosmetics,logoUrl}',''),
    'backgroundUrl',coalesce(profile.settings #>> '{menuCosmetics,backgroundUrl}',''),
    'coverUrl',coalesce(profile.settings #>> '{menuCosmetics,coverUrl}',''),
    'backgroundOpacity',coalesce((profile.settings #>> '{menuCosmetics,backgroundOpacity}')::numeric,.72)
  )
  from public.public_destinations destination
  join public.business_profiles profile on profile.business_id=destination.business_id
  where destination.slug=lower(trim(p_destination_slug)) and destination.active;
$$;

grant execute on function public.get_public_business_cosmetics(text) to anon,authenticated;
