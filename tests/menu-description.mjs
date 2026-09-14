import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, customerHtml, customerCss, customerJs] = await Promise.all([
  readFile(new URL('../dist/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/cart-dock.css', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8')
]);

assert.match(app, /ITEM_DESCRIPTION_LIMIT=140/);
assert.match(app, /field\.maxLength=ITEM_DESCRIPTION_LIMIT/);
assert.match(app, /item-description-count/);
assert.match(app, /description\.length>ITEM_DESCRIPTION_LIMIT/);
assert.match(customerHtml, /class="dish-description"/);
assert.match(customerHtml, /class="dish-actions"/);
assert.match(customerCss, /-webkit-line-clamp:\s*2/);
assert.match(customerCss, /\.dish-add\s*\{[^}]*min-height:\s*44px/s);
assert.match(customerJs, /card\.querySelector\('p'\)\.textContent=item\.description/);
assert.match(customerJs, /\$\('#item-description'\)\.textContent=item\.description/);

console.log('Menu description and compact customer card contract passed.');
