import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html,menu,staff,cartStyles]=await Promise.all([
  readFile(new URL('../dist/menu/index.html',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/cart-dock.css',import.meta.url),'utf8')
]);

assert.match(html,/id="entry-save-name"[^>]*type="checkbox" checked/);
assert.match(html,/id="save-customer-name"[^>]*type="checkbox" checked/);
assert.match(html,/Save name on this device/);
assert.match(menu,/CUSTOMER_NAME_KEY=deviceScopedKey\(businessSlug,'customer-name'\)/);
assert.match(menu,/presetCustomerName\(participant\?\.name\)/);
assert.doesNotMatch(menu,/if\(openTabEnabled\)\{\$\('#cart-bar'\)\.classList\.add\('hidden'\)/);
assert.match(html,/id="open-tab-dialog"/);
assert.doesNotMatch(html,/class="sheet-content cart-content">\s*<section class="tab-summary/);
assert.match(menu,/\$\('#open-tab-control'\)\.addEventListener\('click',openTab\)/);
assert.match(menu,/\$\('\.fulfillment'\)\.classList\.add\('hidden'\);\$\('#choose-fulfillment'\)\.classList\.add\('hidden'\)/);
assert.match(menu,/\$\('#cart-empty'\)\.classList\.toggle\('hidden',cart\.length>0\)/);
assert.match(menu,/class="cart-item-controls"/);
assert.match(menu,/tabOrders\.length\?'Send another order':'Send order'/);
assert.match(menu,/if\(quantity<=0\)cart\.splice\(index,1\)/);
assert.match(menu,/\$\('#checkout-details'\)\.open=false/);
assert.match(html,/id="choose-fulfillment"[^>]*aria-haspopup="dialog"/);
assert.match(html,/id="checkout-details"/);
assert.match(html,/id="fulfillment-dialog"/);
assert.doesNotMatch(html,/id="checkout-data-note"/);
assert.match(cartStyles,/#cart-dialog \.cart-item \{ display: grid; grid-template-columns: minmax\(0, 1fr\) auto;/);
assert.match(cartStyles,/#cart-dialog \.remove-item \{ min-width: 44px; min-height: 44px;/);
assert.match(cartStyles,/#cart-dialog #submit-order \{ min-height: 44px;[^}]*border-radius: 999px;/);
assert.match(staff,/tableOrders=orders\.filter\(order=>order\.fulfillmentType==='table'/);
assert.match(staff,/for\(const order of tableOrders\)\{await completeOrder\(order\)/);
assert.match(staff,/await tableSessionService\.clean\(sessionId\)/);
assert.ok(staff.indexOf('for(const order of tableOrders){await completeOrder(order)')<staff.indexOf('await tableSessionService.markPaid(sessionId)'));
assert.match(staff,/return`\$\{location\}\$\{order\.customerLabel/);
assert.match(staff,/dateStyle:'medium',timeStyle:'short'/);

console.log('Open Tab cart, remembered-name, and table-history contract passed.');
