# R&L Client and Live Orders

R&L is an operator-created QRK Admin client with the persisted local identity `rnl`. It is deliberately not duplicated in the static `DEVELOPMENT_CLIENTS` fixture registry. Its customer route is `/menu/?business=rnl`. The route uses the trusted same-origin development adapter; it never calls R&L directly and never receives an integration credential.

QRK Admin currently stores operator-created clients in browser `localStorage`, scoped to the exact origin. The local development Admin therefore shows R&L as the eleventh client on `http://127.0.0.1:4191`, while a fresh GitHub Pages origin continues to show the ten static fixtures until hosted provisioning replaces browser-local persistence.

## Server-only configuration

Set `QRK_RNL_SUPABASE_URL`, `QRK_RNL_PUBLISHABLE_KEY`, and `QRK_RNL_API_KEY` only in the process environment that runs the QRK server or catalog command. The API key is sent only as the `p_api_key` RPC argument by `scripts/rnl-integration.mjs`. Runtime catalog and order receipts are stored under the gitignored `.qrk-runtime/` directory and contain no credential.

## Manual catalog refresh

Preview the current R&L-to-QRK diff without changing the active projection:

```powershell
npm.cmd run rnl:catalog
```

The command prints a fingerprint plus added, updated, removed, and image-transfer counts. Apply only that reviewed snapshot:

```powershell
npm.cmd run rnl:catalog -- --apply --fingerprint=<previewed-fingerprint>
```

Apply re-reads R&L and refuses the change if the catalog fingerprint changed after preview. Valid product images are copied from the expected R&L `menu-icons/products/` public-storage path into gitignored QRK runtime storage. The applied catalog exposes only stable same-origin QRK asset URLs. A source URL plus product update timestamp identifies an unchanged asset; its content hash deduplicates the stored file. Missing, invalid, oversized, or failed images fall back without aborting the catalog. A browser visit never refreshes the catalog automatically or calls R&L storage.

## Automatic order path

Run `npm.cmd start -- --port 4191`, then open `http://127.0.0.1:4191/menu/?business=rnl`. Checkout posts the QRK order to `POST /__qrk/integrations/rnl/orders`. The trusted adapter validates the imported catalog and totals, constructs the documented R&L payload, and calls `qrk_ingest_order`. The QRK idempotency key is reused as the R&L idempotency key. Exact local retries return the stored acknowledgement; changed retries are rejected. If the process stops after R&L commits but before QRK stores its receipt, the same deterministic source order and payload are retried and R&L's receipt converges on the original order.

R&L's existing Realtime subscription performs the POS refetch after the RPC inserts `public.orders`; QRK sends no refresh request to the POS.

## Development verification

Run `npm.cmd run check:rnl` for the contract test and `npm.cmd run check` for the repository gate. A live non-destructive test requires a newly provisioned enabled R&L development integration key. Use an order note beginning `NON-DESTRUCTIVE QRK R&L INTEGRATION TEST`, submit once through the QRK route, retry the same request, and record the returned QRK order number, `rnlOrderId`, `rnlDeviceOrderId`, and automatic POS count change. Do not enable or reuse the disabled temporary verification key.
