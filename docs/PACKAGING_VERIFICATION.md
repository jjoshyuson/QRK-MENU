# Repository verification

As of September 9, 2026, this working repository is newer than deployed Sites version 8. `MANIFEST.sha256` covers the current local source and documentation; it is not a claim that the provider-ready backend files are deployed.

- `npm run check` validates all browser modules, the local server, backend structure/security markers, SQL test coverage and secret patterns.
- `node tests/photo-races.mjs` passes.
- The existing local preview responded on `http://127.0.0.1:4173`; a second `npm start` correctly reported the port already in use.
- Browser checks at 390, 768 and 1280 CSS pixels passed for `/` and `/menu/`, with no page overflow or console warning/error logs. A complete demo order lifecycle passed through the shared adapter.
- Supabase CLI, PostgreSQL client and Docker were unavailable. Database migration execution, pgTAP, lint, RLS, Broadcast and Storage behavior are not claimed as passed.
- No new ZIP was produced and no deployment occurred in this milestone.
