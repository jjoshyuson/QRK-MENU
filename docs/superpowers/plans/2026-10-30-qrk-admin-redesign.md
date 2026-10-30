# QRK Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle and restructure `/admin/` as Direction B (dark icon rail, warm page, stat-card Overview, client cards, Manage sheet) and add a read-only first-login status from the local credential bridge.

**Architecture:** Pure rendering and data helpers move out of the browser-only `dist/admin/admin.js` into a new ES module `dist/admin/admin-view.js` that Node tests import directly (the pattern `dist/data/qrk-workspace-section.js` uses). `admin.js` keeps every event handler, which already delegates by `data-*` attributes and `closest('[data-client-id]')`, so markup moves without handler changes. `admin.css` is rewritten around `--admin-*` tokens.

**Tech Stack:** Static HTML, CSS, vanilla ES modules; Node ≥18 `node:assert` tests run by `npm run check`; local server `scripts/serve.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-30-qrk-admin-redesign-design.md`

## Global Constraints

- Work on branch `codex/qrk-full-redesign` in `QRK-Redesign`. Never stage the uncommitted customer-menu files (`dist/menu/*`, `tests/device-order-history.mjs`, `tests/menu-motion.mjs`, `tests/open-tab-flow.mjs`, `review-assets/menu-*`). Stage files by path, never `git add -A`.
- Every behavior in the spec's "Behavior that must not change" list keeps its current handler in `admin.js`.
- Paused clients keep today's rule: no Open client login and no Reset temporary password action.
- Keep the existing button label "Preview as admin" (and "Client sign-in" when `hosted`); `tests/service-builder.mjs` asserts it. The spec's "Open as admin" was concept copy.
- Colours only through `--admin-*` tokens defined on `.platform-admin-body` (values verbatim from the spec's token table) or the global `--brand-500` / brand foreground. No new literal colours in rules.
- Text pairs hold 4.5:1; touch targets ≥44px; Manrope; `tabular-nums` on numbers.
- Breakpoints: phone ≤720px (bottom tab bar, 1-column), tablet 721–1099px (2 columns), desktop ≥1100px (3 columns).
- `prefers-reduced-motion: reduce` disables every animation and transition added.
- The accounts endpoint never returns password hashes, salts, emails or tokens.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- A client whose Client Admin username has no bridge record (older or browser-only clients) → no first-login pill and not counted in Needs attention; nothing throws. Test in Task 1.
- Business names with HTML characters or quotes (`Kain & "Inom" <b>`) → escaped in cards, sheet, admin rows and search. Test in Task 1.
- Search with leading/trailing spaces or different case (`"  KUSINA "`) matches; a filter plus a query with zero matches yields an empty list, not all clients. Test in Task 1.
- Bridge unavailable (server without `/__qrk/`, hosted mode) → `previewAccountStatuses()` returns `null`, Admin renders with no first-login pills. Test in Task 2.
- Pausing a client from the Manage sheet while it is open → sheet re-renders to show Activate and hides Open client login / Reset; the card updates behind it. Checked in Task 4's browser step.

---

### Task 1: Pure admin view module

**Files:**
- Create: `dist/admin/admin-view.js`
- Create: `tests/admin-actions.mjs`
- Modify: `package.json` (`check` script: add `node --check dist/admin/admin-view.js` beside `admin.js`, and `node tests/admin-actions.mjs` after `tests/service-builder.mjs`)
- Modify: `tests/service-builder.mjs` (read `admin.js` and `admin-view.js` and assert against their concatenation, since card markup moves)

**Interfaces:**
- Consumes: client records as stored today: `{id, businessName, slug, prefix, status:'active'|'paused', serviceProfile, admin:{name,email,username,access?}, createdAt?}`; `normalizeServiceProfile` and `SERVICE_PRESETS` (import them from wherever `admin.js` imports them now).
- Produces (all named exports):
  - `esc(value) -> string` (moved from `admin.js`; `admin.js` imports it).
  - `serviceLabel(client) -> string` — `'Quick + Table'` when both modes, else the preset name (today's `clientRow` logic).
  - `bandColor(name: string) -> string` — stable hash into `BAND_COLORS`, an exported array of eight hexes: `#C8553D #2F6F5E #3A4A7A #8A6A3B #A23B2A #5B4B8A #2D5D7B #6B7A2F`.
  - `clientStatus(client, statuses: Map<string,{mustChangePassword:boolean}>|null) -> 'paused'|'pending'|'active'` — paused wins; `pending` only when the admin username is in `statuses` with `mustChangePassword:true`.
  - `overviewStats(clients, statuses) -> {total, active, paused, pending, attention:string[] /* business names, max 3 */, attentionCount, mix:[{label,count}] /* sorted desc */}`.
  - `filterClients(clients, {query='', filter='all'}, statuses) -> client[]` — `filter` ∈ `all|quick|table|paused|attention`; query trimmed, case-insensitive against businessName, prefix, admin.name.
  - `filterCounts(clients, statuses) -> {all, quick, table, paused, attention}`.
  - `clientCard(client, {hosted, statuses}) -> string` — `<article class="admin-client-card" data-client-id>` with band, initial, status pill, name, meta line, `[data-open-client]` button and `<button data-manage-client>Manage</button>`.
  - `manageSheetBody(client, {hosted, statuses}) -> string` — wrapper carries `data-client-id`; groups Client Admin (name, email, username, status, `[data-reset-client-password]` "Reset temporary password" when active), Portal (prefix, service, `<a href="/?client-login=1" target="_blank" rel="noopener">Open client login</a>` when active, `<a href="/menu/?business=…">Customer view</a>`, `[data-configure-client]` "Configure"), Danger (`[data-toggle-client]` "Pause" or "Activate").
  - `adminRow(client, statuses) -> string` — `<article class="admin-account-row" data-client-id>` with avatar initials, name/email, business, username, status pill, `[data-reset-client-password]` "Reset password".

- [ ] **Step 1: Write the failing test** `tests/admin-actions.mjs` importing the module with sample clients (one Quick active, one Table active with username `salo-admin`, one Quick + Table paused, one named `Kain & "Inom" <b>`) and `statuses=new Map([['salo-admin',{mustChangePassword:true}]])`. Assertions:
  - `bandColor('Salamat')===bandColor('Salamat')` and is in `BAND_COLORS`.
  - `clientStatus` returns `paused` for the paused client even if its username is pending; `pending` for Salo; `active` when `statuses` is `null` or lacks the username.
  - `overviewStats`: `total 4, active 3, paused 1, pending 1, attentionCount 2`; `mix` counts sum to 4.
  - `filterClients(clients,{query:'  SALO '})` → only Salo; `{filter:'paused',query:'salo'}` → `[]`; `{filter:'attention'}` → paused + Salo.
  - `filterCounts` matches the lengths of each `filterClients` result.
  - For each active client, `clientCard + manageSheetBody` contains `data-open-client`, `data-manage-client`, `Open client login`, `Customer view`, `data-reset-client-password`, `data-configure-client`, `data-toggle-client`, and `Pause`; for the paused client it lacks `Open client login` and `data-reset-client-password` and contains `Activate`.
  - `clientCard(..., {hosted:true})` contains `Client sign-in`, not `Preview as admin`.
  - The `Kain & "Inom" <b>` client's card, sheet and admin row contain `Kain &amp; &quot;Inom&quot; &lt;b&gt;` and no raw `<b>`.

- [ ] **Step 2: Run** `node tests/admin-actions.mjs` — Expected: FAIL, cannot find module `dist/admin/admin-view.js`.

- [ ] **Step 3: Implement** `dist/admin/admin-view.js` with the exports above. `bandColor`: sum of char codes × 31 rolling, modulo 8.

- [ ] **Step 4: Update `tests/service-builder.mjs`** so its `js` is `admin.js + admin-view.js`.

- [ ] **Step 5: Run** `node tests/admin-actions.mjs && node tests/service-builder.mjs` — Expected: both exit 0.

- [ ] **Step 6: Commit** `dist/admin/admin-view.js tests/admin-actions.mjs tests/service-builder.mjs package.json` — "feat(admin): pure view module for cards, stats and filters".

### Task 2: First-login status from the credential bridge

**Files:**
- Modify: `scripts/preview-auth.mjs` (add `accountStatuses` to the store returned by `createPreviewAuthStore`)
- Modify: `scripts/serve.mjs:36` (new GET route, before the `req.method!=='POST'` guard)
- Modify: `dist/data/qrk-auth-service.js` (new method)
- Test: `tests/preview-auth.mjs`

**Interfaces:**
- Produces:
  - `store.accountStatuses() -> Promise<{username:string, mustChangePassword:boolean, active:boolean}[]>`.
  - `GET /__qrk/preview-auth/accounts` → `200 {accounts: [...]}`, loopback only (existing `loopback(req)` guard covers it).
  - `authService.previewAccountStatuses() -> Promise<Map<string,{mustChangePassword:boolean,active:boolean}>|null>` — `null` when not `local`/`preview` environment or the fetch fails/non-200. When the bridge is unavailable, builds the map from `previewUsers()` instead.

- [ ] **Step 1: Extend `tests/preview-auth.mjs`**: after provisioning, `accountStatuses()` includes `{username:'rnl.rnl', mustChangePassword:true, active:true}`; every entry's keys are exactly `['active','mustChangePassword','username']`; after the existing `changePassword` call the entry is `mustChangePassword:false`.
- [ ] **Step 2: Run** `node tests/preview-auth.mjs` — Expected: FAIL, `store.accountStatuses is not a function`.
- [ ] **Step 3: Implement** `accountStatuses` (map over `readState().users`, pick the three fields), the serve route, and `previewAccountStatuses` (use `fetch('/__qrk/preview-auth/accounts')` directly, since `bridge()` posts; wrap in try/catch → fallback/`null`).
- [ ] **Step 4: Run** `node tests/preview-auth.mjs && node --check scripts/serve.mjs && node --check dist/data/qrk-auth-service.js` — Expected: exit 0.
- [ ] **Step 5: Run** with the server up: `curl -s http://127.0.0.1:4190/__qrk/preview-auth/accounts` — Expected: JSON with `accounts`, no `hash`/`salt`/`email` keys.
- [ ] **Step 6: Commit** the four files — "feat(admin): read-only first-login status from preview credentials".

### Task 3: Shell, tokens, Overview and Clients

**Files:**
- Modify: `dist/admin/index.html` (rail, page header, Overview, Clients toolbar and grid, Manage sheet container; development notice → header pill; remove `#platform-menu-toggle` and drawer markup)
- Modify: `dist/admin/admin.css` (rewrite: tokens, rail, phone tab bar, header, stat cards, client card, grid, toolbar, empty states, gate, toast; delete rules for removed `.platform-*` selectors)
- Modify: `dist/admin/admin.js` (`render`, `showView`, remove `setNavigationOpen`, import from `admin-view.js`, search/filter state, statuses loading)
- Modify: `dist/ui-components.js:30` (registry: replace `.platform-client-row` with `.admin-client-card`, label "Client card"; `.platform-account-row` → `.admin-account-row`) and `tests/component-source.mjs` (same selector rename)

**Interfaces:**
- Consumes: Task 1 exports; Task 2 `authService.previewAccountStatuses()`.
- Produces: module-level `let statuses=null` refreshed by `async function refreshStatuses()` (called on load and after provision/reset, then `render()`); `let clientQuery=''`, `let clientFilter='all'`; elements `#overview-stats`, `#recent-client-list`, `#client-list`, `#client-search`, `[data-client-filter]` pills, `#client-empty`, `#manage-sheet`, `#manage-sheet-body`, `#manage-sheet-backdrop` (used by Task 4).

- [ ] **Step 1: Markup** in `index.html` per the spec's Shell, Overview and Clients sections. Rail links keep `data-admin-view` and get `aria-label`, a tooltip `<span class="admin-rail-tip">`, and `aria-current` set by `showView`. Keep `#platform-content`, skip link, gate and dialog IDs unchanged.
- [ ] **Step 2: CSS** in `admin.css`: tokens from the spec table on `.platform-admin-body` and dark values under the global theme's dark selector (use whatever selector `global-theme.js` sets today; read it, don't invent one). Rail 76px fixed; ≤720px becomes a bottom bar with `padding-bottom: env(safe-area-inset-bottom)`. Card radius 20px, pills 999px, shadow token.
- [ ] **Step 3: JS** `render()`: Overview stat cards from `overviewStats` (Live portals segments, Needs attention list or "All clear", Service mix bar widths as percentages); recent = six newest by `createdAt` (fallback array order, newest last); Clients grid from `filterClients`; pill counts from `filterCounts`; empty states "Add your first client" / "No clients match" with a `[data-clear-filters]` button. Search `input` event updates `clientQuery` and re-renders the grid only.
- [ ] **Step 4: Run** `npm run check` — Expected: exit 0.
- [ ] **Step 5: Browser check** at 1366×860, 768×1024 and 390×844 (light): gate → Continue; Overview shows real counts; Clients search `"  KUSINA "` shows one card; each filter pill count equals cards shown; rail tooltips visible on keyboard focus; phone shows the bottom tab bar and no horizontal scroll.
- [ ] **Step 6: Commit** `dist/admin/index.html dist/admin/admin.css dist/admin/admin.js dist/ui-components.js tests/component-source.mjs` — "feat(admin): dark rail shell, stat overview and client cards".

### Task 4: Manage sheet

**Files:**
- Modify: `dist/admin/admin.js`, `dist/admin/admin.css`, `dist/admin/index.html`

**Interfaces:**
- Consumes: `manageSheetBody`; `#manage-sheet*` elements from Task 3; `window.QrkSheet.create` (as used for `#client-sheet`).
- Produces: `openManageSheet(id)`, `closeManageSheet()`; module `let managedClientId=null`. `render()` re-renders `#manage-sheet-body` when `managedClientId` is set.

- [ ] **Step 1: Implement**: `[data-manage-client]` click → `openManageSheet(closest('[data-client-id]').dataset.clientId)` using a second `QrkSheet.create` controller (focus restore to the Manage button, Escape and backdrop close). Configure from the sheet closes the sheet first, then opens the existing client dialog. Sheet slides from the right ≥721px, from the bottom ≤720px.
- [ ] **Step 2: Run** `npm run check` — Expected: exit 0.
- [ ] **Step 3: Browser check**: from Kusina's Manage sheet, each action works — Preview as admin opens the workspace, Open client login opens a new tab, Customer view navigates, Reset shows the credential dialog with a new password, Configure opens the dialog prefilled. Pause while the sheet is open → sheet shows Activate, hides Open client login and Reset; card behind shows Paused. Activate restores both. Escape closes and focus returns to Manage.
- [ ] **Step 4: Commit** the three files — "feat(admin): Manage sheet holds secondary client actions".

### Task 5: Client Admins, Appearance, dialogs and motion

**Files:**
- Modify: `dist/admin/index.html`, `dist/admin/admin.css`, `dist/admin/admin.js`

**Interfaces:**
- Consumes: `adminRow(client, statuses)` from Task 1.

- [ ] **Step 1: Implement** per the spec: Client Admins list in one card (stacking ≤720px); Appearance regrouped into Mode, Presets, Advanced, Reset cards without changing input names, IDs or `initializeThemeEditor`; client dialog, service sheets and credential dialog on tokens (24px radius, surface-2 field groups, warn pill for "shown once"); motion table from the spec, all inside `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 2: Run** `npm run check` — Expected: exit 0.
- [ ] **Step 3: Browser check** light and dark at 1366 and 390: Client Admins Reset password works and shows a pending pill afterwards; Appearance preset and Light/Dark switches still apply live and persist after reload; Add client end to end shows the credential handoff and the new card appears with First login pending; reduced motion (emulate) shows no animation.
- [ ] **Step 4: Commit** the three files — "feat(admin): restyle Client Admins, Appearance and dialogs".

### Task 6: Final verification and notes

**Files:**
- Create: `review-assets/admin-{overview,clients,manage,admins,appearance,gate}-{1366,390}-{light,dark}.png` (the `QRK-Redesign/review-assets/` folder)
- Modify: `memory/ui.md` (replace the `/admin/` bullet with the new structure: rail, Overview stats, client cards, Manage sheet, first-login status source)

- [ ] **Step 1: Run** `npm run check` — Expected: exit 0.
- [ ] **Step 2: Capture** the screenshots above and check contrast of pills and muted text in dark mode.
- [ ] **Step 3: Commit** `memory/ui.md` and the `review-assets/admin-*` files — "docs(admin): redesign notes and review captures".
