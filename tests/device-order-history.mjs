import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, staff] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/app.js', import.meta.url), 'utf8')
]);

assert.match(html, /id="order-history-control"[^>]*aria-controls="history-dialog"/);
assert.match(html, /id="clear-history"/);
assert.match(html, /id="history-clear-confirm"/);
assert.match(js, /HISTORY_LIMIT=25,HISTORY_RETENTION_MS=30\*24\*60\*60\*1000/);
assert.match(js, /if\(!openTabEnabled\)rememberHistory\(order\)/);
assert.match(js, /\['paid','settled'\]\.includes\(session\?\.status\)/);
assert.match(js, /rememberPaidTab\(session,tabOrders\)/);
assert.match(js, /TAB_SESSION_KEY=deviceScopedKey\(businessSlug,`open-tab-session:\$\{dataService\.mode\}`\)/);
assert.match(js, /HISTORY_KEY=deviceScopedKey\(businessSlug,`order-history:\$\{dataService\.mode\}`\)/);
assert.match(js, /\['cleaned','cancelled','expired'\]\.includes\(session\.status\)/);
assert.match(js, /localStorage\.removeItem\(TAB_ORDER_KEY\)/);
assert.match(js, /localStorage\.removeItem\(HISTORY_KEY\)/);
assert.match(js, /openTabEnabled\?'ADDED TO':'ORDER NUMBER'/);
assert.match(staff, /openTab\?'Customer paid':'Table cleaned'/);
assert.match(staff, /tableSessionService\.markPaid/);

console.log('Device order history and Open Tab cleanup contract passed.');
