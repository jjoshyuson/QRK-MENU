# QRK MENU working instructions

Keep work lightweight, focused, and easy for the user to review. Use `memory/README.md` as the routing index and read only the topics needed for the current project.

## Product guardrails

- QRK MENU is a lightweight digital-menu and ordering product for small businesses, initially Philippine restaurants.
- `dist/` contains authored source. Preserve the existing HTML, CSS, and vanilla JavaScript stack while practical.
- Desktop is the management workspace. Mobile and tablet open Dashboard. Menu Studio remains a separate customer-shaped editor.
- Preserve established item, category, image, availability, ordering, table, preview, and permission flows unless the project explicitly changes them.
- Follow `AGENT/STYLE.md` for UI work. Keep interfaces compact and operational; avoid padded decorative cards, nested wrappers, repeated headings, and unnecessary explanatory copy.
- Customer preview hides owner controls but is not an authorization boundary.
- Keep provider calls behind existing adapters. Read `supabase/README.md` before backend, Auth, Realtime, Storage, migration, recovery, or destructive data work.
- Do not claim persistence, authentication, offline use, QR publishing, payments, or cross-device behavior until verified.
- Never commit credentials or secrets. Preserve image provenance.

## Master Builder workflow

The user's primary QRK chat is **Master Builder**. It receives brain dumps, identifies the actual concerns, asks only about material blockers, and converts the request into the smallest useful set of named specialist projects.

Master Builder plans directly. Do not add Planner, domain-manager, QA, or Deployment forwarding layers unless the user explicitly requests them.

Specialist project categories:

- `CO` — Client & Operations: Dashboard, Business Profile, Settings, Menu Studio, staff tools, orders, tables, and management workflows.
- `PM` — Public Menu: customer browsing, product cards, cart, Review Order, fulfillment, bundles, table sessions, Open Tab, and order history.
- `DA` — Data & Admin: business configuration, service presets, database, Auth, permissions, migrations, adapters, and administrative tools.
- `LP` — Landing Page: marketing, pricing, onboarding, public documentation, and acquisition pages.

Name projects from broad to specific:

`CATEGORY / FEATURE / BUSINESS OR MODE / SPECIFIC CONCERN`

Omit levels that add no value. Examples: `CO / Business Profile`, `PM / Shopping Cart / Salamat`, `PM / Bundle Selection / Mr. Samgyeopsal`, `DA / Service Presets`. Use descriptive suffixes instead of `/ 1` and `/ 2` unless two simultaneous attempts truly have identical scope.

Reuse an existing specialist task when its scope and context still match and it has no conflicting unfinished candidate. Create a new task only for a materially different area, genuine parallel work, or required isolation. Every task reports directly to Master Builder.

## Starting a coding project

Before editing, every coding task must:

1. Read `memory/README.md`, then only its category topic and directly relevant contracts.
2. Fetch `origin` and resolve the exact current `origin/main` commit.
3. Confirm the intended worktree is clean.
4. Create a dedicated `codex/` branch and worktree from that exact remote commit. Never start from a dirty checkout or stale local `main`.
5. Declare its human-readable project name, category, scope, expected files, branch/worktree, baseline, and unique local preview port.
6. Inspect the relevant implementation before changing it.

Parallel coding projects may proceed independently, but they must not share a writable worktree, branch, preview port, or destructive database state.

## Questions and decisions

- Infer routine, reversible details from the user's request, existing behavior, relevant memory, and established patterns.
- Ask one focused question only when unresolved ambiguity could materially change product behavior or scope, architecture, access or privacy, destructive data handling, cost, or release authority.
- When a non-material detail is uncertain, choose the smallest reversible option, record the assumption in the task report, and continue.
- Never ask the user to reconfirm behavior they already requested.

## Implementation and self-review

- Own one bounded candidate and change only intended files.
- Prefer the smallest coherent implementation and avoid speculative infrastructure.
- Run focused checks for the changed behavior. Run `npm run check` once before presenting a shared-behavior or release candidate.
- UI work requires representative phone, tablet, and desktop checks plus relevant keyboard, focus, contrast, reflow, state, and reduced-motion checks.
- Review the diff and commit the complete candidate before requesting user approval.
- Update documentation only when its truth changes. `docs/BUILD_STATUS.md` stores meaningful release evidence; `docs/PROGRESS_MAP.md` changes only when milestone direction changes; memory stores concise current facts and routes.

## Completion report and local review

Every completed coding task sends Master Builder a direct report containing:

- Human-readable project name and category.
- Plain-language outcome.
- Exact task title.
- Local startup command, claimed port, URL, and short test checklist.
- Branch/worktree, baseline, and candidate commit as secondary technical references.
- Intended files, checks performed, assumptions, and known limitations.

For user-visible work, Master Builder opens or names the exact specialist task and asks the user to run and physically review that local candidate. Revisions remain under the same project name and return to the same specialist task when practical.

Only explicit user approval using the human-readable project name authorizes deployment. Documentation-only changes may be reviewed from a plain-language summary when no meaningful visual test exists.

## Direct release

The approved specialist task or Master Builder may release directly; do not create separate QA or Deployment tasks by default.

Before pushing:

1. Acquire the single QRK release slot so two tasks cannot update `main` simultaneously.
2. Fetch current `origin/main` again.
3. Confirm candidate scope and ancestry, then integrate onto current `origin/main` without overwriting unrelated work.
4. Resolve only understood conflicts and preserve every already-deployed change.
5. Run `npm run check` once and `git diff --check`.
6. Push `main` without force.
7. Verify the exact GitHub **Deploy development** run and smoke-test `https://jjoshyuson.github.io/QRK-MENU/` before reporting deployment success.

Database changes require their relevant migration, isolation, rollback, and hosted verification steps in addition to this Git release flow.

After verified deployment and user acceptance, archive the completed specialist task when it is no longer useful to retain. Remove only verified-clean, fully integrated temporary branches and managed worktrees. Preserve unique work, Git history, release evidence, Master Builder, and any reusable specialist tasks.

## Component inventory

- `dist/ui-components.css` is the shared component source for owner tools, Client Admin, Client Staff, QRK Admin, customer menu, and `/components/`; landing-page components are separate.
- Reuse existing components when practical. When a shared component or meaningful state changes, update its registry and `/components/` specimen in the same project.
- Keep the inventory dependency-free and preserve stable `data-component`, `data-variant`, and `data-component-source` labels.
