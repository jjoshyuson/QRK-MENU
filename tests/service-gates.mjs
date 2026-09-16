import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DEVELOPMENT_CLIENTS,SERVICE_PRESETS,deriveGateOrder,deriveServiceLayers,normalizeServiceProfile} from '../dist/data/qrk-service-presets.js';

const required=['open_tab','buffet_approval','buffet_end','buffet_timed','package_limited','minimum_spend','deposit_required'];
for(const preset of required)assert.ok(DEVELOPMENT_CLIENTS.some(client=>client.serviceProfile.preset===preset),`${preset} needs a working example client`);
assert.equal(DEVELOPMENT_CLIENTS.length,10,'the shared development inventory must contain exactly ten clients');
assert.equal(new Set(DEVELOPMENT_CLIENTS.map(client=>client.slug)).size,10,'development client slugs must be unique');
for(const client of DEVELOPMENT_CLIENTS)assert.deepEqual(client.serviceProfile.settings.gateOrder,deriveGateOrder(client.serviceProfile.settings),`${client.slug} must use the canonical ordered gates`);
assert.deepEqual(SERVICE_PRESETS.quick.settings.consumptionModes,['dine_in','takeaway']);
assert.deepEqual(SERVICE_PRESETS.quick.settings.paymentModes,['counter']);
assert.equal(deriveServiceLayers(SERVICE_PRESETS.deposit_required.settings).entryPayment,true);
assert.equal(deriveServiceLayers(SERVICE_PRESETS.package_limited.settings).entitlements,true);
assert.equal(normalizeServiceProfile({preset:'buffet_end'}).settings.bundleSelection,'required');

const [menu,staff,server,migration,catalog]=await Promise.all([
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
  readFile(new URL('../scripts/serve.mjs',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609150002_business_service_gates.sql',import.meta.url),'utf8'),
  readFile(new URL('../supabase/development_catalog.sql',import.meta.url),'utf8')
]);
assert.match(menu,/serviceProfile\.layers\.openOrderTab/);
assert.doesNotMatch(menu,/preset==='open_tab'/);
assert.match(menu,/history\.replaceState/);
assert.match(staff,/inactivity_warning/);
assert.match(server,/timingSafeEqual/);
assert.match(server,/inactivity_warning/);
assert.match(migration,/resolve_table_entry/);
assert.match(migration,/never releases or marks the physical table clean/);
assert.equal((catalog.match(/insert into public\.businesses/g)||[]).length,10);
assert.equal((catalog.match(/insert into public\.business_service_configs/g)||[]).length,10);
for(const client of DEVELOPMENT_CLIENTS)assert.ok(catalog.includes(`'${client.slug}'`),`${client.slug} must exist in the generated development catalog`);
console.log('Reusable Quick and Table service-gate contract passed.');
