# QRK Quick and Table master plan

## Objective

Extend the current QRK web app into one shared platform with two configurable operating modes:

- **QRK Quick:** Scan → Order → Pay or choose payment method → Receive order → Done.
- **QRK Table:** Scan table QR → Open or resume table session → Order → Send service requests → Add orders → Request bill → Close session.

This is not authorization to create separate products, dashboards, menu systems, databases, brands, or customer bundles. Menus, business accounts, authentication, staff permissions, orders, branding, analytics foundations, and future integrations remain shared.

## Current baseline

The repository already contains a responsive vanilla HTML/CSS/JavaScript web app, a customer-only `/menu/` route, menu editing, configured items, cart and checkout, device-local customer/staff ordering, order tracking, staff order operations, local Auth/permissions, client branding, and a provider-ready Supabase/PostgreSQL foundation.

The current app is closest to an early QRK Quick demonstration. It does not yet have payments, trusted table QR identity, persistent table visits, open tickets, Quick Requests, a service queue, request analytics, or hosted cross-device verification.

The current Menu Studio control named **Table view** means a compact stock-management list. It must be renamed **Availability view** before QRK Table appears in the product UI.

## Shared product contract

Use a service-model default plus capability flags. UI and API behavior should depend primarily on capabilities so QRK can expand without another rewrite.

```js
serviceMode: "quick" | "table"

capabilities: {
  ordering: true,
  onlinePayment: false,
  tableSessions: false,
  quickRequests: false,
  openTicket: false,
  kioskMode: true,
  posIntegration: false
}
```

Service settings are location-owned with inherited business defaults. A location may override the defaults without creating a separate product or implementation. This direction was approved on September 13, 2026.

The first preset catalog is Quick/counter, traditional Table, traditional prepaid, bundled buffet paid later, bundled buffet hybrid, bundled buffet upfront, café/bar tab, and custom Table. Presets copy editable defaults into a capability-based service profile; changing a preset must not silently overwrite later client customization.

Approved Table defaults for the current prototype are: table-specific QR, staff acceptance, a named Order Host, host-approved additional devices, required display names, one pending or active table session per device per business, optional proximity screening with staff recovery, and staff override. Whether the host approves every guest order or only chargeable guest orders is the next contract-review decision.

## Team and worktree ownership

### UI implementation task

- Implement visual changes inside the existing design system and vanilla stack.
- Rename Menu Studio Table view to Availability view.
- Build reusable, mode-aware customer and staff surfaces after the shared contract is agreed.
- Preserve QRK branding, typography, responsive layouts, menu flows, and lightweight payloads.
- Verify 390, 768, and 1280 CSS-pixel layouts and capture screenshots/evidence.
- Check touch sizing, spacing, focus visibility, contrast, keyboard use, content reflow, errors, and reduced motion.

The UI task must not invent business rules, database fields, payment providers, or a parallel state store.

### UX and product-flow task

- Define Quick and Table journeys, information hierarchy, labels, acceptance criteria, and recovery paths.
- Define table-session start, resume, expiry, bill-request, and closure proposals without marking unresolved policy as approved.
- Define Quick Request discovery, submission, confirmation, status feedback, cancellation policy, and history.
- Define the staff service queue, waiting-time priority, status actions, table detail, and settings presentation.
- Review UI output for speed, clarity, accessibility, and consistency.

The UX task may create documentation and low-risk prototypes, but it must not create a competing production implementation of shared contracts.

### Backend and integration task

- Define location-ready service-mode and capability storage.
- Add or plan locations, tables/service points, secure QR destinations, service sessions, request types, requests, append-only request events, and optional order-to-session linkage.
- Keep menus, items, options, orders, users, businesses, and branding shared.
- Add narrow RPCs, tenant RLS, transition validation, idempotency, token boundaries, and Realtime hints with authoritative refetch.
- Preserve blank-config local fallback and local/Supabase adapter parity.
- Keep payments behind a provider-neutral seam until payment rules and a provider are approved.

The backend task must not deploy, push remote migrations, include development seed remotely, or place privileged keys in browser code.

## Coordination model

The three tasks can work concurrently, but not all deliverables can merge concurrently.

1. **Contract wave:** UX proposes journeys and policies; backend proposes the data/API contract; UI inventories reusable components and performs only isolated safe work.
2. **Contract review gate:** reconcile service mode, capabilities, session states, request states, events, permissions, and routes into one shared contract.
3. **Implementation wave:** UI builds against the approved contract; backend implements additive persistence and adapters; UX reviews flows and evidence.
4. **Integration gate:** merge through a dedicated integration branch only after existing Quick/menu/order/Auth behavior remains green.
5. **Hosted-development gate:** connect and verify only after local integration passes and the hosted project/ref is confirmed.
6. **Publish gate:** review the release candidate, ask for explicit approval, then deploy. No feature branch deploys itself.

## Planned branches

| Branch | Owner | Outcome | Dependency |
| --- | --- | --- | --- |
| `codex/quick-table-ux` | UX task | Journeys, state proposals, acceptance criteria, and UX review | Current baseline |
| `codex/quick-table-ui` | UI task | Reusable mode-aware surfaces and Availability-view rename | Shared contract gate |
| `codex/quick-table-backend` | Backend task | Additive mode/session/request schema and adapter contract | Shared contract gate |
| `codex/quick-table-integration` | Lead task | Reconciled UI, UX contract, backend, tests, and docs | Reviewed task branches |
| `codex/quick-table-release` | Lead release | Approved release candidate and deployment evidence | Integration gate |

Because the current checkout contains extensive uncommitted work, every worktree must start from the current working tree. Each task must inventory inherited changes and avoid claiming them as its own.

## Required product lifecycles

### QRK Quick

1. Resolve business/location QR context.
2. Load the lightweight published menu.
3. Browse, configure, and add items.
4. Review the cart and relevant fulfillment details.
5. Select an approved payment method or pay-at-business option.
6. Submit an idempotent, server-validated order.
7. Track it through fulfillment.
8. Complete the transaction.

Real online payment remains gated on provider, settlement, cancellation, refund, reconciliation, privacy, and cost decisions.

### QRK Table

1. Resolve an active business, location, and table from a server-validated QR destination.
2. Open or resume a scoped service session.
3. Show table identity clearly; do not trust manual table entry after a table QR scan.
4. Browse the shared menu and place one or more orders.
5. Expose common Quick Requests prominently.
6. Track request acknowledgement and completion without forcing cart usage.
7. Request the bill under an approved reversible/locking policy.
8. Let authorized staff settle and close the session.

### Staff operations

Use a unified service workspace for orders and requests. Prioritize table, event type, waiting time, state, and next safe action. Preserve order detail/history and add table-session context rather than replacing current order operations.

Proposed request states are `new`, `acknowledged`, `in_progress`, `completed`, and `cancelled`. Proposed session states are `open`, `bill_requested`, `settled`, `closed`, and `expired`. These remain proposals until contract review.

## Data and security direction

Proposed additive entities:

- `locations`
- `service_points` or `tables`
- `table_qr_destinations`
- `service_sessions`
- `service_request_types`
- `service_requests`
- `service_request_events`
- `service_session_participants`
- `service_session_join_requests`
- `service_packages` and package/menu eligibility rules
- nullable `service_session_id` on orders
- later: `payments`, `payment_attempts`, and refund/reconciliation records

Public clients receive narrow RPC access only. Every tenant record requires RLS. Prices, availability, capabilities, table/session identity, transitions, and idempotency must be validated server-side. Realtime messages are hints; initial load and reconnect/focus/interval/manual refetch remain authoritative.

## Review gates

Every branch must:

1. Preserve the existing stack and avoid unnecessary dependencies or duplication.
2. Inventory inherited dirty-working-tree changes and keep its own diff scoped.
3. Run `npm run check` and `git diff --check`.
4. Run targeted positive, negative, retry, reconnect, and regression checks.
5. Update `docs/BUILD_STATUS.md`, `docs/PROGRESS_MAP.md`, and relevant concise memory after a meaningful milestone.

UI branches additionally verify phone/tablet/desktop layouts; keyboard/focus; meaningful live feedback; contrast; touch targets; reflow; loading, empty, error, and reduced-motion behavior; and that the customer route contains no owner controls.

Backend branches additionally run a fresh local Supabase reset, all pgTAP tests, database lint, adapter validation, tenant-denial tests, invalid-transition tests, idempotency tests, and secret scanning.

## Hosted-development and deployment gate

No task may deploy independently. After reviewed branches are integrated:

1. Confirm the exact hosted Supabase development project and ref.
2. Compare migration history and run a reviewed dry run.
3. Apply approved migrations only; never include seed unless the target is explicitly disposable.
4. Verify two tenants and two physical devices.
5. Exercise Quick ordering and the full Table session/request lifecycle, including reconnect and duplicate retries.
6. Record accessibility, responsive, performance, console, migration, and rollback evidence.
7. Present the release candidate for explicit publishing approval.
8. Deploy only after approval, then smoke-test `/`, `/menu/`, `/admin/`, Quick, and Table routes.
9. Retain the prior known-good hosted version as the frontend rollback target. Use forward-only corrective database migrations.

## Decisions blocking production semantics

- Table-session start, expiry, resume, transfer, recovery, and QR rotation rules.
- Whether host approval applies to every guest order or only orders that add a charge; participant permissions remain configurable.
- Which staff permissions can acknowledge, progress, cancel, settle, and close.
- Whether a bill request can be retracted and what becomes locked afterward.
- Quick payment methods, provider, fees, settlement ownership, refunds, and reconciliation.
- Abuse controls for table QR links, requests, guest orders, and repeated submissions.
- Routing boundaries between service staff, kitchen, printers, payments, and future POS systems.

Prototype defaults may be tested, but must remain labeled as proposals until approved.

## Master exit evidence

The program is complete only when:

- One shared platform supports Quick and Table through capabilities.
- Existing menu editing and Quick ordering regressions remain green.
- A table QR opens or resumes the correct visit without trusted manual table entry.
- Customers can place multiple orders, send requests, observe progress, and request a bill.
- Staff can operate a permission-aware order/request queue and close sessions safely.
- Tenant isolation, tokens, idempotency, lifecycle transitions, and reconnect recovery pass locally and in hosted development.
- Phone, tablet, desktop, keyboard, focus, contrast, touch, error, offline/reconnect, and reduced-motion checks pass.
- The customer payload remains lightweight and owner controls stay out of the public route.
- Documentation distinguishes local demonstration, hosted development, and production accurately.
- The reviewed release candidate receives explicit publishing approval and passes post-deployment smoke tests with a recorded rollback target.
