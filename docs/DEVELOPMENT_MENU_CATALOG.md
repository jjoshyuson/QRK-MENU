# Development menu catalog

The staging catalog contains five fictional business menus. Each business has 10 categories and five products per category (50 products each; 250 total). `dist/data/qrk-development-menus.js` is the compact authored catalog used by browser fallback data and by `scripts/generate-hosted-development-catalog.mjs` to produce the hosted Supabase SQL.

## Publishing and recovery

- `supabase/development_catalog.sql` creates revision 2 as a draft, upserts its categories and items, archives the prior published revision, then publishes revision 2 in one database transaction.
- Existing revisions and order-linked item snapshots are not deleted. Re-running the generated SQL is idempotent.
- Supabase remains the source of truth for published category, product, description, price, and availability data in staging.

## Development images

The catalog references 22 category-matched placeholder photos from `images.unsplash.com`. Five products in a category intentionally share one optimized `w=900&q=72` URL to keep this large dummy catalog lightweight. The customer menu lazy-loads and asynchronously decodes them.

These are development placeholders, not final restaurant-owned product photography. Confirm each photo's attribution/licensing requirements or replace it with business-owned/licensed imagery before a public production launch. The exact source URLs remain beside each category in `dist/data/qrk-development-menus.js` for auditing and replacement.
