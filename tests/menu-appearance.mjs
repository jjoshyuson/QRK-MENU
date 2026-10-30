import assert from 'node:assert/strict';
import { businessInitials, headerModel, accentFor, safeImageUrl } from '../dist/menu/menu-appearance.js';

assert.equal(businessInitials("Kusina Nanay Mila's"), 'KN');
assert.equal(businessInitials('Sorbetes & Co.'), 'SC');
assert.equal(businessInitials(''), 'Q');
const base = { businessName: "Kusina Nanay Mila's", logoDataUrl: '', coverPhotoUrl: 'javascript:alert(1)' };
const open = headerModel(base, { isTable: false, tableNumber: null, orderCount: 0, openForOrders: true, prepLabel: 'About 15 min', area: 'Ermita' });
assert.equal(open.statusLabel, 'Open'); assert.equal(open.coverUrl, ''); assert.equal(open.initials, 'KN'); assert.equal(open.orderBadge, null);
assert.deepEqual(open.metaParts, ['About 15 min', 'Ermita']);
const closed = headerModel(base, { isTable: true, tableNumber: '12', orderCount: 2, openForOrders: false, prepLabel: '', area: '' });
assert.equal(closed.statusLabel, 'Closed'); assert.equal(closed.tableLabel, 'Table 12'); assert.equal(closed.orderBadge, '2'); assert.deepEqual(closed.metaParts, []);
assert.equal(safeImageUrl('x" onerror="alert(1)'), '');

const lum = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
const contrast = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + .05) / (lo + .05); };
for (const hex of ['#FFD400', '#1683ff', '#0E7C86']) assert.ok(contrast(accentFor({ primary: hex }), '#FFFFFF') >= 4.5, hex);
console.log('menu appearance tests passed');
