import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { formatPriceParts, sectionIndexLabel } from '../dist/menu/menu-appearance.js';

assert.deepEqual(formatPriceParts(18000), { symbol: '₱', amount: '180' });
assert.equal(formatPriceParts(123456).amount, '1,234.56');
assert.equal(formatPriceParts(5050).amount, '50.50');
assert.equal(sectionIndexLabel(0), '01');
assert.equal(sectionIndexLabel(11), '12');

const [menu, html, css] = await Promise.all(['menu/menu.js', 'menu/index.html', 'menu/menu.css'].map(f => readFile(new URL(`../dist/${f}`, import.meta.url), 'utf8')));
// Dish text reaches the DOM via textContent, never interpolated into innerHTML.
assert.doesNotMatch(menu, /innerHTML=`[^`]*\$\{item\.(name|description)\}/);
// Sold-out dishes stay listed (disabled); only hidden ones are omitted.
assert.doesNotMatch(menu, /menu\.filter\(item=>item\.available&&!item\.hidden&&`/);
assert.match(menu, /sectionIndexLabel\(/);
assert.match(menu, /in order/);
assert.match(html, /Ordering by QRK/);
assert.match(html, /href="\/photo-credits\.html"/);
assert.match(css, /\.menu-section \.dish-grid\s*\{[^}]*border-radius:\s*20px[^}]*box-shadow:\s*var\(--shadow-sm\)/s);
assert.match(css, /\.dish > \.dish-hit\s*\{[^}]*min-height:\s*44px/s);
assert.match(css, /\.dish \.photo\s*\{[^}]*width:\s*92px[^}]*border-radius:\s*16px/s);
console.log('Menu catalog contract passed.');
