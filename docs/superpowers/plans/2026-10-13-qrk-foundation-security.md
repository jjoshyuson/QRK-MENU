# QRK typography, cards and security implementation plan

> For agentic workers: use superpowers:executing-plans to implement this plan in the current worktree.

**Goal:** Implement the approved redesign's shared typography/card foundation and fix confirmed local-server security issues.
**Architecture:** Preserve Manrope, the existing shared component source and provider adapters. Introduce one request-security module for the preview server; protect RNL status reads at the integration interface.
**Tech stack:** HTML, CSS, vanilla JavaScript, Node built-in tests and HTTP client.
**Spec:** `docs/superpowers/specs/2026-10-13-qrk-redesign-design.md`, amended by the user's typography-first and security instructions.

## Constraints and review focus

- The current GitHub style guide specifies Manrope; older RNL checkout notes about Inter are stale. Keep Manrope.
- Keep local preview shortcuts and LAN demos functional; do not claim they are production authorization.
- Keep both themes, keyboard focus, 44px targets and customer checkout intact.
- Test cross-site requests, hostile Host headers, oversized/malformed bodies, guessed order IDs and invalid quantities.
- Keep security verification local with mock upstream calls; do not change hosted data or credentials.

## Task 1: Local HTTP request security

Files: create `scripts/request-security.mjs`, `tests/request-security.mjs`; modify `scripts/serve.mjs`, `package.json`.
Interface: `validateRequest(req, {host})` rejects disallowed Host/Origin/Fetch-Metadata; `readJson(req)` resolves a JSON object or rejects with a status-bearing error.

- [x] Write HTTP regressions using a disposable server on port 0: hostile Origin/Host return 403, same-origin JSON works, non-JSON returns 415, oversized bodies return 413, malformed/non-object JSON returns 400.
- [x] Run `node tests/request-security.mjs` and observe the original cross-site request failure.
- [x] Implement the request guard and bounded JSON reader; integrate before route dispatch and preserve error statuses.
- [x] Run regressions and existing table/preview-auth tests; commit the candidate.

## Task 2: RNL integration authorization and validation

Files: modify `scripts/rnl-integration.mjs`, `scripts/serve.mjs`; create `tests/rnl-order-security.mjs`.
Interface: `status(rnlOrderId, trackingToken)` validates the stored QRK tracking token before any upstream call. `createOrder(input)` validates finite integer quantities 1–20, finite nonnegative totals and supported fulfillment values before persistence/RPC.

- [x] Write mock-backed tests for absent/wrong tokens, valid tokens, invalid quantities and no upstream side effects on rejection.
- [x] Run `node tests/rnl-order-security.mjs` and observe unauthorized lookup failure.
- [x] Implement checks and pass the token through the HTTP route; run existing RNL integration tests and the new regressions; commit.

## Task 3: Shared typography and card foundation

Files: modify `dist/ui-components.css`, `dist/ui-components.js`, `dist/components/index.html`, `dist/menu/cart-dock.css`, `dist/co-interface-renovation.css`, `dist/admin/admin.css`, `dist/app.js`, `dist/index.html`.
Interface: shared size/weight/spacing tokens and outlined operational cards; customer photos remain edge-to-edge with a neutral footer; Settings stays one grouped list.

- [x] Add semantic type scale and tabular numeric values without replacing Manrope. Apply shared radius, padding, quiet borders and minimal shadows; remove gloss/blur on repeated cards.
- [x] Update existing route rules rather than create another stylesheet layer. Retain responsive card grids and accessible focus.
- [x] Update registry/specimens and derive Menu health from current item state.
- [x] Verify customer item/cart sheets and owner pages in the browser at 390, 768 and 1280px in both themes. Save representative screenshots.
- [x] Run `npm run check`, security tests, `git diff --check`; request one fresh whole-branch review, resolve important findings, and commit.

## Execution record

User authorized implementation in this chat. Native execution keeps the typography and security fixes in one reviewable working copy. Full workflow restructuring remains incremental follow-up work under the broader redesign specification; this plan implements the requested foundation first.


Completed locally on October 13, 2026. Final review's encoded-route bypass was pinned by a failing HTTP test and fixed by sharing the normalized route path. Owner/Admin font and Admin card cascades were reproduced with browser computed styles, then verified with Manrope, 28px figures, 1px borders and 12px corners. Full checks pass. No minor findings were deferred.

Ruling: preserve existing preview shortcuts/table fixtures; production authorization and physical-device behavior remain unverified. Treating preview behavior as production would expose operational state, so delivery explicitly remains local.
