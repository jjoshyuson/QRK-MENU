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
  assert.match(html, /href="\/ui-components\.css\?v=1"/, `${route} must load the shared visual source`);
  assert.match(html, /src="\/ui-components\.js\?v=1"/, `${route} must load stable inspector labels`);
}

const css = await readFile(new URL('../dist/ui-components.css', import.meta.url), 'utf8');
for (const variable of [
  '--component-control-height', '--component-radius-sm', '--component-border',
  '--component-focus', '--component-disabled-opacity', '--component-card-bg',
  '--component-primary-bg', '--component-danger-bg', '--component-button-radius',
  '--component-button-padding-inline', '--component-button-subtle-bg', '--component-button-disabled-bg',
]) {
  assert.ok(css.includes(variable), `missing shared component variable: ${variable}`);
}
for (const family of ['.button', '.metric-card', '.item-row', '.staff-row', '.table-card', '.settings-row', '.dish', '.cart-item', '.platform-client-row']) {
  assert.ok(css.includes(family), `missing shared component rule: ${family}`);
}

const registry = await readFile(new URL('../dist/ui-components.js', import.meta.url), 'utf8');
assert.match(registry, /dataset\.component\s*=/);
assert.match(registry, /dataset\.variant\s*=/);
assert.match(registry, /dataset\.componentSource\s*=\s*['"]\/ui-components\.css/);
assert.match(registry, /MutationObserver/);
assert.match(registry, /classList\.contains\('primary-button'\)/);
assert.match(registry, /attributeFilter:\s*\['class', 'disabled'\]/);

const serviceWorker = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');
assert.match(serviceWorker, /'\.\/ui-components\.css'/);
assert.match(serviceWorker, /'\.\/ui-components\.js'/);

console.log(`Shared component source contract passed (${routeFiles.length} routes).`);
