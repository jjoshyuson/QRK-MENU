# Working instructions

## Before starting work

- For every new build or change request, reply first with one concise discovery question and wait for the user's answer before editing files or implementing anything.
- If a prompt is vague, ambiguous, or could reasonably lead to different outcomes, do not spend time or tokens guessing. Ask the smallest number of focused questions needed to reduce uncertainty.
- After the answer, read `memory/README.md` and only the topic files relevant to the request. Consult the longer handoff documents when the memory index points to them or when detailed evidence is required.
- Before every UI, UX, layout, styling, branding, or responsive change, read and follow `AGENT/STYLE.md` as the project’s visual source of truth.
- For backend, data, order, Auth, Realtime, Storage, migration, or recovery work, also read `supabase/README.md` before changing schema or adapter code.
- Keep `memory/` concise and current after material decisions or milestone changes so a new chat can orient itself without scanning the whole project.

## Preserve the direction

- This is QRK MENU, a lightweight digital menu and future ordering product for small businesses, initially restaurants in the Philippines.
- Build on the existing UI. `dist/` currently contains authored source, not disposable build output.
- Desktop stays a management workspace with a customer preview.
- Mobile/tablet opens to the responsive Dashboard. Menu Studio is a separate view that keeps the customer-shaped, two-column photo menu with owner editing controls. Its compact table mode is only for fast availability changes, not a replacement customer layout. The user explicitly rejected a shrunken desktop table and an ornate restaurant-style mobile page.
- Keep the same site/domain. No separate mobile website or device redirect is required.
- Preserve DM Sans / Manrope and the existing QRK orange unless the user requests a new visual direction.
- Customer preview must hide owner controls. It is not an authorization boundary.
- Do not remove existing item, category, availability, or photo editing flows while polishing.
- Keep interface structure compact and operational. Avoid redundant page headings, padded decorative cards, nested wrappers, and repeated explanatory copy; use progressive disclosure and whole-card actions as defined in `AGENT/STYLE.md`.

## Scope and implementation

- Read the handoff docs before changes. Treat confirmed requirements and proposed future work differently.
- Workstream 3 is a provider-ready Supabase/PostgreSQL foundation, not an operational backend. Until a hosted development project, Auth flow, migrations, SQL tests and two-device checks are connected and verified, preserve the automatic local/demo fallback and do not claim cross-device behavior.
- Do not implement all roadmap features at once. Keep stages reviewable and usable.
- Do not claim persistence, authentication, offline operation, QR publishing, or ordering exists until actually implemented and verified.
- Use practical, plain language in the UI. Keep developer notes outside customer-facing production flows.
- No payment provider, database service, framework migration, AI provider, or paid subscription has been chosen by the user.
- Do not add real credentials to files, commits, browser code, or examples.
- Preserve image provenance. Use owned/licensed photos for a public launch.
- `deployment/original-hosting.json` is reference metadata, not a request to deploy. Work locally unless the user authorizes publishing in the new environment.
- The website's primary technical goal is to remain very lightweight, especially for customers on mobile devices and slow connections.
- Use the minimum code and dependencies needed for the requested result. Prefer the existing HTML, CSS and vanilla JavaScript approach while it remains practical; do not add a framework, package or abstraction without a concrete benefit.
- Keep customer payloads and runtime work small. Avoid duplicated implementations, oversized assets and decorative features that do not improve the core menu experience.

## Working habits

- Start with `npm start` and `npm run check`.
- In this repository, **cloud development** means the GitHub-hosted development stage: the `main` branch on `origin` and its GitHub Pages deployment at `https://jjoshyuson.github.io/QRK-MENU/`. It does not mean the Sites-hosted prototype or a production environment.
- After each completed and validated change, commit the intended files and push `main` to `origin`; this branch deploys the GitHub Pages development site at `https://jjoshyuson.github.io/QRK-MENU/`. Do not include unrelated working-tree changes in the commit, and do not describe a change as deployed until the Pages workflow succeeds.
- For layout work in this next Codex session, use available browser tools to verify representative phone, tablet and desktop sizes; do not rely only on syntax checks.
- Test meaningful flows and specific risks; avoid redundant tests that just mirror the source.
- Keep the latest working UI intact during changes.
- Update `docs/BUILD_STATUS.md` after each milestone and state what remains incomplete.
- Update `docs/PROGRESS_MAP.md` when milestone status, ordering, dependencies or exit criteria change.
- Ask only for decisions that materially change scope, privacy, external costs or access; proceed with routine reversible work.

## Component inventory maintenance

- Treat `dist/ui-components.css` as the source of truth for reusable component variables and visual rules across owner tools, Client Admin, Client Staff, QRK Admin, the customer menu and the unlinked `/components/` reference. Keep page composition and responsive placement in route stylesheets. Landing-page components are intentionally excluded.
- Use the stable inspect-element labels generated by `dist/ui-components.js`: every registered component exposes `data-component`, `data-variant` and `data-component-source`. Keep names human-readable and stable when markup changes.
- Before creating a reusable component, check `/components/` and the shared source named on its specimen so an existing pattern is reused when practical.
- Whenever a reusable component, shared variable or meaningful variant/state is added or materially changed, update `dist/ui-components.css`, its registry entry, and its matching `/components/` specimen in the same milestone.
- Keep the inventory dependency-free. It renders the production component layer for visibility, copy and reference; it is not a second implementation, automated test harness or product-navigation destination.
- Organize specimens by role and component family, and show representative default, selected, disabled, empty, loading, warning, success and destructive states where those states exist.
