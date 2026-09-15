import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeServiceProfile} from '../dist/data/qrk-service-presets.js';

const [html,js,css,menu]=await Promise.all([
  readFile(new URL('../dist/admin/index.html',import.meta.url),'utf8'),
  readFile(new URL('../dist/admin/admin.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/admin/admin.css',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8')
]);
assert.match(html,/class="service-builder"/);
assert.match(html,/name="serviceModeQuick"/);
assert.match(html,/name="serviceModeTable"/);
assert.match(html,/id="apply-service-preset"/);
assert.match(html,/id="start-empty-service"/);
assert.doesNotMatch(html,/id="quick-rules"|id="table-rules"|id="preset-grid"/);
assert.match(js,/draggable="true"/);
assert.match(js,/data-move-gate/);
assert.match(js,/data-remove-gate/);
assert.match(js,/data-add-gate/);
assert.match(js,/gateOrder/);
assert.match(css,/\.gate-boards/);
assert.match(menu,/requestedService/);
const both=normalizeServiceProfile({preset:'traditional',serviceModes:['quick','table'],settings:{serviceModes:['quick','table'],gateOrder:{quick:['fulfillment'],table:['table_entry']}}});
assert.deepEqual(both.serviceModes,['quick','table']);
assert.equal(both.settings.serviceMode,'table');
console.log('Compact ordered Quick/Table service builder passed.');
