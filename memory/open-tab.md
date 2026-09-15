# Open Tab memory

- Tambay Café uses the `open_tab` service preset and the shared customer menu/order implementation.
- Its prominent top Open Tab control stays hidden until the first item is added. It then totals the current draft plus submitted, non-cancelled order rounds.
- The Open Tab drawer exclusively lists submitted rounds with customer-facing Accepted, Preparing, or Prepared status. The floating View order drawer exclusively contains the current editable draft and send-order flow; it does not repeat submitted rounds or the already-established table number. Individual rounds do not enter device Order history while the table tab remains open.
- The floating `View order` action remains the primary way to review and send a new draft. The top-right Open Tab control is a separate running-total/history surface and must not replace or hide the floating cart.
- Open Tab customer confirmation is table-based rather than exposing a separate order number for every round.
- Tambay staff close the visit with `Customer paid`, not `Table cleaned`. That action completes the table's active order rounds before marking the session paid, removes Open Tab from the customer device, and writes one combined table-tab snapshot to device Order history. Other Table cleanup also archives active orders before freeing a table.
- Staff History shows the customer name, item count, completion timestamp, and total; it does not show phone or payment status.
- Customer names may be stored per business and device when the default-on `Save name on this device` checkbox remains selected. The current table participant name also prefills checkout. No phone value is collected or displayed by this UI.
- Tab membership and the paid transition are browser/LAN preview state. Real payment detection, durable hosted persistence, and physical cross-device behavior remain unimplemented.

Authoritative detail: `docs/QUICK_TABLE_MASTER_PLAN.md`, `docs/UI_AND_FLOWS.md`, `docs/BUILD_STATUS.md`, and `dist/menu/menu.js`.
