import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../dist/data/qrk-auth-service.js',import.meta.url),'utf8');
const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
assert.match(source,/if\(!\['local','preview'\]\.includes\(this\.config\.environment\)\)\{this\.saveSession\(null\);return null\}/);
assert.match(source,/signInDevelopment\(account\)\{if\(!\['local','preview'\]\.includes\(this\.config\.environment\)\)/);
assert.match(source,/if\(this\.config\.environment==='local'\)\{const bridged=await this\.bridge\('sign-in'/,'local login must try the trusted preview credential bridge');
assert.match(source,/resetPreviewUserPassword\(username,account\)/,'QRK Admin must reset through the shared credential source');
assert.match(app,/environment==='local'.*client-login.*saveSession\(null\)/,'Open client login must clear only the local preview session before rendering sign-in');
console.log('Hosted staging rejects browser-preview authentication sessions.');
