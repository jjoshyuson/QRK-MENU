# QRK MENU orchestration workflow

This document is the authoritative contract for coordinating concurrent Codex tasks. Product, architecture, UI and release requirements remain in their topic-specific sources.

## Roles

- **Orchestrator** is the user-facing intake and coordination task. It turns rough requests or brain dumps into bounded work, dispatches independent work in parallel when useful, and returns control promptly instead of synchronously babysitting running tasks.
- **Planner** resolves product scope, contracts and dependencies, then sends bounded work packets to the relevant durable domain owner. It does not routinely implement, verify, integrate or deploy.
- **Domain owners** are durable senior coordinators for QRK Client & Operations, QRK Customer Menu and QRK Platform Data. Each owns decisions and sequencing in its product area, creates the smallest useful set of ephemeral implementation tasks and consolidates their candidates and risks.
- **Ephemeral implementation tasks** own one bounded candidate in an isolated branch/worktree. The user may open these tasks directly, answer their questions there and refine their work without routing routine conversation through Orchestrator.
- **QA** independently verifies every completed build candidate. QA reports evidence, regressions, limitations and either PASS or FAIL; it does not integrate or deploy.
- **Deployment** is the only normal integrator and deployer. It integrates only an immutable candidate explicitly approved by the user after QA and local review, runs the release gate, pushes `main`, verifies the development deployment and reports the result.

Orchestrator, Planner, the three domain owners, QA and Deployment are durable roles. Implementation tasks are ephemeral.

## Candidate lifecycle

1. **Intake:** Orchestrator captures the request, identifies decisions that materially affect scope, sends the organized request to Planner and returns control promptly.
2. **Plan and route:** Planner creates a dependency-aware to-do list and sends each bounded work packet to QRK Client & Operations, QRK Customer Menu or QRK Platform Data. Cross-domain dependencies are explicit before implementation starts.
3. **Domain dispatch:** The owning domain creates the smallest useful set of ephemeral implementation tasks. Each receives its scope, authoritative references, approved `origin/main` baseline, branch/worktree ownership, acceptance criteria, validation expectations and explicit non-goals.
4. **Direct collaboration and delegated judgment:** The user may talk directly with the owning domain or implementation task. Domain owners and implementation tasks resolve routine, reversible details from the approved packet, existing patterns and documented product intent; domain owners may answer and record routine assumptions. Ask the user only when unresolved ambiguity would materially change product behavior or scope, architecture, access or privacy, destructive data handling, cost, or release authorization and cannot be responsibly inferred.
5. **Build candidate:** The task edits only owned files, runs proportionate checks and commits its intended changes. Its handoff includes the branch/worktree, exact commit, outcome, checks, limitations and QA focus. It does not merge, push `main` or deploy.
6. **QA gate:** Every completed candidate goes to QA as an immutable commit. A FAIL returns through the domain owner for correction and another QA pass. A PASS returns to Orchestrator, never directly to Deployment.
7. **Local review gate:** Orchestrator identifies the QA-passed candidate and asks the user to open and test it locally. QA PASS is evidence, not deployment authorization.
8. **Approval gate:** After local review, the user explicitly approves or rejects the candidate. Rejected work returns to its domain owner. Silence or a QA PASS never counts as approval.
9. **Deployment gate:** Orchestrator sends the approved commit and evidence to Deployment. Deployment verifies scope and approvals, integrates intentionally, runs the release gate once, pushes `main`, verifies GitHub Pages and reports the exact result.
10. **Acceptance and cleanup:** After verified deployment and user acceptance, completed ephemeral tasks may be archived and only verified-clean managed worktrees and fully merged temporary branches may be removed. Durable roles, Git history and unique work remain.

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

### Orchestrator to Deployment

- User-approved candidate and exact commit
- QA PASS evidence
- Scope approved during local review
- Integration order or dependency notes
- Required release checks and development smoke tests
- Confirmation that the user explicitly authorized release

### Deployment to Orchestrator

- Integrated commits and resulting `main` commit
- Release-gate results
- Push and GitHub Pages workflow result
- Development URLs and smoke-test evidence
- Rollback target and any remaining limitations

## Cleanup safety contract

Cleanup may occur only after verified deployment and explicit user acceptance. The actor performing cleanup must first confirm that:

- the target is an ephemeral completed task;
- its worktree is clean;
- its intended commits are reachable from the accepted `main` history;
- its temporary local and remote branches are fully merged;
- no unique or unmerged changes, untracked work, credentials or user data would be lost.

The completed task may then be archived and only its verified-clean managed worktree and fully merged temporary branches removed. Cleanup must never delete Git history, rewrite shared history, remove durable role tasks, or touch unique/unmerged work. Any failed precondition stops cleanup and returns a precise report to Orchestrator.

## Boundaries

- One task owns each candidate and commits only its own changes.
- Cross-cutting decisions return to Orchestrator or Planner before competing implementations begin; domain owners do not silently redefine another domain's contract.
- QA does not imply release approval.
- Only explicit user approval after local candidate review authorizes Deployment.
- Only Deployment normally integrates to and pushes `main` or deploys development.
- Production deployment remains separately authorized and is not implied by this development workflow.
