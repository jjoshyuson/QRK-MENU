# Start the next Codex session

Open this folder in Codex, then paste:

```text
Continue QRK MENU from this existing project. First read AGENTS.md, README.md,
docs/PRODUCT_PLAN.md, docs/UI_AND_FLOWS.md, docs/TECHNICAL_HANDOFF.md, and
docs/BUILD_STATUS.md. Inspect the current source and run the local preview.

The current prototype is the starting point. Keep its desktop menu editor and
the latest mobile/tablet flow: Dashboard opens first, a top-right hamburger
opens navigation, and Menu Studio is a separate page. Menu Studio keeps the
simple two-column customer-shaped photo grid with editing controls, plus a
compact availability table used only for quick Available/Out of stock changes.
Customer view restores the business identity header. Keep the same website;
do not create m.qrkmenu.com or redirect users to another mobile site. Preserve
the existing DM Sans / Manrope typography and QRK orange. Avoid fancy
restaurant landing pages or a squeezed desktop customer menu.

The menu polish and UI-only Business Dashboard milestones are implemented.
Review the dashboard overview, Business profile, Menu Studio, Staff access,
Orders and Settings on desktop, tablet and phone. Fix only concrete layout,
usability and accessibility defects while keeping the product recognizable.

Use the roadmap to track later work, but do not silently add a backend, real
orders, payment flows, or AI API calls during this UI milestone. Where the
plan proposes a technical choice, distinguish it from a confirmed decision.
After review, report the working result and the next persistent multi-business
milestone. Update docs/BUILD_STATUS.md with actual progress,
verification, unresolved issues, and the exact next action.

Do not expose secrets or deploy to the original hosted site as part of this
local handoff. Ask only when an unresolved decision materially affects scope
or creates an external cost; handle routine reversible work yourself.
```

## Later milestone prompt

Once you are happy with the UI, use:

```text
Proceed to the persistent menu-builder milestone in docs/PRODUCT_PLAN.md.
Preserve the current desktop and two-column mobile UI. Start with a short,
concrete implementation plan. Implement business accounts, authenticated
owner access, durable categories/items/photos, and a separate public
read-only customer menu on the same domain. Follow the technical proposal
only where it still fits the environment; document any chosen stack and
tradeoffs. Prove that one business cannot access another business's data.
Implement draft versus published menu behavior and a stable QR destination.
Do not enable real ordering or payments in this milestone.
```

This second prompt is a suggested next task, not authorization already given to the agent by the first prompt.
