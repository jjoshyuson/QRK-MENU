import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, staff, data, cartCss] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/data/qrk-data-service.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu-sheets.css', import.meta.url), 'utf8')
]);

assert.match(html, /id="order-history-control"[^>]*aria-controls="history-dialog"/);
assert.match(html, /class="customer-history-control">\s*<button class="order-history-control"/);
assert.match(cartCss, /\.customer-history-control\s*\{[^}]*position:\s*absolute/s);
assert.doesNotMatch(html, /customer-session-controls/);
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
assert.match(data, /list_device_orders/);
assert.match(js, /tableSessionId:session\?\.id\|\|null/);

assert.match(html, /<svg class="draw"[^>]*>[^]*?<path d=/);
assert.match(html, /id="confirmation-dialog"[^]*id="confirmation-steps"[^]*id="confirmation-items"/);
assert.match(js, /staggerRise\(\$\('#confirmation-dialog'\),\{step:110,selector:'\.status-step'\}\)/);
assert.match(cartCss, /\.confirm-mark circle\s*\{[^}]*menu-pop[^}]*450ms/s);
assert.match(cartCss, /\.draw path\s*\{[^}]*stroke-dashoffset/s);
assert.match(cartCss, /\.rise-[ab] \.status-step/);
assert.match(cartCss, /#history-dialog, #open-tab-dialog \{ --danger/);
assert.match(html, /id="open-tab-title">Your tab</);
console.log('Device order history and Open Tab cleanup contract passed.');
