import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html,menu,staff]=await Promise.all([
  readFile(new URL('../dist/menu/index.html',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/app.js',import.meta.url),'utf8')
]);

assert.match(html,/id="entry-save-name"[^>]*type="checkbox" checked/);
assert.match(html,/id="save-customer-name"[^>]*type="checkbox" checked/);
assert.match(html,/Save name on this device/);
assert.match(menu,/CUSTOMER_NAME_KEY=`qrk_customer_name_v1_\$\{businessSlug\}`/);
assert.match(menu,/presetCustomerName\(participant\?\.name\)/);
assert.doesNotMatch(menu,/if\(openTabEnabled\)\{\$\('#cart-bar'\)\.classList\.add\('hidden'\)/);
assert.match(staff,/tableOrders=orders\.filter\(order=>order\.fulfillmentType==='table'/);
assert.match(staff,/for\(const order of tableOrders\)\{await completeOrder\(order\)/);
assert.match(staff,/await tableSessionService\.clean\(tableAction\.dataset\.cleanTable\)/);
assert.match(staff,/return`\$\{location\}\$\{order\.customerLabel/);
assert.match(staff,/dateStyle:'medium',timeStyle:'short'/);

console.log('Open Tab cart, remembered-name, and table-history contract passed.');
