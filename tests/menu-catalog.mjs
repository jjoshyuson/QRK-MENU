import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { featuredItems, formatPriceParts, sectionIndexLabel, tagLabel } from '../dist/menu/menu-appearance.js';

assert.deepEqual(formatPriceParts(18000), { symbol: '₱', amount: '180' });
assert.equal(formatPriceParts(123456).amount, '1,234.56');
assert.equal(formatPriceParts(5050).amount, '50.50');
assert.equal(sectionIndexLabel(0), '01');
assert.equal(sectionIndexLabel(11), '12');

const [menu, html, css] = await Promise.all(['menu/menu.js', 'menu/index.html', 'menu/menu.css'].map(f => readFile(new URL(`../dist/${f}`, import.meta.url), 'utf8')));
// Inside renderMenu the only innerHTML writes are the empty reset and the chip list, which escapes via escapeText.
const start = menu.indexOf('function renderMenu(');
const body = menu.slice(start, menu.indexOf('function renderInOrderBadges(', start));
const writes = [...body.matchAll(/innerHTML\s*=\s*([^;\n]*)/g)].map(m => m[1]);
assert.equal(writes.length, 2);
assert.equal(writes.filter(w => w !== "''").length, 1);
assert.match(writes.find(w => w !== "''"), /escapeText\(category\)/);
// Sold-out rows are kept (disabled); hidden ones omitted; first load and Studio updates agree.
assert.match(body, /menu\.filter\(item=>!item\.hidden&&/);
assert.match(menu, /subscribeMenuState\(businessSlug,state=>\{[^\n]*item\.category===category&&!item\.hidden\)/);
assert.doesNotMatch(menu, /item\.category===category&&item\.available/);
assert.match(body, /cardButton\.disabled=true/);
// The row keeps its visible content as accessible name (no aria-label override).
assert.doesNotMatch(body, /setAttribute\('aria-label'/);
// Sold-out dishes stay listed (disabled); only hidden ones are omitted.
assert.doesNotMatch(menu, /menu\.filter\(item=>item\.available&&!item\.hidden&&`/);
assert.match(menu, /sectionIndexLabel\(/);
assert.match(menu, /in order/);
assert.match(html, /Ordering by QRK/);
assert.match(html, /href="\/photo-credits\.html"/);
assert.match(css, /\.menu-section \.dish-grid\s*\{[^}]*border-radius:\s*20px[^}]*box-shadow:\s*var\(--shadow-sm\)/s);
assert.match(css, /\.dish\.sold-out \.dish-copy > :not\(\.dish-badges\)[^{]*\{[^}]*opacity:\s*\.5/);
assert.match(css, /\.dish > \.dish-hit\s*\{[^}]*min-height:\s*44px/s);
assert.match(css, /\.dish \.photo\s*\{[^}]*width:\s*92px[^}]*border-radius:\s*16px/s);
const it = (id, o = {}) => ({ id, featured: true, available: true, hidden: false, ...o });
assert.deepEqual(featuredItems([it(1), it(2, { available: false }), it(3, { hidden: true }), it(4, { featured: false }), it(5), it(6), it(7), it(8)]).map(i => i.id), [1, 5, 6]);
assert.deepEqual(featuredItems([it(1, { featured: false })]), []);
assert.deepEqual(['spicy', 'sharing', 'slow_cooked', 'vegetarian', 'x'].map(tagLabel), ['Spicy', 'Good for sharing', 'Slow-cooked', 'Vegetarian', '']);
assert.match(html, /id="featured-row"/);
assert.match(menu, /Featured/);
assert.doesNotMatch(menu + html, /No\. ?[123]|Bestseller/i);
assert.match(css, /--spicy:\s*#C2410C/i);
assert.match(css, /--spicy:\s*#FB923C/i);
console.log('Menu catalog contract passed.');
