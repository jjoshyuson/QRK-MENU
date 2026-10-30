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

// Minimal DOM stub: just enough surface for applyHeader and bindScrollChrome.
const { applyHeader, bindScrollChrome } = await import('../dist/menu/menu-appearance.js');
const el = () => ({ textContent: '', hidden: false, classes: new Set(), attrs: {}, src: null,
  classList: { toggle(c, on) { on ? this.owner.classes.add(c) : this.owner.classes.delete(c); } },
  removeAttribute(n) { delete this.attrs[n]; }, replaceChildren() {} });
const make = () => { const e = el(); e.classList.owner = e; return e; };
const nodes = { logo: make(), name: make(), tagline: make(), status: make(), meta: make(), line: make(), pill: make(), cover: make(), band: make(), badge: make() };
const map = { '[data-hero-logo]': [nodes.logo], '[data-hero-name]': [nodes.name], '[data-hero-tagline]': [nodes.tagline], '[data-hero-status]': [nodes.status], '[data-hero-meta]': [nodes.meta], '[data-hero-status-line]': [nodes.line], '[data-hero-table]': [nodes.pill] };
const single = { '[data-hero-cover]': nodes.cover, '[data-hero-band]': nodes.band, '#order-history-count': nodes.badge };
const root = { querySelectorAll: s => map[s], querySelector: s => single[s] };
globalThis.document = { createElement: () => ({}) };
applyHeader(root, closed);
assert.equal(nodes.line.classes.has('is-closed'), true);
assert.equal(nodes.pill.hidden, false); assert.equal(nodes.pill.textContent, 'Table 12');
assert.equal(nodes.badge.hidden, false); assert.equal(nodes.badge.textContent, '2');
assert.equal(nodes.cover.hidden, true);
applyHeader(root, open);
assert.equal(nodes.line.classes.has('is-closed'), false);
assert.equal(nodes.pill.hidden, true); assert.equal(nodes.pill.textContent, '');
assert.equal(nodes.badge.hidden, true); assert.equal(nodes.meta.textContent, ' · About 15 min · Ermita');

globalThis.window = {}; const listeners = [];
const flags = new Set();
globalThis.document.body = { toggleAttribute: (n, on) => on ? flags.add(n) : flags.delete(n), removeAttribute: n => flags.delete(n) };
const scroller = { scrollTop: 0, addEventListener: (_, f) => listeners.push(f), removeEventListener: (_, f) => listeners.splice(listeners.indexOf(f), 1) };
const unbind = bindScrollChrome(scroller, { threshold: 140 });
assert.equal(flags.has('data-scrolled'), false);
scroller.scrollTop = 141; listeners.forEach(f => f()); assert.equal(flags.has('data-scrolled'), true);
scroller.scrollTop = 100; listeners.forEach(f => f()); assert.equal(flags.has('data-scrolled'), false);
scroller.scrollTop = 300; listeners.forEach(f => f()); unbind();
assert.equal(listeners.length, 0); assert.equal(flags.has('data-scrolled'), false);
console.log('menu appearance DOM tests passed');
