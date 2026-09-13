# Open Tab memory

- Tambay Café uses the `open_tab` service preset and the shared customer menu/order implementation.
- Its prominent top Open Tab control stays hidden until the first item is added. It then totals the current draft plus submitted, non-cancelled order rounds.
- The Open Tab drawer lists every submitted round with customer-facing Accepted, Preparing, or Prepared status and keeps the next draft editable below it.
- Tab membership is browser-local preview state. Settlement, payment, durable hosted persistence, and physical cross-device behavior remain unimplemented.

Authoritative detail: `docs/QUICK_TABLE_MASTER_PLAN.md`, `docs/UI_AND_FLOWS.md`, `docs/BUILD_STATUS.md`, and `dist/menu/menu.js`.
