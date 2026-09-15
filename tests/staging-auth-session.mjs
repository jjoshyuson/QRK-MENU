import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../dist/data/qrk-auth-service.js',import.meta.url),'utf8');
assert.match(source,/if\(!\['local','preview'\]\.includes\(this\.config\.environment\)\)\{this\.saveSession\(null\);return null\}/);
assert.match(source,/signInDevelopment\(account\)\{if\(!\['local','preview'\]\.includes\(this\.config\.environment\)\)/);
console.log('Hosted staging rejects browser-preview authentication sessions.');
