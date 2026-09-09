# UI memory

- Desktop is a management workspace with a customer preview.
- Mobile/tablet at 1100 CSS pixels or less opens to Dashboard. A top-right hamburger opens a right-side navigation drawer, and Menu Studio is a separate view.
- Menu Studio Photo editor retains the customer-shaped two-column photo menu with owner controls layered on top. Its Table view uses tall, Messenger-inspired touch rows with larger round images, item names and right-aligned Available/Out of stock controls. Table view omits prices and option notes and is not a customer layout.
- Do not turn mobile into a compressed desktop table or an ornate restaurant landing page.
- Use the same site and domain for responsive layouts; no mobile redirect or separate mobile site.
- Preserve DM Sans / Manrope and QRK orange unless the user requests a new direction.
- Dish tiles prioritize photo, name and PHP price. Descriptions remain editable but are not shown on compact tiles.
- Photo editor mode omits the restaurant identity header. Customer preview restores that header and hides item edit, availability and add controls, but this is not an authorization boundary.
- Mobile/customer category tabs jump to menu sections and follow scrolling. Empty categories appear for owners but not customers. Desktop management retains its `All items` filter.
- Preserve item/category creation, item editing/deletion, availability, menu rename and photo selection/removal flows.
- Desktop now opens to a balanced Business Dashboard overview with routes for Business profile, Menu Studio, Staff access, Orders and Settings.
- Phone/tablet opens to the responsive Dashboard; the navigation drawer switches to the separate Menu Studio and back to Dashboard.
- Business profile/QR, staff permissions, live/history orders, sales and settings are clearly UI-only demo states.
- Menu Studio adds category reordering, plain-text option notes and Available/Sold out/Hidden states. Hidden items remain owner-visible and are omitted from customer previews.

See `docs/UI_AND_FLOWS.md` for detailed behavior and test cases.
