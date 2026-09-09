# Progress map

This file is the high-level route from the current prototype to a production QR menu. It shows sequence, dependencies and exit criteria. `docs/BUILD_STATUS.md` remains the detailed evidence log.

## Current position

`UI prototype -> UI polish -> Business Dashboard UI -> [current review gate] -> durable multi-business platform -> public menu and QR -> assisted import -> ordering pilot -> reliability and rollout`

The menu polish pass and complete UI-only Business Dashboard are implemented locally. Phone/tablet now lands on Dashboard, uses a hamburger navigation drawer, and opens Menu Studio as a separate view with photo editing, customer preview and quick availability-table modes. The dashboard represents profile, menu, staff, orders, sales and settings without a backend. Physical-device/accessibility checks remain, and the user has not authorized a durable multi-business implementation.

## Milestones

| Stage | Status | Outcome | Depends on | Exit evidence |
| --- | --- | --- | --- | --- |
| 0. Prototype baseline | Complete | Desktop editor plus two-column mobile/tablet menu | None | Existing add/edit/delete, categories, photos, availability and preview flows work in browser memory |
| 0.1 UI polish | Local pass complete | Responsive and accessible prototype remains recognizable | Prototype baseline | Representative viewport and interaction checks recorded in `docs/BUILD_STATUS.md` |
| 0.2 Business Dashboard UI | Local pass complete; approved scope | Cohesive UI for overview, profile, menu, staff, orders/history/sales and settings, including mobile-first Dashboard navigation and quick stock handling | UI polish; confirmed UI-only scope | All sections navigate and representative demo controls, including mobile availability toggles, work without production claims |
| 0.3 Review gate | Next | User reviews the full local dashboard; remaining physical keyboard, screen-reader, text-scaling and large-category risks are checked as needed | Business Dashboard UI | User accepts the interface or identifies scoped fixes |
| 1. Durable multi-business platform | Proposed; not authorized | Shared login, accounts, tenant-scoped business/menu data, durable photos and save/error states | Review gate; stack and access decisions | Edits survive refresh/device change and cross-business access is denied |
| 2. Public menu and QR | Proposed | Lightweight public route, draft/publish flow and stable QR destination | Durable data and publication rules | Same QR shows a republished price on a second device |
| 3. Assisted import | Proposed | Reviewed AI-assisted extraction from printed menus | Durable draft model; provider/cost/privacy decisions | Real menu photos become a corrected draft without invented data |
| 4. Ordering pilot | Proposed | Guest order submission with staff operating workflow | Public menu; table/payment/abuse-control decisions | Pilot handles duplicate taps, connectivity loss, unavailable items and rejection |
| 5. Reliability and rollout | Proposed | Performance budgets, monitoring, backups, recovery and validated commercial model | Proven pilot | Measured reliability on representative devices/connections and documented operations |

## Immediate path

1. Review the Business Dashboard and separate Menu Studio locally, especially the phone/tablet hamburger navigation, customer-header transition and quick availability table.
2. Decide whether the remaining physical-device/accessibility checks are required before approval.
3. Close the UI review gate or make only scoped polish fixes.
4. When explicitly selected, plan Stage 1 around the smallest viable stack, shared login and tenant-safe data model.

## Cross-cutting constraints

- Keep the public customer experience extremely lightweight.
- Preserve the existing desktop management workspace and mobile/tablet two-column menu direction.
- Use one domain; do not create a separate mobile site.
- Do not claim or expose features before they are implemented and verified.
- Do not select paid providers, deploy, or add credentials without user approval.
- Keep each milestone usable, reviewable and independently verifiable.

## Maintenance

Update this map only when stage status, order, dependencies or exit criteria change. Put detailed test evidence and dated implementation notes in `docs/BUILD_STATUS.md`; put stable project knowledge and routing summaries in `memory/`.
