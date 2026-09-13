# Progress map

This file is the high-level route from the current prototype to a production QR menu. It shows sequence, dependencies and exit criteria. `docs/BUILD_STATUS.md` remains the detailed evidence log.

## Current position

The public customer menu now has a locally implemented device-specific layout pass: phone remains a compact two-column menu with a floating order action, tablet expands to three menu columns, and desktop uses a broad menu plus sticky order summary and wider review dialog. This is approved local UI work; publication remains pending.

Menu Studio now turns the customer route's previously hard-coded choices into browser-persisted option sets. Owners can define whole-business upsells, category defaults and item-specific choices with price and selection rules. The immediate backend path is still to connect authoring to the existing provider option-group schema and verify cross-device publication before making durability claims.

Tambay Café's approved Open Tab customer slice now has a browser-local whole-tab view: after the first item is added, customers can reopen a prominent running-total control and see all submitted order rounds separated by Accepted, Preparing, and Prepared status. This is local preview evidence, not tab settlement or hosted persistence.

The approved product direction is now one shared QRK platform with QRK Quick and QRK Table operating modes. The implementation and delegation contract is `docs/QUICK_TABLE_MASTER_PLAN.md`. Parallel UI, UX, and backend work must converge through its contract, integration, hosted-development, and explicit publish gates.

`UI prototype -> UI polish -> Business Dashboard UI -> customer ordering UI -> staff operations UI -> integrated same-browser demo -> local backend validation -> [current: Quick/Table two-tenant review] -> hosted development connection and verification -> production pilot -> reliability and rollout`

On September 13, 2026, a new Quick/Table configuration slice began. QRK Admin now exposes a capability-backed preset catalog and location-level Table participation/protection settings. The customer Table route is navbar-free and demonstrates session entry, named host, optional guest count, package selection, waiting, and staff acceptance. The LAN preview shares sessions across devices through its local server; GitHub Pages now reproduces each preset in browser-local storage so customer and staff tabs on the same origin can coordinate. Neither mode is a durable hosted Table backend.

The approved Payment First pilot flow is enabled for Kusina Manila while it remains QRK Quick. Review order leads with `Pay order`, then a focused two-card dialog presents `💵 Pay at the counter` and disabled `💳 Cashless` with a `Soon` badge. This is a same-browser simulation only; provider selection, charging, reconciliation, refunds, and hosted payment metadata remain unresolved production work.

The customer ordering and staff operations workstreams remain a working same-origin UI-only demonstration. The local build now uses the approved QRK logo assets and a global theme system with dark-sidebar light presets, full dark presets and independent advanced token editing for both modes. It remains in user review. Workstream 3 has an approved Supabase/PostgreSQL foundation that rebuilds and passes its full local database gate, but hosted connection work is intentionally paused until this UI/UX review is accepted. A hosted project exists but is not linked or migrated; hosted persistence and cross-device delivery are therefore not complete.

Menu Studio and the matching Customer Menu now share a business-scoped browser snapshot in demo mode, so Kusina and the other preview tenants no longer render independently authored menus. This closes same-browser preview parity only; durable publication to other devices remains Stage 2 work.

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
| 0.30 QRK brand and UI/UX review | Current; approved local work | Clean three-part logo set, global light/dark presets, a documented compact visual system, heading-free Settings actions, and single-action staff order completion | Integrated demo; supplied logo, Settings, and Orders directions | `AGENT/STYLE.md` guides future UI work; Settings preserves every control through focused editors; Quick orders move from Received to Paid, Table orders move from Received to Served, and Table session work remains under Tables; representative layouts have no horizontal overflow; user accepts the direction |
| 0.31 Quick/Table public landing pages | Corrected locally; publish pending | The user-supplied choice, Quick and Table designs remain intact while typography, hooks, asset paths and theme-aware accents connect them to QRK | Supplied HTML references; QRK brand/theme system; confirmed Quick/Table direction | All three supplied layouts and interactions remain recognizable; accent colors follow the global theme; typography and copy pass user review; routes reflow without horizontal overflow at phone, tablet and desktop widths |
| 1. Workstream 3 backend foundation | Complete locally; approved | Reproducible Supabase/PostgreSQL schema, tenant authorization, validation, Storage/Realtime rules and demo-safe adapter | Confirmed Supabase target; repository migrations; Docker and CLI | Fresh local reset succeeds; all 19 pgTAP tests pass; database lint reports no schema errors; static/application checks pass |
| 1.05 Local business Auth and permissions | Current; implemented locally | Email/username login resolves one tenant; admin and granular staff access are enforced in database and reflected in UI; browser-local account creation demonstrates generated temporary credentials and mandatory first-login password replacement | Local Docker stack; backend foundation | Seeded admin/staff logins resolve correct tenant; denied permissions remain denied; temporary-password preview lifecycle passes; 26 pgTAP tests, lint and app checks pass |
| 1.06 QRK Admin client provisioning preview | Complete locally; approved scope | QRK Admin creates browser-local client portals and their initial Client Admin handoff without managing Client Staff | Shared preview Auth seam; QRK Admin route | Client creation, one-time credentials, navigation, pause/activation and responsive layout pass; UI retains explicit non-hosted warning |
| 1.07 Per-business portal branding | Implemented locally; visual review pending | Client Admin selects a logo and safe colors shared by Client Admin, Client Staff and the customer menu while QRK Admin keeps the platform brand | Shared tenant slug; business profile UI; customer route | Brand persists by slug in the browser; readable theme variables and logo previews work; representative 390/768/1280 visual checks pass |
| 1.08 Quick/Table demo tenants | Complete locally | Kusina demonstrates Quick and Salamat demonstrates Table with separate admin/staff identities and isolated demo/provider state | Local Auth; service-mode contract; per-business routes | Fresh local reset, 28 pgTAP tests, all four login contexts, Salamat 390/768/1280 review and one Salamat customer-to-admin Supabase order pass |
| 1.09 Table presets and session-entry contract | Current; LAN and hosted-preview parity proven | Five development clients compose eight service layers; every Table client supports six-table selection or QR auto-selection, occupied-table joining, first-guest approval, cancellable/time-limited confirmation waits and staff-controlled table reopening | Quick/Table demo tenants; LAN server or same-browser hosted preview | LAN browser sessions share table occupancy and join approval; hosted customer/staff tabs reproduce the preset rules on one browser origin; unanswered waits expire at the configured time, customers can cancel, and the staff Tables board accepts requests and reopens cleaned tables; durable cross-device hosting/payment remains required |
| 1.095 Payment First pilot simulation | Complete locally; approved | Payment-first checkout offers disabled cashless and usable pay-at-counter choices; submitted orders remain live until the existing staff completion action | Service preset contract; customer checkout; staff Received queue | Contract test passes; payment metadata remains device-local; customer and staff language does not claim a charge |
| 1.1 Hosted development verification | Approved; paused for UI review | Apply migrations to the existing development project, connect Auth/public config, and prove behavior | Accepted brand/UI review; verified project/ref; safe publishable config; Auth users | Business A denied Business B; idempotent public order and all transitions pass; private Broadcast reconciles across two devices; photo rules pass |
| 2. Public menu and QR | Proposed; profile-specific test QR implemented | Durable public route, draft/publish flow and stable QR destination | Backend foundation and publication rules | Current preview gives each of five development clients a distinct scannable URL; exit still requires the same production QR to show a republished price on a second device |
| 3. Assisted import | Proposed | Reviewed AI-assisted extraction from printed menus | Durable draft model; provider/cost/privacy decisions | Real menu photos become a corrected draft without invented data |
| 4. Ordering pilot | Proposed | Guest order submission with staff operating workflow | Public menu; table/payment/abuse-control decisions | Pilot handles duplicate taps, connectivity loss, unavailable items and rejection |
| 5. Reliability and rollout | Proposed | Performance budgets, monitoring, backups, recovery and validated commercial model | Proven pilot | Measured reliability on representative devices/connections and documented operations |

## Immediate path

1. Review `/landing/`, `/landing/quick.html`, and `/landing/table.html` in both global theme modes and approve or revise the public copy and visual direction.
2. Review the corrected customer entry points for Kusina Quick, Salamat Direct Table, Salo Table Approval, Tambay Open Tab and Ihaw Buffet Approval; treat same-browser staff/customer coordination as preview evidence only.
3. Review logo upload, suggested/overridden colors and identity continuity across Client Admin, Client Staff and `/menu/?business=<slug>` at phone, tablet and desktop widths.
4. Replace the verified browser-local temporary-password preview with trusted server-side staff and client-admin provisioning before hosted rollout; never place privileged keys in browser code.
5. After UI/Auth acceptance, confirm the existing hosted project is disposable development, verify its project ref, then link that project only, following `supabase/README.md`.
6. Preview and apply the locally verified migrations to hosted development; do not include development seed unless explicitly intended.
7. Connect Auth and runtime development configuration using only the URL/publishable key in browser config; never place secret/service-role material in the browser.
8. Produce hosted Quick/Table exit evidence across two tenants and two physical devices before declaring the backend operational. Keep physical iOS/Android, full screen-reader, OS text-scaling and large-dataset checks listed as remaining UI verification.

## Cross-cutting constraints

- Keep the public customer experience extremely lightweight.
- Preserve the existing desktop management workspace and mobile/tablet two-column menu direction.
- Use one domain; do not create a separate mobile site.
- Do not claim or expose features before they are implemented and verified.
- Do not select paid providers, deploy, or add credentials without user approval.
- Keep each milestone usable, reviewable and independently verifiable.

## Maintenance

Update this map only when stage status, order, dependencies or exit criteria change. Put detailed test evidence and dated implementation notes in `docs/BUILD_STATUS.md`; put stable project knowledge and routing summaries in `memory/`.
## Current branch milestone — QRK Quick service choice

**Approved and completed:** QRK Quick asks Dine in or Takeout before menu browsing when both are enabled. The choice carries into checkout, where customers can confirm Pickup or Serve at table, enter a table number only when needed, review the subtotal, and continue to payment selection.

**Dependency:** Business availability is represented by `serviceProfile.settings.fulfillmentModes`. A management UI for changing that setting is proposed, not yet approved or built.

**Exit evidence:** Automated checks pass; local browser verification covers both paths, Table/buffet isolation, focus behavior, and phone/tablet/desktop reflow.

**Immediate path forward:** User review of the Quick dialog and checkout sequence, followed by a separately approved business-settings control if required.
