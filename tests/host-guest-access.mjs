import assert from 'node:assert/strict';
import fs from 'node:fs';

const menu=fs.readFileSync(new URL('../dist/menu/menu.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../dist/menu/index.html',import.meta.url),'utf8');
const sessions=fs.readFileSync(new URL('../dist/data/qrk-table-session-service.js',import.meta.url),'utf8');
const server=fs.readFileSync(new URL('../scripts/serve.mjs',import.meta.url),'utf8');

assert.match(menu,/participantCanCheckout\(session\).*role==='host'.*permission==='direct'/s);
assert.match(menu,/This table uses host checkout/);
assert.match(menu,/joined&&\['active','bill_requested'\]\.includes\(current\.status\)/);
assert.match(html,/Preview staff override/);
assert.match(menu,/additionalDevices!==false&&serviceProfile\.settings\.joinPolicy!=='disabled'/);
assert.match(sessions,/\['automatic','direct'\]\.includes\(input\.joinPolicy\)/);
assert.match(sessions,/This table does not allow additional devices/);
assert.match(server,/input\.additionalDevices===false\|\|input\.joinPolicy==='disabled'/);

console.log('Host and guest access gate contract passed.');
