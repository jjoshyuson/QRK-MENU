# Workflow memory

## Start

1. Ask one concise discovery question before every new build/change request and wait for the answer.
2. Read `AGENTS.md` and `memory/README.md`.
3. Before UI or visual work, read and follow `AGENT/STYLE.md`; then read only the relevant memory topics and linked authoritative docs.
4. Run `npm start` and `npm run check`. The local URL is `http://127.0.0.1:4173`.
5. For backend work, read `supabase/README.md`, keep Docker Desktop running, and use the project-local CLI as `npx.cmd supabase ...` on Windows. Before any hosted operation, pass the explicit target flag and verify the linked project ref.

## During work

- Preserve the latest working UI and make the smallest practical change.
- Prefer existing HTML, CSS and vanilla JavaScript; avoid unnecessary packages and abstractions.
- For layout work, verify representative phone, tablet and desktop sizes with browser tools.
- Test meaningful flows and risks, not only syntax.
- Do not deploy or activate archived hosting metadata without explicit authorization.

## Finish

- Run `npm run check` and task-relevant tests such as `node tests/photo-races.mjs`.
- Update `docs/BUILD_STATUS.md` with evidence, limitations and exact next action.
- Update `docs/PROGRESS_MAP.md` only if milestone structure or status changed.
- Update relevant `memory/` topics when stable facts or decisions changed.
- “Cloud development” means `origin/main` and its GitHub Pages development deployment at `https://jjoshyuson.github.io/QRK-MENU/`; it excludes the Sites prototype and production.
- After a validated change, commit only the intended files and push `main` to `origin`. The push triggers the GitHub Pages development deployment at `https://jjoshyuson.github.io/QRK-MENU/`; verify the workflow before calling it deployed.
