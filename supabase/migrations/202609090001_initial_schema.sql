-- QRK MENU portable application schema.
-- Supabase-specific auth, RLS, Realtime and Storage integration is isolated in
-- 202609090002_supabase_security.sql.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create type public.business_role as enum ('owner', 'admin', 'manager', 'order_staff', 'menu_editor');
create type public.menu_revision_state as enum ('draft', 'published', 'archived');
create type public.asset_visibility as enum ('private', 'published');
create type public.order_fulfillment as enum ('table', 'pickup');
create type public.order_status as enum ('received', 'preparing', 'ready', 'completed', 'cancelled');

create table public.businesses (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  public_slug text not null unique check (public_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  currency_code text not null default 'PHP' check (currency_code ~ '^[A-Z]{3}$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_profiles (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  description text not null default '' check (char_length(description) <= 500),
  address text not null default '' check (char_length(address) <= 300),
  phone text not null default '' check (char_length(phone) <= 40),
  timezone text not null default 'Asia/Manila',
  locale text not null default 'en-PH',
  accent_color text not null default '#f36f21' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  open_for_orders boolean not null default false,
  order_prefix text not null default 'QRK' check (order_prefix ~ '^[A-Z0-9]{1,8}$'),
  next_order_number bigint not null default 1 check (next_order_number > 0),
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  updated_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null,
  role public.business_role not null,
  can_manage_orders boolean not null default false,
  can_manage_menu boolean not null default false,
  can_manage_staff boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index business_members_user_idx on public.business_members(user_id) where active;

create table public.menus (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  published_revision_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id)
);
create index menus_business_idx on public.menus(business_id);

create table public.menu_revisions (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  menu_id uuid not null,
  version integer not null check (version > 0),
  state public.menu_revision_state not null default 'draft',
  published_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  foreign key (menu_id, business_id) references public.menus(id, business_id) on delete cascade,
  unique (menu_id, version),
  unique (id, business_id)
);
create unique index one_published_revision_per_menu_idx on public.menu_revisions(menu_id) where state = 'published';
create index menu_revisions_business_idx on public.menu_revisions(business_id, menu_id, state);

alter table public.menus
  add constraint menus_published_revision_fk
  foreign key (published_revision_id, business_id)
  references public.menu_revisions(id, business_id)
  deferrable initially deferred;

create table public.photo_assets (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  provider text not null default 'supabase' check (char_length(provider) between 1 and 40),
  bucket_id text not null default 'menu-photos',
  object_path text not null check (object_path !~ '(^|/)\.\.(/|$)'),
  visibility public.asset_visibility not null default 'private',
  derivative_of uuid references public.photo_assets(id) on delete set null,
  variant text not null default 'original' check (variant in ('original', 'thumb', 'card', 'large')),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  byte_size bigint not null check (byte_size between 1 and 5242880),
  width integer check (width between 1 and 12000),
  height integer check (height between 1 and 12000),
  content_sha256 text check (content_sha256 is null or content_sha256 ~ '^[0-9a-f]{64}$'),
  alt_text text not null default '' check (char_length(alt_text) <= 180),
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (provider, bucket_id, object_path),
  unique (id, business_id)
);
create index photo_assets_business_idx on public.photo_assets(business_id, visibility);

create table public.categories (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  menu_id uuid not null,
  revision_id uuid not null,
  name text not null check (char_length(name) between 1 and 80),
  public_slug text not null check (public_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  foreign key (menu_id, business_id) references public.menus(id, business_id) on delete cascade,
  foreign key (revision_id, business_id) references public.menu_revisions(id, business_id) on delete cascade,
  unique (revision_id, public_slug),
  unique (id, business_id, revision_id)
);
create index categories_revision_sort_idx on public.categories(revision_id, sort_order, id);

create table public.menu_items (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  revision_id uuid not null,
  category_id uuid not null,
  stable_key uuid not null default extensions.gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 500),
  price_minor integer not null check (price_minor between 0 and 100000000),
  available boolean not null default true,
  hidden boolean not null default false,
  photo_asset_id uuid,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  foreign key (revision_id, business_id) references public.menu_revisions(id, business_id) on delete cascade,
  foreign key (category_id, business_id, revision_id) references public.categories(id, business_id, revision_id) on delete cascade,
  foreign key (photo_asset_id, business_id) references public.photo_assets(id, business_id) on delete set null,
  unique (id, business_id),
  unique (revision_id, stable_key)
);
create index menu_items_revision_sort_idx on public.menu_items(revision_id, category_id, sort_order, id);
create index menu_items_public_idx on public.menu_items(revision_id, available) where not hidden;

create table public.item_option_groups (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  menu_item_id uuid not null,
  name text not null check (char_length(name) between 1 and 80),
  required boolean not null default false,
  min_selections smallint not null default 0 check (min_selections >= 0),
  max_selections smallint not null default 1 check (max_selections >= 1),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  foreign key (menu_item_id, business_id) references public.menu_items(id, business_id) on delete cascade,
  check (max_selections >= min_selections),
  check (not required or min_selections >= 1),
  unique (id, business_id)
);
create index option_groups_item_sort_idx on public.item_option_groups(menu_item_id, sort_order, id);

create table public.item_options (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  option_group_id uuid not null,
  name text not null check (char_length(name) between 1 and 100),
  price_delta_minor integer not null default 0 check (price_delta_minor between 0 and 100000000),
  available boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  foreign key (option_group_id, business_id) references public.item_option_groups(id, business_id) on delete cascade,
  unique (id, business_id)
);
create index item_options_group_sort_idx on public.item_options(option_group_id, sort_order, id);

create table public.public_destinations (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  menu_id uuid not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  foreign key (menu_id, business_id) references public.menus(id, business_id) on delete cascade,
  unique (business_id, menu_id)
);

create table public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  order_sequence bigint not null check (order_sequence > 0),
  order_number text not null check (char_length(order_number) between 1 and 32),
  tracking_token text not null unique check (tracking_token ~ '^[0-9a-f]{32}$'),
  verification_token text not null check (verification_token ~ '^[A-HJ-NP-Z2-9]{6}$'),
  idempotency_key uuid not null,
  fulfillment_type public.order_fulfillment not null,
  table_number text check (table_number is null or table_number ~ '^[0-9]{1,3}$'),
  customer_label text check (customer_label is null or char_length(customer_label) <= 40),
  notes text not null default '' check (char_length(notes) <= 180),
  status public.order_status not null default 'received',
  currency_code text not null check (currency_code ~ '^[A-Z]{3}$'),
  subtotal_minor integer not null check (subtotal_minor between 0 and 100000000),
  handoff_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  cancelled_at timestamptz,
  check ((fulfillment_type = 'table' and table_number is not null) or (fulfillment_type = 'pickup' and table_number is null)),
  unique (business_id, order_sequence),
  unique (business_id, order_number),
  unique (business_id, idempotency_key),
  unique (id, business_id)
);
create index orders_business_active_idx on public.orders(business_id, status, created_at);
create index orders_business_history_idx on public.orders(business_id, updated_at desc);

create table public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null,
  order_id uuid not null,
  menu_item_id uuid,
  item_name text not null check (char_length(item_name) between 1 and 120),
  unit_price_minor integer not null check (unit_price_minor between 0 and 100000000),
  quantity smallint not null check (quantity between 1 and 20),
  line_total_minor integer not null check (line_total_minor = unit_price_minor * quantity),
  notes text not null default '' check (char_length(notes) <= 140),
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  foreign key (order_id, business_id) references public.orders(id, business_id) on delete restrict,
  foreign key (menu_item_id, business_id) references public.menu_items(id, business_id) on delete set null (menu_item_id),
  unique (id, business_id),
  unique (order_id, sort_order)
);
create index order_items_order_idx on public.order_items(order_id, sort_order);

create table public.order_item_options (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null,
  order_item_id uuid not null,
  item_option_id uuid,
  group_name text not null check (char_length(group_name) between 1 and 80),
  option_name text not null check (char_length(option_name) between 1 and 100),
  price_delta_minor integer not null check (price_delta_minor between 0 and 100000000),
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  foreign key (order_item_id, business_id) references public.order_items(id, business_id) on delete restrict,
  foreign key (item_option_id, business_id) references public.item_options(id, business_id) on delete set null (item_option_id),
  unique (order_item_id, sort_order)
);
create index order_item_options_item_idx on public.order_item_options(order_item_id, sort_order);

create table public.order_status_events (
  id bigint generated always as identity primary key,
  business_id uuid not null,
  order_id uuid not null,
  from_status public.order_status,
  to_status public.order_status not null,
  actor_user_id uuid,
  label text not null check (char_length(label) between 1 and 120),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  foreign key (order_id, business_id) references public.orders(id, business_id) on delete restrict
);
create index order_status_events_order_idx on public.order_status_events(order_id, id);

create function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_updated_at before update on public.businesses
for each row execute function public.set_updated_at();
create trigger business_profiles_updated_at before update on public.business_profiles
for each row execute function public.set_updated_at();
create trigger business_members_updated_at before update on public.business_members
for each row execute function public.set_updated_at();
create trigger menus_updated_at before update on public.menus
for each row execute function public.set_updated_at();

create function public.guard_order_status_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = old.status then return new; end if;
  if not (
    (old.status = 'received' and new.status in ('preparing', 'cancelled')) or
    (old.status = 'preparing' and new.status in ('ready', 'cancelled')) or
    (old.status = 'ready' and new.status in ('completed', 'cancelled'))
  ) then
    raise exception 'invalid order status transition: % -> %', old.status, new.status using errcode = '23514';
  end if;
  new.updated_at = now();
  new.completed_at = case when new.status = 'completed' then now() else old.completed_at end;
  new.cancelled_at = case when new.status = 'cancelled' then now() else old.cancelled_at end;
  return new;
end;
$$;
create trigger guard_order_status before update of status on public.orders
for each row execute function public.guard_order_status_change();

-- Snapshot and audit records are append-only. Trusted migration/restore roles can
-- disable triggers explicitly during disaster recovery.
create function public.reject_mutation()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception '% is immutable', tg_table_name using errcode = '55000';
end;
$$;
create trigger immutable_order_items before update or delete on public.order_items for each row execute function public.reject_mutation();
create trigger immutable_order_item_options before update or delete on public.order_item_options for each row execute function public.reject_mutation();
create trigger immutable_order_events before update or delete on public.order_status_events for each row execute function public.reject_mutation();
