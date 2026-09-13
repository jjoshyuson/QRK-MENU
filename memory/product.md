# Product memory

- QRK is one lightweight restaurant ordering and service platform with two operating modes: QRK Quick for transaction-focused order/pay visits and QRK Table for persistent table sessions, additional orders, service requests and bill requests.
- Menus, business accounts, authentication, staff permissions, orders, branding, analytics foundations and future integrations remain shared across modes. Capabilities should determine behavior without duplicating the platform.
- Core value: customers scan a QR code to get what they need quickly, while owners and staff receive clear actionable work.
- The implementation and delegation contract is `docs/QUICK_TABLE_MASTER_PLAN.md`.
- Demo tenant mapping: Kusina Manila represents QRK Quick with the payment-first pilot enabled; Salamat represents QRK Table. Each has seeded local admin and staff identities.
- The intended selling range is about PHP 1,500–3,000, but it is not validated pricing.
- The confirmed long-term shape is one lightweight multi-business website with one shared login URL and tenant-scoped workspaces. Login and tenant isolation are not implemented.
- Operational ordering, payments, subscriptions, AI import, offline behavior and QR publishing are future work, not current features. A provider-ready ordering/data foundation exists in source but is not connected.
- Face-to-face onboarding is expected initially. AI extraction from printed menus is proposed only as a reviewable draft workflow.
- People without phones or connectivity must still be serviceable through operational fallbacks such as printed menus or staff assistance.
- Product priorities are fast customer loading, simple maintenance and practical restaurant operation.
- Proposed discovery direction: QR menu browsing should remain account-free. An optional business-approved trusted-customer or VIP account could later unlock online ordering and possibly payment for known regulars. This is not approved scope and is not a substitute for technical abuse, authentication or payment controls.

See `docs/PRODUCT_PLAN.md` for the phased roadmap and full product reasoning.
