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
console.log('menu-background: ok');
