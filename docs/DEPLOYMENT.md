# QRK MENU deployment contract

This document is the authoritative Git integration, development deployment and cleanup procedure. `docs/ORCHESTRATION.md` owns role routing and approval gates.

## Shared baseline and candidate creation

- The shared cloud-development baseline is the exact fetched commit at `origin/main`, not an assumed local `main` or a dirty checkout.
- Before implementation, fetch `origin`, resolve and record `origin/main`, then create a clean named branch and managed worktree from that commit. Do not overwrite or adopt unrelated local work as the baseline.
- Each implementation task owns only its bounded file set and commits a reviewable candidate. The handoff leads with the stable human-readable project name and plain-language outcome, then records the owning task title, branch/worktree, exact commit, intended files, checks, known limits and QA focus.
- A candidate sent to QA is immutable. Corrections produce a new commit and a new exact QA target; QA never certifies moving branch names or uncommitted files.

## Review and approval gates

1. QA independently tests the exact candidate commit and returns a report led by the human-readable project name and plain-language outcome, followed by PASS or FAIL and evidence.
2. After QA PASS for a user-visible application or software change, Orchestrator gives the user the exact ephemeral implementation task title to open and clearly tells them to run and test that named project locally there. Documentation-only changes may be summarized directly when there is nothing meaningful to inspect visually. QA PASS alone is not deployment approval.
3. The user explicitly approves the reviewed human-readable project name for deployment. Silence or approval of only a commit reference does not count.
4. A requested revision returns the same named project to implementation and QA before another local-review request.
5. Orchestrator sends Deployment a release request led by the approved human-readable project name and plain-language outcome, followed by the exact commit, QA evidence, approved scope, dependency/integration order and required smoke tests.

## Integration and GitHub Pages deployment

- Deployment fetches `origin` again and records the current `origin/main`. If it differs from the candidate's baseline, Deployment integrates intentionally and resolves conflicts without discarding unrelated shared work.
- Deployment confirms that the user explicitly approved the human-readable project name and candidate scope, integrates only approved commits into `main`, and runs the release gate once against the resulting commit.
- Deployment pushes `main` to `origin`. That push triggers the GitHub Pages development deployment at `https://jjoshyuson.github.io/QRK-MENU/`.
- A push is not a verified deployment. Deployment waits for the Pages workflow, confirms its result, smoke-tests the development URL and reports the integrated commits, resulting `main` commit, checks, workflow result, URLs, rollback target and remaining limits.
- Production is a separate target and always requires separate authorization.

## Git and database isolation

- Git branches and worktrees isolate files and commits; they do not isolate database state.
- Schema-changing, migration, destructive or shared-data work must use the repository's declared database workflow and an isolated database target when concurrent tasks could interfere.
- Before any hosted database operation, verify the explicit target and linked project. Never treat a feature branch as protection for a shared database.
- Preserve migration history and never run destructive recovery, reset or cleanup against shared data without explicit authorization and a verified target.

## Cleanup gates

Cleanup is allowed only after Deployment verifies the development deployment and the user accepts the result. Before removing anything, confirm that the task is ephemeral, its worktree is clean, its intended commits are reachable from accepted `main`, and every temporary branch being removed is fully merged. Preserve durable role tasks, Git history, release evidence, credentials, user data and all unique or unmerged work. A failed precondition stops cleanup and is reported to Orchestrator.
