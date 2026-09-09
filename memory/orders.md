# Order operations memory

- Staff order operations are a UI-only, same-origin/browser demo. They do not provide a backend, cross-device persistence, authentication, payments, push notifications, or production security.
- The shared store is localStorage key `qrk_demo_orders_v1`, containing an array of contract orders with integer minor-unit money values. Unknown order and item fields must be preserved when staff status changes are written.
- Supported statuses are `received`, `preparing`, `ready`, `completed`, and `cancelled`. Active contains the first three; history contains the final two.
- Staff updates set `updatedAt`, append concise `events` history, save the complete array, and dispatch `qrk:demo-orders-changed`. The dashboard also listens for the browser `storage` event and `qrk-demo-order` compatibility event.
- Received orders can be accepted and started, preparing orders marked ready, and ready orders completed only after the displayed verification token matches. Cancellation requires confirmation.
- Customer ordering supports search, configured items, quantity, item notes, cart add/edit/remove, table or pickup checkout, order confirmation and tracked status. Cart and the latest active order survive refresh on the same origin/browser.
- Desktop order details use a right-side modal drawer. Phone order details use the full usable viewport. Native dialog behavior provides focus containment and Escape close behavior.
- Seed orders are written only when the shared key is absent. Existing customer-written orders take precedence and survive refresh on the same origin/browser.
- Store availability persists as the string `true` or `false` under `qrk_demo_store_open_v1`. Both dashboard status controls update it and dispatch `qrk:demo-store-status-changed`; an open customer tab responds through the browser `storage` event.
- The exact next proposed milestone is workstream 3 backend foundation. Until it is separately authorized and implemented, different physical devices cannot see one another's orders or status changes.

Authoritative implementation: `dist/index.html`, `dist/app.js`, and `dist/dashboard.css`.
