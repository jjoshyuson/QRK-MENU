# Architecture memory

- The current app is static HTML, layered CSS and vanilla JavaScript with no third-party JavaScript dependencies.
- `dist/` contains authored source and must not be treated as disposable build output.
- `dist/index.html` holds the Business Dashboard, menu workspaces and dialogs; `dist/app.js` owns browser-memory state/rendering/interactions; `dist/style.css`, `dist/devices.css`, `dist/mobile-menu.css` and `dist/dashboard.css` form the CSS layers.
- Node is used only for the dependency-free local preview server in `scripts/serve.mjs`.
- Menu Studio state is browser memory; refresh restores sample menu data, and selected photos are temporary data URLs.
- There is no framework, backend, database, authentication, durable upload, publish synchronization, QR generation or production ordering system.
- `/menu/` is a standalone customer-only route with its own small CSS/JavaScript payload and static menu data. It does not ship owner code or synchronize with Menu Studio edits.
- Customer and staff order operations share same-origin `localStorage` and survive refresh in one browser profile. They never synchronize across physical devices.
- Dashboard orders, sales, staff, QR/link, password and session controls are sample UI only. Some interactions update the current browser session and reset on refresh.
- Keep implementation and customer payloads minimal. Add dependencies or abstractions only for a demonstrated requirement.
- A future production public route should send only public menu data and customer code, not the owner editor bundle.
- Any future private backend must enforce tenant authorization on every request; hiding controls is insufficient.

See `docs/TECHNICAL_HANDOFF.md` before architecture or persistence work.
