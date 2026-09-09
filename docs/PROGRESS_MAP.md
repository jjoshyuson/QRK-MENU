# Progress map

This file is the high-level route from the current prototype to a production QR menu. It shows sequence, dependencies and exit criteria. `docs/BUILD_STATUS.md` remains the detailed evidence log.

## Current position

`UI prototype -> UI polish -> Business Dashboard UI -> customer ordering UI -> staff operations UI -> integrated same-browser demo -> [next proposed: workstream 3 backend foundation] -> production pilot -> reliability and rollout`

The customer ordering and staff operations workstreams are complete as an integrated same-origin UI-only demonstration. A customer can submit table or pickup orders from `/menu/`; the root staff workspace can receive, progress, verify, complete or cancel them, and store availability updates open customer tabs. Refresh persistence is browser-local only. Physical-device and deeper assistive-technology checks remain. Workstream 3 backend foundation is the exact next proposed milestone and is not authorized by this documentation milestone.

## Milestones

| Stage | Status | Outcome | Depends on | Exit evidence |
| --- | --- | --- | --- | --- |
| 0. Prototype baseline | Complete | Desktop editor plus two-column mobile/tablet menu | None | Existing add/edit/delete, categories, photos, availability and preview flows work in browser memory |
| 0.1 UI polish | Local pass complete | Responsive and accessible prototype remains recognizable | Prototype baseline | Representative viewport and interaction checks recorded in `docs/BUILD_STATUS.md` |
| 0.2 Business Dashboard UI | Local pass complete; approved scope | Cohesive UI for overview, profile, menu, staff, orders/history/sales and settings, including mobile-first Dashboard navigation and quick stock handling | UI polish; confirmed UI-only scope | All sections navigate and representative demo controls, including mobile availability toggles, work without production claims |
| 0.25 Public development review build | Complete | Current prototype is reachable at the existing development URL and unmistakably labeled Development | Business Dashboard UI; explicit deployment approval | Sites version 5 succeeded; remote phone, tablet and desktop checks pass |
| 0.26 Customer-only development route | Complete; published | `/menu/` demonstrates a separate lightweight customer payload and the dashboard links to it | Public development review build | Sites version 7 succeeded; route has no owner bundle or Development badge; remote phone/tablet/desktop and category navigation checks pass |
| 0.27 Customer ordering UI | Complete; approved UI-only scope | Browse/search, configured items, persistent cart, table/pickup checkout, confirmation and status tracking | Customer-only route | Same-browser customer flow handles valid/invalid, sold-out, empty, closed and cancelled states |
| 0.28 Staff order operations UI | Complete; approved UI-only scope | Active/history queues, responsive order detail, progression, token handoff, cancellation and event history | Customer ordering contract | Same-browser staff can operate customer-created orders without backend claims |
| 0.29 Integrated same-browser demo | Complete locally; deployment milestone | Customer and staff tabs share device-local orders and store status with refresh persistence | Customer and staff UI workstreams | End-to-end table completion, pickup cancellation, store status, refresh, 390/768/1280 and console checks pass |
| 1. Workstream 3 backend foundation | Proposed; not authorized | Server-side order/menu foundation, tenant authorization, validation, durable storage and cross-device delivery | Explicit product, provider, security and access decisions | Two physical devices synchronize only through verified server behavior; unauthorized cross-tenant access is denied |
| 2. Public menu and QR | Proposed | Durable public route, draft/publish flow and stable QR destination | Backend foundation and publication rules | Same QR shows a republished price on a second device |
| 3. Assisted import | Proposed | Reviewed AI-assisted extraction from printed menus | Durable draft model; provider/cost/privacy decisions | Real menu photos become a corrected draft without invented data |
| 4. Ordering pilot | Proposed | Guest order submission with staff operating workflow | Public menu; table/payment/abuse-control decisions | Pilot handles duplicate taps, connectivity loss, unavailable items and rejection |
| 5. Reliability and rollout | Proposed | Performance budgets, monitoring, backups, recovery and validated commercial model | Proven pilot | Measured reliability on representative devices/connections and documented operations |

## Immediate path

1. Publish and remotely verify the integrated same-browser UI-only bundle at `/` and `/menu/`.
2. Keep physical iOS/Android, full screen-reader, OS text-scaling and large-dataset checks listed as remaining verification.
3. Do not start workstream 3 until separately authorized.
4. When authorized, plan only the smallest backend foundation needed for tenant-safe durable data, server validation and cross-device order delivery; do not add payments or unrelated roadmap features.

## Cross-cutting constraints

- Keep the public customer experience extremely lightweight.
- Preserve the existing desktop management workspace and mobile/tablet two-column menu direction.
- Use one domain; do not create a separate mobile site.
- Do not claim or expose features before they are implemented and verified.
- Do not select paid providers, deploy, or add credentials without user approval.
- Keep each milestone usable, reviewable and independently verifiable.

## Maintenance

Update this map only when stage status, order, dependencies or exit criteria change. Put detailed test evidence and dated implementation notes in `docs/BUILD_STATUS.md`; put stable project knowledge and routing summaries in `memory/`.
