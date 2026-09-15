# Workflow memory

## Start

1. Read `AGENTS.md` and `memory/README.md`, then only the topics relevant to the task.
2. Before UI work, read `AGENT/STYLE.md`. Before backend or database work, read `supabase/README.md`.
3. Before editing, fetch `origin`, resolve the exact current `origin/main`, and start from that clean shared baseline. Do not treat a dirty checkout or stale local `main` as the baseline.
4. Use a dedicated branch/worktree and a unique preview port when parallel work makes isolation useful.

## Working model

- Master Builder organizes brain dumps, creates or names focused tasks, tells the user where to work, and then stops unless asked to coordinate again.
- The user collaborates directly with each focused task through implementation, local testing, revisions, commits, and deployment.
- Do not create mandatory Planner, domain-owner, QA, Release, Deployment, approval, or reporting stages.
- Ask only when ambiguity materially changes behavior, scope, architecture, access, privacy, destructive data handling, cost, or production authority.
- Preserve unrelated work and make the smallest practical change using the existing stack and patterns.

## Finish

- Run focused checks and `npm run check` when shared behavior or deployment risk warrants it.
- Commit only intended files.
- A focused task may push or deploy directly when the user instructs it to do so; fetch current `origin/main` again first, integrate without force, run appropriate checks, and verify the resulting development deployment.
- Production, destructive database operations, force-pushes, secrets, and deletion still require clear authorization.
- “Cloud development” means `origin/main` and its GitHub Pages development deployment at `https://jjoshyuson.github.io/QRK-MENU/`.
- Git worktrees do not isolate database state. Isolate schema-changing or destructive data work.
