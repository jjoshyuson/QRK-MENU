import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeServiceProfile,selectServiceExperience} from '../dist/data/qrk-service-presets.js';
import {isValidQuickOrderPair,resolveQuickOrderState,validQuickFulfillmentModes} from '../dist/data/qrk-quick-order.js';

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

const both={consumptionModes:['dine_in','takeaway'],fulfillmentModes:['pickup','table']};
assert.deepEqual(resolveQuickOrderState(both),{...both,consumption:'',fulfillment:'',table:'',validFulfillmentModes:[]},'both Consumption choices require a visible choice');
assert.deepEqual(resolveQuickOrderState({consumptionModes:['dine_in'],fulfillmentModes:['pickup','table']}).consumption,'dine_in','fixed dine-in is automatic');
assert.deepEqual(resolveQuickOrderState({consumptionModes:['takeaway'],fulfillmentModes:['pickup','table']}),{consumptionModes:['takeaway'],fulfillmentModes:['pickup','table'],consumption:'takeaway',fulfillment:'pickup',table:'',validFulfillmentModes:['pickup']},'fixed takeaway filters and selects pickup');
assert.ok(isValidQuickOrderPair(both,'dine_in','pickup'),'dine-in pickup is valid');
assert.ok(isValidQuickOrderPair(both,'dine_in','table'),'dine-in table service is valid');
assert.ok(isValidQuickOrderPair(both,'takeaway','pickup'),'takeaway pickup is valid');
assert.equal(isValidQuickOrderPair(both,'takeaway','table'),false,'takeaway table service is rejected');
assert.deepEqual(validQuickFulfillmentModes({consumptionModes:['takeaway'],fulfillmentModes:['table']},'takeaway'),[],'invalid configuration fails closed');
assert.deepEqual(resolveQuickOrderState(both,{consumption:'dine_in',fulfillment:'pickup'}),{...both,consumption:'dine_in',fulfillment:'pickup',table:'',validFulfillmentModes:['pickup','table']},'saved choices survive reload');
assert.deepEqual(resolveQuickOrderState(both,{consumption:'takeaway',fulfillment:'table',table:'1'}),{...both,consumption:'takeaway',fulfillment:'pickup',table:'',validFulfillmentModes:['pickup']},'switching to takeaway clears incompatible table fulfillment and auto-selects the only valid replacement');
assert.deepEqual(resolveQuickOrderState(both,{},'1'),{...both,consumption:'dine_in',fulfillment:'table',table:'1',validFulfillmentModes:['pickup','table']},'Quick table links preselect dine-in table service');

const [menu,data,migration,consumptionMigration,reconciliation,destinationReconciliation,admin,rnl,markup]=await Promise.all([
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-data-service.js',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609270008_dual_service_experiences.sql',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609280001_order_consumption_type.sql',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609270009_rnl_service_experience_reconciliation.sql',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609270010_rnl_destination_service_reconciliation.sql',import.meta.url),'utf8'),
  readFile(new URL('../dist/admin/admin.js',import.meta.url),'utf8'),
  readFile(new URL('../supabase/functions/rnl-orders/index.ts',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/index.html',import.meta.url),'utf8')
]);
for(const marker of ['service-experience-dialog','sessionStorage.setItem(serviceChoiceKey',"entryParams.has('token')",'resolveQuickOrderState','continueOrderMethodFlow','showConsumptionChoices','validQuickFulfillmentModes'])assert.ok(menu.includes(marker),`Missing public routing marker ${marker}`);
assert.doesNotMatch(menu,/entryParams\.has\('table'\).*requestedService='table'/,'table context must not silently select Table experience');
assert.match(menu,/consumptionType:consumption/);
assert.match(menu,/if\(businessExperience\.serviceMode==='table'\)return paymentFirst\?openPaymentStep\(\):createOrder\(\)/,'Table mode bypasses the Quick Consumption gate');
assert.match(markup,/data-consumption-choice="dine_in"/);
assert.match(markup,/data-consumption-choice="takeaway"/);
assert.match(data,/p_experience:input\.experience/);
assert.match(data,/p_consumption:input\.consumptionType/);
assert.match(rnl,/p_experience:input\.experience/);
assert.match(rnl,/p_consumption:input\.consumptionType/);
for(const marker of ['service experience is not enabled','table experience requires table fulfillment','fulfillment is not enabled for quick experience','service_experience=p_experience'])assert.ok(migration.includes(marker),`Missing server validation marker ${marker}`);
for(const marker of ['consumption_type','consumption is not enabled for quick experience','takeaway requires pickup fulfillment','table experience requires dine-in consumption'])assert.ok(consumptionMigration.includes(marker),`Missing Consumption validation marker ${marker}`);
assert.match(reconciliation,/20000000-0000-4000-8000-000000000001/);
assert.match(reconciliation,/on conflict\(business_id\) do update/);
assert.match(destinationReconciliation,/from public\.public_destinations destination/);
assert.match(destinationReconciliation,/destination\.slug='rnl'/);
assert.match(admin,/serviceBuilder\.experiences\[mode\]/);
assert.doesNotMatch(admin,/serviceBuilder\.settings\[/);
console.log('Independent Quick/Table experience contract passed.');
