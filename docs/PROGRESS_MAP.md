# Progress map

This file is the high-level route from the current prototype to a production QR menu. It shows sequence, dependencies and exit criteria. `docs/BUILD_STATUS.md` remains the detailed evidence log.

## Current position

The approved product direction is now one shared QRK platform with QRK Quick and QRK Table operating modes. The implementation and delegation contract is `docs/QUICK_TABLE_MASTER_PLAN.md`. Parallel UI, UX, and backend work must converge through its contract, integration, hosted-development, and explicit publish gates.

`UI prototype -> UI polish -> Business Dashboard UI -> customer ordering UI -> staff operations UI -> integrated same-browser demo -> local backend validation -> [current: Quick/Table two-tenant review] -> hosted development connection and verification -> production pilot -> reliability and rollout`

On September 13, 2026, a new local Quick/Table configuration slice began. QRK Admin now exposes a capability-backed preset catalog and location-level Table participation/protection settings. The customer Table route is navbar-free and demonstrates session entry, named host, guest count, package selection, waiting, and local preview acceptance. This is browser-local interaction evidence, not a connected Table backend or cross-device claim.

The customer ordering and staff operations workstreams remain a working same-origin UI-only demonstration. The local build now uses the approved QRK logo assets and a global theme system with dark-sidebar light presets, full dark presets and independent advanced token editing for both modes. It remains in user review. Workstream 3 has an approved Supabase/PostgreSQL foundation that rebuilds and passes its full local database gate, but hosted connection work is intentionally paused until this UI/UX review is accepted. A hosted project exists but is not linked or migrated; hosted persistence and cross-device delivery are therefore not complete.

A business-approved trusted-customer/VIP account model has been captured for product discovery only. It is not approved implementation work and does not change the immediate hosted-development verification path.

## Milestones

| Stage | Status | Outcome | Depends on | Exit evidence |
| --- | --- | --- | --- | --- |
| 0. Prototype baseline | Complete | Desktop editor plus two-column mobile/tablet menu | None | Existing add/edit/delete, categories, photos, availability and preview flows work in browser memory |
| 0.1 UI polish | Local pass complete | Responsive and accessible prototype remains recognizable | Prototype baseline | Representative viewport and interaction checks recorded in `docs/BUILD_STATUS.md` |
| 0.2 Business Dashboard UI | Local pass complete; approved scope | Cohesive UI for overview, profile, menu, staff, orders/history/sales and settings, including mobile-first Dashboard navigation and quick stock handling | UI polish; confirmed UI-only scope | All sections navigate and representative demo controls, including mobile availability toggles, work without production claims |
| 0.25 Public development review build | Complete | Current prototype is reachable at the existing development URL and unmistakably labeled Development | Business Dashboard UI; explicit deployment approval | Sites version 5 succeeded; remote phone, tablet and desktop checks pass |
| 0.26 Customer-only development route | Complete; published | `/menu/` demonstrates a separate lightweight customer payload and the dashboard links to it | Public development review build | Sites version 7 succeeded; route has no owner bundle or Development badge; remote phone/tablet/desktop and category navigation checks pass |
| 0.27 Customer ordering UI | Complete; approved UI-only scope | Browse/search, configured items, persistent cart, table/pickup checkout, confirmation and status tracking | Customer-only route | Same-browser customer flow handles valid/invalid, sold-out, empty, closed and cancelled states |
| 0.28 Staff order operations UI | Complete; approved UI-only scope | Active/history queues, responsive order detail, progression, token handoff, cancellation and event history | Customer ordering contract | Same-browser staff can operate customer-created orders without backend claims |
| 0.29 Integrated same-browser demo | Complete; published | Customer and staff tabs share device-local orders and store status with refresh persistence | Customer and staff UI workstreams | Final same-browser lifecycle passed; Sites version 8 published; `/` and `/menu/` remotely verified |
| 0.30 QRK brand and UI/UX review | Current; approved local work | Clean three-part logo set plus global light/dark presets and separate advanced token sets across owner, staff and customer surfaces | Integrated demo; supplied logo direction | Assets and shared theme modes load; preset and custom palettes persist; representative layouts have no horizontal overflow; user accepts the direction |
| 1. Workstream 3 backend foundation | Complete locally; approved | Reproducible Supabase/PostgreSQL schema, tenant authorization, validation, Storage/Realtime rules and demo-safe adapter | Confirmed Supabase target; repository migrations; Docker and CLI | Fresh local reset succeeds; all 19 pgTAP tests pass; database lint reports no schema errors; static/application checks pass |
| 1.05 Local business Auth and permissions | Current; implemented locally | Email/username login resolves one tenant; admin and granular staff access are enforced in database and reflected in UI; browser-local account creation demonstrates generated temporary credentials and mandatory first-login password replacement | Local Docker stack; backend foundation | Seeded admin/staff logins resolve correct tenant; denied permissions remain denied; temporary-password preview lifecycle passes; 26 pgTAP tests, lint and app checks pass |
| 1.06 QRK Admin client provisioning preview | Complete locally; approved scope | QRK Admin creates browser-local client portals and their initial Client Admin handoff without managing Client Staff | Shared preview Auth seam; QRK Admin route | Client creation, one-time credentials, navigation, pause/activation and responsive layout pass; UI retains explicit non-hosted warning |
| 1.07 Per-business portal branding | Implemented locally; visual review pending | Client Admin selects a logo and safe colors shared by Client Admin, Client Staff and the customer menu while QRK Admin keeps the platform brand | Shared tenant slug; business profile UI; customer route | Brand persists by slug in the browser; readable theme variables and logo previews work; representative 390/768/1280 visual checks pass |
| 1.08 Quick/Table demo tenants | Complete locally | Kusina demonstrates Quick and Salamat demonstrates Table with separate admin/staff identities and isolated demo/provider state | Local Auth; service-mode contract; per-business routes | Fresh local reset, 28 pgTAP tests, all four login contexts, Salamat 390/768/1280 review and one Salamat customer-to-admin Supabase order pass |
| 1.09 Table presets and session-entry contract | Current; LAN preview proven | Five development clients compose eight service layers; every Table client supports six-table selection or QR auto-selection, occupied-table joining, first-guest approval and staff-controlled table reopening | Quick/Table demo tenants; single LAN preview server | Separate browser sessions share table occupancy and join approval; the staff Tables board accepts requests and reopens cleaned tables; hosted persistence/payment remains required |
| 1.1 Hosted development verification | Approved; paused for UI review | Apply migrations to the existing development project, connect Auth/public config, and prove behavior | Accepted brand/UI review; verified project/ref; safe publishable config; Auth users | Business A denied Business B; idempotent public order and all transitions pass; private Broadcast reconciles across two devices; photo rules pass |
| 2. Public menu and QR | Proposed | Durable public route, draft/publish flow and stable QR destination | Backend foundation and publication rules | Same QR shows a republished price on a second device |
| 3. Assisted import | Proposed | Reviewed AI-assisted extraction from printed menus | Durable draft model; provider/cost/privacy decisions | Real menu photos become a corrected draft without invented data |
| 4. Ordering pilot | Proposed | Guest order submission with staff operating workflow | Public menu; table/payment/abuse-control decisions | Pilot handles duplicate taps, connectivity loss, unavailable items and rejection |
| 5. Reliability and rollout | Proposed | Performance budgets, monitoring, backups, recovery and validated commercial model | Proven pilot | Measured reliability on representative devices/connections and documented operations |

## Immediate path

1. Review the five one-click development clients and their customer entry points: Kusina Quick, Salamat Direct Table, Salo Table Approval, Tambay Open Tab and Ihaw Buffet Approval.
2. Review logo upload, suggested/overridden colors and identity continuity across Client Admin, Client Staff and `/menu/?business=<slug>` at phone, tablet and desktop widths.
3. Replace the verified browser-local temporary-password preview with trusted server-side staff and client-admin provisioning before hosted rollout; never place privileged keys in browser code.
4. After UI/Auth acceptance, confirm the existing hosted project is disposable development, verify its project ref, then link that project only, following `supabase/README.md`.
5. Preview and apply the locally verified migrations to hosted development; do not include development seed unless explicitly intended.
6. Connect Auth and runtime development configuration using only the URL/publishable key in browser config; never place secret/service-role material in the browser.
7. Produce hosted Quick/Table exit evidence across two tenants and two physical devices before declaring the backend operational. Keep physical iOS/Android, full screen-reader, OS text-scaling and large-dataset checks listed as remaining UI verification.

## Cross-cutting constraints

- Keep the public customer experience extremely lightweight.
- Preserve the existing desktop management workspace and mobile/tablet two-column menu direction.
- Use one domain; do not create a separate mobile site.
- Do not claim or expose features before they are implemented and verified.
- Do not select paid providers, deploy, or add credentials without user approval.
- Keep each milestone usable, reviewable and independently verifiable.

## Maintenance

Update this map only when stage status, order, dependencies or exit criteria change. Put detailed test evidence and dated implementation notes in `docs/BUILD_STATUS.md`; put stable project knowledge and routing summaries in `memory/`.
