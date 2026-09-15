import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DEVELOPMENT_CLIENTS,SERVICE_PRESETS,deriveServiceLayers,normalizeServiceProfile} from '../dist/data/qrk-service-presets.js';

const required=['open_tab','buffet_approval','buffet_end','buffet_timed','package_limited','minimum_spend','deposit_required'];
for(const preset of required)assert.ok(DEVELOPMENT_CLIENTS.some(client=>client.serviceProfile.preset===preset),`${preset} needs a working example client`);
assert.deepEqual(SERVICE_PRESETS.quick.settings.consumptionModes,['dine_in','takeaway']);
assert.deepEqual(SERVICE_PRESETS.quick.settings.paymentModes,['counter']);
assert.equal(deriveServiceLayers(SERVICE_PRESETS.deposit_required.settings).entryPayment,true);
assert.equal(deriveServiceLayers(SERVICE_PRESETS.package_limited.settings).entitlements,true);
assert.equal(normalizeServiceProfile({preset:'buffet_end'}).settings.bundleSelection,'required');

const [menu,staff,server,migration]=await Promise.all([
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
  readFile(new URL('../scripts/serve.mjs',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609150002_business_service_gates.sql',import.meta.url),'utf8')
]);
assert.match(menu,/serviceProfile\.layers\.openOrderTab/);
assert.doesNotMatch(menu,/preset==='open_tab'/);
assert.match(menu,/history\.replaceState/);
assert.match(staff,/inactivity_warning/);
assert.match(server,/timingSafeEqual/);
assert.match(server,/inactivity_warning/);
assert.match(migration,/resolve_table_entry/);
assert.match(migration,/never releases or marks the physical table clean/);
console.log('Reusable Quick and Table service-gate contract passed.');
