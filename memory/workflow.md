# Workflow memory

## Start

1. Read `AGENTS.md` and `memory/README.md`.
2. Proceed on routine, reversible details using the approved packet, existing patterns and documented product intent. Domain owners may answer and record routine assumptions; ask the user only when unresolved ambiguity materially changes behavior or scope, architecture, access or privacy, destructive data handling, cost, or release authorization.
3. Before UI or visual work, read and follow `AGENT/STYLE.md`; then read only the relevant memory topics and linked authoritative docs.
4. Run `npm start` and `npm run check`. The local URL is `http://127.0.0.1:4173`.
5. For backend work, read `supabase/README.md`, keep Docker Desktop running, and use the project-local CLI as `npx.cmd supabase ...` on Windows. Before any hosted operation, pass the explicit target flag and verify the linked project ref.

## During work

- Preserve the latest working UI and make the smallest practical change.
- Prefer existing HTML, CSS and vanilla JavaScript; avoid unnecessary packages and abstractions.
- For layout work, verify representative phone, tablet and desktop sizes with browser tools.
- Test meaningful flows and risks, not only syntax.
- Do not deploy or activate archived hosting metadata without explicit authorization.
- For concurrent work, follow `docs/ORCHESTRATION.md`: Planner routes dependency-aware packets through the durable domain owners; users collaborate directly in the relevant domain or implementation task; every immutable candidate passes independent QA and local user review.

## Finish

- Run `npm run check` and task-relevant tests such as `node tests/photo-races.mjs`.
- Update `docs/BUILD_STATUS.md` with evidence, limitations and exact next action.
- Update `docs/PROGRESS_MAP.md` only if milestone structure or status changed.
- Update relevant `memory/` topics when stable facts or decisions changed.
- “Cloud development” means `origin/main` and its GitHub Pages development deployment at `https://jjoshyuson.github.io/QRK-MENU/`; it excludes the Sites prototype and production.
- Build tasks commit only owned changes and hand exact commits to QA. After QA PASS, local user review and explicit approval, only Deployment integrates, pushes `main`, and verifies GitHub Pages under `docs/DEPLOYMENT.md`.
- Git worktrees do not isolate database state. Isolate schema-changing or destructive data work. Cleanup starts only after verified deployment and user acceptance and preserves durable roles and unique/unmerged work.
