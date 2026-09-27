import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeServiceProfile,selectServiceExperience} from '../dist/data/qrk-service-presets.js';

const combined=normalizeServiceProfile({version:2,serviceModes:['quick','table'],experiences:{
  quick:{preset:'quick',gates:['fulfillment'],settings:{serviceMode:'quick',fulfillmentModes:['pickup'],paymentTiming:'counter'}},
  table:{preset:'buffet_timed',gates:['table_entry','bundle','time_limit'],settings:{serviceMode:'table',bundleSelection:'required',timeLimitMinutes:90,paymentTiming:'end'}}
}});
assert.deepEqual(combined.serviceModes,['quick','table']);
assert.deepEqual(selectServiceExperience(combined,'quick').settings.fulfillmentModes,['pickup']);
assert.equal(selectServiceExperience(combined,'quick').layers.tableSelection,false);
assert.equal(selectServiceExperience(combined,'table').settings.bundleSelection,'required');
assert.equal(selectServiceExperience(combined,'table').layers.tableSelection,true);
const quickBefore=structuredClone(combined.experiences.quick);
combined.experiences.table.settings.timeLimitMinutes=120;
assert.deepEqual(combined.experiences.quick,quickBefore,'editing Table must not mutate Quick');

const [menu,data,migration,admin]=await Promise.all([
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-data-service.js',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609270008_dual_service_experiences.sql',import.meta.url),'utf8'),
  readFile(new URL('../dist/admin/admin.js',import.meta.url),'utf8')
]);
for(const marker of ['service-experience-dialog','sessionStorage.setItem(serviceChoiceKey',"entryParams.has('table')","entryParams.has('token')",'selectServiceExperience'])assert.ok(menu.includes(marker),`Missing public routing marker ${marker}`);
assert.match(data,/p_experience:input\.experience/);
for(const marker of ['service experience is not enabled','table experience requires table fulfillment','fulfillment is not enabled for quick experience','service_experience=p_experience'])assert.ok(migration.includes(marker),`Missing server validation marker ${marker}`);
assert.match(admin,/serviceBuilder\.experiences\[mode\]/);
assert.doesNotMatch(admin,/serviceBuilder\.settings\[/);
console.log('Independent Quick/Table experience contract passed.');
