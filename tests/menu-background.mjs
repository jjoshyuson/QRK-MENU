import assert from 'node:assert/strict';
import { normalizeMenuBackground, MENU_PATTERNS, MENU_BACKGROUND_STYLES } from '../dist/data/qrk-brand-service.js';

const n = normalizeMenuBackground;
assert.deepEqual(MENU_PATTERNS, ['filipino', 'cafe', 'ramen', 'pizza', 'dessert']);
assert.deepEqual(MENU_BACKGROUND_STYLES, ['photo', 'pattern', 'pattern-moving', 'glow', 'plain']);
assert.deepEqual(n({}), { style: 'glow', pattern: null, strength: 50, imageUrl: '' });
assert.equal(n({ backgroundStyle: '<script>' }).style, 'glow');
assert.equal(n({ backgroundStyle: 'pattern', backgroundPattern: '../x' }).style, 'glow');
assert.equal(n({ backgroundStyle: 'pattern', backgroundPattern: 'ramen' }).pattern, 'ramen');
assert.deepEqual(n({ backgroundStyle: 'photo', backgroundPattern: 'ramen' }), { style: 'pattern', pattern: 'ramen', strength: 50, imageUrl: '' });
assert.equal(n({ backgroundStrength: '999' }).strength, 100);
assert.equal(n({ backgroundStrength: -4 }).strength, 0);
assert.equal(n({ backgroundStyle: 'photo' }).style, 'glow');
assert.deepEqual(n({ backgroundStyle: 'photo', backgroundUrl: 'javascript:x' }).imageUrl, '');
assert.deepEqual(n({ backgroundUrl: '/assets/bg.jpg', backgroundOpacity: 0.72 }), { style: 'photo', pattern: null, strength: 40, imageUrl: '/assets/bg.jpg' });

import { readFile } from 'node:fs/promises';
import { backgroundLayers } from '../dist/menu/menu-appearance.js';
const L = backgroundLayers;
const pat = s => L({ style: 'pattern', pattern: 'cafe', strength: s });
assert.equal(pat(50).patternOpacity, 0.11);
assert.equal(pat(50).pattern, 'cafe');
assert.equal(pat(0).patternOpacity, 0.04);
assert.equal(pat(100).patternOpacity, 0.18);
assert.equal(pat(50).moving, false);
assert.equal(L({ style: 'pattern-moving', pattern: 'ramen', strength: 50 }).moving, true);
const photo = s => L({ style: 'photo', imageUrl: '/a.jpg', strength: s });
assert.equal(photo(100).veilOpacity, 0.39);
assert.equal(photo(0).veilOpacity, 0.94);
assert.equal(photo(0).photo, '/a.jpg');
assert.deepEqual(L({ style: 'plain', pattern: null, strength: 50 }), { photo: null, veilOpacity: null, glow: null, pattern: null, patternOpacity: null, moving: false });
assert.ok(L({ style: 'glow', strength: 100 }).glow > L({ style: 'glow', strength: 0 }).glow);
for (const p of MENU_PATTERNS) {
  const svg = await readFile(new URL(`../dist/assets/motifs/${p}.svg`, import.meta.url), 'utf8');
  assert.doesNotMatch(svg, /<script|<style|href|foreignObject/i, `${p}.svg`);
}
const css = await readFile(new URL('../dist/menu/menu.css', import.meta.url), 'utf8');
const backing = css.match(/([^{}]*\.section-heading[^{}]*)\{[^}]*color-mix\(in srgb, var\(--surface\) (\d+)%, transparent\)/);
assert.ok(backing && Number(backing[2]) >= 90, 'text on the themed background needs a >=90% surface backing');
for (const sel of ['.section-heading', 'footer.menu-footer', '.empty-state']) assert.ok(backing[1].includes(sel), `${sel} backed`);
console.log('menu-background: ok');
