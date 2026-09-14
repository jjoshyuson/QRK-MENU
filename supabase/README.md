# QRK MENU backend foundation

> Supabase is the temporary development and initial staging provider. PostgreSQL and the adapter contracts are authoritative. Read `docs/DATABASE_SYNC_AND_PORTABILITY_PLAN.md` before replacing Supabase or moving to a VPS.

## Order synchronization and recovery

Migration `202609140001_order_sync_and_recovery.sql` adds registered browser installations, device-attached order creation, table/open-tab storage foundations, and tenant-scoped clear batches. `clear_order_activity` archives operational data while preserving restaurant, account, staff, menu, product, photo, branding, and destination records. Either of the two newest non-restored clear batches can be restored atomically.

The customer stores a random device UUID and secret. Only the secret digest reaches durable storage. This identifies a browser installation and prevents accidental namespace overlap; it is not a hardware identifier.

This folder is the canonical, version-controlled database source of truth. The disposable hosted development project `qrk-menu-development` was linked and rebuilt from all five migrations plus `seed.sql` on September 14, 2026. Hosted development now has one Client Admin and one Client Staff Auth identity for each of the five preview businesses, with active tenant memberships and forced first-login password changes. Temporary credentials live only in a gitignored local file. Browser runtime configuration, two-device synchronization, Storage checks, and recovery drills remain unverified; production is separate and was not touched.

## Structure

| Path | Purpose |
| --- | --- |
| `supabase/config.toml` | Safe local Supabase CLI/PostgreSQL 17 defaults |
| `supabase/migrations/202609090001_initial_schema.sql` | Portable application tables, constraints, indexes, snapshots, and lifecycle guards |
| `supabase/migrations/202609090002_supabase_security.sql` | Supabase Auth/RLS, narrow RPCs, Realtime Broadcast, and Storage policies |
| `supabase/seed.sql` | Development-only Kusina Manila sample data; never production data |
| `supabase/tests/001_security_and_orders.sql` | pgTAP coverage for public boundaries, tenant isolation, idempotency, and ordered staff transitions |
| `supabase/migrations/202609120001_local_auth_and_permissions.sql` | Global usernames, tenant access context and granular staff permission enforcement |
| `supabase/migrations/202609120002_service_mode_context.sql` | Quick/Table service mode in the tenant access context |
| `supabase/tests/002_auth_and_permissions.sql` | Username and staff-permission coverage |

The application schema uses UUIDs, PHP integer minor units, tenant foreign keys, immutable order snapshots, and append-only status events. Supabase-specific behavior is deliberately isolated in the second migration so a VPS move can retain the first migration and replace Auth claims, RPC exposure, Realtime, and Storage integration.

## Local development

Prerequisites: Docker-compatible container runtime and a current Supabase CLI. The Windows development machine completed this gate successfully on September 11, 2026; future machines and CI still need these prerequisites.

```sh
supabase start
supabase db reset --local
supabase test db
supabase db lint --local --level warning
npm run check
```

`db reset --local` is destructive only to the local Supabase database. It rebuilds from migrations and applies `seed.sql`, proving the repository can recreate the development state. Keep schema changes in new timestamped migrations; do not make unrecorded Dashboard SQL edits.

The local browser app needs no backend. Blank values in `dist/data/qrk-config.js` select the existing `localStorage` demo adapter automatically.

For local Auth, copy `dist/data/qrk-config.local.example.js` to the gitignored `dist/data/qrk-config.local.js` and paste the local `PUBLISHABLE_KEY` reported by `npx supabase status -o env`. Never use the secret/service-role key. This checkout is already configured.

Repeatable local-only logins after `supabase db reset --local`:

| Access | Username | Email | Password |
| --- | --- | --- | --- |
| Kusina business admin | `kusina-admin` | internal synthetic email | `QRK-local-admin-2026!` |
| Kusina order staff | `kusina-staff` | internal synthetic email | `QRK-local-staff-2026!` |
| Salamat business admin | `salamat-admin` | internal synthetic email | `QRK-local-salamat-admin-2026!` |
| Salamat order staff | `salamat-staff` | internal synthetic email | `QRK-local-salamat-staff-2026!` |

Kusina Manila is the QRK Quick tenant; Salamat is the QRK Table tenant. The repeatable repository seed contains those two tenants and four local identities. The hosted development project additionally has tenant/account shells for Salo Table, Tambay Café, and Ihaw Buffet, for ten identities total. Username sign-in maps to an internal `@accounts.qrkmenu.invalid` Auth address. The hosted temporary passwords are not committed and must be reprovisioned after a remote reset; production recovery and staff invitation/activation remain future milestones.

## Environments

- **Local:** `supabase/config.toml`, local containers, disposable development seed, and blank browser backend configuration.
- **Hosted development/staging:** its own Supabase project/ref, publishable key, Auth users, Storage objects, backups, and domain allow-list. It may receive development seed data only when explicitly intended.
- **Production:** a different project/ref, publishable key, users, Storage, backups, and operational monitoring. Never use `--include-seed` or remote reset against production.

Link one checkout to only one intended project at a time. Before any remote command, verify the linked ref and environment. Prefer explicit `--local` and `--linked` flags because Supabase command defaults differ.

## Hosted connection checklist (later)

1. Install/upgrade the Supabase CLI and Docker, then run the local reset, pgTAP tests, and lint commands above.
2. Create separate hosted development and production projects. Record project refs in the deployment/CI secret store, not committed files.
3. Link development only: `supabase link --project-ref <DEVELOPMENT_REF>`.
4. Compare migration history with `supabase migration list --linked`, then preview with `supabase db push --linked --dry-run`.
5. Apply to development with `supabase db push --linked`; use `--include-seed` only if that development project is intentionally disposable.
6. Create real Auth users and business memberships. Replace placeholder seed member IDs only in development data.
7. Disable public Realtime channels in project settings. Verify private channel authorization, Storage bucket/policies, Auth redirect URLs, and rate limits.
8. Put only the development URL, publishable key, business UUID, and public slug into a development copy of `dist/data/qrk-config.js`. Auth must inject the signed-in user's short-lived access token at runtime; do not commit it.
9. Exercise two-tenant denial, public-menu reads, duplicate order retry, every valid/invalid transition, private Broadcast reconnect, focus reconciliation, and photo upload/read rules in development.
10. Back up development, test restore into a disposable project, then repeat the reviewed migrations and smoke tests against production with production-specific configuration.

Do not call the backend operational until two physical devices pass the exit evidence in `docs/PROGRESS_MAP.md`.

## API and security boundary

Unauthenticated clients receive no direct table grants. They can execute only:

- `get_public_menu`: published customer fields only; drafts and private metadata stay hidden.
- `create_public_order`: validates business status, published item/option IDs, required selections, quantities, availability, and all prices on the server. A UUID request ID is unique per business and makes retries idempotent.
- `get_public_order_status`: requires the exact business slug, order number, and random tracking token.

Authenticated staff table reads remain RLS-scoped to active memberships. Order changes use `transition_order_status`; direct table updates are not granted. The database allows only received → preparing → ready → completed, plus cancellation from an active state. Completion requires the six-character handoff token. Order line names/prices/options are immutable snapshots, and event rows are append-only.

The publishable key is designed for browser use and does not bypass RLS. A secret/service-role key bypasses RLS and must never enter HTML, JavaScript, screenshots, logs, examples, or client configuration.

## Realtime and reconciliation

The authoritative flow is always initial/refetch data, then render. A database trigger emits a minimal `order_changed` hint to private topic `business:<business_uuid>:orders`. Realtime authorization permits only authenticated staff with order access for that business. The browser refetches after every hint, reconnect, online event, tab focus, manual refresh, and periodic interval. Missing, duplicated, or out-of-order Broadcast messages therefore cannot corrupt state.

Broadcast is used because current Supabase guidance favors it over Postgres Changes for scalability and authorization. It remains an optional transport behind `qrk-data-service.js`: a future VPS can replace it with a tenant-authorized WebSocket/event service while keeping the same fetch/reconcile contract. Anonymous customer tracking initially polls/fetches with its tracking token; a private per-order channel should be added only with a server-issued short-lived authorization token.

## Photos and storage

`menu-photos` is private and limited to JPEG, PNG, WebP, or AVIF up to 5 MiB. Paths begin with the business UUID. Menu editors may upload/update/delete only their business prefix; staff members may read their business assets; anonymous customers may read only assets marked `published` and referenced by the current published revision.

Validate actual file signatures and image dimensions in a trusted upload/image-processing service before marking metadata published. Keep originals private and generate `thumb`, `card`, and `large` derivatives with dimensions and SHA-256 metadata. `photo_assets.provider`, bucket, path, and variant form the provider boundary; a VPS/S3 migration updates delivery/storage adapters without changing menu-item identity.

## Backup, reset, and recovery

- Canonical schema recovery: clone the repository, install the pinned/current CLI, run `supabase db reset --local`, and verify tests.
- Hosted backup: use managed backups plus scheduled `supabase db dump --linked --data-only -f <protected-path>` (or provider `pg_dump`) and separately back up Storage objects. Store exports encrypted outside the repository.
- Restore drill: create a disposable project/database, apply repository migrations, restore data with `psql`/provider tooling, restore object files, then run tenant/order/public-menu tests and checksums.
- Development reset: confirm the linked ref, then `supabase db reset --linked --include-seed` only for a disposable hosted development project. Never run remote reset against production.

Database dumps are recovery data, not a replacement for migrations. The migrations in this folder must remain sufficient to recreate schema, policies, functions, triggers, and buckets from zero.

## CI gate once tooling is available

Run a fresh local stack in CI, then `supabase db reset --local`, `supabase test db`, `supabase db lint --local --level warning`, `npm run check`, and `node tests/photo-races.mjs`. Fail the build on migration, pgTAP, lint, JavaScript syntax, adapter contract, or secret-scan failures.

Primary references: [Supabase local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Realtime Broadcast database changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes), and [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).
