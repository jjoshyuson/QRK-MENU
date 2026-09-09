# Technical handoff

## Current implementation

The app is static HTML, CSS and vanilla JavaScript with no third-party JavaScript dependencies. Node is only used by the added local preview server. No framework, API or database is present.

| File | Role |
| --- | --- |
| `dist/index.html` | Desktop workspace, mobile workspace and shared dialogs |
| `dist/app.js` | Seed data, state, renderers, dialog handlers and preview sizing |
| `dist/style.css` | Original theme, desktop UI, forms, base responsive styles |
| `dist/devices.css` | Earlier device-preview controls and responsive rules |
| `dist/mobile-menu.css` | Latest mobile photo grid and customer-preview overrides |
| `dist/dashboard.css` | Business Dashboard panels, cards, order/staff/profile/settings UI and responsive dashboard access |
| `dist/menu/index.html` | Standalone customer-only development menu route with static published sample content |
| `dist/menu/menu.css` | Lightweight customer menu layout and responsive two-column photo grid |
| `dist/menu/menu.js` | Category jump and scroll-following state for the customer menu |
| `dist/photo-credits.html` | Sample image credits |

The layered CSS reflects iterative design work. Consolidation is reasonable after verifying behavior, but do not discard later overrides or treat `dist/` as generated output.

## Data and state

Current item fields: `id`, `name`, `description`, `price`, `category`, `options`, `available`, `hidden`, `photo`.

Categories are name strings. Item IDs for additions use `Date.now()`. Photos are local sample paths or temporary data URLs. Rendering is rebuilt from state with HTML escaping applied to text/attributes. This state is not a production data model: use stable database IDs, integer minor units for money, server validation and tenant-scoped queries in the durable implementation.

The root page renders the menu workspaces and Business Dashboard from browser-memory sample state. At phone/tablet widths, CSS opens the responsive Dashboard first; a right-side navigation drawer switches to the separate Menu Studio view. Menu Studio has photo-editor, customer-preview and quick availability-table display states.

The development `/menu/` route is a separate static customer payload and does not ship the owner dashboard/editor bundle. It demonstrates the intended public boundary, but its sample data is authored separately and does not update when the browser-memory owner editor changes. Durable shared menu data and draft/publish synchronization remain unimplemented.

Customer and staff order operations share `localStorage` key `qrk_demo_orders_v1`. Orders use integer minor-unit values and preserve unknown forward-compatible fields when staff changes a status. Supported states are `received`, `preparing`, `ready`, `completed` and `cancelled`; each mutation updates timestamps and appends an event. The customer cart and active-order pointer use `qrk_demo_cart_v1` and `qrk_demo_active_order_v1`. Store availability uses `qrk_demo_store_open_v1`. Same-origin tabs synchronize with browser storage events and local custom events.

This persistence is deliberately browser-local. It survives refresh in the same browser profile but cannot synchronize across physical devices, browsers or origins. Workstream 3 must replace it with server-side storage, validation, tenant authorization and a real-time or polling delivery mechanism before operational use.

Dashboard profile, staff, QR/link, sales, account, password, numbering and session controls remain presentation-only. Order and store-status controls persist only in local browser storage; they do not authenticate, publish, notify, charge, synchronize across devices or communicate with a kitchen.

## Proposed production architecture (not yet selected)

- One domain, owner routes such as `/app/menu`, public route such as `/m/{businessSlug}`.
- Authenticated backend for owner changes; published public reads separated from drafts.
- Relational database for accounts, businesses, menu records and later orders.
- Object storage for owned menu photos with validated resizing/transcoding.
- Server-side image processing and generated responsive image sizes.
- Stable QR target with publication versioning behind it.

Choose a framework and vendors based on the actual deployment environment and cost constraints. No backend provider is mandated by the existing prototype. If migrating to a framework, port the existing UI and interactions incrementally instead of replacing them with a starter design.

## Suggested durable entities

| Entity | Important fields / relationships |
| --- | --- |
| Account | Authentication provider subject and profile |
| Business | ID, name, unique public slug, currency, owner |
| Membership | Account, business, role; only if staff access is needed |
| Menu | Business ID, name, draft/published revision pointers |
| Category | Stable ID, menu ID, name, sort order |
| Item | Stable ID, category/menu/business IDs, name, description, price in minor units, availability, photo key, sort order |
| Menu revision | Validated published snapshot/version and publication timestamp |
| Image asset | Business ID, storage key, dimensions, MIME type, ownership/source metadata |
| Import draft | Business ID, source-image references, extracted fields, uncertainty/review status |
| Order (later) | Business ID, status, idempotency key, table/session context, authoritative totals |
| Order line (later) | Item/variation references plus immutable ordered name/price/options snapshot |

Variations/add-ons are later schema candidates when the pilot requires them. Do not silently treat every item as having variations.

## Production boundaries

- Tenant authorization must be enforced on every private backend request, including image endpoints.
- Hiding edit buttons is not authentication.
- Do not trust browser totals, prices, role flags or availability when accepting orders.
- Validate file content as well as declared MIME type; enforce dimensions/size limits and safe storage keys.
- Serve public menu data without private account details.
- Define concurrent-edit behavior and saved/unsaved/retry states before claiming reliable persistence.
- Cache invalidation must account for prices, availability and publication revisions.
- Offline queued actions need explicit status and duplicate protection; never show a confirmed order before server acceptance.

## Performance direction

Optimize for a very light customer experience. Separate owner and customer code paths, use small responsive compressed photos, reserve image dimensions, lazy-load below-the-fold images and avoid large UI dependencies on the customer route. Self-host permitted font files or use a suitable fallback if eliminating external font requests becomes a requirement.

No measured load-time or stress-test target has been established. Agree on budgets and representative connection/device conditions before claiming performance. Stress tests should use realistic menu-read and later order-submit traffic, including burst patterns, p95 latency, error rate and duplicate handling.

## Existing hosting reference

The archived `deployment/original-hosting.json` contains the original project ID and static directory setting. It has no credentials. It is not active in this portable package. Existing deployment tools may require restoring that file to its original location only when intentionally continuing that same hosted Site with valid access.

The local server is for development only. It binds to loopback by default and provides no authentication, TLS or production hardening.
