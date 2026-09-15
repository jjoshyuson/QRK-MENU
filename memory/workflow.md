# Workflow memory

- Full operating contract: `docs/ORCHESTRATION.md`.
- Start with `AGENTS.md` and `memory/README.md`, then load only the routed topic files.
- Orchestrator is the default user entry point and routes rough ideas through Planner, domain build tasks, QA, and Release as needed.
- Planner owns scope and milestone order; domain chats build isolated branches; QA validates release candidates; Release alone merges and deploys.
- Feature chats stop after a focused commit and concise handoff. They do not push `main` or maintain the release log.
- Match checks to risk. Use targeted checks during development and `npm run check` once at the QA/release gate for shared changes.
- Local preview: `npm start` at `http://127.0.0.1:4173`. Run it only when the task needs the application.
- “Cloud development” is `origin/main` and its GitHub Pages deployment at `https://jjoshyuson.github.io/QRK-MENU/`.
- Production requires separate explicit approval.
- After accepted integration, Release archives ephemeral tasks and removes only verified-clean managed worktrees and fully merged temporary branches.
- Last refreshed: September 15, 2026.
