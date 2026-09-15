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
| Chat roles, Git ownership, handoffs and local commands | `memory/workflow.md` | `docs/ORCHESTRATION.md`, `README.md` |

## Reading rule

For a routine UI change, read `workflow.md`, `AGENT/STYLE.md`, and the one or two feature topics involved. For product or roadmap work, read `product.md`, `progress.md`, and `decisions.md`. For backend/data work, read `workflow.md`, `architecture.md`, the relevant data topic, then `supabase/README.md`. Read longer authoritative documents only when implementation depends on their detail.

## Maintenance rule

- Record only stable facts, current state, decisions and useful file routes.
- Put unprocessed thoughts in `inbox.md`; clearly label them as notes or proposals rather than requirements.
- Do not paste long logs or duplicate detailed evidence.
- Update one matching topic file after a material decision or milestone change. Avoid recording the same update in several memory files.
- Date facts that can become stale and distinguish confirmed decisions from proposals.
- Last refreshed: September 9, 2026.
