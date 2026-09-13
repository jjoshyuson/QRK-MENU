# Build status

## September 13, 2026 — Public menu branded identity and unified sticky tools

- Replaced the redundant public-menu eyebrow, “Today’s menu,” “What would you like?” and total-item copy with a compact business-first header.
- Added optimized illustrated Kusina Manila banner and profile-mark assets. The circular mark overlaps the banner edge in a familiar social-profile pattern while retaining the business name, description, currency and location.
- Grouped search and category navigation into one bounded sticky toolbar. Category jumps and active tracking account for the full toolbar height, and the combined control returns to its natural position when scrolling back above the menu.
- Preserved the existing responsive menu grids, ordering flows, tenant logo override, semantic search/navigation and 44px category targets.
- Browser checks confirmed the banner/avatar composition and zero horizontal overflow at 390×844, a flush sticky toolbar with Drinks tracking correctly, three menu columns at 768×1024, and the three-column menu plus desktop order summary at 1280×720. `npm run check` passed.

## September 13, 2026 — profile-specific test QR codes

- Business Profile now renders a scannable test QR for the signed-in client instead of the decorative placeholder.
- The five development clients resolve to five distinct customer destinations using `/menu/?business=<slug>`.
- `Download QR`, `Open customer view`, and `Copy link` use the same profile-specific destination. The test image is generated over HTTPS by the goQR API; production QR generation and the permanent public domain remain part of the future public-menu/QR milestone.
- Local phone scanning requires opening the dashboard through `npm run start:lan` and the computer's LAN address. A QR created from `127.0.0.1` is only reachable on the same computer.
- Validation: `npm run check` passed, including the new five-profile URL contract; `node scripts/build-pages.mjs` passed; Kusina Manila's QR rendered in the Business Profile card and exposed the expected encoded customer URL in browser review.

## September 13, 2026 — Customer category navbar sticky boundary

- Removed the late compact-theme margins, rounded container, and top offset that made the public-menu category navigation appear suspended over menu items.
- The category navigation now sits flush at the top of the viewport while its parent menu is active, remains bounded by that menu section, and naturally returns below the search/header when scrolling upward.
- Added bounded end-of-menu scroll room on phone layouts so even a short menu can move the navbar fully to `top: 0` before the document reaches its scroll limit.
- Preserved horizontal category scrolling, active-section tracking, 44px targets, semantic navigation, and existing phone/tablet/desktop menu grids. Browser checks confirmed the short 390×844 menu reaches `top: 0` with zero side margin or radius, then returns to its 365px natural position at page top. The 768×1024 and 1280×720 layouts retained three columns and zero horizontal overflow. `npm run check` and `git diff --check` passed.

## September 13, 2026 — Public menu desktop page-shell finish

- Removed the desktop customer menu's inherited full-viewport-height content column, which created an abrupt empty seam above the footer on shorter menus.
- Added a consistent 64px bottom gutter to the centered menu/order workspace and changed the footer into a full-viewport-width closing band with centered content and theme-derived contrast.
- Kept phone and tablet behavior unchanged. Browser checks at 1440×900, 768×1024, and 390×844 measured zero horizontal overflow. Desktop showed a 64px content-to-footer gap, a full-width footer, and a centered 1240px workspace; tablet retained three menu columns and phone retained two columns with its 54px order action. `npm run check` and `git diff --check` passed.

## September 13, 2026 — Public menu responsive layout and order review

- Replaced the narrow desktop customer-menu canvas with a dedicated wide layout: a three-column food grid sits beside a sticky live order summary showing line quantities, selections, subtotal, and a focused Review order action.
- Expanded desktop order review into a two-column dialog that separates cart lines from fulfillment details. Tablet now uses a three-column menu; phone retains the established two-column menu and 54px floating order action.
- Preserved the existing vanilla HTML/CSS/JavaScript stack, customer ordering behavior, theme tokens, accessibility semantics, and same-browser preview limitations. No backend or deployment scope changed.
- Browser verification covered 390×844, 768×1024, and 1280×720 desktop. The phone measured zero horizontal overflow, the tablet resolved to three columns, the desktop sidebar updated after adding an item, and the 900px two-column review dialog remained keyboard-addressable with zero page overflow. `npm run check` and `git diff --check` passed.

## Customer order-number emphasis — September 13, 2026

- Reduced the post-submit confirmation to one centered popup containing only `ORDER SENT`, `ORDER NUMBER`, and the generated identifier in large bold type.
- Removed waiting/preparing/ready/completed status content, verification details, development notes, confirmation buttons, and the post-close customer tracking panel. The popup dismisses through its backdrop or Escape.
- Validation: `npm run check` passed. Live browser checks at 390×844 and the default desktop viewport confirmed the centered three-line popup, no customer status panel after dismissal, working Escape and backdrop dismissal, and no horizontal overflow.

## Guided Kusina payment step — September 13, 2026

- Changed Kusina's QRK Quick checkout from an inline payment fieldset to a guided second step. Review order now ends with `Pay order`, which opens a focused payment dialog containing two large semantic button cards.
- Simplified the dialog to a text Back control and two label-only cards: `💵 Pay at the counter` and disabled `💳 Cashless` with a compact `Soon` badge. Repeated helper copy, price, unavailable label, pilot note, eyebrow, and close icon were removed.
- The payment dialog restores the order-review dialog through its Back control or Escape, retains the cart and checkout fields, and moves keyboard focus to the enabled payment choice on entry.
- Removed the visible `How would you like to pay?` heading; the dialog keeps a concise accessible name without adding visual copy.
- Validation: `npm run check` and `git diff --check` pass. Live browser inspection confirmed the minimal dialog exposes only Back and two card choices; focus lands on Pay at the counter, Cashless is disabled and announces `Soon Cashless`, and Back restores the populated review with Pickup still selected.

## Business workspace preview-label removal — September 13, 2026

- Removed the drawer's UI-preview notice, the top-bar environment label, Dashboard preview badge, footer label, and remaining UI-preview wording from business-workspace dialogs and feedback.
- Kept specific browser-local and unconnected-feature wording where it prevents unsupported persistence or backend claims.
- Validation: `npm run check` and targeted diff checks passed. Browser checks at 390×700, 390×844, 768×700, and 1280×800 confirmed no user-facing “UI preview” or “UI demo” labels, the profile stayed visible inside the drawer, and horizontal overflow remained zero.

## Kusina QRK Quick payment-first configuration — September 13, 2026

- Kept Kusina Manila on QRK Quick while overriding its payment timing to upfront, so its customer checkout now displays the existing payment-first choice.
- Cashless remains visible and disabled for the pilot; pay-at-counter remains the only enabled payment method. No table-session behavior or real payment processing was added.
- Validation: `npm run check`, the payment-first contract test, and `git diff --check` pass.

## Mobile drawer profile footer — September 13, 2026

- Kept the signed-in profile control permanently visible at the bottom of the phone/tablet navigation drawer.
- Moved navigation and the UI-preview note into one bounded internal scroll region so dynamic viewport recalculation cannot push account access below the drawer.
- Preserved the existing account menu, keyboard semantics, drawer navigation, global theme, and safe-area bottom inset.
- Validation: responsive browser checks passed at 390×700, 390×844, 768×700, and 1280×800 after refresh. The profile stayed within the drawer boundary, the short-phone content area scrolled independently, horizontal overflow remained zero, and the account menu opened and dismissed with Escape.

## Menu Studio category-tab alignment — September 13, 2026

- Removed the artificial horizontal padding that centered the first and last Menu Studio category tabs.
- Active categories now stay in their natural left-to-right position while fully visible; the strip scrolls the active category toward the center only after it becomes clipped or moves outside the visible tab area.
- The same behavior applies to the responsive owner Menu Studio and its customer-shaped preview.
- Validation: `npm run check` passed. Browser checks at 390px confirmed that selecting visible `Sides` does not shift the strip while clipped `Breakfast` recenters; 768px and 1280px layouts remained intact, and no console warnings or errors were reported.

## Connected Settings list correction — September 13, 2026

- Replaced the four separate oversized Settings cards with one compact rounded list matching the supplied reference: four stacked full-row actions, subtle dividers, left-aligned outline icons, labels, and right chevrons.
- Preserved the Account, Orders, Availability, and Security & sessions dialogs and their existing behavior.
- Added the connected-list pattern to `AGENT/STYLE.md` so future Settings work does not return to separate bordered cards.
- Validation: `npm run check` and `git diff --check` passed. Browser checks at 390px portrait, 844px landscape, and 1440px desktop confirmed 54–56px rows, a 640px maximum panel width, working dialogs for all four rows, and no horizontal overflow.

## Menu Studio header alignment — September 13, 2026

- Replaced the responsive Menu Studio logo bar with the same light business/page breadcrumb and outlined hamburger treatment used by Dashboard.
- Verified the 44px navigation target and zero horizontal overflow at 390px, plus the matching tablet header at 768px.
- `npm run check` and `git diff --check` pass.

## Single-action order completion — September 13, 2026

- Removed the staff-facing Preparing tab and grouped all live provider-compatible order states under Received, so existing in-flight demo/provider orders are not stranded.
- QRK Quick order cards now use one `Mark paid` action. QRK Table order cards use one `Mark served` action. Each action performs the existing ordered provider transitions internally and moves the order directly to History.
- Table businesses retain the separate Tables view for table acceptance, occupancy, and cleanup. Quick businesses show only Received.
- No database transition contract, payment integration, or POS capability was added; `Mark paid` is an operational staff acknowledgement in the current prototype.
- Validation: `npm run check` and `git diff --check` passed. Browser review of a Table-mode workspace confirmed that Orders exposes only Received and Tables, with no Preparing tab or Preparing empty state.

## Compact Settings and Orders structure — September 13, 2026

- Added `AGENT/STYLE.md` as the repository's visual source of truth and routed future UI work to it from `AGENTS.md`, the README map, and memory index.
- Replaced the long Settings surface with four compact, fully clickable cards: Account, Orders, Availability, and Security & sessions. Removed the redundant Settings heading and subtitle; detailed controls now open progressively in dialogs.
- Kept Received, Preparing, and Tables in one uninterrupted three-column Orders bar, and grouped History directly beside the hamburger button in one top-bar action container.
- Preserved the existing HTML, CSS, and vanilla JavaScript stack with no new dependency or product capability.
- Validation: `npm run check` and responsive browser checks passed at 1440, 800, and 390 CSS pixels. Settings rendered four, two, and one columns respectively without page overflow; every Settings card opened its dialog. Orders retained three equal columns on one row, and the phone header rendered History and navigation as adjacent 44-pixel controls in the same parent container.

## Shared workspace header cleanup — September 13, 2026

- Removed the centered Quick/Table demo badge from the shared Dashboard, Orders, and Menu Studio mobile/tablet headers.
- Orders retains the same light shared top bar and outlined navigation button as the Dashboard; functional customer-route service labels remain unchanged.
- Local syntax/static validation and responsive browser checks passed at representative phone, tablet, and desktop widths.

## September 13, 2026 — Open Tab customer order history

- Implemented Tambay Café's Open Tab customer workflow as a preset-specific extension of the existing lightweight customer menu rather than a separate route or order system.
- The top-right Open Tab control remains hidden until the customer adds the first item. It then shows the combined draft/submitted item count and running total and stays available after individual orders are sent.
- The Open Tab drawer groups each submitted order round, lists its items and total, and distinguishes customer-facing `Accepted`, `Preparing`, and `Prepared` states while keeping the current draft editable below the tab history.
- Tab membership is browser-local and stores only order IDs for the current business/data mode; current order records remain authoritative. This demonstrates one-browser behavior only and does not add settlement, payment, or durable cross-device sessions.
- `npm run check`, `node --check dist/menu/menu.js`, and `git diff --check` pass. The documented `npm start` command could not bind to port 4173 in the task sandbox, so fresh-build responsive browser verification remains an integration check.

## Payment First customer-order workflow — September 13, 2026

- Implemented the provider-neutral pilot path for the existing `Restaurant · pay first` preset. Checkout now requires a payment choice before submission; `Pay cashless` remains visible and disabled with a pilot-status explanation, while `Pay at the counter` is usable.
- Device-local orders retain `paymentMethod: counter` and `paymentStatus: due_at_counter`. The staff Received queue labels those orders `Pay at counter`.
- Preserved the simplified staff workflow: received cards keep the existing mode-aware `Mark paid` or `Mark served` action, which performs provider-compatible transitions internally. Payment-first customers see `Waiting for staff` until that action occurs.
- No provider, credential, charge, refund, or production payment claim was added. The Supabase RPC contract remains unchanged, so hosted persistence of payment metadata is still future work.
- Validation: `npm run check` passed, including the new `tests/payment-first-preview.mjs` contract check. Live browser setup confirmed that QRK Admin can create the payment-first preset and the customer route applies its payment-choice gate. End-to-end checkout could not be completed in that temporary browser because the generated test workspace opened with ordering paused and its mandatory first-login password gate cannot be automated safely.

## Provider checkout UUID repair — September 13, 2026

- Fixed Salamat Table checkout failures where browsers without `crypto.randomUUID()` saved a `demo-*` idempotency key that PostgreSQL rejected as an invalid UUID.
- The customer route now generates an RFC 4122 version 4 UUID with `crypto.getRandomValues()` when the native helper is unavailable. Checkout also replaces previously saved invalid pending keys before retrying, without clearing the customer cart.
- Table numbers remain plain one-to-three-digit text as required by the existing RPC; the screenshot's Table 12 value was not the failing field.
- No schema, order pricing, fulfillment or staff workflow changed.
- Validation: `npm run check` and `git diff --check` passed. Browser verification on `/menu/?business=salamat&table=12` submitted Chicken adobo successfully as provider-backed order `SL-0204`; the confirmation opened with status Received and no UUID error.

## Separate Received and Preparing order views — September 13, 2026

- Restyled the Client Admin/Client Staff Orders screen around the supplied compact service-workspace reference while preserving QRK branding and existing order operations.
- Replaced the simultaneous two-column stage board with distinct Received and Preparing queue views selected through large count tabs. Received opens by default; keyboard users can switch with the Left and Right arrow keys.
- Expanded each selected queue into the full available content area and added reference-aligned empty-state guidance. History remains a separate view, while sound and manual refresh remain available on larger screens and stay out of the compact phone command bar.
- No order status, permission, adapter, database or customer-flow contract changed.
- Validation: `npm run check` and `git diff --check` passed. Browser verification at 390 CSS pixels confirmed the Received empty view, compact header and one-tap switch to the separate Preparing empty view. A 1280 CSS-pixel check confirmed the selected queue expands cleanly across the desktop workspace. No page-level horizontal overflow was visible at either size.

## QRK Quick/Table master-planning milestone — September 12, 2026

- Confirmed one shared QRK platform with QRK Quick and QRK Table operating modes.
- Added `docs/QUICK_TABLE_MASTER_PLAN.md` as the implementation, team-ownership, worktree, review-gate and deployment contract.
- Defined parallel UI, UX and backend responsibilities plus a controlled integration branch and explicit publish approval gate.
- Recorded that the current Menu Studio `Table view` must become `Availability view` to avoid conflicting with the QRK Table product name.
- No product code, hosted database or deployment was changed in this documentation milestone.
- Validation: `npm run check` passed before authoring; final documentation/link and application checks remain part of this milestone's closeout.

## Handoff baseline

Deployed version 4, source commit `35ceaa69d888eb7004b966a6799b589a86442d72`.

### Implemented

- Desktop menu editor and customer preview.
- Separate mobile/tablet layout within the same page, selected at <=1100 CSS pixels.
- Simple two-column photo grid with six sample items.
- Item create/edit/delete, descriptions and PHP prices.
- Category creation/filtering and menu renaming.
- Available/sold-out toggles.
- Local photo selection, removal, type/size checks and preview.
- Owner/customer preview toggle.
- Expanded customer preview with mobile/tablet/desktop widths.
- All six demo image assets bundled locally, with provenance.

### Not implemented

- Durable saves, database or uploads.
- Real owner login, business onboarding or authorization.
- Real public menu route and draft/publish workflow.
- QR generation and table assignment.
- AI menu-photo extraction and review workflow.
- Customer cart, order submission, staff/kitchen processing or payment.
- PWA installation or offline menu/order behavior.
- Category edit/delete/reordering, item reordering, variations/add-ons.
- Subscription billing, analytics, production monitoring or backups.

### Verification already performed

- JavaScript syntax checks passed.
- Static entrypoint and local asset references checked.
- Duplicate HTML IDs checked.
- Six food photos were inspected and decoded successfully.
- Hosted version 4 deployment reported `succeeded`.
- No full browser interaction or responsive visual QA was performed in the creation environment. Do not describe those tests as passed.
- The exported source, local server syntax and ZIP receive packaging checks; this does not replace browser UI QA or a live local-server check.

## UI verification and polish — local pass completed September 8, 2026

1. Run the local site.
2. Review desktop, tablet and phone layouts with the existing design direction.
3. Exercise item/category/photo flows and customer preview.
4. Fix concrete usability issues and accessibility failures.
5. Update this file with evidence and remaining work.

## Acceptance checklist

- [x] Mobile has two readable photo tiles per row without horizontal page overflow.
- [x] Tablet uses the dedicated menu layout, not a compressed desktop table.
- [x] Desktop management list and preview remain usable.
- [x] Add/edit/delete updates both menu representations consistently.
- [x] New category, duplicate-category error and empty category states work.
- [x] Prices including zero and decimal amounts render correctly.
- [x] Availability controls and sold-out labels stay consistent.
- [x] Valid image selection/removal works; corrupt, oversize and unsupported images show errors.
- [x] Image-read cancellation/race cases cannot save the wrong item's image.
- [x] Customer preview has no owner actions.
- [ ] Dialogs can be used with keyboard and phone keyboard open.
- [ ] Long names, many categories and increased text size remain usable.
- [x] Prototype refresh-reset behavior is clearly understood until durable storage is added.

After this milestone, the next proposed task is durable accounts and menu storage, followed by public publishing and QR generation. Do not start ordering merely because it appears later in the roadmap.


## Local UI milestone results — September 8, 2026

### Changes

- Customer category tabs omit empty categories in both previews. Switching from an empty owner category to customer view falls back to All, so existing dishes remain visible.
- Item dialogs cancel pending photo reads on close and restore focus to the edited item or add button after rendering. Reopening clears stale item-name validation.
- All four dialogs have accessible names.
- Improved secondary-label contrast, long-title wrapping, narrow form columns, wrapping dialog actions and mobile input text size while preserving the existing fonts, orange, desktop workspace and two-column mobile menu.

### Verification evidence

- Started the local server at http://127.0.0.1:4173; npm run check passed before and after changes.
- In-app Chromium browser: checked 360, 390, 430, 768, 1024, 1280 and 1440 CSS-pixel widths. DOM measurements showed no horizontal page overflow; phone/tablet grids had two columns and desktop retained its editor and preview. Visually inspected representative 390, 768 and 1280 layouts.
- Exercised add, edit, delete and delete cancellation; category creation, duplicate rejection and empty category; menu rename and search no-results; zero and decimal prices; availability toggles; long item/category/menu labels. Verified a mobile-created item appeared in the desktop editor and customer preview.
- Selected a bundled JPG through the file chooser and saved it. Removed it and verified the no-photo state. Corrupt PNG, file over 5 MB and unsupported Markdown input each produced the expected error.
- node tests/photo-races.mjs passed: controlled completion order proves older reads, cancelled dialogs and removed photos cannot overwrite the current selection. This is a handler-level regression test, not a device upload test.
- Expanded preview switched to 768 and 1280 widths and filtered to one Drinks item. Empty category tabs disappeared after deleting their last item.
- Customer view rendered all six sold-out labels with zero item-edit/stock/add actions in its generated menu. Deleting all six sample items produced the customer empty state with only the All tab.
- At 360 x 400, the item dialog scrolled to price and save actions; saving restored focus to Edit Chicken adobo. This checks reduced-height reachability, not a physical virtual keyboard.
- Temporarily enlarged menu text through developer tooling at tablet width; long title wrapped and page did not overflow. This is a synthetic text stress check, not OS text scaling certification.
- Reload restored the original six sample dishes and Main menu. Temporary browser styling and viewport overrides were reset.

### Remaining verification and limits

- Physical iOS/Android keyboard behavior, full keyboard/screen-reader navigation, OS text scaling and a large number of categories remain unverified. The two related acceptance boxes above stay open.
- The expanded preview remains a scaled DOM clone, not a device emulator. No performance or full accessibility certification is claimed.
- All baseline unimplemented production features remain unimplemented, including durable saves, authentication, public publishing, QR generation and ordering. Nothing was deployed.
- MANIFEST.sha256 describes the original export, not the modified working tree.

### Exact next action

Review the local UI and finish the physical-device/accessibility checks above. Once the user selects the persistent-menu milestone, begin with a short stack and access plan for authenticated business accounts and tenant-scoped durable categories/items/photos; then implement and verify cross-business isolation and save/reload behavior. Draft/publish and stable public QR destinations follow the selected milestone scope. No provider or paid service has been selected, and ordering remains later work.

## Scroll-following category navigation — September 8, 2026

- Removed All from the mobile/tablet menu and docked/expanded customer previews. Categories now jump to sections instead of filtering dishes out. Desktop management retains its All items filter.
- The sticky category bar highlights the section beneath it as the menu scrolls, and horizontally centers the highlighted tab, including first/last tabs. Each preview follows its own scroll container.
- Added five empty seed categories for testing: Breakfast, Desserts, Snacks, Specials and Platters. Owner view shows all eight sections; customer previews continue to omit empty categories. Adding a category on mobile jumps to the new section.
- Browser verification: 390px phone, 768px tablet and 1280px desktop; category taps, forward/reverse scrolling, first/last centering, customer mode and docked/expanded navigation. Measured active-tab center offsets below 1 CSS pixel on phone and no horizontal page overflow. A temporary ninth category (Weekend) jumped and highlighted correctly; reloaded to the eight-category baseline afterward.
- npm run check and node tests/photo-races.mjs passed. Normal browser sizing restored. No deployment or persistence work.
- Next action: review the eight-category scrolling experience locally. Physical-device checks and the later persistent-menu milestone remain as described above.

## Project guidance and memory system — September 8, 2026

- Added `docs/PROGRESS_MAP.md` to show milestone sequence, dependencies, current position and exit evidence without replacing this detailed status log.
- Added a topic-based `memory/` index covering product, UI, architecture, progress, decisions and workflow so new chats can load focused context.
- Updated `AGENTS.md` to require one discovery question before build/change work, prefer clarification over guessing on vague prompts, and make lightweight minimal-code implementation an explicit primary goal.
- Updated the README file map. No application source or behavior changed.
- Verification: `npm run check` passed; the existing local server responded HTTP 200 at `http://127.0.0.1:4173`.
- Next action remains user review of the current UI and a decision on the remaining physical-device/accessibility checks before authorizing any persistent-menu work.

## UI-only Business Dashboard — September 8, 2026

### Implemented

- Replaced the single desktop Menu Studio navigation with a cohesive Business Dashboard: balanced overview, Business profile, Menu Studio, Staff access, Orders and Settings.
- Added clear sample-only overview metrics, open/closed store control, live-order board and quick actions.
- Added business logo/contact/profile fields, menu appearance controls, sample business QR code and customer menu link UI.
- Preserved existing item/category/photo/availability/editing flows and added browser-memory category reordering, plain-text item option notes and Available/Sold out/Hidden states. Hidden items are omitted from customer previews.
- Added UI-only staff account creation, role/permission choices, account enable/disable states and explanatory limitations.
- Added realistic live and history order views, order details, status progression, sample sales summary and activity log. Totals and labels are illustrative and locally consistent.
- Added account/password, order-numbering, operating status, other-device sign-out and logout UI. None represents a real authenticated session.
- Preserved the customer-shaped phone/tablet Menu Studio while making Dashboard the default at 1100 CSS pixels or less. Owners navigate with a top-right hamburger and right-side drawer; customer mode hides item editing controls.
- Added `dist/dashboard.css` as a focused CSS layer. No package, framework, backend or production integration was added.

### Verification evidence

- Before editing, `npm run check` passed. `npm start` reported that port 4173 was already in use; the existing local preview responded HTTP 200.
- After implementation, `npm run check` and `node tests/photo-races.mjs` passed. Duplicate-ID and local-asset-reference checks passed.
- In-app Chromium: visually inspected dashboard, profile/QR, Menu Studio/category arrangement, staff dialog, orders and settings on desktop. Exercised category reordering, item options/Hidden state, staff creation and disable controls, live-order status progression, order history and store-status UI.
- Confirmed hidden items remain visible to owners but disappear from customer previews. Rechecked customer mode at 360px and found no edit, add, availability or Dashboard owner actions.
- Visually inspected the default two-column menu and dashboard access at 360/390px phone and 768px tablet sizes, plus dashboard layouts at 390/768/1280/1440px. Measured no page-level horizontal overflow at those representative sizes; phone/tablet menus retained two columns.
- Verified the phone Dashboard return control and icon-only toolbar controls expose accessible names. Browser console error log was empty during the checked flows.
- Nothing was deployed. Browser-memory demo changes reset on reload.

### Remaining verification and limitations

- Physical iOS/Android keyboard behavior, full keyboard/screen-reader navigation, OS text scaling and very large category/team/order datasets remain unverified.
- The responsive dashboard is a prototype UI, not a production owner application. No login, tenant enforcement, database, uploads, publication, real QR destination, notifications, ordering, payments, analytics, session management or persistence exists.
- The dashboard intentionally uses sample identity, order, sales and staff data. No production provider, framework or paid service has been selected.
- `MANIFEST.sha256` still describes the original export, not this modified working tree.

### Exact next action

Review the complete local Business Dashboard and preserved menu experience. Close the UI review gate or request scoped visual/interaction changes. Only after explicit authorization should the next milestone select the smallest practical stack for a shared login, tenant-safe business data, durable menus/photos and verified cross-business isolation.

## Mobile Dashboard and quick availability refinement — September 8, 2026

### Implemented

- Made Dashboard the phone/tablet landing view and moved Menu Studio to its own responsive view.
- Replaced the former home-style shortcut with a true hamburger button in the top-right corner. It opens a right-side drawer containing Dashboard, Business profile, Menu Studio, Staff access, Orders and Settings.
- Removed the Kusina Manila identity block from Menu Studio's Photo editor mode. Customer view restores the identity block above the customer-shaped menu.
- Added Table view beside Customer view. It groups dishes by category and provides direct Available/Out of stock controls for rapid service-time updates; the two-column photo grid remains the editing and customer presentation.
- Kept all changes in the existing HTML, CSS and vanilla JavaScript with no new packages or production services.

### Verification evidence

- Before editing, `npm run check` passed. `npm start` reported `EADDRINUSE` because the existing local preview already occupied port 4173; that preview continued responding normally.
- After implementation, `npm run check` and `node tests/photo-races.mjs` passed.
- In-app browser verification at 390px and 768px confirmed Dashboard-first loading, the right-side navigation drawer, separate Menu Studio, hidden editing identity header, restored customer identity header and responsive availability table. Desktop Dashboard remained intact at 1280px.
- Toggled Chicken adobo from Available to Out of stock in Table view; the accessible status and available-item count updated immediately and focus remained on the changed control.
- Measured no page-level horizontal overflow at 390px, 768px or 1280px. Browser console error log was empty. The browser viewport override was reset after testing.
- Nothing was deployed; all demo changes still reset on reload.

### Remaining verification and limitations

- Physical iOS/Android keyboard behavior, full keyboard/screen-reader navigation, OS text scaling and very large datasets remain unverified.
- Dashboard, Menu Studio navigation and availability changes remain browser-memory UI only. No authentication, persistence, publication, real ordering or backend stock synchronization exists.

### Exact next action

Review the mobile Dashboard-to-Menu Studio flow and quick availability table locally. If accepted, close the UI review gate or choose a narrowly scoped remaining accessibility/device check before explicitly authorizing persistent multi-business work.

## Touch-sized availability rows — September 8, 2026

- Enlarged only the Menu Studio Table view rows, thumbnails and availability buttons using the Messenger contact-card density as a touch-size reference.
- Kept each Available/Out of stock button vertically centered on the far right of its row at phone and tablet widths.
- Removed prices and option notes from Table view to reduce clutter and mistaken taps. Photo editor, Customer view and desktop menu pricing remain unchanged.
- Browser verification at 360px and 390px confirmed 88px-high rows, 56px circular thumbnails, 48px-high availability buttons aligned 12px from the right edge, no Table view price text and no horizontal overflow. At 768px, rows expand to 92px with 60px thumbnails while controls remain right-aligned.
- Toggled Chicken adobo to Out of stock and confirmed the status/count update and retained focus. Switched back to Photo editor and confirmed its PHP prices remain present. Browser console error log was empty and the viewport override was reset.

## Public development deployment — September 9, 2026

### Implemented

- Added a compact Development badge to the desktop and responsive owner headers without changing customer-preview content or adding dependencies.
- Activated the existing Sites development project configuration and published version 5 to `https://qrk-menu-studio.jjoshyuson.chatgpt.site` after explicit approval.
- Kept the public release bundle limited to the static site assets and hosting manifest. Internal handoff documentation was not included in the hosted archive.
- Preserved the existing photos; no new generated or searched imagery was added because the current food assets already support the menu and additional media would increase payload without improving this milestone.

### Verification evidence

- `npm run check`, `node tests/photo-races.mjs`, local asset-reference checks and duplicate-ID checks passed.
- Local browser checks at 390, 768 and 1280 CSS pixels confirmed no page-level horizontal overflow, responsive Dashboard navigation, separate Menu Studio, customer-preview owner-control hiding, device preview switching and availability updates.
- The Sites deployment reported `succeeded`, and access was set to public so anyone with the URL can review it without signing in.
- Remote browser checks at 390, 768 and 1280 CSS pixels confirmed the Development badge, Dashboard-first phone/tablet layout, hamburger navigation, two-column Menu Studio, six-row availability table without prices, desktop customer preview and zero console errors.

### Remaining verification and limitations

- Physical iOS/Android keyboard behavior, full keyboard/screen-reader navigation, OS text scaling and very large datasets remain unverified.
- The public URL is a development UI prototype. Browser-memory changes reset on refresh; no authentication, durable data, real publishing flow, ordering, payments or backend services were added.

### Exact next action

Review version 5 at the public development URL and either close the UI review gate or request only scoped polish/accessibility changes. Persistent multi-business work remains proposed and requires separate authorization.

## Customer-only development route — September 9, 2026

### Implemented

- Added `/menu/` as a standalone customer-only route with its own small HTML, CSS and JavaScript payload. It reuses the six bundled photos and does not load the owner dashboard/editor bundle.
- Preserved the customer-shaped two-column photo menu across phone, tablet and desktop widths, including category navigation and the sold-out state.
- Updated the Business profile menu link, Open menu action and Copy link behavior to target `/menu/`. The root owner workspace keeps its Development label; the customer route has none.
- Updated the local server so directory routes such as `/menu/` resolve their `index.html` files.

### Verification evidence

- `npm run check` covers the owner app, customer menu script and local server. The photo race regression test, local route requests and customer asset-reference checks pass.
- Local browser checks at 390, 768 and 1280 CSS pixels found two menu columns, six items, one sold-out item, no page-level horizontal overflow, no owner controls, no Development label and no console errors.
- Category links jump to their sections and the active state follows the final Drinks section at the bottom of the page.
- The Business profile Open menu action lands on `/menu/`, whose document contains no owner sidebar or dashboard controls.
- Sites version 7 deployed successfully at the existing public URL. Remote 390, 768 and 1280 CSS-pixel checks matched the local results, category navigation reached `#drinks`, and the browser console remained clear.
- The published dashboard keeps its Development label and its Business profile Open menu action reaches the customer-only route. Versioned dashboard asset URLs prevent a previously cached owner bundle from retaining the old placeholder link.

### Remaining limitations

- `/menu/` uses separately authored static sample data. Owner edits do not synchronize to it, and there is still no durable draft/publish workflow or real QR image.
- Ordering, authentication, tenant isolation, database storage and production image licensing remain unimplemented.

### Exact next action

Review the public dashboard and customer menu at `/menu/`. After approval, the next proposed product milestone remains tenant-safe durable menu data and draft/publish synchronization.

## Integrated customer ordering and staff operations — September 9, 2026

### Implemented

- Integrated the completed customer ordering and staff operations workstreams without adding a framework, dependency, backend or paid service.
- `/menu/` now supports browse/search, configured items and add-ons, quantities and notes, cart add/edit/remove, table or pickup checkout, validation, demo submission, order number/token confirmation, refresh-persistent cart/latest order and tracked received/preparing/ready/completed/cancelled states.
- The root dashboard now reads and updates the shared device-local queue, separates active/history orders, shows responsive order details and event history, progresses statuses, requires token matching before completion, confirms cancellation, indicates received orders and persists store-open state.
- Replaced the native cancellation prompt with the existing modal-dialog pattern so focus, Escape close and the destructive action are explicit and testable.
- Customer and staff share `qrk_demo_orders_v1`; store status uses `qrk_demo_store_open_v1`; money stays in integer minor units and staff mutations preserve forward-compatible fields.

### Local validation evidence

- `npm run check` and `node tests/photo-races.mjs` passed; direct `/` and `/menu/` requests returned HTTP 200.
- Final closeout rerun: submitted pickup order `KM-IHS6D` with a configured Calamansi iced tea, confirmed immediate staff intake, progressed Received → Preparing → Ready, rejected a wrong token, completed with `CMUWEC`, and verified Completed remained visible in both customer and staff views after refresh.
- In two real same-origin browser tabs, configured Chicken adobo as Large plus Extra rice, changed its quantity, added and removed a second cart item, validated the missing table-number error, and submitted table order `KM-3I641` for ₱275.
- Staff received the order without refresh, progressed it received → preparing → ready, rejected an incorrect token, accepted `7HCQVX` case-insensitively, completed the handoff, and the customer confirmation tracked each state. Refresh retained the completed order and empty cart.
- Submitted pickup order `KM-3K6JT`, confirmed cancellation through the focused modal, verified Escape returned focus to the Cancel order trigger, and confirmed the customer tab updated to Cancelled. The order remained in History after refresh.
- Closing the store updated an already-open customer tab, displayed the paused-order notice, blocked item configuration/submission, and persisted across customer refresh. Reopening removed the notice.
- At 390, 768 and 1280 CSS pixels, both direct routes had no page-level horizontal overflow. `/menu/` retained two columns; `/` used responsive hamburger navigation at 390/768 and the desktop sidebar at 1280. Visual checks at phone and desktop sizes were clean.
- Browser console warning/error logs were empty in the checked customer and staff tabs. Sold-out and empty-search states were also exercised.

### Remaining limitations

- All order, cart and store-status synchronization is limited to the same browser profile and origin. Different physical devices do not synchronize without workstream 3.
- There is still no backend, database, authentication, tenant authorization, server price/availability validation, idempotency, payment, push notification, kitchen integration or production security.
- Menu Studio edits still do not publish into `/menu/`. Physical iOS/Android behavior, full screen-reader testing, OS text scaling and large production datasets remain unverified.

### Deployment closeout

- Published the integrated static bundle as Sites version 8 at the existing public development URL.
- Remotely verified `/` and `/menu/` at representative phone, tablet and desktop widths. The owner route retains its Development label; the customer route remains unbadged and customer-only.
- Remote route, responsive-layout, owner-control boundary and console checks passed. No backend or production-ordering capability was introduced.

### Exact next action

Review the integrated development build. The exact next proposed milestone is workstream 3 backend foundation only; it remains unapproved until separately authorized.

## Workstream 3 provider-ready backend foundation — September 9, 2026

### Implemented

- Added `supabase/` as the canonical database source with PostgreSQL 17 local config, a portable application-schema migration, isolated Supabase Auth/RLS/Realtime/Storage migration, development-only Kusina Manila seed, pgTAP security/order tests, and an operations/recovery runbook.
- Modeled businesses, memberships/roles/permissions, profiles/settings, menus and revisions, categories, items/options, public destinations, photo metadata, orders, immutable line/option snapshots, and append-only status events with UUID tenant keys, integer PHP minor units, constraints and indexes.
- Added anonymous RPC boundaries for published-menu reads, server-validated/idempotent order creation, and token-scoped customer tracking. Direct anonymous table access is revoked. Staff order changes use a tenant-authorized transition RPC with received → preparing → ready → completed ordering, active-state cancellation and handoff-token validation.
- Added private, business-scoped Broadcast change hints with RLS authorization. Authoritative initial/refetch behavior remains primary; reconnect, online, focus, interval and manual refresh reconcile missed/out-of-order events.
- Added a private `menu-photos` bucket policy model with tenant upload control and public reads limited to published assets referenced by a published revision. Provider/path/variant metadata preserves an object-storage migration seam.
- Added `dist/data/qrk-data-service.js` and safe configuration examples. Both `/` and `/menu/` use it. Blank configuration automatically retains the existing `qrk_demo_orders_v1` and `qrk_demo_store_open_v1` behavior; the owner UI visibly reports `Development · Demo data`.
- Added static backend/security/secret validation to `npm run check`. No packages, hosted accounts, credentials, deployment, framework or product-code rewrite were added.

### Verification evidence

- Before changes, `npm run check` and `node tests/photo-races.mjs` passed. `npm start` reported `EADDRINUSE` because the existing healthy preview already occupied `127.0.0.1:4173`.
- After changes, `npm run check` passed JavaScript/module syntax plus backend coverage and secret-pattern checks: 15 required tables, five public RPCs, two ordered migrations, expected RLS/Broadcast/Storage markers and required pgTAP cases. `node tests/photo-races.mjs` passed.
- Local browser checks at 390, 768 and 1280 CSS pixels confirmed `/` loads Dashboard in demo mode, `/menu/` retains six items/two columns with no owner controls, neither route has page-level horizontal overflow, and console warning/error logs are empty.
- Completed a fresh local demo pickup order through the shared adapter: `KM-LHB5M`, received by staff, progressed to preparing and ready, matched token `WZEH93`, completed, and recorded ordered history without console errors.
- Supabase CLI, `psql` and Docker were unavailable. Migrations, pgTAP, database lint, RLS execution, Broadcast delivery and Storage policies therefore received static validation only and must not be described as operational.

### Remaining connection and exit evidence

- Install current Supabase CLI/Docker; execute a clean local reset, pgTAP suite and database lint.
- Create separate development and production projects; link/apply development first and configure real Auth memberships.
- Supply only development URL/publishable key/business ID/slug to browser configuration and inject short-lived Auth access at runtime.
- Verify two-tenant denial, public-field boundary, price/availability validation, idempotent retry, every permitted/forbidden transition, private Broadcast reconnect/focus reconciliation, and photo upload/read rules against development.
- Prove customer/staff synchronization on two physical devices, test backup/restore into a disposable target, then review production migration separately.

### Exact next action

Follow `supabase/README.md` to install local tooling and run the clean reset/test/lint gate. Then create and link only a hosted development project. The backend remains provider-ready, not connected or operational.

## Notes inbox and trusted-customer ordering proposal — September 9, 2026

### Documentation update

- Added `memory/inbox.md` as the lightweight capture point for random ideas, observations and unresolved questions.
- Captured the account-free QR browsing concept and an optional business-approved trusted-customer/VIP model for ordering and payment.
- Routed the proposal into product and decision memory plus the authoritative product plan without marking it as approved scope.
- Recorded that approval alone is not a security boundary and retained abuse prevention, payment, identity, guest access, revocation and tenant scope as open design questions.
- No product code, runtime behavior, dependency, backend configuration or milestone ordering changed.

### Validation evidence

- Before writing, `npm start` found the existing preview already occupying `127.0.0.1:4173`; `npm run check` passed, including backend static validation for 15 tables, five RPCs and two migrations.
- Documentation paths and cross-references were checked after the update.

### Exact next action

The implementation path remains the workstream 3 local reset/test/lint gate and hosted development verification. Revisit the trusted-customer proposal during ordering-policy discovery before authorizing ordering or payment implementation.

## Workstream 3 local database gate — September 11, 2026

### Completed

- Installed Docker Desktop and the Supabase CLI as a project development dependency; no browser/runtime dependency was added.
- Started the QRK MENU local Supabase stack and rebuilt the disposable database from the two canonical migrations plus development seed.
- Removed two redundant PL/pgSQL declarations reported by lint and updated the deprecated local email configuration section to `local_smtp`; application behavior and schema contracts did not change.

### Verification evidence

- `npx.cmd supabase db reset --local` completed successfully from a clean local rebuild.
- `npx.cmd supabase test db` passed all 19 pgTAP tests in `supabase/tests/001_security_and_orders.sql`.
- `npx.cmd supabase db lint --local --level warning` returned `No schema errors found` with an empty result set.
- `npm run check` passed static application/backend validation for 15 tables, five RPCs and two migrations.
- `node tests/photo-races.mjs` passed photo supersession, dialog cancellation and removal-race coverage.

### Remaining limitations and exact next action

The hosted Supabase project is still unlinked and unchanged. Confirm that it is the disposable development environment, verify its project ref, then link and dry-run the two locally verified migrations. Do not include seed data or configure browser credentials until the remote target and migration preview are reviewed.

## QRK brand theme and UI/UX audit — September 11, 2026

### Implemented

- Interpreted the supplied logo into three transparent, lightweight SVG files: icon/favicon mark, text-only wordmark and combined horizontal logo. The QR geometry was cleaned into consistent modules while retaining the receipt/menu cue.
- Replaced owner wordmarks with the combined logo, added the icon-only favicon to owner, customer and photo-credit routes, and added the text-only wordmark to the customer footer.
- Applied vivid teal, deep teal and deep navy to navigation, primary actions, active tabs, QR preview, staff order accents and the customer route while retaining amber, green and red where they communicate preparation, ready/success, warning or destructive states.
- Kept the existing vanilla HTML/CSS/JavaScript stack and added no package, framework or runtime dependency.

### Validation evidence

- `npm run check` passed, including JavaScript syntax and static backend validation. `node tests/photo-races.mjs` passed.
- Local owner/admin review at 1280 CSS pixels confirmed the combined logo, navy workspace navigation, teal active and primary states, no page-level horizontal overflow and successful asset decoding.
- Responsive checks at 390 and 768 CSS pixels covered Dashboard, the right-side navigation drawer, Staff Orders, the order-detail panel and Menu Studio. No page-level horizontal overflow was measured.
- Customer checks at 390 and 768 CSS pixels confirmed the two-column menu, teal/navy header and controls, item sheet, cart, checkout, confirmation and wordmark asset loading.
- Completed one same-browser lifecycle: created table order `KM-64GK6`, verified immediate staff intake, progressed Received → Preparing → Ready, matched token `ASKNEM`, and completed the handoff.
- The three brand files and customer brand stylesheet returned HTTP 200 from the local server. Browser console review and remaining static checks are recorded in the final validation pass.

### Remaining verification and limitations

- The new brand/theme has not been deployed. The public development site remains Sites version 8.
- Physical iOS/Android behavior, full keyboard/screen-reader navigation, OS text scaling and large production datasets remain unverified.
- The user mentioned a possible additional feature but did not finish defining it; no feature scope was inferred or implemented.
- Hosted Supabase linking, Auth configuration and two-device Realtime evidence remain paused until the user accepts the UI/UX direction.

### Exact next action

Review the local brand direction and specify any scoped UI refinements. Once accepted, resume hosted development connection from `supabase/README.md`; treat the unfinished feature idea as a separate discovery request.

## Neutral-first theme refinement — September 11, 2026

### Implemented

- Rebalanced the UI from teal-heavy surfaces to a minimalist black, white and gray foundation. Teal/cyan now appears primarily on calls to action, active navigation, selected categories, focus rings and compact live-state indicators.
- Added `dist/theme.css` as the shared palette source for the owner workspace, responsive Menu Studio and standalone customer route. It exposes the neutral scale, three brand-accent levels, semantic colors, surfaces and compatibility aliases in one place.
- Changed the desktop and responsive navigation to near-black, converted cards, icon tiles and supporting controls to neutral grays, and retained semantic amber/green/red for preparation, success and destructive states.
- Updated the menu appearance swatches to QRK cyan, deep teal, electric blue and graphite for future UI experimentation. The controls remain preview-only.

### Validation evidence

- `npm run check`, `node tests/photo-races.mjs` and `git diff --check` passed. Owner, customer and shared theme assets returned HTTP 200 locally.
- Visual browser checks at 390, 768 and 1280 CSS pixels confirmed the neutral hierarchy, restrained accent use and no page-level horizontal overflow.
- The 390px customer route retained two columns, a black header, white content surface and teal action/selection details. The 390px owner route retained Dashboard-first navigation and a near-black drawer.
- The 768px customer grid retained two columns and both routes loaded `--brand-500: #0fb9c0` from the shared theme file. Browser console warning/error logs were empty during the checked routes.

### Remaining verification and exact next action

This refinement is local and not deployed. Review the open local dashboard and customer route. If this hierarchy is accepted, continue the scoped UI/UX review; hosted Supabase connection remains paused.

## Logo asset correction — September 11, 2026

### Implemented

- Replaced the three hand-drawn SVG approximations with transparent PNG mark, wordmark and combined-logo assets extracted from the approved generated artwork.
- Updated the owner header, mobile header, customer footer and all favicon references to use the corrected files.
- Kept the generated symbol proportions and `QRK menu` lettering intact, with only background removal, transparent cropping and responsive sizing applied.

### Validation and status

- The three corrected assets were visually inspected at their native resolutions before integration and each returned HTTP 200 with the correct `image/png` content type.
- The responsive navigation drawer rendered the combined logo at 177 × 45 CSS pixels without distortion; the customer footer rendered the wordmark successfully. Both routes had zero page-level horizontal overflow and no browser warning/error logs.
- `npm run check`, `node tests/photo-races.mjs` and `git diff --check` passed. This remains a local, undeployed change.

## Local business Auth and granular permissions — September 12, 2026

Implemented local-only Supabase Auth for the shared business portal. Email or globally unique username credentials restore a short-lived session, resolve the active tenant and route owners/admins to the full workspace while staff open on their permitted operational surface. The database stores and enforces individual order, availability, menu, history, sales and staff-management permissions. `/admin/` stages the future Google Workspace platform portal without enabling a password fallback.

The local database rebuild succeeds with repeatable admin and staff development users. Both HTTP password grants resolve the correct Kusina Manila membership and role. The pgTAP suite, database lint, JavaScript/static checks and browser login review pass. No hosted project, DNS or public deployment changed.

The September 12 follow-up aligned the seeded admin Auth address with the username-to-internal-email mapping. Direct checks now confirm both `kusina-admin` and `kusina-staff` authenticate by username and resolve their expected roles.

The signed-in identity block now opens a keyboard-accessible account menu containing Settings and Log out. Admin Settings opens the existing business settings page; staff Settings opens an account summary without exposing business-only controls. Log out clears the local Supabase session and returns to the shared login screen.

The account trigger uses balanced padding and a 64px flex row, vertically centering the avatar, left-aligned name/subtitle, and ellipsis. Follow-up browser inspection confirmed the hovered drawer row is centered (avatar and text share the row's vertical midpoint); `npm.cmd run check` passes.

The local staff preview now generates a one-time temporary password after account creation, provides a copyable credential handoff, and requires the new user to choose a password before entering the workspace. The forced-change gate is shared by staff and client-admin access contexts. Browser QA completed the create → logout → temporary-password login → password replacement flow; hosted account provisioning remains intentionally unconnected.

Staff usernames now use a locked business namespace plus a client-entered suffix. Kusina Manila displays `kusina.` beside the editable field, previews the complete login as it is typed, and creates credentials such as `kusina.rhain`. Browser QA confirmed the prefix and suffix remain one continuous field on the narrow mobile layout and the generated credential uses the exact previewed username. The hosted provisioning milestone must reserve business prefixes uniquely before this becomes production identity policy.

Still incomplete: production-safe staff invitation/activation, username-only password recovery, hosted Auth configuration, Google Workspace OAuth, multi-business selection for a user with multiple memberships, and physical two-device Realtime evidence.

The platform-admin surface is now reviewable locally without OAuth: `/admin/` uses an explicitly labeled temporary Continue action to open a responsive client overview, and Exit returns to its gate. The normal business login no longer includes a clickable platform-admin link, keeping client and platform entry points separate. Browser checks confirmed the bypass by keyboard, the development warning, Kusina client row and narrow-layout contrast. This bypass is development UI only and is not production authentication.

## QRK Admin client provisioning preview — September 12, 2026

The `/admin/` preview now uses the confirmed names QRK Admin, Client Admin and Client Staff. Its Overview, Clients and Client Admins navigation is functional. QRK Admin can create a browser-local client portal together with its initial Client Admin, receive a generated one-time credential handoff, and pause or activate the client record. Client Staff is explicitly outside QRK Admin scope and remains managed from the client portal.

The initial Client Admin uses the existing preview-auth store and mandatory first-login password replacement. No service-role secret, hosted user, real tenant, invitation, email or deployment was created. `npm run check` and `git diff --check` passed. Browser validation created a sample client, confirmed the credential handoff and client count update, and measured zero horizontal page overflow at 390 CSS pixels. Hosted provisioning and production QRK Admin authentication remain incomplete.

## Per-business portal branding preview — September 12, 2026

Business Profile now accepts a PNG, JPEG or WebP logo, extracts a suggested accent from the image, and lets the Client Admin approve or override the primary and navigation colors. A small theme safety layer chooses readable foreground colors and darkens navigation colors when necessary. The approved identity is saved per business slug in browser-local storage and appears on the Client Admin/Client Staff workspace and the matching `/menu/?business=<slug>` customer route. The QRK Admin route remains QRK-branded, and the customer footer retains a restrained “Powered by QRK MENU” attribution.

This is a UI preview, not hosted persistence: logo data and theme settings do not yet use Supabase Storage or `business_profiles`. `npm run check` passes. Automated desktop browser control was unavailable in this session because the local UI-control runtime could not initialize, so the new branding interaction still needs the planned representative 390/768/1280 visual pass before approval or deployment.

## Quick and Table demo tenants — September 12, 2026

Kusina Manila is now the QRK Quick demo tenant, while Salamat is the QRK Table demo tenant. The local seed adds `salamat-admin` and `salamat-staff` alongside the existing Kusina identities, and tenant access context now returns the `serviceMode` stored in `business_profiles.settings`. The workspace identifies the signed-in mode, and the former Menu Studio “Table view” label is now “Availability view” to avoid colliding with the QRK Table product name.

The customer route is mode-aware without adding a second bundle. Kusina retains the Quick order/pickup experience. `/menu/?business=salamat&table=12` identifies the Table experience, fixes the visit to Table 12, removes pickup, and keeps the existing lightweight browse/cart/order flow. Browser-local carts, active orders, queues and store state are keyed by business slug so the two tenant demonstrations do not leak into each other.

Validation: `npm run check` passed with four migrations. After approval, a fresh local database reset applied the two-tenant seed. All 28 pgTAP tests passed, and direct Auth checks confirmed `kusina-admin`/`kusina-staff` resolve to Kusina Quick while `salamat-admin`/`salamat-staff` resolve to Salamat Table with their expected owner/order-staff roles. The Salamat customer route and fixed-table checkout were exercised in the browser; 390, 768 and 1280 CSS-pixel checks measured no page-level horizontal overflow. A final browser pass also corrected the shared dashboard breadcrumb, greeting and customer preview identity for Salamat. Nothing was deployed.

## Salamat customer-to-admin order connection — September 13, 2026

The Salamat customer route now loads the same local publishable Supabase configuration as the authenticated business workspace. Customer carts and pending idempotency keys are also separated by tenant and active data mode, preventing an older browser-demo cart from being submitted against provider-backed menu identifiers.

Validation: `npm run check` passed. Browser verification submitted one Chicken adobo order from `/menu/?business=salamat&table=12`; Salamat Admin immediately displayed received order `SL-0201`, Table 12, one item, ₱180. Provider-mode copy now identifies local Supabase instead of incorrectly claiming that orders use only localStorage. No hosted project or deployment was changed.

## Quick/Table service order board — September 13, 2026

The shared staff Orders page now prioritizes two live stages only: Received and Preparing. Each order card includes its next action, Start preparing or Mark served, and served orders leave the live board for a separate History view opened from the top-right command bar. Development banners, sample sales and activity panels, the Ready column, and visible handoff-token verification were removed from the staff workflow. Order details remain available for item review, notes and confirmed cancellation.

The database contract remains unchanged. Mark served performs the existing preparing → ready → completed transitions through the shared data service, using the staff-visible order credential internally. This keeps the same implementation compatible with both QRK Quick and QRK Table while preserving ordered provider transitions.

Validation: `npm run check` passed. Browser testing at a narrow 354px phone-sized viewport and a 1280px desktop viewport showed a clean reflow with large card actions and no console warnings/errors. Salamat order `SL-0203` was submitted from Table 12, appeared under Received, moved to Preparing with one tap, moved to History as Served with one tap, and remained visible in History. The installed `ui-ux-pro-max` skill was updated to resolve its own Codex skill directory instead of Claude plugin paths and now documents Codex filesystem, patch, shell and browser mappings; its search script produced verified mobile-touch and responsive-layout guidance. The bundled validator could not run because PyYAML is absent from the available Python runtime, so frontmatter/path integrity was checked directly and both modified search commands executed successfully. Nothing was deployed.
# September 13, 2026 — Table preset and session-entry slice

- Added a shared location-ready preset/capability module with Quick, traditional Table, prepaid Table, three bundled-buffet payment variants, café/bar tab and custom Table defaults.
- Extended QRK Admin client onboarding with first location, preset selection, table identification, joining, guest-order permission, proximity policy, radius and staff-acceptance controls plus a plain-language journey preview.
- Saved new client service profiles into the existing browser-local client record and routed the customer preview through the same profile.
- Removed the customer route's global header/navbar while preserving menu category navigation and the bottom cart action.
- Added browser-local Table session entry, named host, guest count, package choice, one-session-per-device protection, occupied-table join requests, waiting states and explicit preview acceptance.
- `npm run check` passes, including syntax validation for the new modules; `git diff --check` reports only existing line-ending warnings.
- Visually verified the Admin preset dialog and Salamat Table entry/waiting flow in the local browser. The documented server initially could not bind inside the sandbox; it ran successfully on approved localhost port 4175.
- Still incomplete: Client Admin configuration, staff session/join operations, host notifications/approval UI, package editor, production database entities/RPC/RLS, real geofence evaluation, hosted cross-device behavior and payment integration.

## September 13, 2026 — Global appearance editor

- Shifted the platform visual baseline to the supplied clean dashboard reference: white navigation and surfaces, cool page gray, blue actions/active states, fine borders and restrained shadows.
- Added a QRK Admin Appearance view with live color inputs for accent, page, surface, text and sidebar colors, plus save and reset controls.
- Added a shared browser-local theme runtime so saved global colors apply to QRK Admin, business workspaces and customer menu routes on the same origin. Accent and sidebar foreground colors are derived automatically for readability.
- `npm run check` passes and now syntax-checks the shared theme runtime. `git diff --check` reports only the repository's existing line-ending warnings.
- This remains a local development preference; hosted global settings, account synchronization and deployment are not implemented.
- Follow-up correction: removed the logo filter that rendered the supplied lockup as a black block and replaced the light-sidebar lockup with a readable text treatment. Global QRK colors are now authoritative across client workspaces and customer menus; historical tenant color values no longer override them unless a future explicit custom-color mode is introduced. Open same-origin tabs receive saved color updates through the browser storage event.
- Removed the Client Admin Portal appearance card. Business name/logo editing remains in Business details; color editing now exists only in QRK Admin → Appearance.
- Fixed local cross-port theme propagation. The QRK Admin theme now writes a host-scoped cookie in addition to same-origin storage, allowing `127.0.0.1:4173` and `127.0.0.1:4175` previews to share the palette. Client tabs re-apply it when focused or made visible.
- Opening the QRK Admin Appearance editor also migrates any previously saved same-port palette into the shared host cookie, so existing selections do not require manual re-entry.
- Expanded the editor from five base colors to twelve mapped design tokens. Dedicated controls now cover navigation/count badges, muted text, borders, icon backgrounds, success, warning and danger states in addition to accent, page, surface, text and sidebar colors.
- Corrected the Orders alert badge to use the navigation-badge token instead of danger, and added a thirteenth dedicated control for badge number text rather than forcing automatic contrast.
- Replaced the temporary CSS-generated `QRK MENU` sidebar text with the canonical transparent `dist/assets/brand/qrk-logo.png` lockup and removed the added CSS backing so the PNG renders as supplied. The login view also no longer crops the lockup to its mark. `npm run check` passed; local browser checks covered the QRK Admin login/sidebar and the 370px business navigation drawer.
- Reworked QRK Admin Appearance into a simple Theme section and optional Advanced settings. Theme provides four light presets—each with a dark sidebar—and four complete dark presets, plus a global Light/Dark mode switch. Advanced settings keeps independent 13-token editors for both modes. The shared runtime migrates legacy flat palettes into custom Light settings and applies the selected mode across Admin, business and customer routes. Local browser checks covered preset selection, dark Admin/login contrast, the expanded advanced editor and the customer Table-entry surface; `npm run check` and `git diff --check` passed. Persistence remains browser-local and nothing was deployed.

## September 13, 2026 — Compact Menu Studio navigation state

- Fixed the phone/tablet Menu Studio route so its navigation button receives the same active highlight and `aria-current` state as every other dashboard destination.
- The compact Menu Studio branch previously returned before the shared navigation-state update, even though the correct editor view opened.
- `npm run check` passed. Browser verification at the compact 1068px viewport navigated from Orders to Menu Studio by keyboard, reopened the drawer, and confirmed Menu Studio was highlighted while Orders was not.

## September 13, 2026 — Global preset contrast audit

- Corrected sidebar business, help and account panels to derive their text, borders and fills from the selected sidebar tokens. Active navigation icons now use the same readable foreground as their labels.
- Removed remaining light-only dashboard surfaces from dark mode, including quick actions, order controls, queue cards, dialogs, verification panels and the demo banner.
- Replaced the accent foreground brightness guess with WCAG relative-luminance comparison, and applied that foreground to navigation, primary, cart and customer table-entry actions.
- Audited all four light and all four dark presets on QRK Admin, the business dashboard and the customer Table entry. Measured accent-action contrast ranges from 4.84:1 to 8.66:1; representative dark content ranges from 12.82:1 to 19.39:1. Midnight Blue light was restored after testing.
- `npm run check` and `git diff --check` passed; the latter reports only existing LF-to-CRLF warnings. Nothing was deployed.

## September 13, 2026 — Modern compact visual branch

- Created `codex/modern-compact-ui` from the current local working tree so the visual direction can be reviewed without replacing the established design on `main`.
- Added one final lightweight CSS layer that preserves QRK assets and theme colors while switching to a system UI type stack, six-pixel surface radii, flatter borders/shadows, a narrower navigation rail and tighter page/card spacing.
- Applied the same direction to business login, the Kusina dashboard, QRK Admin and the Kusina customer menu. Customer menu controls retain 44px minimum targets despite the tighter appearance.
- Saved before/after screenshots and a comparison index in `docs/screenshots/modern-compact/`.
- Local browser checks covered 1264px desktop and 716px tablet-width views, the compact Admin navigation, the Kusina dashboard and menu, login, dark Admin tokens, and horizontal overflow. `npm run check` and `git diff --check` passed. Nothing was deployed.

## September 13, 2026 — Seamless material refinement

- Made the experimental branch's visual language borderless by default across Dashboard, Business Profile, Menu Studio, Staff, Orders/Tables, Settings, QRK Admin and customer menu surfaces.
- Removed nested card fills, borders and elevation from content. Hierarchy now comes from alignment, type and intentional section spacing; quiet tinted fills remain only for status/help regions and selected controls.
- Following Apple material guidance, translucent blur is limited to navigation, sticky category controls and floating cart actions rather than applied to content cards. Reduced-transparency fallbacks retain opaque, readable surfaces.
- Browser review covered the Salamat Tables workspace, Business Profile, Staff Access, mobile Menu Studio, Kusina desktop dashboard, Salamat customer menu and QRK Admin. Representative surface audits confirmed zero borders/shadows on primary content containers.

## September 13, 2026 — Five-client ordering workflow lab

- Centralized five development-client profiles and their no-photo menus: Kusina Quick, Salamat Direct Table, Salo Table Approval, Tambay Open Tab and Ihaw Buffet Approval.
- Added one-click Client Admin login shortcuts on the business sign-in page and direct Admin workspace/customer-view actions in QRK Admin.
- Added a separate Table requests page beside Received and Preparing. Staff can accept a pending table from this page.
- Normal staff-approved Table guests can browse and build a cart while waiting, but checkout blocks until acceptance. Buffet-package guests choose their package and remain gated before menu ordering opens.
- Removed seeded order fallbacks and started fresh browser-demo order/session namespaces. Cleared 5 local Supabase orders with cascading order details; verification showed `orders=0` and all 8 seeded menu items remained.
- Browser verification proved Salo Table request → staff Table requests count/card → Accept table → automatic customer unlock. A category-ID defect discovered during testing was corrected for category names containing spaces. The login page visibly exposes all five shortcuts and the final Orders counts are empty.
- `npm run check` passed for this first slice. At that point Table sessions were browser-local; the later LAN repair below supersedes that limitation for local testing. Hosted persistence and payment remain incomplete. Nothing was deployed.

## September 13, 2026 — LAN ordering and table-join repair

- Corrected local backend addressing so a phone loading the LAN preview calls Supabase on the preview computer instead of its own loopback interface.
- Corrected the one-click Kusina and Salamat shortcuts to authenticate their seeded Supabase Client Admins. Preview-only clients retain browser development accounts.
- Replaced browser-only Table sessions with state shared by the single LAN preview server. Every Table client now starts with a large 2×3 Table 1–6 selector unless a valid table-specific QR parameter selects the table automatically.
- Occupied tables appear muted but remain actionable. A second device requests to join, waits for the first guest, and unlocks automatically after that host approves it.
- Formalized the configurable service sequence as eight capability layers: table selection, bundle selection, bundle payment, staff acceptance, open order tab, join control, tab payment and staff reopen. Presets derive which layers apply rather than defining separate page implementations.
- Browser evidence: Kusina `KM-1050` and Salamat `SL-0207` both appeared in the correct authenticated staff queues. Separate browser sessions proved Table 1 occupancy, join request, host approval and joiner unlock. `?table=3` bypassed the grid and opened Table 3 details.
- The LAN preview ports 4173 and 54321 both accepted connections. Payment execution, tab settlement, staff reopen controls and durable hosted Table sessions remain incomplete. Nothing was deployed.

## September 13, 2026 — Customer cart footer docking

- Removed the viewport-wide gradient/backing layer from the floating customer cart action and sized the card itself to 85vw.
- Added footer-aware docking: the card calculates the visible footer overlap during scroll/resize and stays 12px above the footer instead of covering it.
- Reduced the footer's obsolete cart-reservation padding and removed the docking transition entirely so footer tracking is immediate and stable.
- The menu now reserves the rendered cart card height plus breathing room only while the cart is visible, allowing the final item to scroll fully above the floating action without leaving a permanent empty gap.
- The Tables tab now shows occupied tables as its persistent count and a separate red pending-request badge only when table or join requests exist. Unchanged two-second table polls no longer rebuild the controls, preventing interrupted `Table cleaned` clicks and visible table-session flicker.
- The shared table-session browser module is explicitly versioned so open LAN browsers cannot retain an older cleanup action. The local preview endpoint normalizes cleanup action aliases while preserving the canonical `clean` request.
- Root cause verification found separate localhost and LAN listeners serving different preview-server revisions on port 4173: localhost accepted cleanup while the LAN listener returned `Unknown table action`. Both were stopped and replaced with one current LAN server; cleanup then returned `cleaned` through both addresses.
- Browser measurement at the footer confirmed a 621px card in a 731px viewport (85vw), with the card bottom at 800px and footer top at 812px. `npm run check` passes. Nothing was deployed.

## September 13, 2026 — Tables operations board

- Renamed the staff `Table requests` order tab to `Tables` and replaced its request-only list with six compact operational cards.
- Available cards remain light; pending cards expose `Accept table request`; occupied cards use a theme-derived muted surface and expose `Table cleaned` to reopen the table.
- Added the local preview lifecycle `Available → Request pending → Occupied → Table cleaned → Available` without adding dependencies or changing the hosted data contract.
- `npm run check` passed. The local endpoint returned `pending`, `active`, then `cleaned`; browser review confirmed the full control cycle, all six cards in the current dark theme, and clean 390px phone, 768px tablet and desktop layouts with no console warnings or errors. Nothing was deployed.

## September 13, 2026 — Hosted preview session parity

- Made the signed-in identity a semantic profile button that opens the existing keyboard-accessible account menu.
- Added a browser-local preview session mode to the GitHub Pages artifact. It exposes the same five Client Admin preview choices as the LAN sign-in screen without publishing Supabase credentials.
- Profile-menu Log out and the Settings logout control now clear the browser-local preview session and return to the shared business sign-in screen.
- `npm run check`, the Pages build, and a browser flow of Salo Table preview → profile menu → Log out → sign-in screen passed locally. Hosted backend Auth, durable cross-origin session sharing, and hosted Table-session persistence remain separate work.

## September 13, 2026 — Hosted Table preset parity

- Fixed the GitHub Pages customer route so Table presets no longer depend on the LAN-only `/__qrk/table-sessions/` endpoint. Preview deployments now use business-scoped browser storage while the LAN environment keeps its shared preview-server endpoint.
- Cross-referenced all five development clients against the LAN preview. Kusina remains Quick; Salamat requests table, name and guest count; Salo Table adds staff acceptance; Tambay Café omits guest count and opens directly; Ihaw Buffet requires table, name, guest count and package before staff acceptance.
- Added a dependency-free automated browser-storage lifecycle check covering request, staff acceptance, occupied-table join request, host approval and cleaning.
- Browser verification on a Pages-shaped local build confirmed the correct entry fields for every preset. A Salo Table customer request appeared in the staff `Tables` queue, changed to occupied after acceptance and unlocked the customer menu automatically.
- Hosted preview coordination is intentionally limited to tabs in the same browser profile and origin. Cross-device/durable Table sessions still require the hosted backend milestone.

## September 13, 2026 — Menu Studio and Customer Menu parity

- Removed the separate three-item Kusina customer preset that caused the public Customer Menu to disagree with the six-item Menu Studio.
- Added a dependency-free, business-scoped browser menu store shared by Menu Studio and the standalone Customer Menu. Item/category changes, prices, descriptions, photos, ordering, menu name and visibility now survive refresh and update an already-open matching customer tab.
- The Customer Menu omits both unavailable and hidden items as confirmed. Kusina's initial customer menu now matches the five currently available Menu Studio items; Lumpiang shanghai remains owner-visible but is not public while unavailable.
- This is same-browser preview persistence only. Supabase-backed customer menus continue to read the public-menu RPC, and durable cross-device publishing remains part of the hosted backend milestone. Nothing was deployed.

## September 13, 2026 — Cancellable Table confirmation waits

- Added a customer-visible Cancel request action and second-by-second countdown to every Table or join flow waiting for confirmation.
- Added a dedicated acceptance timeout, defaulting to 90 seconds and configurable from 30–600 seconds during QRK Admin client setup. It remains separate from active table-session expiry.
- Cancellation and automatic expiry release pending sessions, remove requests from staff-facing pending state, and return the customer to table selection. Terminal sessions are excluded from current-session lookup.
- `npm run check` passed, including browser-local cancellation and expiry assertions. Browser verification confirmed the 1:30 countdown, accessible Cancel request control, and immediate table release after cancellation.

## September 13, 2026 — Pending Table request badge contrast

- Changed the Tables pending-request count from customizable navigation-badge colors to a dedicated deep-red badge with white text.
- A real Salo Table preview request was verified in the browser in both Charcoal Teal light mode and Carbon dark mode. The white-on-red pair measures 6.57:1 contrast, and the prior light-mode preference was restored after testing. GitHub Pages deployment run `34774730702` succeeded, and a fresh request visibly confirmed the red badge on the public development site.

## September 13, 2026 — Settings card consolidation

- Replaced the redundant long Settings forms with four compact groups: Account, Orders, Availability, and Security & sessions.
- Consolidated username/email and password under Account while keeping password editing as a focused action. Order numbering and prep time now open task-specific dialogs; availability stays directly switchable; both session actions remain available.
- Preserved the existing browser-preview limitations and store-status synchronization. No backend, authentication policy, or persistence claim changed.
- `npm run check` and `git diff --check` passed. Browser review covered desktop, 768px tablet, and 390px phone layouts in the current dark theme, confirmed the numbering and password dialogs, keyboard-addressable controls, and no phone-width horizontal overflow. Light-theme and physical-device review remain part of the broader UI acceptance pass. Nothing was deployed.

# September 13, 2026 — Quick/Table public landing pages

- Added a lightweight public landing set at `/landing/`: a service-mode choice page plus focused QRK Quick and QRK Table pages.
- Reduced the supplied reference pages to a shorter public narrative: the core problem, a three-step flow, three concrete benefits and one primary demo action. Removed or softened claims that depend on unverified hosted publishing, payments, POS connections, AI import or real-time cross-device operation.
- Reused the official QRK logo, `theme.css` and `global-theme.js`, so all three pages inherit the global light/dark mode and advanced color selections without a route-specific theme implementation.
- Browser review passed at 390×844, 768×1024 and 1280×800. All routes loaded in the active dark theme, the choice grid reflowed from two columns to one, and measured horizontal overflow remained zero. Light-theme visual review and user acceptance remain open.
- `npm run check`, GitHub Pages artifact generation and route/link validation passed. Commit `ab78378` deployed successfully through GitHub Pages run `34777124517`.

## Supplied-design restoration and copy review — September 13, 2026

- Replaced the initial simplified landing implementation with the actual user-supplied Choice, QRK Quick and QRK Table HTML layouts. Their composition, section order, interactive demonstrations, motion and responsive behavior remain intact.
- Connected the sample accent variables to the shared `--brand-400` and `--brand-500` tokens, replaced embedded logo data with the official lightweight QRK assets, and aligned typography to Manrope headings with DM Sans body copy.
- Strengthened the primary hooks to “One QRK. Built for how you serve.”, “Turn every scan into an order.” and “Your guests shouldn’t have to wave for service.” Supporting hero and closing copy was tightened without reducing the supplied page depth.
- The existing preview server was reused because port 4173 was already active. `npm run check` passed before editing. Browser checks confirmed both new type stacks, the active global accent, zero broken images and no horizontal overflow at 390px, 768px or 1280px. Corrected deployment and final user review remain open.
## September 13, 2026 — Configurable ordering option sets

- Replaced Menu Studio's plain-text option note with persisted option sets that apply to the whole business, one category, or one item.
- Added required/optional, single/multiple selection, named choices and nonnegative price adjustments. Kusina's starter state demonstrates business extras, Mains add-ons, Drinks size/sweetness and Sisig-specific spice level.
- Connected demo Customer Menu item sheets to inherited option sets and enforced required selections before adding an item. Supabase-backed customer menus continue to use the provider RPC; provider-backed Menu Studio writes remain incomplete.
- Added a dependency-free inheritance test. `npm run check` passed, and browser review confirmed the desktop editor, item-level Configure entry, stacked option dialog, 375px mobile entry point and 44px mobile settings control. The active local Supabase adapter prevented an end-to-end demo-store browser check, so the shared inheritance contract is covered automatically and the provider route remains correctly isolated.
- Nothing was deployed.

## September 13, 2026 — QRK Quick service choice

- Added a blocking QRK Quick entry dialog that occupies at least 80% of the viewport and presents Dine in and Takeout as two stacked action cards.
- Made the available choices business-configurable through `serviceProfile.settings.fulfillmentModes`; Quick defaults to both choices, while Table and buffet presets keep their existing dine-in/table entry.
- The selected entry choice now carries into order review. Checkout shows Pickup or Serve at table, requests a table number only for dine-in, leads with the subtotal, and uses Confirm payment before the payment-method step.
- `npm run check` and `git diff --check` passed. Browser checks covered both Quick paths, buffet isolation, keyboard focus, and 390×844, 768×1024 and 1280×800 viewports with no horizontal overflow. Hosted payment and a business-facing fulfillment-setting editor remain incomplete.

### Popup simplification

- Replaced the heading, helper copy, arrows and compact rows with an exact 80vw × 80vh centered popup containing only two equal, oversized stacked cards: `Dine in 🍽️` and `Takeout 🛍️`.
