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
assert.match(customerHtml, /class="dish-hit" type="button"/);
assert.match(customerHtml, /class="dish-cta" aria-hidden="true"/);
assert.match(customerCss, /-webkit-line-clamp:\s*2/);
assert.match(customerCss, /\.dish-cta\s*\{[^}]*padding:\s*\.38em \.72em[^}]*border:\s*0[^}]*color:\s*#111827[^}]*font-size:\s*\.72em/s);
assert.match(customerCss, /\.dish-cta > span\s*\{[^}]*place-items:\s*center[^}]*line-height:\s*1/s);
assert.match(customerCss, /\.menu-section \.dish\s*\{[^}]*border:\s*0/s);
assert.match(customerCss, /\.menu-tools \.categories\s*\{[^}]*grid-template-columns:\s*repeat\(3,minmax\(0,1fr\)\)/s);
assert.match(customerCss, /\.menu-tools \.search-wrap #menu-search\s*\{[^}]*border:\s*0/s);
assert.match(customerCss, /#menu-search:focus-visible\s*\{[^}]*outline:\s*0[^}]*box-shadow:\s*0 5px 18px/s);
assert.match(customerHtml, /<svg viewBox="0 0 24 24" fill="none">/);
assert.match(customerJs, /card\.querySelector\('p'\)\.textContent=item\.description/);
assert.match(customerJs, /\$\('#item-description'\)\.textContent=item\.description/);

console.log('Menu description and compact customer card contract passed.');
