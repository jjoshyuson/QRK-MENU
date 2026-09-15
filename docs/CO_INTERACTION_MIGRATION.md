# Client Operations interaction migration

This is the concise routing inventory for the staged CO-wide grouped-settings and sheet migration. It classifies current interactions without changing their business behavior.

## Batch 1 — Business Profile and Settings

| Surface | Current interaction | Target classification | Status |
| --- | --- | --- | --- |
| Business Profile overview | Compact profile rows | Grouped settings entry | Migrated to shared list primitive |
| Business details | Multi-field dialog | Decision-heavy sheet | Migrated with draft/Done behavior |
| Business logo | Upload/remove dialog | Decision-heavy sheet | Migrated with draft/Done behavior |
| Customer menu background | Upload, veil, remove dialog | Decision-heavy sheet | Migrated with draft/Done behavior |
| Menu link | QR/link actions | Short modal | Migrated to focused read-only sheet |
| Table QR codes | Adaptive table grid and QR detail | Decision-heavy sheet with nested Back | Migrated; table grid and detail remain in one sheet |
| Settings overview | Account, Orders, Availability, Security rows | Grouped settings entry | Migrated to shared list primitive |
| Account details/password | Nested edit dialogs | Decision-heavy sheet with nested Back | Migrated with Back navigation |
| Order numbering/prep time | Nested edit dialogs | Decision-heavy sheet with nested Back | Migrated with Back navigation |
| Store availability/order sound | Immediate toggle rows | Focused settings sheet | Availability now drafts until Done; existing order behavior is preserved |
| Order-data clearing | Typed destructive flow | Short modal plus destructive confirmation | Keep separate from general settings sheet |
| Security/session actions | Review and logout actions | Focused settings sheet; confirmations remain modal | Migrated; destructive confirmation remains separate |

## Batch 2 — Staff and Menu Studio

| Surface | Current interaction | Target classification | Status |
| --- | --- | --- | --- |
| Add staff and permissions | Large form dialog | Decision-heavy sheet | Planned |
| Temporary credentials | One-time handoff dialog | Short modal | Keep |
| First-login password | Mandatory blocking dialog | Short modal | Keep; do not make dismissible |
| Staff enable/disable | Immediate row action | Simple confirmation or direct reversible action | Evaluate without changing permission behavior |
| Add/edit menu item | Multi-field item dialog | Decision-heavy sheet | Planned |
| Ordering option sets | List plus nested editor | Decision-heavy sheet with nested Back | Planned |
| Rename menu/add category | Single-field dialog | Short modal | Keep |
| Arrange categories | Ordered-list dialog | Decision-heavy sheet | Planned |
| Delete item | Destructive confirmation | Simple confirmation | Keep |
| Customer preview | Large responsive preview dialog | Purpose-built preview modal | Keep |

## Batch 3 — Operational evaluation

| Surface | Current interaction | Target classification | Status |
| --- | --- | --- | --- |
| Dashboard metrics/status/quick actions | Informational cards and direct navigation | Keep operational overview | No sheet migration planned |
| Order detail | Operational detail and completion actions | Short modal | Keep unless later editing is added |
| Cancel order | Destructive confirmation | Simple confirmation | Keep |
| Orders tabs/history | Operational navigation | Keep | No sheet migration planned |
| Tables grid and accept/clean/paid actions | Operational cards | Keep | No sheet migration planned |

## Shared contract dependency

- Consume the grouped-settings list and responsive sheet from the shared `dist/ui-components.css` and `dist/ui-components.js` contract being extracted by DA / Clients.
- Required behavior: draft until Done, Close/outside/Escape discard, nested Back navigation, focus trap and restoration, responsive inset/bottom geometry, safe-area handling, and reduced-motion support.
- Do not add a CO-only sheet controller, duplicate shared tokens, or mix the migration with service-gate schema changes.

## Review sequence

1. Rebase onto the pushed shared primitive candidate.
2. Migrate Business Profile and Settings as the first reviewable batch.
3. Verify phone, tablet, desktop, keyboard/focus return, reduced motion, light/dark contrast, and overflow.
4. Commit and push the coherent batch for user review; do not merge or deploy without explicit instruction.
