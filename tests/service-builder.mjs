import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeServiceProfile} from '../dist/data/qrk-service-presets.js';

const [html,js,css,sharedCss,menu]=await Promise.all([
  readFile(new URL('../dist/admin/index.html',import.meta.url),'utf8'),
  readFile(new URL('../dist/admin/admin.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/admin/admin.css',import.meta.url),'utf8'),
  readFile(new URL('../dist/ui-components.css',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8')
]);
assert.match(html,/class="client-settings-list qrk-settings-list"/);
assert.match(html,/class="client-sheet qrk-sheet"/);
assert.match(html,/name="serviceModeQuick"/);
assert.match(html,/name="serviceModeTable"/);
assert.match(html,/data-open-client-sheet="services"/);
assert.match(html,/data-open-client-sheet="quick"/);
assert.match(html,/data-open-client-sheet="table"/);
assert.doesNotMatch(html,/id="quick-rules"|id="table-rules"|id="preset-grid"/);
assert.match(js,/draggable="true"/);
assert.match(js,/data-move-gate/);
assert.match(js,/data-configure-gate/);
assert.match(js,/data-remove-gate/);
assert.match(js,/data-add-gate/);
assert.match(js,/data-service-mode="quick"/);
assert.match(js,/data-service-mode="table"/);
assert.match(js,/data-configure-client/);
assert.match(js,/enhanceGlassSelects/);
assert.match(js,/data-glass-option/);
assert.match(js,/gateOrder/);
assert.match(css,/\.gate-boards/);
assert.match(sharedCss,/\.qrk-sheet\.open/);
assert.match(sharedCss,/\.qrk-choice-popover/);
assert.match(sharedCss,/backdrop-filter:blur\(30px\)/);
assert.match(sharedCss,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(html,/class="client-sheet qrk-sheet"/);
assert.match(html,/id="client-sheet-backdrop"/);
assert.match(js,/captureSheetDraft/);
assert.match(js,/restoreSheetDraft/);
assert.match(menu,/requestedService/);
const both=normalizeServiceProfile({preset:'traditional',serviceModes:['quick','table'],settings:{serviceModes:['quick','table'],gateOrder:{quick:['fulfillment'],table:['table_entry']}}});
assert.deepEqual(both.serviceModes,['quick','table']);
assert.equal(both.settings.serviceMode,'table');
console.log('Progressive client settings and ordered Quick/Table service builder passed.');
