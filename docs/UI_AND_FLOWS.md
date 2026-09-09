# UI and user flows

## Desktop

The dark sidebar now routes between Dashboard, Business profile, Menu Studio, Staff access, Orders and Settings. Dashboard balances live-order sample activity with menu health and quick actions. Menu Studio retains the compact management list and customer photo-grid preview. The expanded customer preview can represent mobile, tablet and desktop widths.

The non-menu sections are explicitly UI-only: profile and appearance controls, a sample QR/link, demo staff accounts and permissions, sample live/history orders and status progression, a basic sample sales summary/log, and account/order-numbering/open-status/session controls. They must not imply a connected backend or live service.

## Mobile and tablet

At widths of 1100 CSS pixels or less, the static prototype opens the responsive Business Dashboard. A top-right hamburger opens a right-side navigation drawer with Dashboard, Business profile, Menu Studio, Staff access, Orders and Settings. Menu Studio is a separate in-page view on the same route. This is a viewport-based layout switch, not user-agent detection, authentication or a redirect.

The intended hierarchy is:

1. Compact QRK owner header with a top-right hamburger.
2. Menu Studio toolbar with Customer view and Table view controls.
3. In Photo editor mode, menu title and category tabs followed by two photo tiles per row, grouped by category.
4. Owner add-item button and inline add tiles.
5. In Customer view, restaurant name and brief details appear above the customer-shaped photo menu.

Photo editor mode deliberately omits the restaurant identity header so the editing workspace starts with menu controls. Each dish tile shows its photo, name and PHP price. Owners see an edit button over the photo and an availability control. Customer preview restores the restaurant identity header and hides item-edit, availability and add-item controls. Sold-out status remains visible. Sample descriptions stay in the editor data/form but are not displayed on the latest compact tiles.

Table view is an owner-only availability workspace grouped by category. It uses tall, Messenger-inspired touch rows with a large round thumbnail and item name on the left and a direct Available/Out of stock control on the far right. Prices and option notes are omitted in this mode so service staff can change stock quickly without crowded or easy-to-mistap controls. It is not the customer menu and must not replace the two-column photo grid.

This is deliberately a simple food-menu grid. Do not reintroduce the previous large serif restaurant header, decorative slogans, or the compressed desktop table.

## Current item workflow

- Add through the main button or a category's add tile.
- Enter name, optional description, nonnegative price and category.
- Optionally select a JPG, PNG, WebP or AVIF file of up to 5 MB.
- Set availability; submit to update browser-memory state and both previews.
- Add an optional plain-text options note and choose whether an item is available, sold out or hidden. Hidden items remain visible to owners and are omitted from customer previews.
- Edit an existing item with its pencil control; change/remove its photo if desired.
- Delete only after the confirmation dialog.
- Photo removal or an item created without a photo uses an explicit no-photo state.

Photo selection is a local temporary preview. It does not upload to durable storage. A future backend must validate and resize images independently.

## Categories and menu naming

- Category tabs filter the editor/menu.
- The category plus button opens a category-name dialog.
- Blank and duplicate category names are rejected.
- A new empty category remains usable in owner view; customers do not need to see empty categories.
- Rename the main menu using its edit control.
- Category reordering is available through Arrange categories and updates all menu views in browser memory. Category rename and delete are not implemented.

## Expected checks in the next Codex session

Check at approximately 360, 390, 430, 768, 1024, 1280 and 1440 CSS pixels, and with increased text size. These are test sizes, not assumptions about specific device models. Verify touch targets, wrapping, dialog reachability with the keyboard open, and no unintended horizontal page scrolling.

Check long names, long category labels, free items, decimal prices, empty menus, all-sold-out menus, invalid image files, cancellation while an image loads, and switching between owner/customer modes after edits.

Customer preview should remain truthful. The current expanded frame is a scaled DOM clone, not a real device emulator. A visual owner/customer toggle is not a substitute for backend authorization in production.

## Updated category navigation

Mobile/tablet and customer previews show all populated sections in order, without an All tab. Category buttons scroll to sections; scrolling updates and centers the highlighted category. Owners also see empty sections and can add items there. The desktop management list retains category filtering and All items. Five extra empty seed categories are included to exercise the longer owner navigation bar.
