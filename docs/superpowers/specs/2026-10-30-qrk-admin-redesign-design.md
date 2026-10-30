# QRK Admin redesign — design

Status: design approved in chat (Direction B), spec awaiting review. No product code has changed.

Concept canvas (private): https://claude.ai/artifact/5p3eALU2bQHbmpUrAaggir — artboard "B · Dark rail + client cards" is the chosen direction. A and C are rejected.

This spec narrows `2026-10-13-qrk-redesign-design.md` to the QRK Admin route (`/admin/`) and supersedes its Admin section.

## What the owner asked for

- A complete redesign of QRK Admin; the current look is "ugly".
- Direction B: slim dark icon rail, warm light page, Overview with stat cards, clients as cards.
- Include a "first login pending" status for Client Admins who have not replaced their temporary password.

## Scope

In scope:
1. Visual redesign of every `/admin/` screen: sign-in gate, Overview, Clients, Client Admins, Appearance, client dialog, service sheets, credential handoff dialog, toast.
2. A new Manage sheet per client that holds the secondary actions removed from rows.
3. Search and filter on Clients.
4. A read-only first-login status from the local preview credential bridge.
5. Phone, tablet and desktop layouts; light and dark.

Out of scope: hosted (Supabase) first-login status, new client fields (logos, cover photos, colours), Client Staff management, changes to the business workspace or customer menu, the landing pages.

## Behavior that must not change

Acceptance requirements. The redesign changes how these look and where they sit, not what they do.

- Preview gate: Continue to local preview, the OAuth-bypass warning, Exit preview / Log out.
- Add client and Configure: the client form, service presets, the service builder and its sheets (Business details, Business services, Quick settings, Table settings, Client Admin), draft capture/restore on sheet cancel, form validation and errors.
- Credential handoff: temporary password shown once, copy actions, copy client login.
- Per-client actions: Preview as admin (or Client sign-in when hosted), Open client login, Customer view, Reset temporary password, Configure, Pause / Activate.
- Hosted mode keeps hiding actions it hides today.
- Client Admins never manage Client Staff from here.
- Appearance: four light and four dark presets, global Light/Dark switch, advanced 13-token editors per mode, Reset, live preview, `qrk_global_theme_v1` sharing.
- Client data stays in browser storage via the existing `readClients` / `saveClients`.
- Skip link, focus restoration for dialogs and sheets, Escape and backdrop close.

## Visual design

### Tokens

Defined once in `dist/admin/admin.css` on `.platform-admin-body`, with a dark override driven by the existing global theme mode. Accent comes from the existing global theme variables (`--brand-500` and its foreground), not a literal.

| Token | Light | Dark |
|---|---|---|
| `--admin-page` | `#F3F2EF` | `#0E1012` |
| `--admin-surface` / `--admin-surface-2` | `#FFFFFF` / `#F0EFEC` | `#171A1D` / `#1F2327` |
| `--admin-ink` / `--admin-muted` | `#14161A` / `#5F636A` | `#F1F1EF` / `#A2A7AC` |
| `--admin-rail` / `--admin-rail-active` | `#111316` / `#262A30` | `#08090A` / `#1F2327` |
| `--admin-strong` (black pills, dark stat card) | `#14161A` | `#F1F1EF` (text inverts) |
| `--admin-warn-bg` / `--admin-warn-fg` | `#FFF1DB` / `#7A4B00` | `#3A2A0E` / `#FFD58A` |
| `--admin-ok-bg` / `--admin-ok-fg` | `#E7F6EC` / `#17663A` | `#12301E` / `#8FE0AE` |
| `--admin-danger-bg` / `--admin-danger-fg` | `#FDECEA` / `#B3261E` | `#3A1512` / `#FFB4AB` |
| `--admin-radius-card` / `--admin-radius-control` | 20px / 999px | same |
| `--admin-shadow` | `0 1px 2px rgb(0 0 0 / .05), 0 8px 24px rgb(20 22 26 / .04)` | `0 0 0 1px rgb(255 255 255 / .06)` |

All text pairs hold 4.5:1. Type is Manrope (already loaded); numbers use `tabular-nums`.

### Shell

- Desktop and tablet (>720px): 76px fixed icon rail on the left. Top: 40px accent logo tile. Then Overview, Clients (with count badge), Client Admins, Appearance as 48px icon links, active one on `--admin-rail-active`. Bottom: Log out. Each link has a visible-on-hover/focus tooltip and an `aria-label`; the current view has `aria-current="page"`.
- Phone (≤720px): the rail becomes a fixed bottom tab bar (icon + short label, safe-area padded). The existing hamburger drawer (`#platform-menu-toggle`) is removed.
- Page header on every view: small muted line, 32px/800 title, a "Local preview" warn pill (replaces the full-width development notice, which keeps its text as the pill's tooltip and in the gate), primary action on the right where the view has one.
- Content max width 1200px, 40px padding (20px on phone).

### Overview

- Header: "Overview", primary black pill **Add client**.
- Three stat cards in a row (stack on phone):
  1. **Live portals** — dark card (`--admin-strong`): active count, "of N active", one segment per client (accent = active, muted = paused).
  2. **Needs attention** — count of paused clients plus Client Admins with first login pending; lists up to three business names; "All clear" in `--admin-ok-fg` at zero.
  3. **Service mix** — stacked bar by service label computed from each client's service profile (Quick, Table, Quick + Table, and preset names such as Buffet or Package), with a legend of counts.
- "Clients" heading with "View all N" link to Clients, then the six most recently created clients as cards (below).

### Client card

- 20px card. Top 54px band coloured from the business name (a stable hash into a fixed palette of eight muted colours that all hold 4.5:1 for the white initial text). A 44px white circle overlaps the band edge showing the business initial.
- Status pill top-right on the band: Active (ok), Paused (muted), First login pending (warn). Paused takes precedence.
- Body: name 16/800; muted line "service · location · `prefix.`".
- Actions: **Open as admin** (black pill, flex 1; "Client sign-in" when hosted) and **Manage** (surface-2 pill). Both ≥44px tall on touch.
- Paused cards render at 70% opacity except the actions.

### Clients view

- Header: "Clients", **Add client**.
- Toolbar: search field (filters by business name, prefix or admin name, live) and filter pills: All, Quick, Table, Paused, Needs attention — each with a count. One active at a time.
- Grid: 3 columns ≥1100px, 2 columns ≥720px, 1 column below.
- Empty states: no clients ("Add your first client" + button); no match ("No clients match" + Clear filters).

### Manage sheet

A right-side sheet (bottom sheet on phone) using the same sheet primitive and focus/Escape handling as the existing `#client-sheet`, opened from **Manage**.

- Header: the card band and initial, business name, status pill, close button.
- **Client Admin** group: name, email, username, first-login status, **Reset temporary password** (opens the existing credential dialog).
- **Portal** group: staff login prefix, service label, **Open client login**, **Customer view**, **Configure** (opens the existing client dialog).
- **Danger** row, separated: "Pause this client — staff and customers lose access until you reactivate it." with **Pause** (danger) or **Activate** (accent) for paused clients.

Every action keeps its existing handler; only its location moves.

### Client Admins view

- One card holding a row per admin: 36px initials avatar, name and email, business, `username` (monospace), status pill (Active / First login pending / Paused business), **Reset password** outline pill.
- Below 720px rows stack: avatar + name line, then business and username, then the button full width.

### Appearance

Same controls, regrouped into cards: **Mode** (Light/Dark segmented control), **Presets** (light and dark preset swatches as selectable tiles), **Advanced** (the two 13-token editors, collapsed by default as today), **Reset**. Styling only.

### Dialogs, sheets and gate

- Client dialog, service sheets and credential dialog adopt the tokens: 24px radius, surface background, grouped fields on surface-2, pill buttons, warn pill for the "shown once" notice.
- Sign-in gate: centred light card on the page colour, accent logo tile, title, one-line description, black **Continue to local preview** pill, and the existing development warning as a warn-tinted block.
- Toast: dark pill at bottom centre (above the phone tab bar).

### Motion

| Event | Motion | Duration |
|---|---|---|
| View change | content fades and rises 8px | 200ms |
| Cards first render | staggered rise | 300ms, ≤240ms total delay |
| Manage sheet | slides in from right (up on phone), backdrop fades | 260ms / 200ms |
| Press | buttons and cards scale to .98 | 120ms |

`prefers-reduced-motion: reduce` disables all of these.

## First-login status

- New loopback-only endpoint in `scripts/serve.mjs`: `GET /__qrk/preview-auth/accounts` returns `{accounts:[{username, mustChangePassword, active}]}`. No hashes, salts, emails or tokens. Same `loopback(req)` guard as the other preview-auth routes.
- `scripts/preview-auth.mjs` gains `accountStatuses()` returning that list from the stored users.
- `dist/data/qrk-auth-service.js` gains `previewAccountStatuses()` calling the bridge (`GET`), returning `null` when the bridge is unavailable or in hosted mode.
- Admin loads statuses once on render and after any provision or reset; matches by Client Admin username. Unknown (null) shows no pill rather than guessing.
- Browser-only preview users (no bridge) read `mustChangePassword` from `previewUsers()`.

## Files

- `dist/admin/index.html` — new shell markup (rail, header, views, Manage sheet), development notice reduced to the pill.
- `dist/admin/admin.css` — rewritten around the tokens above; old `.platform-*` rules that no longer apply are deleted.
- `dist/admin/admin.js` — `clientRow` becomes `clientCard`; new overview stats, filters/search, Manage sheet open/close; `adminRow` restyled; handlers reused.
- `scripts/preview-auth.mjs`, `scripts/serve.mjs`, `dist/data/qrk-auth-service.js` — first-login status, as above.

## Testing

- `npm run check` passes.
- New `tests/admin-actions.mjs`: renders the admin markup against sample clients and asserts every per-client action (preview as admin, client login, customer view, reset, configure, pause/activate) is reachable from the card or the Manage sheet, filter counts match the data, and Needs attention counts paused clients plus pending first logins.
- `tests/preview-auth.mjs` extended: `accountStatuses()` returns no secret fields; flips to `mustChangePassword:false` after `changePassword`.
- Browser check at 1366, 768 and 390 widths, light and dark: gate, Overview, Clients (search, each filter), Manage sheet (every action), Client Admins, Appearance (preset switch, mode switch), Add client end to end, reset password handoff. Screenshots saved to `review-assets/admin-*.png`.
