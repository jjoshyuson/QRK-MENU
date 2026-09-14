import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/components/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../dist/components/components.css', import.meta.url), 'utf8');
const agents = await readFile(new URL('../AGENTS.md', import.meta.url), 'utf8');

const requiredSections = [
  'foundations', 'controls', 'navigation', 'feedback', 'dashboard',
  'menu-management', 'staff', 'orders', 'tables', 'settings',
  'customer', 'checkout', 'admin', 'forms', 'states',
];

for (const id of requiredSections) {
  assert.match(html, new RegExp(`id="${id}"`), `missing component family: ${id}`);
}

for (const sourceLabel of [
  '.button', '.metric-card', '.item-row', '.staff-row', '.order-queue-card',
  '.table-card', '.settings-row', '.dish', '.cart-item', '.platform-client-row', '.form-error',
]) {
  assert.ok(html.includes(sourceLabel), `missing production source label: ${sourceLabel}`);
}

assert.match(html, /noindex,nofollow/, 'catalog must stay out of search indexes');
assert.match(html, /data-component/, 'catalog must explain stable Inspect Element names');
assert.match(html, /--component-control-height/, 'catalog must expose shared component variables');
assert.doesNotMatch(html, /dist\/landing|\/landing\//, 'landing-page components are intentionally excluded');
assert.match(css, /@media\(max-width:700px\)/, 'phone layout must remain explicit');
assert.match(css, /:focus-visible/, 'keyboard focus styling must remain visible');
assert.match(agents, /Component inventory maintenance/, 'AGENTS.md must retain the inventory workflow');
assert.match(agents, /Whenever a reusable component, shared variable or meaningful variant\/state is added/, 'future component upkeep must stay explicit');

console.log(`Component inventory contract passed (${requiredSections.length} families).`);
