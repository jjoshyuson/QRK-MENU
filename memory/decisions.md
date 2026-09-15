# Decision memory

## Confirmed

- QRK uses a role-based chat fleet: Planner controls scope, domain chats implement on owned branches, QA validates release candidates, and Release alone merges and deploys `main`.
- A durable Orchestrator is the default user entry point and coordinates Planner, ephemeral domain worktrees, QA, and Release. Completed ephemeral tasks are archived and cleaned only after accepted integration with no unique work remaining.
- Feature chats do not push `main` or repeat release/status updates. They hand off a focused commit plus validation evidence.
- QRK Quick and QRK Table are two operating modes of one shared platform, not separate products, dashboards, databases or brands.
- Use service-mode defaults plus capability flags; keep the model extensible and location-ready.
- QRK Table requires a persistent table/session and service-request workflow rather than a copy of Quick with one request button.
- Feature branches must pass review before integration. Publishing requires explicit user approval after release-candidate review; feature branches never deploy themselves.
- Menu Studio `Table view` was renamed `Availability view` so it does not conflict with the QRK Table product name.
- Keep one responsive website/domain.
- Keep desktop as an owner management workspace with customer preview.
- Open mobile/tablet on Dashboard and use a top-right hamburger for workspace navigation.
- Keep Menu Studio's mobile/tablet Photo editor as a simple two-column food-photo menu with owner controls; add a compact table only for fast availability changes.
- Hide the restaurant identity header while editing and restore it in Customer view.
- Use Inter for interface, body, control and dashboard text. Reserve Source Serif 4 for customer-facing restaurant and menu headings. Keep both font roles centralized in `dist/ui-components.css`. Use black, white and gray as the dominant interface palette; teal/cyan is the complementary QRK brand accent rather than a full-page theme.
- Keep interface colors centralized in `dist/theme.css` so palette experimentation does not require editing each route independently.
- Optimize for a very lightweight customer experience and use minimal code.
- Polish and verify the UI before starting broader product development.
- Use one shared future login URL for a multi-business product, with each business limited to its own workspace.
- Build the full Business Dashboard branch as UI only before choosing backend providers or implementing production services.
- Balance menu health and order operations on the dashboard landing view.
- Target an intended selling range of roughly PHP 1,500–3,000; this remains unvalidated.
- Use Supabase/PostgreSQL for the initial backend foundation, keep schema migrations as repository source of truth, separate development and production, and isolate provider-specific integration so a future VPS migration remains practical.
- Business users share one login and may use email or a globally unique username plus password. Membership routes them to their business; admins receive the full workspace and staff receive individually configured permissions.
- Staff usernames use a business namespace: QRK MENU locks the business prefix and the client enters only the staff-specific suffix (for example, `kusina.rhain`). The complete username remains globally unique; the hosted backend must reserve each business prefix uniquely.
- Reserve `admin.qrkmenu.com` for QRK platform administration through Google Workspace. During local UI review, `/admin/` may use the explicitly labeled temporary Continue bypass requested by the user; do not add a fake password form, expose this entry from the client login, or treat the bypass as production authentication.
- Use the role names QRK Admin, future QRK Staff, Client Admin and Client Staff. QRK Admin may create a client portal and its initial Client Admin account, but does not create, assign or manage Client Staff; that remains inside the client portal.
- Let each client portal feel business-owned through controlled white-labeling: the Client Admin may provide a logo and primary/navigation colors, while QRK enforces readable contrast and retains a small customer attribution. Client Admin and Client Staff share the client identity; QRK Admin always retains QRK branding. Fonts and layouts are not tenant-customizable in this stage.

## Open

- First pilot restaurant/customer segment.
- Owner/staff roles and multi-branch needs.
- Authentication/onboarding details, production hosting, rate limits and operational provider settings. Supabase/PostgreSQL is selected only as the initial provider foundation.
- First-pilot item variations and add-ons.
- Draft/publish rules, especially urgent sold-out changes.
- AI import provider, cost ceiling and source-image retention.
- Ordering operations, table identity, payment and fake-order controls.
- Whether online ordering or online payment should use optional business-approved trusted-customer accounts, what guests may do without approval, and whether trust is scoped to one business.
- Subscription offer and evidence for the PHP 1,500–3,000 target range.

Do not convert open choices into requirements. Ask the user when a choice materially affects scope, privacy, access or cost.
## September 13, 2026 — Table service configuration

- Approved: service settings belong to each location and inherit business-wide defaults.
- Approved: QRK uses capability-backed presets rather than business-specific code paths.
- Approved prototype direction: table-specific or manually selected tables, a named Order Host, configurable joining, one active/pending table session per device per business, proximity screening with staff recovery, and staff override.
- Pending decision: whether the host approves every guest order or only guest orders that add a charge. Included refills may bypass approval only if explicitly approved.
