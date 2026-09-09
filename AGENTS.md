# Working instructions

## Before starting work

- For every new build or change request, reply first with one concise discovery question and wait for the user's answer before editing files or implementing anything.
- If a prompt is vague, ambiguous, or could reasonably lead to different outcomes, do not spend time or tokens guessing. Ask the smallest number of focused questions needed to reduce uncertainty.
- After the answer, read `memory/README.md` and only the topic files relevant to the request. Consult the longer handoff documents when the memory index points to them or when detailed evidence is required.
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

## Scope and implementation

- Read the handoff docs before changes. Treat confirmed requirements and proposed future work differently.
- The next milestone is user review and focused verification of the complete UI-only Business Dashboard unless the user explicitly selects a later milestone.
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
- For layout work in this next Codex session, use available browser tools to verify representative phone, tablet and desktop sizes; do not rely only on syntax checks.
- Test meaningful flows and specific risks; avoid redundant tests that just mirror the source.
- Keep the latest working UI intact during changes.
- Update `docs/BUILD_STATUS.md` after each milestone and state what remains incomplete.
- Update `docs/PROGRESS_MAP.md` when milestone status, ordering, dependencies or exit criteria change.
- Ask only for decisions that materially change scope, privacy, external costs or access; proceed with routine reversible work.
