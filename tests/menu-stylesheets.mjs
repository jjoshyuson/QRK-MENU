import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8');
const links = [...html.matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map(m => m[1]);
assert.deepEqual(links, ['/theme.css', '/pwa.css', '/ui-components.css', '/menu/menu.css', '/menu/menu-sheets.css', '/menu/menu-table.css']);
for (const gone of ['brand', 'table-session', 'payment-first', 'order-confirmation', 'quick-service', 'cart-dock'])
  await assert.rejects(access(new URL(`../dist/menu/${gone}.css`, import.meta.url)));
// Shared button/input/card tokens belong to ui-components.css; route sheets must not restate them.
for (const f of ['menu', 'menu-sheets', 'menu-table']) {
  const css = await readFile(new URL(`../dist/menu/${f}.css`, import.meta.url), 'utf8');
  assert.doesNotMatch(css, /--component-(primary-bg|button-|control-height|customer-control-height|card-bg|border-strong)/, `${f}.css restates ui-components rules`);
}
console.log('menu stylesheet checks passed');
