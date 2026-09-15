# QRK MENU working instructions

Keep this file short. It contains rules that apply to every task. Use `memory/README.md` to find current context and `docs/ORCHESTRATION.md` for the full workflow.

## Start efficiently

- Ask one concise question only when the answer could materially change scope or implementation. Do not require a question for routine, well-specified work.
- Read `memory/README.md`, then only the memory topic and authoritative document routed for the task.
- Inspect Git status, branch, and relevant files before editing. Do not scan the entire repository by default.
- Work in a dedicated branch/worktree. Never edit directly on `main` unless this is the designated Release chat performing an approved integration.
- Preserve unrelated work and never stage, revert, merge, or clean it.

## Product guardrails

- QRK MENU is a lightweight digital-menu and future-ordering product for small businesses, initially Philippine restaurants.
- Preserve the existing HTML, CSS, and vanilla JavaScript stack while practical. `dist/` contains authored source.
- Keep one responsive product and domain. Desktop is the management workspace; mobile/tablet opens Dashboard; Menu Studio remains a separate customer-shaped editor.
- Preserve existing item, category, photo, availability, ordering, and preview flows unless the task explicitly changes them.
- Preserve the established QRK brand and follow `AGENT/STYLE.md` for UI work.
- Customer preview hides owner controls but is not an authorization boundary.
- Keep provider calls behind existing adapters. For backend/data work read `supabase/README.md`; for provider migration read `docs/DATABASE_SYNC_AND_PORTABILITY_PLAN.md`.
- Do not claim persistence, authentication, offline use, QR publishing, payments, or cross-device behavior until verified.
- Never commit credentials or secrets. Preserve image provenance.

## Role boundaries

- **Planner chat:** owns approved scope, sequencing, architecture decisions, and `docs/PROGRESS_MAP.md`. It does not routinely implement or deploy.
- **Domain build chats:** own one bounded product area and branch. They implement, run proportionate checks, and prepare a concise handoff. They do not merge or deploy.
- **QA chat:** reviews a release candidate, runs risk-based functional, responsive, accessibility, performance, and regression checks, and records pass/fail evidence. It does not silently fix or deploy.
- **Release chat:** is the only normal path for integrating approved branches, resolving release conflicts, updating release records, pushing `main`, and verifying GitHub Pages.

Detailed ownership and handoff formats are in `docs/ORCHESTRATION.md`.

## Validation and documentation

- Match validation to risk. Documentation-only work needs link, consistency, diff, and Git checks; it does not require the full product test suite unless it changes commands or executable examples.
- UI work requires representative phone, tablet, and desktop checks plus relevant keyboard, focus, contrast, reflow, state, and reduced-motion checks.
- Run `npm run check` for code changes that affect shared behavior or before a release candidate. Run narrower tests for small isolated changes when available.
- Update only documentation whose truth changed. Do not append the same milestone to `BUILD_STATUS`, `PROGRESS_MAP`, and multiple memory files.
- `docs/BUILD_STATUS.md` is detailed release evidence, maintained by QA/Release. `docs/PROGRESS_MAP.md` is current direction, maintained by Planner. Memory is a concise routing/current-state layer.

## Git and release

- Feature work ends with a focused commit on its owned branch and a handoff to QA or Release. Pushing the feature branch is allowed when needed for review; it is not deployment.
- Only Release merges approved work into `main` and pushes `main`. A successful GitHub Pages workflow is required before describing development as deployed.
- Never merge production, force-push shared history, delete work-bearing branches, or change production resources without explicit approval.
- Do not use or reinstall `ui-ux-pro-max`; it was removed by user decision.
