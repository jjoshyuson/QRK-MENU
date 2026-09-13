# UI and user flows

## Per-business branding preview

The Client Admin can upload a PNG, JPEG or WebP logo from Business Profile. QRK Admin owns the global platform appearance: it provides four complete light presets with dark navigation, four complete dark presets, a global Light/Dark mode switch, and Advanced settings with independent 13-token light and dark editors. The theme layer derives readable action/sidebar foregrounds and applies the selected mode across QRK Admin, Client Admin, Client Staff and customer routes. Existing legacy flat palettes migrate into the custom Light palette. Settings remain browser-local until hosted global configuration is implemented.

## Desktop

The dark sidebar now routes between Dashboard, Business profile, Menu Studio, Staff access, Orders and Settings. Dashboard balances live-order sample activity with menu health and quick actions. Menu Studio retains the compact management list and customer photo-grid preview. The expanded customer preview can represent mobile, tablet and desktop widths.

The non-menu sections are explicitly UI-only: profile and appearance controls, a sample QR/link, demo staff accounts and permissions, sample live/history orders and status progression, a basic sample sales summary/log, and account/order-numbering/open-status/session controls. Business Settings is one heading-free, compact rounded list with four stacked full-row actions: Account, Orders, Availability, and Security & sessions. Each row uses a clean outline icon, label, divider, and chevron; selecting one reveals its focused controls. They must not imply a connected backend or live service.

Platform administration is separate from the business login. The business sign-in card contains no admin link. During local development only, `/admin/` presents a temporary Continue-to-preview gate and a persistent warning that OAuth is bypassed. The QRK Admin workspace has functional Overview, Clients and Client Admins views. Adding a client creates a browser-local portal record and the initial Client Admin preview login with a one-time password and mandatory first-login replacement. QRK Admin can pause or activate a client record but has no Client Staff controls; client staff remains a Client Admin responsibility.

Business profile now links to the public development `/menu/` route. The route shows only the matching customer menu and photo credits, with no Development badge or owner controls. In browser-preview mode Menu Studio changes synchronize to it and unavailable/hidden items are omitted; this remains a same-browser review flow, not durable cross-device publishing.

## Customer ordering demonstration

The standalone `/menu/` route now supports menu browsing and search, item details, required options and optional add-ons, quantities and item notes, and cart add/edit/remove. Checkout supports either a required table number or pickup with an optional customer label. Submitting creates a device-local demo order with an order number and verification token; the active-order panel and confirmation dialog track received, preparing, ready, completed and cancelled states.

For the `Restaurant · pay first` preset, checkout adds a required payment-method choice before the order reaches staff. `Pay cashless` is visible but disabled during the pilot; `Pay at the counter` is the only enabled method and is retained on the device-local order. After submission, the customer sees `Waiting for staff`. The order remains Received until staff selects `Accept order`, which moves it to Preparing and records `Accepted by staff`. This simulates workflow only and does not execute or authorize a payment.

The customer route includes sold-out, empty-search, closed-store, invalid-checkout, cancelled-order and browser-storage error states. Cart and active-order state survive refresh in the same browser profile. No request reaches a kitchen, takes payment or synchronizes to another device.

## Staff order operations demonstration

The shared staff surface removes kitchen preparation tracking from QRK. All live orders stay in Received until staff use the single mode-aware completion action: `Mark paid` for QRK Quick or `Mark served` for QRK Table. The existing provider transition sequence remains internal for compatibility; Preparing and Ready are not exposed as staff workflow stages. History is a separate top-right view containing paid/served and cancelled orders. Table businesses also retain a separate Tables view for accepting sessions, seeing occupancy, and reopening cleaned tables. The responsive detail panel keeps fulfillment, items, selected options, notes, totals and cancellation without exposing development verification steps in the primary workflow.

The dashboard and Settings store controls update an already-open same-origin customer tab and persist across refresh. Both routes now call a shared data-service interface. With blank configuration that interface deliberately uses the same demo storage; connected behavior remains unverified until Auth and a hosted development project exist.

The owner header identifies `Development · Demo data` while the fallback is active. If safe Supabase public configuration is later supplied it identifies the provider mode, but that label alone does not claim the backend has passed the required connection/security checks.

For QRK Table businesses, the third live-workspace tab is `Tables`. It always shows six compact cards in the current practice setup. Available tables are ready for guests, pending tables show the requesting guest and an `Accept table request` action, and occupied tables use a quieter theme-derived surface with a visible `Occupied` label and `Table cleaned` action. Cleaning ends the local preview session and returns that card to Available.

The five development clients share one capability-driven entry flow. Kusina Manila is Quick and opens without a Table dialog. Salamat asks for table, name and guest count, then opens directly. Salo Table asks for the same fields and waits for staff while allowing the guest to build an order. Tambay Café asks only for table and name, then opens directly. Ihaw Buffet asks for table, name, guest count and a required package, then waits for staff before revealing the menu.

Every customer or join request that waits for confirmation shows a Cancel request action and a visible countdown. Unanswered requests expire automatically after 90 seconds by default, release the pending table claim, disappear from the staff queue, and return the customer to table selection. QRK Admin can set the acceptance timeout from 30 to 600 seconds per client; this is separate from the duration of an active table visit.

On the LAN preview, Table state is shared by the local preview server and can be exercised across devices. On GitHub Pages, the static preview uses business-scoped browser storage so customer and staff tabs on the same browser origin can demonstrate the same rules. That fallback does not synchronize different browsers or physical devices and is not durable hosted service state.

## Mobile and tablet

At widths of 1100 CSS pixels or less, the static prototype opens the responsive Business Dashboard. A top-right hamburger opens a right-side navigation drawer with Dashboard, Business profile, Menu Studio, Staff access, Orders and Settings. Menu Studio is a separate in-page view on the same route. This is a viewport-based layout switch, not user-agent detection, authentication or a redirect.

The intended hierarchy is:

1. Compact QRK owner header with a top-right hamburger.
2. Menu Studio toolbar with Customer view and Availability view controls.
3. In Photo editor mode, menu title and category tabs followed by two photo tiles per row, grouped by category.
4. Owner add-item button and inline add tiles.
5. In Customer view, restaurant name and brief details appear above the customer-shaped photo menu.

Photo editor mode deliberately omits the restaurant identity header so the editing workspace starts with menu controls. Each dish tile shows its photo, name and PHP price. Owners see an edit button over the photo and an availability control. Customer preview restores the restaurant identity header and hides item-edit, availability and add-item controls. Sold-out status remains visible. Sample descriptions stay in the editor data/form but are not displayed on the latest compact tiles.

Availability view is an owner-only stock workspace grouped by category. It uses tall, Messenger-inspired touch rows with a large round thumbnail and item name on the left and a direct Available/Out of stock control on the far right. Prices and option notes are omitted in this mode so service staff can change stock quickly without crowded or easy-to-mistap controls. It is not the customer menu and must not replace the two-column photo grid.

This is deliberately a simple food-menu grid. Do not reintroduce the previous large serif restaurant header, decorative slogans, or the compressed desktop table.

## Current item workflow

- Add through the main button or a category's add tile.
- Enter name, optional description, nonnegative price and category.
- Optionally select a JPG, PNG, WebP or AVIF file of up to 5 MB.
- Set availability; submit to update browser-memory state and both previews.
- Add an optional plain-text options note and choose whether an item is available, sold out or hidden. Hidden items remain visible to owners and are omitted from customer previews.
- Edit an existing item with its pencil control; change/remove its photo if desired.
- Delete only after the confirmation dialog.
- Photo removal or an item created without a photo uses an explicit no-photo state.

Photo selection is a local temporary preview. It does not upload to durable storage. A future backend must validate and resize images independently.

## Categories and menu naming

- Category tabs filter the editor/menu.
- The category plus button opens a category-name dialog.
- Blank and duplicate category names are rejected.
- A new empty category remains usable in owner view; customers do not need to see empty categories.
- Rename the main menu using its edit control.
- Category reordering is available through Arrange categories and updates all menu views in browser memory. Category rename and delete are not implemented.

## Expected checks in the next Codex session

Check at approximately 360, 390, 430, 768, 1024, 1280 and 1440 CSS pixels, and with increased text size. These are test sizes, not assumptions about specific device models. Verify touch targets, wrapping, dialog reachability with the keyboard open, and no unintended horizontal page scrolling.

Check long names, long category labels, free items, decimal prices, empty menus, all-sold-out menus, invalid image files, cancellation while an image loads, and switching between owner/customer modes after edits.

Customer preview should remain truthful. The current expanded frame is a scaled DOM clone, not a real device emulator. A visual owner/customer toggle is not a substitute for backend authorization in production.

## Updated category navigation

Mobile/tablet and customer previews show all populated sections in order, without an All tab. Category buttons scroll to sections; scrolling updates and centers the highlighted category. Owners also see empty sections and can add items there. The desktop management list retains category filtering and All items. Five extra empty seed categories are included to exercise the longer owner navigation bar.
