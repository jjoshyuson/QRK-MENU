# Export verification

- All exported `dist/` files match the deployed source snapshot byte for byte.
- Direct Node syntax checks passed for `dist/app.js` and `scripts/serve.mjs`.
- Package JSON parsed successfully.
- ZIP entries, checksums and CRC integrity verified.
- The new local server was not started for a live HTTP smoke check in this environment. Run `npm start` after extraction.
- No browser or end-to-end UI testing is claimed.
