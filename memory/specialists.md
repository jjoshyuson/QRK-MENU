# Focused task registry

Master Builder uses this file only to route future QRK work to an existing useful task. Keep entries concise; do not store conversation transcripts, implementation reports, commits, test logs, or deployment history here.

| Task name | Task ID | Category | Specialty | Status | Last confirmed |
| --- | --- | --- | --- | --- | --- |
| DBRS / Salamat / Table Session and Menu Availability | `01a0a694-0d99-7f70-9649-d8d35b4fa47b` | DBRS | Table-session constraints, published-menu identity reconciliation, and Salamat/Tambay ordering relations | Reusable | 2026-09-15 |
| PM / Menu Card Content Simplification | `01a0a69f-cef2-7363-8252-a671de87af47` | PM | Public-menu card content, plus placement, and whole-card ordering semantics | Active | 2026-09-15 |
| PM / Cards | `01a0a69d-e060-7523-9577-f124f367f372` | PM | Public-menu card visual treatment and styling direction | Active | 2026-09-15 |

## Registration rule

When the user asks a QRK task to introduce itself, it should send Master Builder its human-readable name, task ID, category, durable specialty, and whether it remains useful. Master Builder updates one entry here and uses the closest matching active or reusable task for future routing. Create a new task only when no existing entry has suitable context or when isolation is necessary.
