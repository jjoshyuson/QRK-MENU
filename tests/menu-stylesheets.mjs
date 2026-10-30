import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8');
const links = [...html.matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map(m => m[1]);
assert.deepEqual(links, ['/theme.css', '/pwa.css', '/ui-components.css', '/menu/menu.css', '/menu/menu-sheets.css', '/menu/menu-table.css']);
for (const gone of ['brand', 'table-session', 'payment-first', 'order-confirmation', 'quick-service', 'cart-dock'])
  await assert.rejects(access(new URL(`../dist/menu/${gone}.css`, import.meta.url)));
console.log('menu stylesheet checks passed');
