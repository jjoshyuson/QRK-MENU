# Customer menu redesign — design

Status: approved concept, spec awaiting review. No product code has changed.

Concept canvas (private): https://claude.ai/artifact/Mcm73WM4Xqo2WioKi9cjJt
- Concept A: polished menu, interactive.
- Concept B: themed background, interactive.
- Header 6 (brand band with cover photo) chosen from six header options.

This spec narrows `2026-10-13-qrk-redesign-design.md` to the customer route (`/menu/`) and supersedes its customer-menu section.

## What the owner asked for

- Keep Concept A's layout: compact list rows with photo on the right, Popular row, category chips, bottom order bar, sheets for item, cart, confirmation and history.
- Fix the flat feel: depth, finish, subtle detail ("plain but designed") and quick, clean motion.
- Header 6 layout with the restaurant's cover photo as the band; no white header block.
- A background that each restaurant can edit, based on its brand color and food type.

## Scope

In scope:
1. Visual redesign of `/menu/` for Quick and Table, light and dark.
2. Header band, floating search, mini header on scroll.
3. Detail and motion layer (listed below), with reduced-motion fallbacks.
4. Themed background: owner-editable style, food pattern and strength, delivered to the public menu.
5. Featured dishes and dish tags (data plus display), as the last slice.
6. Consolidating the customer route's CSS.

Out of scope: checkout sequencing changes, payments, owner dashboard redesign, admin and marketing pages, R&L integration changes, new service modes.

## Behavior that must not change

These are acceptance requirements. The redesign changes how they look, not what they do.

- Quick and Table experiences, chosen by the service profile and `?service=` / table token entry.
- Table entry: QR token resolution, table choice, staff-acceptance waiting state, join requests.
- Item options: required and optional groups, min/max rules, price deltas, special requests (140 chars), quantity 1 to 20.
- Cart: edit a line from review, remove, quantity, recommendations.
- Fulfillment and consumption choices as gated by the service profile; payment-first preset with pay-at-counter enabled and cashless shown as unavailable.
- Orders stay Received until staff accept. No payment is taken.
- Open Tab rounds, tab summary, bill request.
- Order history and confirmation (order number, handoff token, status).
- Sold-out items shown disabled; hidden items omitted.
- Store-closed notice; menu-loading skeleton; empty search state.
- Device identity, idempotency keys, published-menu reconciliation, R&L catalog display.
- Safe-area insets, focus trapping and restoration in dialogs, Escape and backdrop close.

## Visual design

### Tokens

Defined once for the route in `dist/menu/menu.css` on `:root` with a dark override, derived from the business accent with `color-mix()`:

| Token | Light | Dark |
|---|---|---|
| `--page` | accent 7% over `#F5F4F1` | accent 9% over `#0D0F10` |
| `--surface` / `--surface-2` | `#FFFFFF` / `#F7F7F5` | `#171A1C` / `#1E2124` |
| `--ink` / `--muted` | `#141414` / `#5B5F66` | `#F1F1EF` / `#A2A7AC` |
| `--accent-soft` | accent 11% over white | accent 24% over surface |
| `--accent-text` | accent 78% over black | accent 50% over white |
| `--shadow-sm/md/lg` | layered, low-alpha | stronger, black |

Text pairs keep 4.5:1. Accent buttons use white text; owner-chosen accents that fail 4.5:1 against white are darkened in `qrk-brand-service.js` (existing contrast-safe derivation).

Type: Manrope 400 to 800 (already loaded). Prices use `font-variant-numeric: tabular-nums`; the ₱ sign is smaller and muted beside a bold figure.

### Header (Header 6)

- Full-width band, bottom corners 30px, cover photo `object-fit: cover` behind a dark fade (`rgba(0,0,0,.55)` → `.35` → `.5`) so white text holds 4.5:1.
- Row: logo 52px (white 2px ring), name 21/800, status line "Open · About 15 min · Ermita" (green dot), frosted history button 44px with order-count badge.
- Tagline below; Table mode adds a white "Table 12" pill beside it.
- Search (50px, radius 16, shadow) floats over the curved edge; category chips sit below on the page background.
- No cover photo: band is the accent color with the food pattern in white at 15% plus a soft highlight.
- No logo: white tile with the business initials in `--accent-text`.
- Store closed: the status dot and word switch to "Closed" in muted text; the existing store notice still shows.

### Scrolling

- After about 140px of scroll a mini header (56px, frosted) slides down with logo, name, Table pill and history button.
- The search and chips stick under it and gain a frosted backing; before that they have no backing.
- Category chips keep the existing scroll-spy and jump-to-section behavior.

### Catalog

- Section heading: two-digit index in `--accent-text` ("01"), name, item count on the right.
- Each section's dishes sit in one raised card (radius 20, `--shadow-sm`) with inset dividers.
- Row: name 15/800, two-line description, tags, price; photo 92px radius 16 on the right with a floating + button. No photo: a small accent-soft + at the right.
- Badges on a row: "Sold out" (row disabled, 50% opacity), "N in order" (accent-soft).
- Popular row: horizontal cards (204px) with the photo inset in the card, price pill on the photo, accent + button. Cards without a photo show the food pattern tile.
- Footer: "ORDERING BY QRK" between hairlines and the prices note.

### Sheets

- Bottom sheets, top radius 26, grab handle, slide-up entrance.
- Item sheet: photo 236px (pattern tile 150px without photo), name and price, option groups in rounded boxes with Required/Optional badges, error state outlines the group in `--danger` with "Choose one to continue.", special requests textarea, quantity stepper, accent "Add to order · ₱X" button.
- Cart: line photo thumbnail 52px, options and note, stepper, Edit, Remove, "Add more items", fulfillment choice cards, optional name, payment rows, dashed divider before Total, sticky "Place order · ₱X".
- Confirmation: check circle with halo, order number and pickup code card, status steps, line items, primary and secondary actions.
- History: order cards with status pills; Table mode titles it "Your tab" with tab total and bill request.

### Detail and motion

| Event | Motion | Duration |
|---|---|---|
| Menu load, category change | rows and Popular cards rise in, staggered | 500ms, ≤520ms delay |
| Scroll past header | mini header slides down | 260ms |
| Item added or updated | toast "Added 2× Chicken adobo" at top; order-bar count pops | 1.9s / 360ms |
| Order bar first appears | rises in | 400ms |
| Option picked | check pops in | 220ms |
| Sheet open | slides up, backdrop fades | 320ms / 220ms |
| Confirmation | circle pops, check draws, steps cascade | 450ms + 110ms steps |
| Press | buttons and cards scale to .975 | 140ms |

`prefers-reduced-motion: reduce` disables all of these; the check renders drawn.

## Themed background

### What the customer sees

The page background behind the catalog uses one of:

| Style | Rendering |
|---|---|
| `photo` | the existing menu background image under a page-colored veil |
| `pattern` | food pattern masked in the accent color |
| `pattern-moving` | same, drifting over 60s (static under reduced motion) |
| `glow` | two soft accent light patches in opposite corners |
| `plain` | the accent-tinted page color only |

Strength (0 to 100) sets pattern opacity (4% to 18%), glow intensity, or veil opacity for photos (94% down to 39%). Cards stay opaque, so text contrast does not depend on the background.

Food patterns: `filipino`, `cafe`, `ramen`, `pizza`, `dessert`. Each is a 160px tileable SVG drawn with strokes only, rendered through CSS `mask-image` so it takes any accent color. Files: `dist/assets/motifs/<pattern>.svg` (from the concept).

Fallbacks: `photo` with no image falls back to `pattern`; no pattern chosen falls back to `glow`.

### Owner editing

In Business profile, the existing "Customer menu background" sheet gains:
- Style: segmented control (Photo, Pattern, Moving pattern, Glow, Plain).
- Food pattern: five swatch buttons showing each pattern in the business accent.
- Strength: slider with 5-step increments.

The existing live preview (`cosmetics-menu-preview`) renders the chosen background. Done saves; Cancel discards the draft and restores focus (existing sheet behavior).

### Data

Stored in `business_profiles.settings.menuCosmetics.background`:

```json
{ "style": "pattern", "pattern": "filipino", "strength": 50 }
```

- `qrk-data-service.js` `saveBusinessCosmetics` writes it beside the existing `logoUrl`, `coverUrl`, `backgroundUrl`, `backgroundOpacity`.
- Demo mode stores the same shape in the browser-local brand service.
- New migration replaces `public.get_public_business_cosmetics(text)` to also return `backgroundStyle`, `backgroundPattern` and `backgroundStrength`. The function whitelists values: unknown style returns `glow`, unknown pattern returns `null`, strength is clamped to 0–100 and defaults to 50.
- The public menu validates again on read with one pure function (`normalizeMenuBackground` in `dist/data/qrk-brand-service.js`) used by both the menu and the owner preview.
- Existing `backgroundOpacity` stays readable; when `style` is absent and `backgroundUrl` is set, the style is `photo` and strength is derived from the old opacity.

## Featured dishes and tags (last slice)

The menu schema has no popularity or tag data. Until this slice ships, the Popular row and dish tags stay hidden.

- Migration adds `menu_items.featured boolean not null default false` and `menu_items.tags text[] not null default '{}'` with a check that every tag is in `{spicy, sharing, slow_cooked, vegetarian}`. Existing rows default to not featured and no tags; `seed.sql`, `development_catalog.sql` and the catalog generator scripts need no change unless they want sample values.
- `get_public_menu` returns `featured` and `tags`.
- Menu Studio item editor gets a Featured switch and tag toggles.
- The customer menu shows up to 3 featured, available items in the Popular row, in menu order, labeled "Featured" without rank numbers. The concept's "No. 1/2/3" ranks and the Bestseller badge need real order counts and are left out.

## Code structure

Customer route stylesheets today: `menu.css`, `brand.css`, `table-session.css`, `payment-first.css`, `order-confirmation.css`, `quick-service.css`, `cart-dock.css`, plus the shared `theme.css`, `pwa.css`, `reference-theme.css`, `modern-compact.css`, `ui-components.css`.

Target:
- Shared: `theme.css`, `pwa.css`, `ui-components.css` (component tokens stay the source of truth for shared controls).
- Route: `menu/menu.css` (tokens, layout, catalog), `menu/menu-sheets.css` (item, cart, fulfillment, payment, confirmation, history), `menu/menu-table.css` (table entry and Open Tab).
- `reference-theme.css` and `modern-compact.css` are no longer loaded by `/menu/`; they remain for owner routes. Old route files are deleted once their rules are migrated, one surface at a time, with before/after screenshots.

JavaScript:
- `menu/menu-appearance.js` (new): header band, mini header, background rendering, scroll state, toast and pop helpers. Takes the normalized brand and background, returns nothing; owns only presentation.
- `menu/menu.js`: keeps catalog, item, cart and checkout coordination. Functions touched by the redesign are formatted to one statement per line before they are changed, so diffs are reviewable.
- HTML built with `innerHTML` must escape every value with the existing `escapeText`; image URLs go through `safeImageUrl`.

## Errors and edge states

- Images that fail to load fall back to the pattern tile or initials; layout keeps its size.
- Long names wrap to two lines in the header; long locations wrap the status line.
- Menus with no photos at all still show the pattern tiles, so the page looks finished.
- Background settings that fail validation fall back as described above; the menu never fails to render because of cosmetics.
- Saving cosmetics keeps the draft on failure and shows the existing error with retry.

## Testing

Update tests that pin the old CSS and markup instead of deleting their intent:
`tests/menu-description.mjs`, `tests/focused-bottom-sheet.mjs`, `tests/menu-performance.mjs`, `tests/open-tab-flow.mjs`, `tests/device-order-history.mjs`, `tests/business-cosmetics.mjs`, `tests/component-source.mjs`. Image loading priority and lazy-loading assertions in `menu-performance.mjs` are kept.

New tests:
- `normalizeMenuBackground`: unknown style, unknown pattern, strength out of range, legacy `backgroundOpacity` mapping, missing fields.
- Migration: `validate-backend.mjs` covers the new function and its whitelist; a pgTAP test checks a stored `style: "<script>"` returns `glow`.
- Featured/tags slice: the tag check constraint rejects unknown tags; `get_public_menu` returns both fields.

Browser checks per slice, using the local preview at 390px and 768px, light and dark, Quick and Table:
- add item with required options, edit from cart, remove, place order, confirmation, history;
- table entry, waiting, Open Tab round, bill request;
- store closed, sold out, empty search, no-photo menu;
- keyboard: focus order, dialog focus trap and restore, Escape;
- reduced motion on.

Before/after screenshots go in `review-assets/`.

## Delivery slices

Each slice is its own commit and review.

1. Foundation: tokens, header band, floating search, mini header, chips, section cards and rows, footer, motion utilities, CSS consolidation for these surfaces.
2. Sheets: item, cart, fulfillment, payment, confirmation, history, toast, Open Tab strip.
3. Themed background: motif assets, `normalizeMenuBackground`, background rendering, owner editor controls, data-service save, cosmetics RPC migration.
4. Featured dishes and tags: migration, `get_public_menu`, Menu Studio fields, Popular row and tags on the menu.

Slices 1 and 2 are front-end only. Slices 3 and 4 change SQL and must run the backend checks.

## Assumptions

- Kusina's cover photo and logo are representative; restaurants upload landscape covers.
- The five food patterns are enough for the pilot; more can be added as SVG files without code changes beyond the whitelist.
- Sample photos in the repo remain unlicensed and are not used in production.
