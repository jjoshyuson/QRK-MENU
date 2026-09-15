# Open Tab memory

- Tambay Café uses the `open_tab` service preset and the shared customer menu/order implementation.
- Its prominent top Open Tab control stays hidden until the first item is added. It then totals the current draft plus submitted, non-cancelled order rounds.
- The Open Tab drawer lists every submitted round with customer-facing Accepted, Preparing, or Prepared status and keeps the next draft editable below it.
- The floating `View order` action remains the primary way to review and send a new draft. The top-right Open Tab control is a separate running-total/history surface and must not replace or hide the floating cart.
- Table cleanup archives every active order for that table before freeing the table. History shows the customer name, item count, completion timestamp, and total; it does not show phone or payment status.
- Customer names may be stored per business in browser-local preview state when the default-on `Save name on this device` checkbox remains selected. The current table participant name also prefills checkout. No phone value is collected or displayed by this UI.
- Tab membership is browser-local preview state. Settlement, payment, durable hosted persistence, and physical cross-device behavior remain unimplemented.

Authoritative detail: `docs/QUICK_TABLE_MASTER_PLAN.md`, `docs/UI_AND_FLOWS.md`, `docs/BUILD_STATUS.md`, and `dist/menu/menu.js`.
