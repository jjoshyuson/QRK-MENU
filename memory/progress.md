# Progress memory

As of September 9, 2026:

- The static UI prototype and local responsive polish pass are complete.
- The UI-only Business Dashboard milestone is complete: balanced overview, business profile/appearance/QR/link, expanded menu management, staff access, live/history orders with sample sales, and business settings.
- Desktop, tablet and phone layouts were checked at representative CSS widths; core item/category/photo/availability/customer-preview flows were exercised.
- Business Dashboard navigation and representative profile, category ordering, hidden-item, staff-account, order-status/history, store-status and responsive return flows were exercised. Phone/tablet now lands on Dashboard, uses a right-side hamburger drawer and opens Menu Studio separately. Menu Studio offers Photo editor, Customer view and a quick availability table; stock toggles update immediately. No page-level horizontal overflow was measured at representative phone, tablet and desktop widths.
- Category navigation now jumps to scroll sections and tracks the active section.
- Table view availability rows were enlarged for safer phone tapping; prices were removed only from that mode and stock controls remain on the far right.
- Remaining UI risks: physical iOS/Android keyboard behavior, full keyboard/screen-reader navigation, OS text scaling and a very large category set.
- The current prototype is published at `https://qrk-menu-studio.jjoshyuson.chatgpt.site` as Sites version 5. Desktop and responsive owner headers show a Development badge.
- Remote checks at 390, 768 and 1280 CSS pixels confirmed the Dashboard-first responsive layout, hamburger navigation, separate Menu Studio, customer preview, availability table, no page-level horizontal overflow and no console errors.
- A standalone customer-only `/menu/` development route is published in Sites version 7 with a separate lightweight payload. The dashboard link targets it, and remote 390/768/1280 checks confirm two columns, working category navigation, no owner controls, no Development badge and no console errors.
- Customer ordering and staff operations are complete locally as one same-browser UI-only demo. End-to-end table completion, pickup cancellation, store open/closed sync, refresh persistence, 390/768/1280 layout checks and clean consoles passed.
- The exact next proposed milestone is workstream 3 backend foundation for tenant-safe durable data, server validation and cross-device delivery. It has not been authorized.

Read `docs/PROGRESS_MAP.md` for milestone sequencing and `docs/BUILD_STATUS.md` for detailed evidence.
