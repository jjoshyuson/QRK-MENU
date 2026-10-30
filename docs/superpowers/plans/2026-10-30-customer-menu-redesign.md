# Customer Menu Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `/menu/` customer route to the approved concept: cover-photo header band, polished catalog and sheets with detail and motion, an owner-editable themed background, and featured dishes with tags.

**Architecture:** Vanilla HTML/CSS/ES modules as today. Presentation moves into one new module, `dist/menu/menu-appearance.js`, with small pure functions that Node tests can import; `dist/menu/menu.js` keeps catalog, item, cart and checkout coordination. The customer route's 12 stylesheets collapse to three shared files plus three route files. Two migrations extend the public cosmetics RPC and the menu item schema.

**Tech Stack:** Static `dist/` site, Node 18+ `node:assert` tests run by `npm run check`, Supabase/PostgreSQL migrations with pgTAP tests.

**Spec:** `docs/superpowers/specs/2026-10-30-customer-menu-redesign-design.md`. Visual reference: concept canvas https://claude.ai/artifact/Mcm73WM4Xqo2WioKi9cjJt (Concept A, Concept B, Header 6). Motif SVGs from the concept are at `/tmp/claude-1000/-home-joshy-Documents-ChatGPT-QRK/c52b3e61-e614-4ed9-939d-32a34a034d0c/scratchpad/motifs/motif-<pattern>.svg` (temporary; if gone, redraw per the spec: 160px tiles, stroke-only, `stroke="#000"`).

## Global Constraints

- Every behavior in the spec's "Behavior that must not change" list keeps working; each task's browser check covers the flows it touches.
- Type: Manrope 400–800. Prices `font-variant-numeric: tabular-nums`; ₱ smaller and muted.
- Token values exactly as the spec's Tokens table; accent-derived tokens use `color-mix(in srgb, …)`.
- Text contrast ≥ 4.5:1; touch targets ≥ 44px.
- Every value interpolated into HTML goes through `escapeText`; every image URL through `safeImageUrl` (both already in `dist/menu/menu.js`). Prefer `textContent`/`createElement` for new code.
- Motion durations exactly as the spec's motion table; `prefers-reduced-motion: reduce` disables all animation and transitions, and the confirmation check renders fully drawn.
- No change to order, table, payment, R&L or device RPC contracts. Only the two migrations named in Tasks 10 and 12 touch SQL.
- Each new test file is added to the `check` script in `package.json`.
- One commit per task; run `npm run check` before each commit.

## Review Focus

1. Owner picks a light accent such as `#FFD400`: white button text must stay readable (accent darkened). Test in Task 2.
2. Long restaurant name or location (60+ chars) on a 390px phone: header text wraps; logo and history button keep their size. Test in Task 2 plus its browser check.
3. A business with no cover, no logo and no dish photos: header shows brand color with pattern and initials, rows and sheets show pattern tiles, no broken images. Tests in Tasks 2 and 9.
4. Bad cosmetics values from the database (`style: "<script>"`, `strength: "999"`, `pattern: "../x"`): menu renders with safe defaults. Tests in Tasks 8 and 10.
5. Store closed: header says "Closed" and ordering stays blocked as today. Test in Task 2.

---

## File map

| File | Responsibility |
|---|---|
| `dist/menu/index.html` | Route markup: header band, sticky search, sections, sheets, loads 3 shared + 3 route stylesheets |
| `dist/menu/menu.css` | Route tokens, page, header, sticky search, mini header, catalog, footer, motion utilities |
| `dist/menu/menu-sheets.css` (new) | Item, cart, fulfillment, payment, confirmation, history sheets; toast |
| `dist/menu/menu-table.css` (new) | Table entry dialog, waiting view, Open Tab strip and dialog |
| `dist/menu/menu-appearance.js` (new) | Pure header/background/initials helpers + DOM appliers for header, mini header, background, toast, pop |
| `dist/menu/menu.js` | Catalog, item, cart, checkout, table, history coordination (formatted where touched) |
| `dist/data/qrk-brand-service.js` | Adds `normalizeMenuBackground`; stores `background` in browser-local brand |
| `dist/data/qrk-data-service.js` | Reads/saves `menuCosmetics.background`; reads `featured`/`tags` |
| `dist/app.js`, `dist/index.html` | Owner cosmetics sheet controls; Menu Studio Featured switch and tags |
| `dist/data/qrk-menu-store.js` | Item shape gains `featured`, `tags` |
| `dist/assets/motifs/{filipino,cafe,ramen,pizza,dessert}.svg` (new) | Food pattern tiles |
| `supabase/migrations/202610300001_menu_background_cosmetics.sql` (new) | Replaces `get_public_business_cosmetics` |
| `supabase/migrations/202610300002_menu_item_featured_tags.sql` (new) | `menu_items.featured`, `menu_items.tags`, replaces `get_public_menu` |
| `supabase/tests/004_menu_cosmetics_and_tags.sql` (new) | pgTAP for both migrations |
| Deleted after migration: `dist/menu/brand.css`, `table-session.css`, `payment-first.css`, `order-confirmation.css`, `quick-service.css`, `cart-dock.css` |

---

## Slice 1: Foundation

### Task 1: Consolidate the route stylesheets

**Files:**
- Modify: `dist/menu/index.html:16-27`, `dist/menu/menu.css`
- Create: `dist/menu/menu-sheets.css`, `dist/menu/menu-table.css`
- Delete: `dist/menu/brand.css`, `table-session.css`, `payment-first.css`, `order-confirmation.css`, `quick-service.css`, `cart-dock.css`
- Modify tests that read the deleted files: `tests/menu-description.mjs`, `tests/device-order-history.mjs`, `tests/focused-bottom-sheet.mjs`, `tests/menu-performance.mjs`, `tests/open-tab-flow.mjs`
- Test: `tests/menu-stylesheets.mjs` (new)

**Interfaces:**
- Produces: the three route stylesheets every later task edits.

- [ ] **Step 1: Write the failing test** `tests/menu-stylesheets.mjs`

```js
const html = await readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8');
const links = [...html.matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map(m => m[1]);
assert.deepEqual(links, ['/theme.css', '/pwa.css', '/ui-components.css', '/menu/menu.css', '/menu/menu-sheets.css', '/menu/menu-table.css']);
for (const gone of ['brand', 'table-session', 'payment-first', 'order-confirmation', 'quick-service', 'cart-dock'])
  await assert.rejects(access(new URL(`../dist/menu/${gone}.css`, import.meta.url)));
```

- [ ] **Step 2:** Run `node tests/menu-stylesheets.mjs`. Expected: FAIL on the link list.
- [ ] **Step 3:** Move rules: catalog/page rules from `brand.css`, `quick-service.css`, `cart-dock.css` (bar part) and the rules `/menu/` actually uses from `reference-theme.css` and `modern-compact.css` into `menu.css`; sheet rules from `cart-dock.css`, `payment-first.css`, `order-confirmation.css` into `menu-sheets.css`; `table-session.css` and Open Tab rules into `menu-table.css`. Keep selector order so the cascade is unchanged. Update the six `<link>`s. Point the five existing tests at the file that now holds each asserted rule; keep their assertions.
- [ ] **Step 4:** Run `npm run check`. Expected: all pass.
- [ ] **Step 5: Browser parity check.** Preview `/menu/?business=kusina-manila` and `/menu/?business=salamat&table=12` at 390px light/dark; screenshots match `review-assets/menu-after.png` and `menu-phone-dark.png` apart from rules that only existed for owner routes. Save as `review-assets/menu-task1-*.png`.
- [ ] **Step 6: Commit** `refactor(menu): consolidate customer route stylesheets`

### Task 2: Tokens, header band, floating search, mini header

**Files:**
- Create: `dist/menu/menu-appearance.js`
- Modify: `dist/menu/index.html:56-72` (restaurant section → header band; search moves under it), `dist/menu/menu.css`, `dist/menu/menu.js:104-106` (replace inline header code with the appliers)
- Test: `tests/menu-appearance.mjs` (new)

**Interfaces:**
- Consumes: `themeValues(brand)` from `qrk-brand-service.js` (returns `{primary, primaryStrong, primaryForeground, …}`).
- Produces (all exported from `menu-appearance.js`):
  - `businessInitials(name: string): string` — first letter of the first two words that start with a letter or digit, uppercased; `''` → `'Q'`.
  - `headerModel(brand, {isTable: boolean, tableNumber: string|null, orderCount: number, openForOrders: boolean, prepLabel: string, area: string}): {name, tagline, initials, logoUrl, coverUrl, statusLabel: 'Open'|'Closed', metaParts: string[], tableLabel: string|null, orderBadge: string|null}`; `logoUrl`/`coverUrl` already passed through `safeImageUrl` (move `safeImageUrl` here and import it in `menu.js`; keep the `const safeImageUrl=` single-line form the existing test evals, or update that test to import it).
  - `applyHeader(root: Element, model): void`
  - `bindScrollChrome(scroller: Element|Window, {threshold = 140}): () => void` — toggles `data-scrolled` on `<body>`; returns an unbind function.
  - `accentFor(brand): string` — `themeValues(brand).primaryStrong`, set as `--accent` on `:root`.

- [ ] **Step 1: Write failing tests** in `tests/menu-appearance.mjs`

```js
import { businessInitials, headerModel, accentFor } from '../dist/menu/menu-appearance.js';
assert.equal(businessInitials("Kusina Nanay Mila's"), 'KN');
assert.equal(businessInitials('Sorbetes & Co.'), 'SC');
assert.equal(businessInitials(''), 'Q');
const base = { businessName: "Kusina Nanay Mila's", logoDataUrl: '', coverPhotoUrl: 'javascript:alert(1)' };
const open = headerModel(base, { isTable: false, tableNumber: null, orderCount: 0, openForOrders: true, prepLabel: 'About 15 min', area: 'Ermita' });
assert.equal(open.statusLabel, 'Open'); assert.equal(open.coverUrl, ''); assert.equal(open.initials, 'KN'); assert.equal(open.orderBadge, null);
assert.deepEqual(open.metaParts, ['About 15 min', 'Ermita']);
const closed = headerModel(base, { isTable: true, tableNumber: '12', orderCount: 2, openForOrders: false, prepLabel: '', area: '' });
assert.equal(closed.statusLabel, 'Closed'); assert.equal(closed.tableLabel, 'Table 12'); assert.equal(closed.orderBadge, '2'); assert.deepEqual(closed.metaParts, []);
const contrast = (a, b) => /* WCAG relative-luminance ratio */;
for (const hex of ['#FFD400', '#1683ff', '#0E7C86']) assert.ok(contrast(accentFor({ primary: hex }), '#FFFFFF') >= 4.5, hex);
```

- [ ] **Step 2:** Run `node tests/menu-appearance.mjs`. Expected: FAIL, module not found.
- [ ] **Step 3:** Implement the five exports. If `#FFD400` fails contrast, fix `readableAccent` in `qrk-brand-service.js` (darken until ≥ 4.5:1 against white) rather than special-casing here.
- [ ] **Step 4:** Markup and CSS per spec "Header (Header 6)" and "Scrolling": band padding `22px 16px 82px`, radius `0 0 30px 30px`, fade `rgba(0,0,0,.55)`→`.35` at 45%→`.5`; logo 52px; name 21/800 with `min-width: 0` and normal wrapping; frosted history button 44px; tagline row with Table pill; search 50px radius 16 in a sticky wrapper with `margin-top: -62px`; `body[data-scrolled] .menu-tools` gets `--frost` backing + blur + border and sticks at `top: 56px`; mini header 56px fixed at top, hidden until `data-scrolled`. No cover → accent band with `.motif` layer (Task 9 supplies the pattern; until then the plain accent band). No logo → white tile with initials.
- [ ] **Step 5:** Run `npm run check`. Expected: pass.
- [ ] **Step 6: Browser check** at 390px and 768px, light/dark: Kusina, Salamat table 12, a business renamed in the browser-local brand to a 70-character name, and store closed (toggle in the owner dashboard). Header wraps cleanly; mini header appears after ~140px; chips scroll-spy still works.
- [ ] **Step 7: Commit** `feat(menu): cover-photo header band and floating search`

### Task 3: Catalog sections, rows and footer

**Files:**
- Modify: `dist/menu/menu.js:140-170` (`renderMenu`, `#dish-template` usage), `dist/menu/index.html:183-185` (`#dish-template`), footer `:106`, `dist/menu/menu.css`
- Test: `tests/menu-performance.mjs` (keep its image-priority assertions), `tests/menu-catalog.mjs` (new)

**Interfaces:**
- Produces: `formatPriceParts(minor: number): {symbol: '₱', amount: string}` exported from `menu-appearance.js`; `sectionIndexLabel(i: number): string` → `'01'`.

- [ ] **Step 1: Failing tests** in `tests/menu-catalog.mjs`: `formatPriceParts(18000)` → `{symbol:'₱', amount:'180'}`; `formatPriceParts(123456)` → amount `'1,234.56'`; `sectionIndexLabel(0)` → `'01'`, `sectionIndexLabel(11)` → `'12'`; source check that `renderMenu` builds names with `textContent` or `escapeText` (`assert.doesNotMatch(menu, /\$\{item\.name\}/)`).
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Format `renderMenu` to one statement per line, then render: section heading (index, name, "N items"), one raised card per section, rows per spec "Catalog" (photo 92px radius 16 with floating +, accent-soft + when no photo, Sold out, "N in order"). Popular row markup exists but stays hidden until Task 14. Footer: "ORDERING BY QRK" between hairlines plus existing photo-credits link.
- [ ] **Step 4:** Run `npm run check`. Expected: pass.
- [ ] **Step 5: Browser check:** search, empty search, category jump, sold-out row disabled, add an item and see "1 in order".
- [ ] **Step 6: Commit** `feat(menu): raised section cards and refined dish rows`

### Task 4: Motion layer

**Files:**
- Modify: `dist/menu/menu-appearance.js`, `dist/menu/menu.css`, `dist/menu/menu-sheets.css`, `dist/menu/menu.js` (call sites after add-to-order and category change)
- Test: `tests/menu-motion.mjs` (new)

**Interfaces:**
- Produces: `showToast(text: string, {duration = 1900}): void` (one `role="status"` element, restarts on repeat); `popElement(el: Element): void` (alternates `.pop-a`/`.pop-b` to restart); `staggerRise(container: Element, {step = 50, max = 520}): void` (sets `--rise-delay` on children and toggles `.rise-a`/`.rise-b` on the container).

- [ ] **Step 1: Failing tests:** CSS source contains `@media (prefers-reduced-motion: reduce)` rule that sets `animation: none` and `transition: none` for the route, and `.draw path{stroke-dashoffset:0}` inside it; keyframes exist for rise (500ms), mini header (260ms), toast (1.9s), pop (360ms), press scale `.975` (140ms); `menu-appearance.js` exports the three functions.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement per the spec motion table. Toast text is set with `textContent`.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check** with OS reduced motion on and off.
- [ ] **Step 6: Commit** `feat(menu): staggered rise, toast and press motion`

## Slice 2: Sheets

### Task 5: Item sheet

**Files:** Modify `dist/menu/index.html:107-118`, `dist/menu/menu.js:177-200` (`renderItemOptions`, `openItem`, `updateItemTotal`), `dist/menu/menu-sheets.css`. Test: `tests/focused-bottom-sheet.mjs`, `tests/menu-options.mjs`.

- [ ] **Step 1: Failing test** added to `tests/menu-options.mjs`: submitting with a missing required group adds `data-invalid` to that group's fieldset and shows text "Choose one to continue." (source assertion on the message and attribute).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Restyle per spec "Sheets › Item sheet": photo 236px (pattern tile 150px when no photo, via `.motif` from Task 9 or accent-soft until then), Required/Optional badges, group boxes, checks pop (Task 4), stepper, "Add to order · ₱X" / "Update · ₱X". Keep existing drag-to-dismiss and focus restore.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check:** required group error, multi-select extras, special request at 140 chars, edit from cart reopens with saved choices.
- [ ] **Step 6: Commit** `feat(menu): restyled item sheet with group validation state`

### Task 6: Cart, fulfillment and payment sheets

**Files:** Modify `dist/menu/index.html:119-166`, `dist/menu/menu.js:188-260` (`renderCart`, `openOrderMethodSheet`, `openPaymentStep`), `dist/menu/menu-sheets.css`. Test: `tests/payment-first-preview.mjs`, `tests/dual-service-experiences.mjs`, `tests/service-gates.mjs`.

- [ ] **Step 1:** Add assertions: cart line markup includes a 52px thumbnail slot and uses `escapeText` for option names and notes; payment sheet still renders cashless as disabled with label "Soon".
- [ ] **Step 2:** Run. Expected: FAIL on the new assertions.
- [ ] **Step 3:** Restyle per spec "Sheets › Cart". Fulfillment/consumption choices remain driven by the service profile; only presentation changes.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check:** Quick dine-in and take-out, payment-first preset, Table fulfillment fixed, recommendations, empty cart.
- [ ] **Step 6: Commit** `feat(menu): restyled cart, fulfillment and payment sheets`

### Task 7: Confirmation, history and Open Tab

**Files:** Modify `dist/menu/index.html:148-182`, `dist/menu/menu.js:137-139` (`renderHistory`, `renderTabSummary`) and confirmation render, `dist/menu/menu-sheets.css`, `dist/menu/menu-table.css`. Test: `tests/open-tab-flow.mjs`, `tests/device-order-history.mjs`, `tests/table-session-preview.mjs`.

- [ ] **Step 1:** Add assertions: confirmation check SVG has class `draw`; status steps get `--rise-delay` in 110ms increments; Open Tab strip renders after the category chips, not before the search.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Restyle per spec "Sheets › Confirmation/History". Order stays Received until staff accept.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check:** place a Quick order through to confirmation; Table round 1 and 2, tab summary, bill request; history after refresh.
- [ ] **Step 6: Commit** `feat(menu): confirmation, history and Open Tab polish`

## Slice 3: Themed background

### Task 8: `normalizeMenuBackground`

**Files:** Modify `dist/data/qrk-brand-service.js`. Test: `tests/menu-background.mjs` (new).

**Interfaces:**
- Produces: `export const MENU_PATTERNS = ['filipino','cafe','ramen','pizza','dessert']`; `export const MENU_BACKGROUND_STYLES = ['photo','pattern','pattern-moving','glow','plain']`; `export function normalizeMenuBackground(raw: {backgroundStyle?, backgroundPattern?, backgroundStrength?, backgroundUrl?, backgroundOpacity?}): {style, pattern: string|null, strength: number, imageUrl: string}`.

- [ ] **Step 1: Failing tests**

```js
const n = normalizeMenuBackground;
assert.deepEqual(n({}), { style: 'glow', pattern: null, strength: 50, imageUrl: '' });
assert.equal(n({ backgroundStyle: '<script>' }).style, 'glow');
assert.equal(n({ backgroundStyle: 'pattern', backgroundPattern: '../x' }).style, 'glow');      // no valid pattern → glow
assert.equal(n({ backgroundStyle: 'pattern', backgroundPattern: 'ramen' }).pattern, 'ramen');
assert.equal(n({ backgroundStrength: '999' }).strength, 100);
assert.equal(n({ backgroundStrength: -4 }).strength, 0);
assert.equal(n({ backgroundStyle: 'photo' }).style, 'glow');                                     // photo without image
assert.deepEqual(n({ backgroundStyle: 'photo', backgroundUrl: 'javascript:x' }).imageUrl, '');
// legacy: image set, no style → photo; strength from opacity (.94 - s*.55 = opacity)
assert.deepEqual(n({ backgroundUrl: '/assets/bg.jpg', backgroundOpacity: 0.72 }), { style: 'photo', pattern: null, strength: 40, imageUrl: '/assets/bg.jpg' });
```

- [ ] **Step 2:** Run `node tests/menu-background.mjs`. Expected: FAIL.
- [ ] **Step 3:** Implement. Strength rounds to the nearest 5. URL check reuses the same rule as `safeImageUrl`.
- [ ] **Step 4:** Passes; add to `check`.
- [ ] **Step 5: Commit** `feat(brand): normalize menu background settings`

### Task 9: Motif assets and background rendering

**Files:** Create `dist/assets/motifs/*.svg`. Modify `dist/menu/menu-appearance.js`, `dist/menu/menu.css`, `dist/menu/menu.js:29,83` (replace `applyPublicMenuBackground` and the cosmetics merge). Test: `tests/menu-background.mjs`.

**Interfaces:**
- Consumes: `normalizeMenuBackground` (Task 8).
- Produces: `backgroundLayers(bg): {photo: string|null, veilOpacity: number|null, glow: number|null, pattern: string|null, patternOpacity: number|null, moving: boolean}` (pure) and `applyMenuBackground(root: Element, bg): void`.

- [ ] **Step 1: Failing tests:** `backgroundLayers({style:'pattern',pattern:'cafe',strength:50})` → `patternOpacity` `0.11`, `pattern` `'cafe'`; strength 0 → `0.04`, 100 → `0.18`; photo strength 100 → `veilOpacity` `0.39`, strength 0 → `0.94`; `pattern-moving` → `moving: true`; each SVG in `MENU_PATTERNS` exists and contains no `<script`, `<style`, `href` or `foreignObject`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Pattern layer uses `mask-image: url(/assets/motifs/<pattern>.svg)` with `background-color: var(--accent)`, mask size 150px; moving drifts 150px over 60s; the header band and missing-photo tiles reuse the same `.motif.m-<pattern>` classes. The background sits behind the scroll content; cards stay opaque. Every customer-route `<img>` (cover, logo, dish, cart thumbnail, item sheet) gets an `error` listener that swaps in the pattern tile (dish/sheet/cart), the accent band (cover) or the initials tile (logo) at the same size.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check:** each style at strength 0, 50, 100 in light and dark; a business with no cover/logo/photos shows pattern band, initials and pattern tiles; a dish photo URL that 404s shows a pattern tile without layout shift.
- [ ] **Step 6: Commit** `feat(menu): themed food-pattern backgrounds`

### Task 10: Cosmetics RPC migration and data service

**Files:** Create `supabase/migrations/202610300001_menu_background_cosmetics.sql`, `supabase/tests/004_menu_cosmetics_and_tags.sql`. Modify `scripts/validate-backend.mjs`, `dist/data/qrk-data-service.js:82-92`. Test: `tests/business-cosmetics.mjs`.

**Interfaces:**
- Produces: `get_public_business_cosmetics(text)` also returns `backgroundStyle`, `backgroundPattern`, `backgroundStrength` read from `settings->'menuCosmetics'->'background'`; `saveBusinessCosmetics(cosmetics)` accepts `cosmetics.background: {style, pattern, strength}` and writes it under `settings.menuCosmetics.background`.

- [ ] **Step 1: Failing pgTAP** in `004_…sql`: stored `{"style":"<script>","pattern":"../x","strength":"999"}` returns `backgroundStyle = 'glow'`, `backgroundPattern is null`, `backgroundStrength = 100`; missing background returns `glow`, `null`, `50`; valid `{"style":"pattern","pattern":"ramen","strength":35}` returns them unchanged. Add marker `'cosmetics whitelist rejects unknown style'` and require it in `validate-backend.mjs`. Add to `tests/business-cosmetics.mjs`: `saveBusinessCosmetics` source writes `background` inside `menuCosmetics`.
- [ ] **Step 2:** Run `node scripts/validate-backend.mjs` (expected FAIL on the missing marker) and, if the local stack is running, `npx supabase test db` (expected FAIL).
- [ ] **Step 3:** `create or replace function public.get_public_business_cosmetics(p_destination_slug text)` keeping the existing keys and grants; whitelist with `case when … in (…)`, clamp with `greatest(0, least(100, …))`, non-numeric strength → 50. Update the data service.
- [ ] **Step 4:** `npm run check` passes; pgTAP passes when the local stack is available (record if it was not run).
- [ ] **Step 5: Commit** `feat(db): expose validated menu background cosmetics`

### Task 11: Owner background editor

**Files:** Modify `dist/app.js:330-338` (cosmetics sheet), `dist/index.html` (sheet markup), `dist/data/qrk-brand-service.js` (browser-local `background`), `dist/dashboard.css`. Test: `tests/business-cosmetics.mjs`.

**Interfaces:**
- Consumes: `normalizeMenuBackground`, `MENU_PATTERNS`, `MENU_BACKGROUND_STYLES` (Task 8); `backgroundLayers` (Task 9) for the preview.

- [ ] **Step 1: Failing assertions:** the sheet contains a segmented control named "Style" with the five options (labels Photo, Pattern, Moving pattern, Glow, Plain), five pattern swatch buttons with `aria-pressed`, and a range input labeled "Strength" with `step="5"`, `min="0"`, `max="100"`; Cancel restores the saved values.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement; preview renders through `backgroundLayers`; Done calls `saveBusinessCosmetics` (or browser-local save in demo mode); failure keeps the draft and shows the existing error with retry.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check:** change style/pattern/strength in the owner dashboard, Done, open `/menu/` for that business and see it applied; Cancel discards; keyboard reaches every control.
- [ ] **Step 6: Commit** `feat(owner): edit customer menu background style, pattern and strength`

## Slice 4: Featured dishes and tags

### Task 12: Schema and public menu

**Files:** Create `supabase/migrations/202610300002_menu_item_featured_tags.sql`. Modify `supabase/tests/004_menu_cosmetics_and_tags.sql`, `scripts/validate-backend.mjs`.

**Interfaces:**
- Produces: `menu_items.featured boolean not null default false`, `menu_items.tags text[] not null default '{}'` with check `tags <@ array['spicy','sharing','slow_cooked','vegetarian']`; `get_public_menu` items gain `'featured'` and `'tags'`.

- [ ] **Step 1: Failing pgTAP:** inserting `tags = '{spicy,unknown}'` raises a check violation; `get_public_menu` returns `featured` and `tags` for a seeded item; hidden items still omitted. Marker `'menu item tags reject unknown values'` required by `validate-backend.mjs`.
- [ ] **Step 2:** Run `node scripts/validate-backend.mjs`. Expected: FAIL.
- [ ] **Step 3:** `alter table` plus `create or replace function public.get_public_menu` copying the current definition and adding the two fields; re-grant to `anon, authenticated, service_role`.
- [ ] **Step 4:** `npm run check` passes; pgTAP passes when available.
- [ ] **Step 5: Commit** `feat(db): featured flag and tags on menu items`

### Task 13: Menu Studio fields

**Files:** Modify `dist/app.js` (item editor dialog), `dist/index.html` (`#dialog-title` "Add a menu item" form), `dist/data/qrk-menu-store.js`, `dist/data/qrk-data-service.js`. Test: `tests/service-builder.mjs` or new `tests/menu-item-tags.mjs`.

**Interfaces:**
- Produces: menu-store items carry `featured: boolean` and `tags: string[]` (only values from the four allowed tags), defaulting to `false` and `[]` for existing stored items.

- [ ] **Step 1: Failing test:** reading a stored item without the fields yields `featured === false`, `tags` `[]`; saving `tags: ['spicy','bogus']` stores `['spicy']`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Add a Featured switch and four tag toggles (labels Spicy, Good for sharing, Slow-cooked, Vegetarian) to the item editor; persist through the store and the hosted save path.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Commit** `feat(owner): featured switch and dish tags in Menu Studio`

### Task 14: Featured row and tags on the menu

**Files:** Modify `dist/menu/menu.js` (`renderMenu`, remote menu mapping at `:63`), `dist/menu/menu.css`. Test: `tests/menu-catalog.mjs`.

**Interfaces:**
- Consumes: item `featured`, `tags` (Tasks 12–13).
- Produces: `featuredItems(items): Item[]` exported from `menu-appearance.js` — available, not hidden, `featured`, menu order, max 3. `tagLabel(tag): string` — `spicy→'Spicy'`, `sharing→'Good for sharing'`, `slow_cooked→'Slow-cooked'`, `vegetarian→'Vegetarian'`, unknown → `''`.

- [ ] **Step 1: Failing tests:** `featuredItems` drops sold-out and hidden, keeps order, caps at 3, returns `[]` when none; `tagLabel` mapping above; section titled "Featured" and no "No. 1" or "Bestseller" text in the route source.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Show the row only when browsing All with no search and `featuredItems` is non-empty; cards without photos use the pattern tile; tags render under the description with the spicy tag in `--spicy`.
- [ ] **Step 4:** `npm run check` passes.
- [ ] **Step 5: Browser check:** mark two items featured and tag one spicy in Menu Studio, see them on `/menu/`; unmark all and the row disappears.
- [ ] **Step 6: Commit** `feat(menu): featured row and dish tags`

### Task 15: Final verification

- [ ] **Step 1:** `npm run check` and `node tests/photo-races.mjs`. Expected: all pass.
- [ ] **Step 2:** Full browser checklist from the spec's Testing section at 390px and 768px, light and dark, Quick and Table, keyboard, reduced motion.
- [ ] **Step 3:** Before/after screenshots in `review-assets/menu-redesign-*.png`; add a dated entry to `docs/BUILD_STATUS.md` listing what was verified and what was not (hosted stack, physical devices).
- [ ] **Step 4: Commit** `docs: record customer menu redesign verification`
