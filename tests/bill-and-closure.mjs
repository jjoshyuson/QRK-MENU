import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html,menu,service,server,styles]=await Promise.all([
  readFile(new URL('../dist/menu/index.html',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-table-session-service.js',import.meta.url),'utf8'),
  readFile(new URL('../scripts/serve.mjs',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/cart-dock.css',import.meta.url),'utf8')
]);

assert.match(menu,/billGateEnabled=Boolean\(serviceProfile\.layers\?\.tabPayment\)/);
assert.match(menu,/orderingLocked=.*bill_requested.*billLocksOrdering/);
assert.match(menu,/showSessionEnded\(session\)/);
assert.match(menu,/\['paid','settled'\]\.includes\(session\?\.status\)/);
assert.match(menu,/\['cleaned','cancelled','expired'\]\.includes\(session\.status\)/);
assert.match(menu,/requestBill\(currentTableSession\.id\)/);
assert.match(html,/id="request-bill"/);
assert.match(html,/id="session-ended-dialog"/);
assert.match(html,/id="session-ended-copy"/);
assert.match(service,/path==='\/bill'/);
assert.match(service,/async requestBill\(sessionId\)/);
assert.match(server,/action==='bill'/);
assert.match(styles,/\.bill-actions/);

console.log('Public bill and session-closure gate contract passed.');
