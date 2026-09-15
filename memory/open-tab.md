# Open Tab memory

- Tambay Café uses the `open_tab` service preset and the shared customer menu/order implementation.
- Its prominent top Open Tab control stays hidden until the first item is added. It then totals the current draft plus submitted, non-cancelled order rounds.
- The Open Tab drawer lists every submitted round with customer-facing Accepted, Preparing, or Prepared status and keeps the next draft editable below it. Individual rounds do not enter device Order history while the table tab remains open.
- Open Tab customer confirmation is table-based rather than exposing a separate order number for every round.
- Tambay staff close the visit with `Customer paid`, not `Table cleaned`. That action marks the table session paid, completes the table's active order rounds, removes Open Tab from the customer device, and writes one combined table-tab snapshot to device Order history.
- Tab membership and the paid transition are browser/LAN preview state. Real payment detection, durable hosted persistence, and physical cross-device behavior remain unimplemented.

Authoritative detail: `docs/QUICK_TABLE_MASTER_PLAN.md`, `docs/UI_AND_FLOWS.md`, `docs/BUILD_STATUS.md`, and `dist/menu/menu.js`.
