# QRK MENU direct deployment

This is a focused-task checklist, not a separate Release or Deployment role. Use it only when the user asks the current task to push or deploy.

## Before integration

1. Confirm the requested project scope and the task's intended commits.
2. Confirm the worktree contains no unrelated or uncommitted work that would be lost.
3. Fetch `origin` and record the exact current `origin/main`.
4. Integrate the task onto that current baseline without force-pushing or discarding unrelated changes.
5. Resolve only understood conflicts. Stop and explain any conflict that could change another project's behavior.

## Validate and deploy

1. Run `git diff --check` and the checks proportionate to the change. Run `npm run check` for shared behavior or a development deployment.
2. Push `main` without force.
3. Verify the exact GitHub Pages workflow triggered by that push.
4. Smoke-test `https://jjoshyuson.github.io/QRK-MENU/` and the changed flow.
5. Report the human-readable project name and outcome first, followed by the resulting commit, checks, workflow result, URL, and remaining limitations.

No QA handoff, approval-routing task, or separate release chat is required. The user works directly with the focused task and may tell that same task to deploy.

## Database boundary

Git deployment does not apply hosted database migrations automatically. Before a hosted data change, verify the exact Supabase target and follow `supabase/README.md`. Keep development and production authority separate. Destructive operations, production changes, secrets, and irreversible recovery actions require clear authorization.

## Cleanup

Cleanup is optional and occurs only after the deployment is verified and the user accepts it. Remove only clean worktrees and fully integrated temporary branches after confirming their commits are reachable from `main`. Preserve unique work, Git history, credentials, user data, and anything unmerged.
