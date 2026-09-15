# QRK MENU orchestration workflow

This document is the authoritative contract for coordinating concurrent Codex tasks. Product, architecture, UI and release requirements remain in their topic-specific sources.

## Roles

- **Orchestrator** is the user-facing intake and coordination task. It turns rough requests or brain dumps into bounded work, dispatches independent work in parallel when useful, and returns control promptly instead of synchronously babysitting running tasks.
- **Planner** resolves product scope, contracts, dependencies and implementation packets. It does not implement, integrate or deploy unless the user separately changes its role.
- **Ephemeral build tasks** own one bounded candidate in an isolated branch/worktree. The user may open these tasks directly, answer their questions there and refine their work without routing routine conversation through Orchestrator.
- **QA** independently verifies every completed build candidate. QA reports evidence, regressions, limitations and either PASS or FAIL; it does not integrate or deploy.
- **Release** is the only normal integrator and development deployer. It integrates only a candidate explicitly approved by the user after local review, runs the release gate, pushes `main`, verifies the development deployment and reports the result.
- **Cleaner** performs post-acceptance cleanup. It is dispatched only by Orchestrator after Release reports successful deployment verification and the user explicitly accepts the result.

Orchestrator, Planner, QA, Release and Cleaner are durable roles. Feature-specific build tasks are ephemeral.

## Candidate lifecycle

1. **Intake and split:** Orchestrator captures the request, identifies decisions that materially affect scope, and splits independent work into bounded candidates. Parallel work is preferred only when ownership is clear and merge conflicts are unlikely.
2. **Dispatch and handoff:** Each build task receives its scope, authoritative references, branch/worktree ownership, acceptance criteria, validation expectations and explicit non-goals. Orchestrator tells the user which tasks were started and yields control.
3. **Direct collaboration:** The user may talk directly with any build task. Build-task questions stay in that task by default. Escalate to Orchestrator only when a decision affects multiple candidates, shared architecture, sequencing, cost, privacy, access or release scope.
4. **Build candidate:** The task inspects inherited changes, edits only owned files, runs proportionate checks and commits its intended changes. Its handoff includes the commit, outcome, checks, limitations and QA focus. It does not merge, push `main` or deploy.
5. **QA gate:** Every completed build candidate goes to QA. A FAIL returns to the owning build task for correction and another QA pass. A PASS returns to Orchestrator, never directly to Release.
6. **Local review gate:** Orchestrator identifies the QA-passed candidate and asks the user to open and test that local candidate. QA PASS is evidence, not release authorization.
7. **Approval gate:** After local review, the user explicitly approves or rejects the candidate. Rejected work returns to the appropriate build task. Silence or a QA PASS never counts as approval.
8. **Release gate:** Orchestrator sends the approved commit and evidence to Release. Release verifies scope and approvals, integrates intentionally, runs the release gate once, pushes `main`, verifies the GitHub Pages development deployment and reports the exact result. No other role performs these actions in the normal workflow.
9. **Acceptance and cleanup:** After successful deployment verification, Orchestrator asks for or records the user's explicit acceptance. Only then may Orchestrator dispatch Cleaner.

## Handoff contracts

### Build task to QA

- Candidate name and owning task
- Branch/worktree and exact commit
- Intended file set and inherited changes excluded from ownership
- User-visible outcome and acceptance criteria
- Checks run and results
- Known limitations, risks and focused QA requests

### QA to Orchestrator

- Candidate and exact commit tested
- PASS or FAIL
- Evidence for each acceptance criterion
- Regressions, unresolved risks and environment limitations
- Exact retest target when failed

### Orchestrator to Release

- User-approved candidate and exact commit
- QA PASS evidence
- Scope approved during local review
- Integration order or dependency notes
- Required release checks and development smoke tests
- Confirmation that the user explicitly authorized release

### Release to Orchestrator

- Integrated commits and resulting `main` commit
- Release-gate results
- Push and GitHub Pages workflow result
- Development URLs and smoke-test evidence
- Rollback target and any remaining limitations

## Cleaner safety contract

Cleaner may act only after Orchestrator dispatches it following verified deployment and explicit user acceptance.

Before removing anything, Cleaner must confirm that:

- the target is an ephemeral completed task;
- its worktree is clean;
- its intended commits are reachable from the accepted `main` history;
- its temporary local and remote branches are fully merged;
- no unique or unmerged changes, untracked work, credentials or user data would be lost.

Cleaner may archive the completed ephemeral task and remove only the verified-clean managed worktree and fully merged temporary branches. It must never delete Git history, rewrite shared history, remove durable role tasks, or touch work with unique/unmerged changes. Any failed precondition stops cleanup and returns a precise report to Orchestrator.

## Boundaries

- One task owns each candidate and commits only its own changes.
- Cross-cutting decisions return to Orchestrator or Planner before competing implementations begin.
- QA does not imply release approval.
- Only explicit user approval after local candidate review authorizes Release.
- Only Release normally integrates to and pushes `main` or deploys development.
- Production deployment remains separately authorized and is not implied by this development workflow.
