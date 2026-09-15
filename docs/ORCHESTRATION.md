# QRK MENU lightweight task workflow

This document defines how Master Builder prepares focused Codex tasks. It intentionally has no mandatory Planner, QA, Release, or Deployment stages.

## Master Builder

Master Builder is the user's brain-dump and task-creation chat. It:

1. Identifies and organizes the user's concerns.
2. Asks only when ambiguity would materially change the requested result.
3. Creates or identifies clearly named, narrowly scoped tasks.
4. Gives each task the relevant context, constraints, and acceptance criteria.
5. Tells the user which task to open, then stops coordinating that work unless the user asks for help.

Master Builder does not automatically supervise implementation, collect progress reports, route work through QA, request approval, or create a separate release task.

## Focused tasks

Use a stable human-readable name, normally:

`CATEGORY / FEATURE / BUSINESS OR MODE / SPECIFIC CONCERN`

Categories are `CO` for Client and Operations, `PM` for Public Menu, `DA` for Data and Admin, `DBRS` for Database Relations, and `LP` for Landing Page.

Each focused task is the user's direct workspace for that area. The user may discuss, revise, implement, test, commit, push, and deploy from that same task. Do not create downstream Planner, QA, Release, Deployment, domain-owner, or reporting tasks unless the user explicitly asks for them.

## Start from the shared baseline

Before editing code, a focused task must:

1. Read only the relevant project guidance and files.
2. Fetch `origin`.
3. Resolve the exact current `origin/main` commit.
4. Start its branch/worktree from that commit and confirm the worktree is clean.
5. Preserve unrelated local work and use a unique local preview port when needed.

This baseline pull is required. A dirty checkout or stale local `main` is not the shared baseline. Database state is separate from Git and must be handled according to `supabase/README.md`.

## Work and completion

- Make the smallest coherent change and ask only material questions.
- Run checks proportionate to the change; use `npm run check` for shared behavior or before deployment.
- Let the user inspect user-visible work locally in the same task.
- Commit only intended files.
- Push or deploy only when the user tells that focused task to do so.
- Before pushing `main`, fetch again, integrate without force, preserve unrelated changes, run the appropriate checks, and verify the resulting development deployment.
- Production, destructive database work, force-pushes, secret handling, and deletion remain separately authorized.

No separate QA or Release handoff is required. A focused task may self-review and complete the full workflow directly with the user.
