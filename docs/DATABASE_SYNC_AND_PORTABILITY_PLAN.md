# Database sync and portability plan

## Status and purpose

Supabase is the approved **temporary development and initial staging provider** for QRK MENU. PostgreSQL is the durable data contract. Supabase Auth, REST, Realtime, and Storage are adapters around that contract, not permanent product dependencies.

This document is authoritative when implementing order synchronization or when the user says QRK must **upgrade, migrate, or move away from Supabase to a VPS**.

## Source-of-truth boundary

Supabase/PostgreSQL is authoritative for submitted orders, immutable order snapshots, status history, store ordering availability, registered browser installations, table sessions, participants, join requests, open tabs, and reversible clear batches. Realtime messages are change hints only; clients replace rendered state with a database refetch after initial load, reconnect, focus, visibility return, periodic reconciliation, manual refresh, clear, or restore.

An unsubmitted cart stays on the customer device and is keyed by business plus a random installation UUID. Local/demo mode remains an explicit fallback for development when provider configuration is absent; it must never be presented as cross-device synchronization.

## Device identity

- Generate a random UUID and a separate high-entropy secret in the browser.
- Store the pair in local storage; mirror the non-secret UUID in a first-party cookie for recovery/inspection.
- Register the pair through a narrow RPC. Store only a SHA-256 digest of the secret.
- Scope customer drafts as `business:{business}:device:{device}:...`.
- Treat the identity as a browser installation identifier, not proof of a physical phone.
- Never use IP address, user agent, screen size, table number, or a browser fingerprint as identity.
- A future same-domain application server may issue an HttpOnly cookie without changing the database identity contract.

## Reversible operational clearing

`clear_order_activity` creates a tenant-scoped batch and archives active operational records in one transaction. It preserves accounts, businesses, profiles, memberships, menus, revisions, categories, products, options, photos, branding, and public destinations. The two newest non-restored batches remain restorable. Restore is transactional and refuses unsafe conflicts instead of partially recovering data.

Order line items and status events remain immutable. Archived data is hidden through RPC filters and RLS rather than destructive client-side deletion. Permanent retention/purge policy requires a separate approved milestone.

## Staging topology

1. GitHub remains the source repository and CI practice environment.
2. A dedicated Supabase project is used for disposable development/staging data only.
3. Browser artifacts receive only the staging URL and publishable key through the build environment.
4. Database passwords, secret/service-role keys, and signing secrets never enter browser files or Git.
5. Migrations are previewed, applied forward-only, then verified with two tenants and two separate devices.
6. Frontend publication occurs only after the database gate passes. Keep the last known-good frontend artifact available for rollback.

## Moving from Supabase to a VPS

When migration is requested, do not rewrite product flows first. Follow this sequence:

1. Freeze schema changes and record the current migration version.
2. Provision managed or self-hosted PostgreSQL on the VPS with encrypted transport, backups, point-in-time recovery, monitoring, and least-privilege roles.
3. Apply the portable `public` schema and data constraints first.
4. Replace `auth.uid()` and Supabase JWT helpers behind the existing private authorization functions.
5. Replace REST/RPC transport behind `dist/data/qrk-data-service.js`; preserve method inputs and normalized outputs.
6. Replace private Realtime Broadcast with WebSocket/SSE notifications carrying hints only.
7. Replace Supabase Storage with an S3-compatible/private object adapter while preserving database asset metadata and tenant-prefixed keys.
8. Export, checksum, import, and reconcile tenant data. Verify counts, foreign keys, immutable snapshots, clear batches, and object references.
9. Run dual-read comparison in staging, then a short controlled write freeze for final cutover.
10. Rotate all old provider credentials, retain encrypted rollback backups, and document the recovery window.

The replaceable seams are the data service, auth service, image service, configuration loader, and provider-specific migration files. Business rules, tenant keys, integer-money representation, idempotency, lifecycle guards, and immutable snapshots must remain provider-neutral.

## Exit evidence

- Local reset, pgTAP, database lint, application checks, and secret scan pass.
- Tenant A cannot read or mutate Tenant B.
- Two devices at the same table retain separate identities and drafts.
- Duplicate submission converges through idempotency.
- Customer, staff, and history reconcile after reconnect.
- Clear removes operational records from every device; either of the last two batches restores atomically.
- Restaurant, account, staff, menu, product, image, and branding data are unchanged.
- Hosted staging passes the same checks before it is described as synchronized.
