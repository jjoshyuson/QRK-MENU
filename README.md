# QRK MENU — Codex handoff

This package contains the current menu and Business Dashboard UI prototype, all six sample menu photos, and the plan for continuing development in Codex.

## Start here

1. Extract the ZIP.
2. Open the `QRK-MENU` folder in Codex or your code editor.
3. Read `CODEX_START_HERE.md` and paste its starter prompt into Codex.
4. To preview locally, install Node.js if needed, open a terminal in this folder, and run `npm start`.
5. Open `http://127.0.0.1:4173`.

No npm dependencies or installation step are needed for this prototype. Do not open `dist/index.html` directly: its assets use root-relative URLs and need the local server. Alternative with Python installed: `python -m http.server 4173 --directory dist`.

To preview on your phone, use `npm run start:lan`, connect both devices to the same Wi-Fi, then open `http://YOUR-COMPUTER-LAN-IP:4173`. Your firewall may need to allow the local server. This optional command exposes the prototype to devices on that network; it is not a production server.

## What is included

| Path | Purpose |
| --- | --- |
| `dist/` | Editable source of the working static site, despite the folder name |
| `dist/assets/brand/` | Canonical transparent PNG QRK mark, wordmark and combined logo assets |
| `dist/theme.css` | Shared neutral and QRK accent variables used by owner and customer routes |
| `dist/manifest.webmanifest`, `dist/pwa.*`, `dist/sw.js` | Shared installable app metadata, app-like touch behavior and lightweight service-worker shell |
| `dist/photos/` | Six bundled sample food photographs |
| `dist/dashboard.css` | Business Dashboard layout and responsive workspace styles |
| `dist/menu/` | Standalone customer-only development menu route, including its small route-specific theme layer and CSS/JavaScript payload |
| `dist/landing/` | Lightweight public choice, QRK Quick and QRK Table landing pages sharing the global QRK theme |
| `dist/components/` | Unlinked, static development inventory of reusable owner, admin, staff and customer UI components and states |
| `dist/menu/payment-first.css` | Small checkout override for the simulated Payment First choices and keyboard focus treatment |
| `dist/data/` | Shared demo/Supabase data-service adapter and safe public configuration scaffold |
| `dist/data/qrk-auth-service.js` | Lightweight local Supabase Auth session and tenant-context client |
| `dist/data/qrk-brand-service.js` | Browser-local per-business logo/color preview with contrast-safe theme derivation |
| `dist/data/qrk-menu-store.js` | Business-scoped Menu Studio state shared with the Customer Menu in the browser preview |
| `dist/data/qrk-businesses.js` | Lightweight Quick/Table demo-business experience definitions |
| `scripts/serve.mjs` | Dependency-free local preview server |
| `scripts/validate-backend.mjs` | Static schema/security/test coverage and secret-pattern validation |
| `tests/payment-first-preview.mjs` | Lightweight contract check for the pilot payment choice and explicit staff-acceptance boundary |
| `supabase/` | Canonical migrations, development seed, pgTAP tests, local config, and recovery/connection runbook |
| `CODEX_START_HERE.md` | Ready-to-paste continuation prompt |
| `AGENTS.md` | Instructions to preserve the product and design decisions |
| `AGENT/STYLE.md` | Authoritative QRK interface density, card, navigation, responsive and accessibility rules |
| `memory/` | Concise topic-based context, including `inbox.md` for rough ideas awaiting review and routing |
| `docs/PRODUCT_PLAN.md` | Product intent, decisions, proposed scope, phased roadmap |
| `docs/UI_AND_FLOWS.md` | Desktop/mobile requirements and interaction descriptions |
| `docs/TECHNICAL_HANDOFF.md` | Current structure, limitations, adapter and provider-ready backend architecture |
| `docs/BUILD_STATUS.md` | Completed work, next milestone, and verification checklist |
| `docs/PROGRESS_MAP.md` | Milestone sequence, dependencies, status and exit criteria |
| `docs/QUICK_TABLE_MASTER_PLAN.md` | Shared QRK Quick/Table architecture, team ownership, branch gates and deployment plan |
| `docs/PHOTO_SOURCES.json` | Asset provenance |
| `deployment/original-hosting.json` | Archived identity of the original Sites project |
| `MANIFEST.sha256` | Checksums of the included files |

## Current state

- Desktop: Business Dashboard with overview, profile, Menu Studio, staff access, orders, and settings sections.
- PWA shell: owner tools, client/admin tools and the customer menu share standalone install metadata, safe-area handling and app-like touch behavior. Double-tap zoom is suppressed without disabling deliberate pinch zoom.
- Component inventory: `/components/` is an unlinked development-only visual catalog with production class/source labels; landing-page UI is intentionally excluded.
- Brand: black, white and gray dominate the interface, with cyan/teal reserved for actions and selection. Separate transparent PNG icon, wordmark and combined assets preserve the approved generated artwork; the favicon uses the icon-only mark.
- Mobile/tablet at viewport widths up to 1100 CSS pixels: Dashboard opens first; a top-right hamburger opens navigation, and Menu Studio is a separate view with photo-grid and quick availability-table modes.
- Owners can add/edit/delete items, set PHP prices and option notes, create/reorder categories, rename the menu, set available/sold-out/hidden states, and replace photos.
- Local Supabase Auth includes Kusina Manila admin/staff accounts for QRK Quick and Salamat admin/staff accounts for QRK Table, with tenant routing and granular permission gates. Staff provisioning controls remain preview-only until invitation/activation is implemented.
- Customer view restores the restaurant identity header and hides item editing controls. `/menu/?business=kusina-manila` demonstrates Quick; `/menu/?business=salamat&table=12` demonstrates a table-linked Salamat visit with pickup removed and the table fixed from the demo link.
- The root dashboard provides the matching staff-side active/history queue, order details, status progression, handoff-token verification, cancellation, and store-open controls.
- The `Restaurant · pay first` preset simulates a pilot checkout with disabled cashless and enabled pay-at-counter choices. Submitted orders remain Received until staff explicitly accepts them into Preparing; no payment is taken.
- Customer and staff order state survives refresh only through same-origin `localStorage` in one browser profile. Different physical devices do not synchronize.
- A provider-ready Supabase/PostgreSQL foundation now exists under `supabase/`, and both public routes use a shared adapter that automatically stays in demo mode while backend configuration is absent.
- Menu Studio changes persist in this browser and immediately drive the matching `/menu/` Customer Menu; unavailable and hidden items are omitted there. This is browser-preview synchronization, not durable cross-device publishing.
- The repository includes tenant RLS, server-validated order RPCs, local Auth/permission migrations, development logins, private Broadcast and photo-storage policies. The hosted project is not linked, migrated or verified; hosted login, staff activation, operational persistence, real QR generation, durable UI publishing, payments and notifications remain incomplete. The service worker provides a basic cached shell, not a verified offline ordering workflow.

The running app is still a UI-only same-browser ordering demonstration, not a production ordering service. Provider-ready SQL is not evidence of an operational backend. The sample business and food prices are illustrative. The prototype still loads its fonts from Google Fonts; all food photos are bundled locally.

## Snapshot

- Public development site: https://qrk-menu-studio.jjoshyuson.chatgpt.site
- Saved and deployed Sites version: 8
- Hosted source provenance: recorded with Sites version 8
- Last deployed and remotely checked: September 9, 2026.

The neutral-first brand update described above is currently local and has not been deployed. The public URL remains Sites version 8 until a later deployment is explicitly approved.

The hosted release contains the public `dist/` files and active `.openai/hosting.json`; handoff documents and local tooling are excluded from the deployment bundle. Access tokens, account sessions, and temporary working files are not included. `deployment/original-hosting.json` remains historical reference metadata.

## Photo use

Five photos are external sample images with no verified open reuse license. The lumpia photo is AI-generated. Sources are in `docs/PHOTO_SOURCES.json` and `dist/photo-credits.html`. Before a public restaurant launch, use restaurant-owned or properly licensed images. Keep the source credits with this private prototype.
