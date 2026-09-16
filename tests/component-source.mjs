import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routeFiles = [
  '../dist/index.html',
  '../dist/admin/index.html',
  '../dist/menu/index.html',
  '../dist/components/index.html',
];

for (const route of routeFiles) {
  const html = await readFile(new URL(route, import.meta.url), 'utf8');
  assert.match(html, /href="\/ui-components\.css\?v=9"/, `${route} must load the shared visual source`);
  assert.match(html, /src="\/ui-components\.js\?v=4"/, `${route} must load stable inspector labels`);
}

const css = await readFile(new URL('../dist/ui-components.css', import.meta.url), 'utf8');
for (const variable of [
  '--font-interface', '--font-menu-display',
  '--component-control-height', '--component-radius-sm', '--component-border',
  '--component-focus', '--component-disabled-opacity', '--component-card-bg',
  '--component-primary-bg', '--component-danger-bg', '--component-button-radius',
  '--component-button-padding-inline', '--component-button-subtle-bg', '--component-button-disabled-bg',
  '--component-sheet-bg', '--component-sheet-accent',
]) {
  assert.ok(css.includes(variable), `missing shared component variable: ${variable}`);
}
for (const family of ['.button', '.metric-card', '.item-row', '.staff-row', '.table-card', '.settings-row', '.qrk-sheet', '.qrk-choice-popover', '.dish', '.cart-item', '.platform-client-row']) {
  assert.ok(css.includes(family), `missing shared component rule: ${family}`);
}
assert.match(css,/\.qrk-choice-trigger\{[^}]*border:0/);
assert.match(css,/\.qrk-choice-popover\{[^}]*border:0/);

const registry = await readFile(new URL('../dist/ui-components.js', import.meta.url), 'utf8');
assert.match(registry, /dataset\.component\s*=/);
assert.match(registry, /dataset\.variant\s*=/);
assert.match(registry, /dataset\.componentSource\s*=\s*['"]\/ui-components\.css/);
assert.match(registry, /MutationObserver/);
assert.match(registry, /classList\.contains\('primary-button'\)/);
assert.match(registry, /attributeFilter:\s*\['class', 'disabled'\]/);
assert.match(registry, /window\.QrkSheet\s*=\s*\{create\}/);
assert.match(registry, /event\.key === 'Escape'/);
assert.match(registry, /window\.QrkChoice\s*=\s*\{enhance, sync, close\}/);
assert.match(registry, /role="listbox"/);
assert.match(css, /height:min\(90dvh,calc\(100dvh - 20px\)\)/);
assert.match(css, /min-width:60px/);
assert.match(css, /background:transparent!important;color:var\(--component-sheet-text\)!important/);
assert.match(css, /settings-form>label:focus-within/);

const serviceWorker = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');
assert.match(serviceWorker, /'\.\/ui-components\.css'/);
assert.match(serviceWorker, /'\.\/ui-components\.js'/);

console.log(`Shared component source contract passed (${routeFiles.length} routes).`);
