# QRK MENU memory index

Use this folder as the fast entry point for a new chat. Read this file first, then open only the topic files relevant to the task. These are concise routing notes, not replacements for authoritative handoff documents.

## Topic map

| Topic | Read | Authoritative detail |
| --- | --- | --- |
| Rough notes, random ideas and questions awaiting review | `memory/inbox.md` | Route stable conclusions to the relevant topic and authoritative document |
| Product purpose, audience and constraints | `memory/product.md` | `docs/PRODUCT_PLAN.md` |
| UI direction and editing flows | `memory/ui.md` | `AGENT/STYLE.md`, `docs/UI_AND_FLOWS.md` |
| Code structure, state and technical limits | `memory/architecture.md` | `docs/TECHNICAL_HANDOFF.md` |
| Device-local customer/staff order demo | `memory/orders.md` | `dist/app.js`, `docs/TECHNICAL_HANDOFF.md` |
| Tambay Open Tab customer workflow | `memory/open-tab.md`, `memory/orders.md` | `dist/menu/menu.js`, `docs/BUILD_STATUS.md` |
| Provider-ready database, RLS, RPC, Realtime, Storage and recovery | `memory/architecture.md`, `memory/orders.md` | `supabase/README.md`, `supabase/migrations/` |
| Supabase staging and future VPS migration | `memory/architecture.md`, `memory/orders.md` | `docs/DATABASE_SYNC_AND_PORTABILITY_PLAN.md` |
| Current progress and next milestone | `memory/progress.md` | `docs/PROGRESS_MAP.md`, `docs/BUILD_STATUS.md` |
| Confirmed decisions and unresolved choices | `memory/decisions.md` | `docs/PRODUCT_PLAN.md` |
| Local commands and verification | `memory/workflow.md` | `README.md`, `docs/BUILD_STATUS.md` |
| Multi-task roles, ownership and approval gates | `memory/workflow.md` | `docs/ORCHESTRATION.md` |
| Git baseline, candidate, deployment and cleanup gates | `memory/workflow.md` | `docs/DEPLOYMENT.md` |

## Reading rule

For a routine UI change, read `AGENT/STYLE.md`, `ui.md`, `architecture.md`, `progress.md` and `workflow.md`. For product or roadmap work, read `product.md`, `progress.md` and `decisions.md`; consult `inbox.md` only when reviewing newly captured ideas. For backend/data work, read `architecture.md`, `orders.md`, `progress.md`, `workflow.md`, then the full `supabase/README.md`. Planner and all durable roles read `workflow.md` and route to `docs/ORCHESTRATION.md`; QA and Deployment also read `docs/DEPLOYMENT.md`. Read the full authoritative document when implementation depends on nuance or verification evidence.

## Maintenance rule

- Record only stable facts, current state, decisions and useful file routes.
- Put unprocessed thoughts in `inbox.md`; clearly label them as notes or proposals rather than requirements.
- Do not paste long logs or duplicate detailed evidence.
- Update the matching topic file after a material decision or milestone change.
- Date facts that can become stale and distinguish confirmed decisions from proposals.
- Last refreshed: September 15, 2026.
