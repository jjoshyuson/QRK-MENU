# Codex universal personalization

Work efficiently and preserve project context without loading unnecessary material.

## Global defaults

- Treat the user’s current request and confirmed project decisions as authoritative.
- Ask a focused question only when the answer could materially change scope, cost, access, privacy, or implementation. Proceed with routine reversible work.
- Inspect relevant files and Git state before editing. Search first and read only what the task needs.
- Prefer the existing stack, patterns, components, utilities, and dependencies. Keep changes small and avoid speculative infrastructure.
- Preserve unrelated work, credentials, user data, and human control over production, destructive actions, and shared history.
- Match validation to risk. Do not run broad suites repeatedly when a targeted check proves a small change.
- Keep updates concise and lead with outcomes.

## Establishing a project

When a repository lacks useful guidance, propose or create a concise root `AGENTS.md` containing only:

- The product purpose and non-negotiable constraints.
- The smallest startup and validation commands.
- Repository-specific architecture and file-routing rules.
- Git ownership and release boundaries.
- Links to authoritative product, architecture, design, and workflow documents.

Keep detailed procedures out of `AGENTS.md`. Put repeatable workflows in a skill or focused workflow document, stable project facts in concise topic memory, and detailed evidence in status or release records. Use nested `AGENTS.md` files only when a subtree genuinely needs different rules.

If the project benefits from checked-in memory, create `memory/README.md` as a small index and only the topic files that contain useful stable facts. The normal reading path is:

`AGENTS.md → memory/README.md → relevant topic → authoritative document when needed`

Do not load the entire documentation tree, duplicate specifications into memory, or use memory as a raw chat/build log. Native Codex memory is a helpful recall layer; required team rules still belong in checked-in guidance.

## Multi-chat projects

For concurrent development, prefer one chat, one branch, and one worktree. Each chat owns only its intended changes.

Use durable role chats when a project is large enough:

- Orchestrator: the default user-facing intake that converts rough ideas into plans and coordinates the other roles.
- Planner: scope, decisions, architecture, dependencies, and milestone order.
- Domain build chats: bounded implementation areas and focused branches.
- QA: independent release-candidate verification.
- Release: the only normal integrator/deployer to shared development or production branches.

Feature chats hand off a branch/commit, outcome, checks, limits, and QA focus. They do not merge or deploy unless the project explicitly assigns them the Release role.

For bounded work, prefer ephemeral Codex-managed worktrees. After the intended commits are merged, required checks pass, and the user accepts the result, archive the task and remove its clean worktree and fully merged temporary branches. Preserve durable Orchestrator, Planner, QA, and Release tasks, Git history, and release evidence.

Use subagents only when the user or project guidance requests them and independent parallel work materially helps. Prefer read-heavy delegation; parallel write-heavy work often adds conflicts and consumes more tokens.

## Documentation updates

Update documentation only when its truth changes:

- Progress map: current stage, approved next work, blockers, and dependencies.
- Status/release log: meaningful validation and deployment evidence.
- Architecture/product docs: durable decisions and contracts.
- Memory: a short current fact and a link to its authoritative source.

Avoid recording the same milestone in every file. A routine fix should not trigger a full documentation and release ceremony.

## Completion

For feature work: review the diff, run proportionate checks, commit only owned changes, and provide the project’s handoff. For Release work: verify approvals and QA evidence, integrate intentionally, run the release gate once, update the minimum required records, deploy to the authorized target, and verify the result.
