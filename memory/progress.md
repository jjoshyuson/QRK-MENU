# Progress memory

As of September 13, 2026:

- The shared Button component now uses the approved pill hierarchy across standard and customer actions while continuing to inherit the active global theme accent. Source variables, catalog specimens and Inspect Element variants are synchronized.

- Business Profile and the public customer route now share a business-scoped public-menu background contract with upload, remove/reset, and a neutral surface-veil control. Kusina is seeded with its bundled illustrated wallpaper at 72%; other businesses remain image-free until customized.

- Each of the five development client profiles now has a distinct scannable test QR in Business Profile. It targets that client's `/menu/?business=<slug>` route and can be opened, copied, or downloaded. QR images use a temporary HTTPS generator; permanent production URLs and first-party generation remain Stage 2 work.

- The component inventory is now backed by a shared production source of truth: `dist/ui-components.css` supplies reusable variables/visual rules to every operational route and `/components/`, while `dist/ui-components.js` gives initial and dynamically rendered elements stable Inspect Element names and variants. The catalog covers 15 UI families and excludes landing pages.

- A shared PWA shell is implemented locally across owner, client/admin and customer routes. Manifest, standalone metadata, touch behavior and the lightweight service-worker cache pass static/base-path validation; publication and physical-device installed-mode verification remain pending.

- Public customer-menu responsive redesign is implemented locally: desktop adds a sticky order summary and wider order review, tablet uses a three-column menu, and phone preserves its compact two-column menu and floating order action. Final light/dark and representative-width verification is recorded in `docs/BUILD_STATUS.md`; publication remains pending.

- Kusina Manila remains QRK Quick and uses a guided payment-first checkout: `Pay order` opens a minimal dialog with `💵 Pay at the counter` and disabled `💳 Cashless` cards.

- The public landing-page set at `/landing/` has been corrected locally to preserve the three supplied HTML designs. The revised pages retain their original structure, visuals, motion and content depth; use Manrope/DM Sans, official QRK assets, global-theme accent colors, and stronger Quick/Table hooks. Local 390px, 768px, and 1280px overflow checks passed; corrected deployment and user review remain open.

- Business Settings is now one compact rounded list of four full-row entry points backed by focused dialogs. Orders removes Preparing: Quick shows Received with Mark paid, while Table adds Tables and uses Mark served for received orders. Responsive History shares the hamburger's top-bar container. Validation evidence is recorded in `docs/BUILD_STATUS.md`.

- Confirmation-gated Table requests now support customer cancellation and automatic expiry. The default acceptance wait is 90 seconds, client setup can configure 30–600 seconds, and terminal requests no longer resolve as the device's current session.

- The browser-preview Menu Studio is now the single source for the matching Customer Menu. Kusina defaults to the full six-item studio menu, edits persist per business, open customer tabs refresh on changes, and unavailable/hidden items are omitted. Ordering option sets are configurable at business, category and item scope and inherit into customer item choices with prices and selection rules. Durable provider-backed authoring and cross-device publication still depend on the hosted backend milestone.

- Payment First is implemented as an approved local pilot simulation for the `Restaurant · pay first` preset: cashless is visible but disabled, pay-at-counter is required, and received orders need explicit staff acceptance before Preparing. Payment execution and hosted payment metadata remain future work.

- GitHub Pages preview-session parity is implemented and locally verified: the profile identity opens Settings/Log out, and logout returns to the sign-in screen with five Client Admin preview workspaces. All five customer presets now follow the LAN field and gate rules on the static deployment; Salo Table customer → staff acceptance → customer unlock passed in separate tabs on one origin. This remains browser-local and does not synchronize the LAN origin or different physical devices.

- The Client Admin/Client Staff Orders workspace now follows the simplified operational direction: all live orders stay under Received until one mode-aware completion action moves them to History. Preparing/Ready remain internal compatibility states only; the backend contract is unchanged.

- The static UI prototype and local responsive polish pass are complete.
- The UI-only Business Dashboard milestone is complete: balanced overview, business profile/appearance/QR/link, expanded menu management, staff access, live/history orders with sample sales, and business settings.
- Desktop, tablet and phone layouts were checked at representative CSS widths; core item/category/photo/availability/customer-preview flows were exercised.
- Business Dashboard navigation and representative profile, category ordering, hidden-item, staff-account, order-status/history, store-status and responsive return flows were exercised. Phone/tablet now lands on Dashboard, uses a right-side hamburger drawer and opens Menu Studio separately. Menu Studio offers Photo editor, Customer view and a quick availability table; stock toggles update immediately. No page-level horizontal overflow was measured at representative phone, tablet and desktop widths.
- Category navigation now jumps to scroll sections and tracks the active section.
- Availability view rows were enlarged for safer phone tapping; prices were removed only from that mode and stock controls remain on the far right.
- Remaining UI risks: physical iOS/Android keyboard behavior, full keyboard/screen-reader navigation, OS text scaling and a very large category set.
- The current prototype is published at `https://qrk-menu-studio.jjoshyuson.chatgpt.site` as Sites version 8. Desktop and responsive owner headers show a Development badge.
- Remote checks at 390, 768 and 1280 CSS pixels confirmed the Dashboard-first responsive layout, hamburger navigation, separate Menu Studio, customer preview, availability table, no page-level horizontal overflow and no console errors.
- A standalone customer-only `/menu/` development route is published in Sites version 7 with a separate lightweight payload. The dashboard link targets it, and remote 390/768/1280 checks confirm two columns, working category navigation, no owner controls, no Development badge and no console errors.
- Customer ordering and staff operations are complete and published as Sites version 8 in one same-browser UI-only demo. End-to-end completion, pickup cancellation, store open/closed sync, refresh persistence, 390/768/1280 layout checks and clean consoles passed locally; `/` and `/menu/` were remotely checked after deployment.
- Workstream 3 is approved and provider-ready in repository source: canonical Supabase/PostgreSQL migrations, seed, SQL tests, RLS/RPC/Realtime/Storage design and shared app adapter are implemented.
- Docker Desktop and the project-local Supabase CLI are installed. The canonical migrations rebuild successfully in local Supabase; all 19 pgTAP tests pass and database lint reports no schema errors. The SQL-only lint cleanup removed redundant declarations without changing behavior.
- A hosted Supabase project exists but is not linked, migrated or configured. The exact next milestone is to confirm it is disposable development, link/preview/push the verified migrations, configure Auth safely, and complete tenant/two-device exit evidence.
- Current local work is the QRK brand and UI/UX review. The inaccurate hand-drawn SVG logo approximation was replaced with three transparent PNG assets extracted from the approved generated artwork. The second local theme pass is neutral-first—near-black, white and gray with restrained cyan/teal accents—and uses shared variables from `dist/theme.css`. Representative 390/768/1280 checks and a complete same-browser order lifecycle passed. Hosted Supabase connection work remains paused until the user accepts this visual direction.
- Local business Auth is implemented: seeded admin/staff logins, username mapping, session restoration, tenant context, owner/staff routing and granular database permissions. The separate `/admin/` route now has a clearly labeled temporary development bypass into a basic platform-client overview; it is no longer linked from the business login. Hosted OAuth, production recovery and staff invitation/activation remain incomplete.
- QRK Admin now has functional local Overview, Clients and Client Admins views. It can create and pause/activate browser-local client portals, generate the initial Client Admin's one-time credentials, and route that account through the existing first-login password gate. QRK Admin has no Client Staff controls; hosted client/admin provisioning remains incomplete.
- The temporary-credential UX is complete locally: staff creation generates a one-time password, the credential handoff is copyable, and first login requires password replacement before workspace access. Dynamic preview accounts remain browser-local; trusted hosted provisioning for both staff and client admins is still required.
- Per-business logo and color branding is implemented as a browser-local preview. The shared brand service extracts a suggested logo accent, derives accessible theme values and keys identity by business slug so Client Admin, Client Staff and the matching customer route can agree. `npm run check` passes; representative browser visual checks remain pending because UI automation failed to initialize in the implementation session.
- Kusina Manila represents QRK Quick and Salamat represents QRK Table. Four seeded local logins cover admin/staff for both tenants; the service-mode context and business-scoped browser demo state are implemented. A fresh local reset succeeded, all 28 pgTAP tests passed, and direct Auth checks resolved both admin/staff pairs to the correct tenant, role and mode. Salamat customer UI passed 390/768/1280 checks, including a fixed Table 12 checkout.
- The Salamat customer route now consumes the local Supabase publishable configuration. Browser evidence confirms submitted order `SL-0201` from Table 12 appeared in Salamat Admin; cart and pending-request storage is isolated by tenant and data mode.
- The CSS-generated sidebar wordmark and added CSS backing have been removed. QRK Admin, business navigation and login surfaces now render the canonical transparent combined PNG lockup from `dist/assets/brand/qrk-logo.png`; local desktop and 370px drawer checks passed.
- Global Appearance now offers four complete light presets with dark sidebars, four complete dark presets, a global mode switch and separate advanced 13-token editors for each mode. Legacy palettes migrate safely; desktop Admin and customer dark-mode surfaces were visually checked.
- Five development clients are available through one-click local Client Admin shortcuts: Kusina Quick, Salamat Direct Table, Salo Table Approval, Tambay Open Tab and Ihaw Buffet Approval. Their menus are preserved and centrally configured without generated photos.
- The staff Orders workspace now includes a six-card Tables page. LAN testing proved request → staff acceptance → occupied → table cleaned → available. The GitHub Pages preview now uses a same-browser storage fallback and has passed request → staff acceptance → customer unlock; durable cross-device table sessions remain incomplete.
- The LAN order regression is fixed: Kusina `KM-1050` and Salamat `SL-0207` were submitted through the customer route and appeared in their authenticated Supabase staff queues. The six-table selection and host-controlled join flow also passed across separate browser device sessions. Table sessions use the local preview server only and reset when it restarts.

Read `docs/PROGRESS_MAP.md` for milestone sequencing and `docs/BUILD_STATUS.md` for detailed evidence.
## September 13, 2026 — QRK Quick service choice

- Completed on `P/MENU/2`: configurable Dine in/Takeout entry dialog and fulfillment-aware Quick checkout.
- Validation passed for automated checks, both customer paths, buffet isolation and representative responsive widths.
- Business-facing controls for editing allowed fulfillment modes and real payment processing remain incomplete.
