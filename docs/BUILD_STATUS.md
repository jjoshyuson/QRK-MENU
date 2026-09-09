# Build status

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
