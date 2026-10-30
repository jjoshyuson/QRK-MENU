import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const r = p => readFile(new URL(`../dist/${p}`, import.meta.url), 'utf8');
const [menu, menuCss, tableCss, app, dash, brand, appearance] = await Promise.all(['menu/menu.js', 'menu/menu.css', 'menu/menu-table.css', 'app.js', 'dashboard.css', 'data/qrk-brand-service.js', 'menu/menu-appearance.js'].map(r));
// Unaccepted orders must not read as accepted.
assert.match(menu, /received:\['Received','received'\]/);
assert.doesNotMatch(menu, /\['Accepted'/);
assert.match(tableCss, /\.tab-status\.received\s*\{/);
// Footer must not combine width:100% with side margins (horizontal overflow at >=1080px).
assert.doesNotMatch(menuCss.slice(menuCss.indexOf('min-width:1080px') > 0 ? menuCss.indexOf('min-width:1080px') : menuCss.indexOf('min-width: 1080px')), /\n\s*footer \{[^}]*width: 100%/);
// Owner preview motif must be a CSS class (build rewrites url(/assets/...) in CSS), never a JS-built unquoted url().
assert.doesNotMatch(app, /url\(\/assets\/motifs/);
for (const n of ['filipino', 'cafe', 'ramen', 'pizza', 'dessert']) assert.match(dash, new RegExp(`\\.cosmetics-preview-surface\\.m-${n}\\{--motif-url:url\\(/assets/motifs/${n}\\.svg\\)`));
// One source for the image-URL check and the pattern list.
assert.doesNotMatch(brand, /safeMenuImageUrl/);
assert.doesNotMatch(appearance, /const MOTIFS|const safeImageUrl|export const safeImageUrl/);
assert.doesNotMatch(menuCss, /--surface-soft/);
assert.doesNotMatch(menu, /img\.alt=item\.name/);
console.log('final review fixes ok');
