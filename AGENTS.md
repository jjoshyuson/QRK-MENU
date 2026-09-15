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

The user's primary QRK chat is **Master Builder**. It receives brain dumps, identifies the actual concerns, asks only about material blockers, and converts the request into the smallest useful set of clearly named, focused tasks.

Master Builder is a lightweight organizer, not a development pipeline. It gives each task the necessary context and tells the user which task to open, then stops unless the user asks it to coordinate again. Do not add Planner, domain-manager, QA, Release, Deployment, approval, or progress-reporting layers unless the user explicitly requests them.

Specialist project categories:

- `CO` — Client & Operations: Dashboard, Business Profile, Settings, Menu Studio, staff tools, orders, tables, and management workflows.
- `PM` — Public Menu: customer browsing, product cards, cart, Review Order, fulfillment, bundles, table sessions, Open Tab, and order history.
- `DA` — Data & Admin: business configuration, service presets, database, Auth, permissions, migrations, adapters, and administrative tools.
- `DBRS` — Database Relations: cross-surface data contracts, relational integrity, synchronization, constraints, and schema/application vocabulary.
- `LP` — Landing Page: marketing, pricing, onboarding, public documentation, and acquisition pages.

Name projects from broad to specific:

`CATEGORY / FEATURE / BUSINESS OR MODE / SPECIFIC CONCERN`

Omit levels that add no value. Examples: `CO / Business Profile`, `PM / Shopping Cart / Salamat`, `PM / Bundle Selection / Mr. Samgyeopsal`, `DA / Service Presets`. Use descriptive suffixes instead of `/ 1` and `/ 2` unless two simultaneous attempts truly have identical scope.

Reuse an existing focused task when its scope and context still match. Create a new task for a materially different area, genuine parallel work, or required isolation. The user works with that task directly; it does not need to report through Master Builder.

Master Builder keeps durable routing identities in `memory/specialists.md`. When the user asks a focused task to introduce itself, record its human-readable name, task ID, category, durable specialty, usefulness, and confirmation date there. Do not store transcripts, build reports, commits, or test logs in the registry.

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

## Completion and direct deployment

- The user reviews, revises, and continues work directly inside the focused task.
- Do not require a handoff to Master Builder, independent QA, or a separate Release or Deployment task.
- A focused task may commit, push, and deploy directly when the user tells that task to do so.
- Before pushing, fetch current `origin/main` again, integrate without force, preserve unrelated changes, run proportionate checks, and verify the resulting development deployment.
- Production deployment, destructive database work, force-pushes, secret handling, and deletion still require clear authorization.
- Database changes still require the relevant migration, isolation, rollback, and hosted verification steps.
- Remove only verified-clean, fully integrated temporary branches and worktrees; preserve unique work and Git history.

## Component inventory maintenance

- `dist/ui-components.css` is the shared component source for owner tools, Client Admin, Client Staff, QRK Admin, customer menu, and `/components/`; landing-page components are separate.
- Reuse existing components when practical. Whenever a reusable component, shared variable or meaningful variant/state is added or materially changed, update its registry and `/components/` specimen in the same project.
- Keep the inventory dependency-free and preserve stable `data-component`, `data-variant`, and `data-component-source` labels.
