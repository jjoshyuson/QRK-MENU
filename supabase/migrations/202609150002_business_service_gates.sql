-- Reusable business service gates and server-authorized permanent table entry.

create table public.business_service_configs (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  foundation text not null check (foundation in ('quick','table')),
  gates jsonb not null default '{}'::jsonb check (jsonb_typeof(gates)='object'),
  updated_at timestamptz not null default now()
);
alter table public.business_service_configs enable row level security;
create policy business_service_configs_staff_read on public.business_service_configs for select to authenticated
  using (private.is_business_member(business_id));
create policy business_service_configs_admin_write on public.business_service_configs for all to authenticated
  using (private.has_business_role(business_id,array['owner','admin','manager']::public.business_role[]))
  with check (private.has_business_role(business_id,array['owner','admin','manager']::public.business_role[]));

create table public.table_entry_identifiers (
  id uuid primary key default extensions.gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  table_number text not null check (table_number ~ '^[1-9][0-9]{0,2}$'),
  token_digest text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id,table_number)
);
alter table public.table_entry_identifiers enable row level security;
create policy table_entry_identifiers_staff on public.table_entry_identifiers for all to authenticated
  using (private.has_business_role(business_id,array['owner','admin','manager']::public.business_role[]))
  with check (private.has_business_role(business_id,array['owner','admin','manager']::public.business_role[]));

create or replace function public.resolve_table_entry(p_destination_slug text,p_token text)
returns jsonb language sql security definer set search_path='' as $$
  select jsonb_build_object('table',q.table_number)
  from public.table_entry_identifiers q
  join public.businesses b on b.id=q.business_id
  where b.public_slug=p_destination_slug and b.active and q.active
    and q.token_digest=encode(extensions.digest(p_token,'sha256'),'hex')
  limit 1
$$;
revoke all on function public.resolve_table_entry(text,text) from public;
grant execute on function public.resolve_table_entry(text,text) to anon,authenticated;

alter table public.table_sessions
  add column last_activity_at timestamptz not null default now(),
  add column inactivity_minutes smallint not null default 120 check (inactivity_minutes between 15 and 720),
  add column inactivity_grace_minutes smallint not null default 15 check (inactivity_grace_minutes between 1 and 120),
  add column inactivity_warning_at timestamptz,
  add column inactivity_grace_elapsed boolean not null default false;

drop index public.table_sessions_one_live_table_idx;
alter table public.table_sessions drop constraint table_sessions_status_check;
alter table public.table_sessions add constraint table_sessions_status_check
  check (status in ('pending','active','bill_requested','inactivity_warning','settled','cleaned','cancelled','expired'));
create unique index table_sessions_one_live_table_idx on public.table_sessions(business_id,table_number)
  where clear_batch_id is null and status in ('pending','active','bill_requested','inactivity_warning');

comment on column public.table_sessions.inactivity_grace_elapsed is
  'A staff attention flag only. It never releases or marks the physical table clean.';
