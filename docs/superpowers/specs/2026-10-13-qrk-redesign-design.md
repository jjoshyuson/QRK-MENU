# QRK full redesign — proposed design

Status: proposed for user review; product implementation has not begun.

## Intent and baseline

The user requested a separate QRK checkout on the Ubuntu laptop, a code review and refactor, and a full interface redesign similar to the work on RNL. The goal is a coherent, maintainable digital-menu and restaurant operations product. Existing menu, ordering, permission and tenant flows remain acceptance requirements.

Baseline: `origin/main` at `d29fdfff1e6f7feb5cbce2e47d45b637d9919562`. Worktree: `QRK-Redesign`; branch: `codex/qrk-full-redesign`; local preview: port 4187. The previous checkout under RNL contains local changes and remains untouched.

Assumptions: retain QRK branding and the HTML/CSS/vanilla JavaScript stack; use RNL's consistent spacing, neutral hierarchy and outline-icon treatment as principles, while respecting QRK's compact operational style. Work stays local until publishing is requested.

## Initial review evidence

- `npm run check` passed on the fresh checkout, including backend static validation. This does not verify hosted data, payments, physical devices or complete browser interactions.
- `dist/app.js` is 100,870 bytes, `dist/menu/menu.js` is 69,640 bytes, and `dist/admin/admin.js` is 46,147 bytes. Many functions are compressed onto long lines, making state changes and rendering harder to inspect.
- Owner navigation, Menu Studio, settings and operational orders share `dist/app.js`. Customer item configuration, cart, checkout and table behavior share `dist/menu/menu.js`.
- Owner markup loads multiple overlapping stylesheets, including `reference-theme.css`, `modern-compact.css`, and `co-interface-renovation.css`. Consolidation needs visual comparison before removing rules.
- The development shortcut opens a 50-item Kusina workspace, while Dashboard's Menu health remains the hard-coded `5 / 6` in `dist/index.html`. The dashboard labels its figures as sample data, but these counts should agree or be explicitly distinguished.
- Some UI checks, including `tests/focused-bottom-sheet.mjs` and `tests/menu-performance.mjs`, assert source patterns. Add behavior verification at the flows affected by refactoring; avoid treating those source checks as end-to-end coverage.
- The customer menu and owner development entry were opened successfully in the browser. Responsive and full interaction validation remain implementation work.

## Approach options

1. **Recommended: incremental redesign and refactor.** Build on shared tokens and controls, migrate one surface at a time, and verify each flow. This supports a substantial visual change while keeping regression scope reviewable.
2. Visual reskin first. Faster initial screenshots, but retains tangled rendering and styling and creates more work later.
3. Framework rewrite. Changes the stack and expands migration risk without a demonstrated product need.

## Interface direction

### Shared foundation

Use a consistent spacing scale, semantic light/dark colors, Manrope for both interface and customer menu typography, and the existing outline icons. Use restrained fills and dividers; cards represent meaningful actions or states. Reserve accent colors for actions and status. Keep 44px interactive targets, visible keyboard focus and readable contrast. Maintain the shared component registry and `/components/` specimens whenever reusable controls change.

### Owner and staff workspace

Desktop uses persistent compact navigation and a continuous working surface. Phone and tablet prioritize Dashboard and daily tasks. Rework Dashboard, Orders/Tables, Menu Studio, Business Profile, Staff Access and Settings with one hierarchy and consistent controls. Dashboard metrics must derive from the relevant available state or carry accurate sample labels. Preserve staff permission filtering and business-scoped workspace restoration.

Orders prioritize actionable queues, status labels and table context. Menu Studio preserves item/category management, option inheritance, image handling, availability, hidden items and customer preview. Settings preserve compact grouped rows and focused draft-edit sheets with Done, cancel and focus restoration.

### Customer menu

Keep each business's identity and imagery. Prioritize dish names, prices, photos, persistent search/category access and a clear cart summary. Preserve item configuration and special requests, editing from Review Order, fulfillment/payment choices, Quick and Table capabilities, Open Tab, order history and confirmation. Keep the customer route independent of owner code. Changes to checkout sequencing require a separate product decision.

### Platform admin and marketing

Apply the same operational control language to client lists, provisioning previews and service configuration. Preserve the existing service-gate contract. Redesign landing, Quick and Table pages around the existing product claims and assets; do not imply unverified payment, offline or production capabilities.

## Code structure and data flow

Refactor around responsibilities that already exist: owner navigation, menu editing, settings sheets and orders; customer catalog rendering, item configuration, cart and checkout coordination; admin rendering and client/service configuration. Introduce focused modules with small explicit interfaces only where they reduce shared-state coupling. Format the affected code before or alongside extraction so the diff remains reviewable.

Keep provider operations behind the current adapters. UI actions update a draft or domain state, validation returns an actionable result, the existing adapter performs persistence, and rendering reflects the result. Keep business/user identity explicit in storage and access operations. A redesign must not change SQL schemas, hosted configuration or RNL integration contracts by implication.

Consolidate CSS by migrating one control or surface at a time into shared semantic tokens and its route styles, then remove superseded rules after comparison. Avoid adding another global override layer.

## Errors and interaction states

Every affected flow retains loading, empty, unavailable, validation-error and save-failure states. Failed saves preserve the user's draft and offer retry; prevent duplicate submissions. Sheet cancellation discards drafts and restores focus. Status is communicated by text or symbols as well as color. Preserve safe-area spacing, scroll position and reduced-motion behavior.

## Delivery order

1. Shared controls and owner navigation/Dashboard as the first visual slice.
2. Owner Menu Studio, Profile and Settings; orders/tables and staff tools.
3. Customer catalog, item sheets and cart; then capability-specific checkout and history.
4. Platform admin and marketing pages.
5. Remove superseded CSS and finish module extraction across the touched flows.

The full scope remains the intended outcome. Each slice should be reviewable in the same local preview and committed separately. Backend feature work and deployment are separate from this redesign.

## Acceptance and verification

- Run the repository checks for each shared-behavior candidate and review the diff.
- Exercise changed browser flows at representative phone, tablet and desktop widths, in light and dark modes.
- Check keyboard navigation, focus trapping/restoration, Escape/cancel/Done, text reflow, overflow, contrast and reduced motion.
- Check owner item/category edits, availability, image updates and preview refresh without crossing business state.
- Check customer item options, totals, cart edits/removal, back navigation, fulfillment, cancellation, order history and the applicable Table/Open Tab states using isolated local fixtures.
- Confirm permission-aware navigation and business switching still use the existing access checks.
- Compare before/after screenshots. Record precisely what was verified; static checks cannot substantiate hosted or cross-device claims.

## Next step

User review of this proposed direction, followed by a concrete implementation plan. No product code, production data or deployment has been changed.
