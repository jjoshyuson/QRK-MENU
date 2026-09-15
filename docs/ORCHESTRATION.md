# QRK MENU orchestration

This is the operating contract for planning, building, testing, and releasing QRK MENU without repeating the full project history in every chat.

## Fleet

| Chat | Owns | Reads first | Produces | Must not do |
| --- | --- | --- | --- | --- |
| Planner | Product decisions, architecture boundaries, milestone order, conflict detection | `memory/product.md`, `memory/architecture.md`, `memory/progress.md`, `memory/decisions.md` | Approved work packet and progress-map update | Routine implementation or deployment |
| Customer & Menu | Public menu, cart, checkout, Open Tab customer flow, Menu Studio parity | `memory/ui.md`, `memory/orders.md`, `memory/open-tab.md` | Focused feature branch and handoff | Merge or deploy |
| Client Operations | Dashboard, Client Admin/Staff, orders, tables, business settings | `memory/ui.md`, `memory/orders.md`, `memory/architecture.md` | Focused feature branch and handoff | Merge or deploy |
| Platform & Data | QRK Admin, Auth, tenant data, Supabase adapters/migrations, portability | `memory/architecture.md`, `memory/orders.md`, `supabase/README.md` | Focused feature branch, migration evidence, and handoff | Production changes without approval |
| QA | Release-candidate testing, visual review, accessibility, performance, regressions | Work packet, branch diff, relevant memory | Pass/fail report with reproducible evidence | Add unrelated features or deploy |
| Release | Integration, release notes, `main`, development deployment, workflow verification | Approved work packets and QA evidence | Integrated commit, deployment result, concise state updates | Change product scope during release |

Keep these chats durable while their role remains useful. Create temporary chats only for a bounded investigation that would pollute a core chat. Parallel subagents are optional and should be used for independent read-heavy checks, not as a default; they consume additional tokens.

## Source-of-truth map

| Information | Canonical location | Update owner |
| --- | --- | --- |
| Always-on repository rules | `AGENTS.md` | Planner/Release, rarely |
| Current stage and approved next work | `docs/PROGRESS_MAP.md` | Planner |
| Detailed validation and deployment evidence | `docs/BUILD_STATUS.md` | QA/Release |
| Stable product decisions | `docs/PRODUCT_PLAN.md` | Planner |
| Technical architecture | `docs/TECHNICAL_HANDOFF.md` and focused backend plans | Planner/Platform |
| Fast task routing and current facts | `memory/README.md` plus focused topics | Chat that changed the fact |
| Unreviewed ideas | `memory/inbox.md` | Any chat; Planner promotes after approval |

The same fact should have one authoritative home. Memory may summarize it in one or two lines and link to that home.

## Work packet

Planner gives a build chat a compact packet:

```text
Goal:
Approved behavior:
Out of scope:
Owned area/files:
Dependencies:
Acceptance checks:
Target branch:
```

If the request is already clear and isolated, the user may give this directly to a domain chat without visiting Planner.

## Build handoff

A domain chat stops after implementation, proportionate validation, and a focused commit:

```text
Branch and commit:
Outcome:
Files changed:
Checks passed:
Known limits/risks:
QA focus:
```

It does not merge `main`, deploy, or append release history. It updates a memory topic only when it created a stable fact that the next chat genuinely needs.

## QA gate

QA checks the acceptance criteria and changed risk surface. It starts narrow, then expands only when failures or shared behavior justify it. A QA result is one of:

- `PASS`: candidate is ready for Release.
- `PASS WITH KNOWN LIMIT`: user-approved limitation is documented.
- `FAIL`: reproducible blocker returns to the owning build chat.

QA does not turn observations into new scope. New ideas go to `memory/inbox.md` or Planner.

## Release gate

Release is the only normal writer to `main` and performs this sequence:

1. Confirm the approved branch/commit and QA result.
2. Check `main` and candidate ancestry; integrate only the intended commits.
3. Resolve conflicts without redesigning the feature. Return material product conflicts to Planner/build.
4. Run the release-level suite once, including `npm run check` and any targeted hosted/backend checks.
5. Update `docs/BUILD_STATUS.md`, `docs/PROGRESS_MAP.md` only if stage status changed, and the minimum relevant memory topic.
6. Push `main`, wait for the GitHub Pages workflow, and verify the deployed behavior.
7. Report the integrated commit, deployment run/result, validation, and rollback point.

Production remains a separate, explicitly approved release target.

## Token budget rules

- Start from the memory index; do not preload the documentation tree.
- Search headings and relevant sections before reading long files.
- Keep raw logs in tool output or external artifacts; store conclusions in docs.
- Do not repeat full background in handoffs—link to the authoritative file and name the relevant section.
- Do not run startup, full tests, browser matrices, merge checks, and deployment checks in every chat. Each gate runs the checks it owns.
- Prefer one build chat per coherent area, not one chat per tiny edit and not one giant chat for the whole product.
- Archive or replace a role chat when its context becomes stale or noisy; the repository handoff remains authoritative.
