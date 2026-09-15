import assert from 'node:assert/strict';
import {resolveEntitlement} from '../dist/menu/entitlement-gate.js';

const active={id:'session-1',table:'8',packageId:'classic',status:'active',expiresAt:'2099-01-01T00:00:00.000Z'};
const settings={entitlementMode:'bundle',refillPolicy:'included',paymentTiming:'split'};
assert.equal(resolveEntitlement({settings,item:{price:0},session:active}).kind,'included');
assert.equal(resolveEntitlement({settings,item:{price:5000},session:active}).kind,'extra');
assert.equal(resolveEntitlement({settings:{...settings,paymentTiming:'upfront'},item:{price:5000},session:active}).kind,'counter-only');
assert.equal(resolveEntitlement({settings,item:{price:0,entitlement:{bundleIds:['premium']}},session:active}).kind,'unavailable');
assert.equal(resolveEntitlement({settings,item:{price:0},session:{...active,status:'expired'}}).kind,'unavailable');
assert.equal(resolveEntitlement({settings,item:{price:0},session:{...active,expiresAt:'2020-01-01T00:00:00.000Z'},now:Date.parse('2020-01-02')}).kind,'unavailable');
assert.equal(resolveEntitlement({settings,item:{price:0},session:null}).kind,'unavailable');
assert.equal(resolveEntitlement({settings:{entitlementMode:'none'},item:{price:5000},session:null}).kind,'standard');
console.log('Entitlement gate contract passed.');
