-- Server-authorized QRK platform client provisioning metadata.

create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.platform_clients (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  username_prefix text not null unique check (username_prefix ~ '^[a-z0-9][a-z0-9_-]{1,29}$'),
  location_name text not null default '' check (char_length(location_name) <= 120),
  initial_admin_user_id uuid unique references auth.users(id) on delete set null,
  initial_admin_email text not null check (char_length(initial_admin_email) between 3 and 254),
  service_profile jsonb not null default '{}'::jsonb check (jsonb_typeof(service_profile)='object'),
  provider text not null default 'qrk' check (provider in ('qrk','rnl')),
  provider_config jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_config)='object'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;
alter table public.platform_clients enable row level security;

create or replace function private.is_platform_admin()
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.platform_admins where user_id=(select auth.uid()) and active)
$$;

create function public.get_my_platform_admin_context()
returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object('userId',a.user_id,'displayName',a.display_name,'isPlatformAdmin',true)
  from public.platform_admins a where a.user_id=(select auth.uid()) and a.active
$$;

create function public.list_platform_clients()
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if not private.is_platform_admin() then raise exception 'platform admin required' using errcode='42501'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id',b.id,'businessName',b.name,'slug',b.public_slug,'prefix',pc.username_prefix,
      'status',case when b.active then 'active' else 'paused' end,'createdAt',pc.created_at,
      'serviceProfile',pc.service_profile,'provider',pc.provider,'providerConfig',pc.provider_config,
      'admin',jsonb_build_object('userId',pc.initial_admin_user_id,'name',coalesce(up.display_name,''),
        'email',pc.initial_admin_email,'username',coalesce(up.username,''),'access','Hosted account')
    ) order by pc.created_at,b.name)
    from public.platform_clients pc join public.businesses b on b.id=pc.business_id
    left join public.user_profiles up on up.user_id=pc.initial_admin_user_id
  ),'[]'::jsonb);
end;
$$;

revoke all on table public.platform_admins,public.platform_clients from anon,authenticated;
revoke all on function public.get_my_platform_admin_context(),public.list_platform_clients() from public;
grant execute on function public.get_my_platform_admin_context(),public.list_platform_clients() to authenticated;

comment on table public.platform_clients is 'Non-secret QRK platform provisioning metadata. Provider credentials remain in server-side secrets.';
