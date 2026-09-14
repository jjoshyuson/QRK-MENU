import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, customerHtml, customerCss, customerJs, componentCss] = await Promise.all([
  readFile(new URL('../dist/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/cart-dock.css', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/ui-components.css', import.meta.url), 'utf8')
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
assert.match(customerCss, /\.menu-tools \.categories\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*nowrap[^}]*overflow-x:\s*auto[^}]*scroll-snap-type:\s*inline proximity/s);
assert.match(customerCss, /\.menu-tools \.categories\s*\{[^}]*padding-right:\s*max\(18px, calc\(50% - 4\.25rem\)\)/s);
assert.match(customerCss, /\.menu-tools \.categories a\s*\{[^}]*flex:\s*0 0 clamp\(6\.5rem, 32%, 8\.5rem\)[^}]*scroll-snap-align:\s*center/s);
assert.match(customerCss, /\.menu-tools \.search-wrap #menu-search\s*\{[^}]*border:\s*0/s);
assert.match(customerCss, /#menu-search:focus-visible\s*\{[^}]*outline:\s*0[^}]*box-shadow:\s*0 5px 18px/s);
assert.match(componentCss, /--component-menu-search-height:2\.1rem/);
assert.match(componentCss, /--component-menu-category-height:1\.925rem/);
assert.match(componentCss, /--component-menu-floating-order-height:2\.3625rem/);
assert.match(customerCss, /#menu-search\s*\{[^}]*height:\s*var\(--component-menu-search-height\)[^}]*min-height:\s*0/s);
assert.match(customerCss, /\.menu-tools \.categories a\s*\{[^}]*height:\s*var\(--component-menu-category-height\)[^}]*min-height:\s*0/s);
assert.match(customerCss, /\.cart-bar button\s*\{[^}]*height:\s*var\(--component-menu-floating-order-height\)[^}]*min-height:\s*0/s);
assert.match(customerHtml, /<svg viewBox="0 0 24 24" fill="none">/);
assert.match(customerJs, /card\.querySelector\('p'\)\.textContent=item\.description/);
assert.match(customerJs, /\$\('#item-description'\)\.textContent=item\.description/);
assert.match(customerJs, /centerIfClipped=link=>\{[^}]*getBoundingClientRect\(\)[^}]*track\.scrollTo\(\{left:link\.offsetLeft-\(track\.clientWidth-link\.offsetWidth\)\/2/s);
assert.match(customerJs, /prefers-reduced-motion: reduce/);

console.log('Menu description and compact customer card contract passed.');
