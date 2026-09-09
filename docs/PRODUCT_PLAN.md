# Product plan

## Confirmed direction from the project conversations

QRK MENU helps small businesses put their menu online, update it easily, and let customers open it by scanning a QR code. Ordering is part of the intended product, but only a UI demonstration exists today. The intended offer is roughly PHP 1,500–3,000; this is a target range, not validated pricing or an existing subscription.

The confirmed direction is one lightweight multi-business website. A future shared login URL should route each authenticated business to its own tenant-scoped workspace; the current prototype does not implement authentication or tenant isolation.

The central priorities are fast customer loading, easy menu maintenance, and practical use in small restaurants. Some customers may not have a phone or internet. The design and operating process need to account for that without blocking service.

Initial onboarding will include face-to-face help. A proposed quick-import flow photographs an existing printed menu and uses AI to extract items. Staff and the owner then double-check and correct everything. AI output must remain a reviewable draft; it must not silently become the live menu.

The menu polish, UI-only Business Dashboard, customer ordering UI and staff order-operations UI milestones are implemented. Customer and staff flows integrate only through same-origin browser storage; this is a refresh-persistent demonstration, not cross-device or production ordering. Workstream 3 backend foundation remains proposed and requires separate authorization.

## Confirmed UI decisions

- Desktop business editor with a customer preview.
- One website with layouts adapted to screen width; no separate mobile domain.
- Mobile owner view resembles the customer's menu with added edit and plus buttons.
- Latest direction: simple two-column food-photo tiles, similar in layout to familiar food-delivery apps. Do not copy another company's branding.
- Keep existing typography; avoid fancy decorative mobile headers.
- Show photo, dish name and peso price prominently. Put detailed editing in the item form.

## Proposed phased roadmap

The implementation details below are recommendations for the next development phase, not features already built or final decisions already approved.

### Phase 0 — Finish the design prototype (next task)

Verify the current menu grid and desktop editor on actual viewport sizes. Resolve cramped buttons, clipping, inconsistent previews and keyboard focus issues. Exercise add/edit/delete, categories, sold-out toggles, photo selection/removal, customer preview and empty states. Keep the existing design recognizable.

Exit: owner can understand and complete the editing flows on phone, tablet and desktop; the customer preview accurately represents the same data. Record evidence and remaining issues.

### Phase 1 — Durable business menu builder

Build sign-up/login, a business profile, tenant-scoped menu data and durable image storage. Start with one business and one main menu per owner while keeping IDs and schema extensible. Add reliable save feedback and recoverable errors. Replace sample identity with real account/business values.

Introduce drafts and published menu revisions. Draft changes should not accidentally replace a live menu. Decide whether urgent sold-out changes are applied immediately to the live menu or through publishing; document that product rule and communicate it clearly.

Exit: saved edits survive refresh and login on another device; unauthorized requests cannot read or modify another business's private records.

### Phase 2 — Customer menu and QR publishing

Create a stable public route such as `/m/{businessSlug}` on the same domain. Publish only validated menu data. Generate a real QR code to this stable route; a price edit must not require reprinting the QR.

Serve a small customer payload without the owner editor. Optimize photos, cache public data sensibly, and show clear unavailable/empty states. Keep owner controls and private fields out of customer responses.

Exit: scan from a second device, load the published menu, change and republish a price, and verify the same QR resolves to the update.

### Phase 3 — Assisted menu import

During face-to-face onboarding, capture one or more menu photos. Extract candidate categories, names, descriptions, prices and any clearly shown variations. Mark uncertain text/values and preserve the source images for review. Review side by side, correct, approve, and import into a draft.

Avoid invented prices or ingredients. Show processing/failure states. Flag possible duplicates instead of silently merging different dishes or sizes. No AI provider is selected yet; choose one later with a clear cost and privacy model.

Exit: staff can turn a real printed menu into a verified draft faster than manual entry, and can recover when extraction is incomplete.

### Phase 4 — In-store ordering pilot

First settle operational rules: how an order identifies its table or pickup context; who accepts it; where kitchen staff see it; how unavailable items are handled; how price changes affect a cart; and when customers pay.

Proposed first pilot: guest ordering with staff confirmation and payment at the restaurant. This is a proposal, not a confirmed payment decision. Keep payment integration separate until the workflow is proven.

Requirements include server-side price/availability validation, duplicate-order prevention, rate limits, clear submitted/accepted/rejected statuses, and an audit trail. Do not label an order confirmed until the server has accepted it. Authentication, table/session tokens, payment and staff confirmation are possible abuse controls; no single method eliminates fake orders.

Exit: a small restaurant can operate a real pilot and recover from duplicate taps, lost connectivity, unavailable dishes and rejected orders.

### Phase 5 — Reliability, low connectivity and commercial rollout

Agree on performance budgets, test slow connections and low-end phones, test realistic peak traffic, and measure rather than promise speed. Add monitoring, backups, operational recovery and support procedures. Add subscriptions only after plan/pricing decisions are validated.

Offline browsing may use a previously cached menu. A first visit still requires a delivery path to fetch the menu. A QR code pointing to a URL does not itself contain the website. Do not promise that scanning opens an installed PWA without browser UI. Real order submission/confirmation needs connectivity to the ordering service; pending local intent is not a confirmed order.

Proposed service fallback: printed menus and staff-assisted orders for people without a device or internet. Restaurant Wi-Fi may help but should not be treated as universal or automatic.

## Open decisions

1. Exact first customer segment and pilot restaurant.
2. Owner roles/staff permissions and whether multi-branch support is needed at launch.
3. Framework, database, authentication, storage and hosting providers.
4. Required item variations and add-ons for the first pilot.
5. Order intake device, staff responsibilities, payment flow and fake-order controls.
6. Publication rule for price edits versus sold-out changes.
7. AI import provider, cost ceiling and source-image retention.
8. Actual subscription offering and evidence supporting the PHP 1,500–3,000 target range.

None of these decisions should be invented as an already approved requirement.
