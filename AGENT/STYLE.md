# QRK MENU interface style

This is the project’s visual source of truth. Read it before every UI, UX, layout, styling, branding, or responsive change. Apply it together with `AGENTS.md`; explicit user requirements and established QRK product decisions remain higher priority.

## Visual direction

- Keep QRK lightweight, compact, operational, and easy to scan. The product is a working surface, not a collection of decorative dashboard panels.
- Preserve the existing QRK assets, global theme tokens, and approved typography: Inter for interface text and Source Serif 4 only for customer-facing brand and menu headings. Use the shared typography variables in `dist/ui-components.css` rather than route-specific font stacks, and use shared semantic variables before adding route-specific colors.
- Prefer one continuous content plane. Use fills, borders, shadows, blur, and rounded containers only when they clarify hierarchy or interaction.
- Do not add headings, subtitles, eyebrow labels, help text, or wrappers that repeat information already supplied by navigation or a control label.

## Cards and progressive disclosure

- Do not use a card merely because content exists. A card must represent a meaningful action, state, or tightly related set of information.
- Keep cards compact: minimal internal padding, short labels, no decorative empty space, and no stacked explanatory copy unless it prevents a real mistake.
- When a card represents one destination or task, make the entire card a semantic button or link. Do not place a small action inside an otherwise inert card.
- On overview pages, show only the setting or destination name when context is sufficient. Move fields, secondary descriptions, and editing controls into a focused dialog, sheet, or detail view.
- Avoid nested cards. Use dividers, alignment, type weight, and spacing to organize detail views.
- Settings overview pages use one compact rounded list container. Each setting is a full-width row with a clean outline icon, a short left-aligned label, and a right-aligned chevron; separate outlined cards are not the QRK Settings pattern.

## Material sheets and form editing

- Decision-heavy forms open from a compact settings row into the shared QRK material sheet. Do not expose an entire multi-step form on the overview or stack dialogs and cards.
- Desktop and tablet use an inset floating sheet with continuous rounded corners; phone attaches the same sheet to the bottom edge with rounded top corners. Preserve the underlying page behind a separate dimmed backdrop.
- Use the standard sheet header: Close or Back on the left, a centered title, and Done on the right. Nested decisions replace the sheet body and return with Back; they never open a second sheet above the first.
- Treat sheet edits as drafts. Done commits them to the parent workflow; Close, backdrop click, or Escape discards them and restores the prior values and focus.
- Use shared grouped rows, checkbox choices, choice popovers, focused value editors, and ordered lists. Do not use browser-native select, date, or time popups when the shared QRK control exists.
- Keep the charcoal material restrained: translucent dark surface, soft blur and ambient shadow, faint light separators, white primary text, muted secondary text, and one accent color. Avoid opaque gray slabs and decorative nesting.
- Sheet controls and choice popovers are borderless at rest. Separate related values with one low-contrast internal divider and use tonal fill, spacing and blur for grouping; do not outline the trigger, popup, grouped section, every ordered row and its surrounding container at the same time. A visible outline is reserved for keyboard focus or a state that cannot be communicated by fill and text alone.
- Editable sheet values live inside the same dark tonal grouped surface as their labels. Prefer a compact approximately 50/50 label-left/value-right grid with both columns left-aligned and one subtle divider between peers. Inputs, textareas and selects merge into the row without a native bevel, independent rim, or nested field card. Keep both halves left-aligned, pin custom-choice chevrons to the value column's far-right edge, and preserve visible focus and validation states.
- Bounded counts use the shared cylindrical scroll-snap number wheel with a fixed center selection band, uniform type size, touch scrolling, option tapping, arrow keys, buffered digit entry, and subtle supported-device haptics as values cross center. Keep min/max validation on the hidden source field.

## Navigation and control grouping

- Keep peer navigation choices on one line when three compact labels fit. In Orders, `Received`, `Preparing`, and `Tables` are exactly three equal columns in one uninterrupted row.
- Group related top-bar actions in one parent container. On responsive Orders, History sits directly beside the hamburger menu in that shared action group.
- Do not add separate wrapper elements for each control unless layout, semantics, or state management requires them.
- Keep operational content prominent; navigation and utility controls should consume as little vertical space as practical.

## Responsive and accessible behavior

- Preserve semantic buttons, links, tabs, dialogs, labels, and visible keyboard focus.
- Keep interactive targets at least 44 by 44 CSS pixels while making the visual treatment compact.
- Never rely on color alone for selected, warning, success, or disabled state.
- Maintain readable contrast in both global theme modes and honor reduced-motion and reduced-transparency preferences.
- Prevent horizontal page scrolling. Let grids reflow deliberately when labels or touch targets would become cramped.
- Validate representative phone, tablet, and desktop widths, keyboard access, text reflow, and both light and dark modes when applicable.

## Focused public-menu sheets

- Keep public-menu sheet controls borderless at rest. Use tonal fill, spacing, blur, ambient shadow, and one quiet divider between peer rows; reserve visible outlines for keyboard focus or states that cannot be communicated by fill and text alone.
- Use the shared focused bottom-sheet pattern for customer configuration, fulfillment, table choice, and payment choice. Keep roughly the top 10% of the previous menu context visible behind the sheet.
- Consolidate an item's persistent options and add-ons in one scannable sheet. Lead with a large dish photo and an overlaid close control, keep Special request visible as a labeled text area, and use one bottom pill action that pairs Add to order or Update item with the calculated price.
- Keep Review Order focused on items, optional order details, and a subtotal that is always visible. Ask quick-service customers to choose Pickup or Serve at table only after they proceed; a fulfillment tap advances directly to table choice when required, then payment.
- When an item is edited from Review Order, layer the item sheet above the still-open cart. Updating or cancelling must reveal the same Review Order state underneath and restore focus to that item's refreshed Edit control.
- Keep alerts, errors, confirmations, order history, and the optional “Add name or order notes” review section in their established patterns unless a separate product decision changes them.
- Preserve native dialog semantics, trapped focus, Escape dismissal where cancellation is allowed, focus restoration, safe-area padding, reduced-motion behavior, and zero horizontal overflow.

## Implementation discipline

- Preserve the existing HTML, CSS, and vanilla JavaScript stack. Prefer a small markup or stylesheet change over a new component system or dependency.
- Reuse existing icon rendering and design tokens. Do not use emoji as interface icons or create duplicate icon treatments.
- Remove obsolete selectors and wrappers when a layout is simplified, but do not disturb unrelated working flows.
- Update `docs/BUILD_STATUS.md`, `docs/PROGRESS_MAP.md` when milestone structure changes, and concise memory after meaningful visual decisions.
