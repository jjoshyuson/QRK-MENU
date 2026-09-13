# Architecture memory

- The current app is static HTML, layered CSS and vanilla JavaScript with no third-party JavaScript dependencies.
- `dist/` contains authored source and must not be treated as disposable build output.
- `dist/index.html` holds the Business Dashboard, menu workspaces and dialogs; `dist/app.js` owns browser-memory state/rendering/interactions; `dist/style.css`, `dist/devices.css`, `dist/mobile-menu.css` and `dist/dashboard.css` form the CSS layers.
- Node is used only for the dependency-free local preview server in `scripts/serve.mjs`.
- Menu Studio state is browser memory; refresh restores sample menu data, and selected photos are temporary data URLs.
- There is no framework or connected/operational hosted backend. Canonical Supabase/PostgreSQL source lives in `supabase/`; on September 11, 2026 it rebuilt successfully in local Docker, passed all 19 pgTAP tests, and linted with no schema errors. A hosted project exists but is not linked or migrated; Auth, durable upload and cross-device ordering remain unverified.
- `/menu/` is a standalone customer-only route with its own small CSS/JavaScript payload and static menu data. It does not ship owner code or synchronize with Menu Studio edits.
- Customer and staff order operations use business-slug-scoped `localStorage` and survive refresh in one browser profile. Kusina and Salamat demo state stays isolated, but neither synchronizes across physical devices.
- Dashboard orders, sales, staff, QR/link, password and session controls are sample UI only. Some interactions update the current browser session and reset on refresh.
- Keep implementation and customer payloads minimal. Add dependencies or abstractions only for a demonstrated requirement.
- A future production public route should send only public menu data and customer code, not the owner editor bundle.
- Any future private backend must enforce tenant authorization on every request; hiding controls is insufficient.
- `dist/data/qrk-data-service.js` is the shared app seam. Blank safe config selects local demo behavior; valid public Supabase config selects the provider adapter. Supabase-specific Auth/RLS/Realtime/Storage SQL is isolated from the portable application schema for a future VPS move.
- Realtime messages are change hints only. Initial fetch plus reconnect, focus, interval and manual refetch are authoritative.
- Local Supabase Auth now has globally unique usernames, tenant context and individually enforced staff permissions. The browser refreshes short-lived sessions; deployed Sites keeps demo fallback because `qrk-config.local.js` is gitignored.
- The local seed has two tenants and four repeatable identities: Kusina admin/staff for Quick and Salamat admin/staff for Table. `business_profiles.settings.serviceMode` is returned in the tenant access context.
- Browser-local preview users are stored separately from Supabase Auth so the temporary-password and forced first-login-change UX can be tested end to end without exposing a service-role key. Production staff/client provisioning still requires trusted server-side account creation; the shared auth service supports changing a flagged Supabase user's password through their own authenticated session.
- QRK Admin client records use browser-local `qrk_platform_clients_v1`; initial Client Admin credentials reuse the shared preview-user store and first-login password gate. This is a prototype provisioning seam, not hosted tenant creation.
- Global appearance uses the host-scoped `qrk_global_theme_v1` browser cookie so local preview ports share a selected mode plus independent light/dark palettes; same-origin localStorage remains a compatibility copy. Legacy flat palettes migrate to custom Light. This is local preview persistence, not hosted account synchronization.
- `dist/data/qrk-service-presets.js` is the shared local preset/capability contract used by QRK Admin and the customer route. `dist/data/qrk-table-session-service.js` demonstrates one-device session and join-request rules in browser storage only; it is not the production or cross-device backend.

See `docs/TECHNICAL_HANDOFF.md` and `supabase/README.md` before architecture or persistence work.
