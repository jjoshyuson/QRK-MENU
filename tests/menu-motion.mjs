import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { showToast, popElement, staggerRise } from '../dist/menu/menu-appearance.js';

const css = ['menu.css', 'menu-sheets.css', 'menu-table.css'].map(f => readFileSync(new URL(`../dist/menu/${f}`, import.meta.url), 'utf8')).join('\n');
const rm = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^@]*?\.draw path[^@]*?\}\s*\}/)?.[0] || '';
assert.match(rm, /animation:\s*none/); assert.match(rm, /transition:\s*none/); assert.match(rm, /\.draw path\s*\{\s*stroke-dashoffset:\s*0/);
for (const [name, time] of [['menu-rise', '500ms'], ['menu-pop', '360ms'], ['menu-toast', '1900ms']]) {
  assert.match(css, new RegExp(`@keyframes ${name}`), name);
  assert.match(css, new RegExp(`animation:[^;}]*${name}[^;}]*${time}|animation:[^;}]*${time}[^;}]*${name}`), `${name} ${time}`);
}
assert.match(css, /\.mini-header\{?[^}]*transition:\s*transform 260ms/);
assert.match(css, /scale\(\.975\)/); assert.match(css, /140ms/);

const stubEl = () => { const e = { children: [], style: { props: {}, setProperty(k, v) { this.props[k] = v; } }, set: new Set(), textContent: '', attrs: {},
  classList: { add(c) { e.set.add(c); }, remove(c) { e.set.delete(c); }, contains: c => e.set.has(c) }, setAttribute(k, v) { e.attrs[k] = v; }, append(c) { e.children.push(c); }, offsetWidth: 1 }; return e; };
const body = stubEl(); const timers = [];
globalThis.document = { createElement: () => stubEl(), body };
globalThis.setTimeout = (fn, ms) => (timers.push([fn, ms]), timers.length); globalThis.clearTimeout = () => {};

showToast('Added 2× Chicken adobo');
const toast = body.children[0];
assert.equal(toast.attrs.role, 'status'); assert.equal(toast.textContent, 'Added 2× Chicken adobo'); assert.ok(toast.set.has('is-on'));
assert.equal(timers.at(-1)[1], 1900);
showToast('<b>x</b>'); assert.equal(body.children.length, 1); assert.equal(toast.textContent, '<b>x</b>');
timers.at(-1)[0](); assert.ok(!toast.set.has('is-on'));

const el = stubEl(); popElement(el); assert.ok(el.set.has('pop-a') && !el.set.has('pop-b'));
popElement(el); assert.ok(el.set.has('pop-b') && !el.set.has('pop-a'));

const rows = Array.from({ length: 20 }, stubEl); const box = stubEl(); box.querySelectorAll = () => rows;
staggerRise(box); assert.equal(rows[0].style.props['--rise-delay'], '0ms'); assert.equal(rows[1].style.props['--rise-delay'], '50ms');
assert.equal(rows[19].style.props['--rise-delay'], '520ms'); assert.ok(box.set.has('rise-a'));
staggerRise(box); assert.ok(box.set.has('rise-b') && !box.set.has('rise-a'));
assert.match(css, /prefers-reduced-motion:\s*reduce\)\s*\{\s*\.menu-toast\.is-on\s*\{[^}]*opacity:\s*1/);
assert.doesNotMatch(css, /#cart-count\s*\{[^}]*display/);
const js = readFileSync(new URL('../dist/menu/menu.js', import.meta.url), 'utf8');
assert.equal(js.match(/staggerRise\(/g).length, 2); // load + chip click
assert.ok(!/staggerRise\(risen\)/.test(js)); assert.equal(js.match(/staggerRise\(\$\('#menu-sections'\)\)/g).length, 2);
assert.match(js, /classList\.remove\('rise-a','rise-b'\)/);
const seq = []; for (let i = 0; i < 3; i++) { staggerRise(box); seq.push(box.set.has('rise-a') ? 'a' : 'b'); }
assert.deepEqual(seq, ['a', 'b', 'a']);
console.log('menu motion tests passed');
