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
| `dist/photos/` | Six bundled sample food photographs |
| `dist/dashboard.css` | Business Dashboard layout and responsive workspace styles |
| `dist/menu/` | Standalone customer-only development menu route and its small CSS/JavaScript payload |
| `scripts/serve.mjs` | Dependency-free local preview server |
| `CODEX_START_HERE.md` | Ready-to-paste continuation prompt |
| `AGENTS.md` | Instructions to preserve the product and design decisions |
| `memory/` | Concise topic-based context and routing for new chats |
| `docs/PRODUCT_PLAN.md` | Product intent, decisions, proposed scope, phased roadmap |
| `docs/UI_AND_FLOWS.md` | Desktop/mobile requirements and interaction descriptions |
| `docs/TECHNICAL_HANDOFF.md` | Current structure, limitations, proposed architecture/data model |
| `docs/BUILD_STATUS.md` | Completed work, next milestone, and verification checklist |
| `docs/PROGRESS_MAP.md` | Milestone sequence, dependencies, status and exit criteria |
| `docs/PHOTO_SOURCES.json` | Asset provenance |
| `deployment/original-hosting.json` | Archived identity of the original Sites project |
| `MANIFEST.sha256` | Checksums of the included files |

## Current state

- Desktop: Business Dashboard with overview, profile, Menu Studio, staff access, orders, and settings sections.
- Mobile/tablet at viewport widths up to 1100 CSS pixels: Dashboard opens first; a top-right hamburger opens navigation, and Menu Studio is a separate view with photo-grid and quick availability-table modes.
- Owners can add/edit/delete items, set PHP prices and option notes, create/reorder categories, rename the menu, set available/sold-out/hidden states, and replace photos.
- Business profile, staff accounts, orders, sales, QR/link, account, and session controls are realistic UI-only demo states.
- Customer view restores the restaurant identity header and hides item editing controls. `/menu/` is a separate lightweight customer route with browse/search, configured items, a persistent cart, table or pickup checkout, demo order confirmation, and status tracking.
- The root dashboard provides the matching staff-side active/history queue, order details, status progression, handoff-token verification, cancellation, and store-open controls.
- Customer and staff order state survives refresh only through same-origin `localStorage` in one browser profile. Different physical devices do not synchronize.
- Menu Studio edits still reset on refresh and do not publish into `/menu/`; uploaded photos remain temporary.
- Login, tenant isolation, backend persistence, real QR generation, durable menu publishing, server-validated ordering, payments, notifications, and offline support are not implemented.

This is a UI-only same-browser ordering demonstration, not a production ordering service. The sample business and food prices are illustrative. The prototype still loads its fonts from Google Fonts; all food photos are bundled locally.

## Snapshot

- Public development site: https://qrk-menu-studio.jjoshyuson.chatgpt.site
- Saved and deployed Sites version: 5
- Hosted source commit: `0a077037427c008136b1255ef3b7f55283483bb9`
- Last deployed and remotely checked: September 9, 2026.

The hosted release contains the public `dist/` files and active `.openai/hosting.json`; handoff documents and local tooling are excluded from the deployment bundle. Access tokens, account sessions, and temporary working files are not included. `deployment/original-hosting.json` remains historical reference metadata.

## Photo use

Five photos are external sample images with no verified open reuse license. The lumpia photo is AI-generated. Sources are in `docs/PHOTO_SOURCES.json` and `dist/photo-credits.html`. Before a public restaurant launch, use restaurant-owned or properly licensed images. Keep the source credits with this private prototype.
