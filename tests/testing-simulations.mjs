import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [html,css,script,menu,dataService,tableService]=await Promise.all([
  readFile(new URL('../dist/testing/index.html',import.meta.url),'utf8'),readFile(new URL('../dist/testing/testing.css',import.meta.url),'utf8'),readFile(new URL('../dist/testing/testing.js',import.meta.url),'utf8'),readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),readFile(new URL('../dist/data/qrk-data-service.js',import.meta.url),'utf8'),readFile(new URL('../dist/data/qrk-table-session-service.js',import.meta.url),'utf8')
]);
assert.match(html,/noindex,nofollow/);assert.match(html,/id="device-grid"/);assert.match(html,/id="page-size"/);assert.match(html,/id="next-page"/);assert.match(html,/id="menu-url"/);
assert.match(script,/DEVICE_COUNT=10/);assert.match(script,/DEVELOPMENT_CLIENTS/);assert.match(script,/simDevice/);assert.match(script,/state\.page\+\+/);assert.match(css,/aspect-ratio:390\/844/);
assert.match(menu,/simulationDeviceId/);assert.match(menu,/storageSuffix=.*simulationDeviceId/);assert.match(dataService,/activeKey=.*deviceSuffix/);assert.match(tableService,/deviceKey=simulationDeviceId/);
console.log('Ten-device paginated testing simulator and storage-isolation contract passed.');
