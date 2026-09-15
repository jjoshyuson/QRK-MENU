import assert from 'node:assert/strict';
import {bundleGateEnabled,bundleOptionsForProfile,bundlePaymentCopy} from '../dist/menu/bundle-gate.js';

const disabled={settings:{packageMode:'none',paymentTiming:'end'},layers:{bundleSelection:false}};
assert.equal(bundleGateEnabled(disabled),false);
assert.deepEqual(bundleOptionsForProfile(disabled,[]),{enabled:false,options:[],error:''});

const enabled={settings:{packageMode:'required',paymentTiming:'upfront'},layers:{bundleSelection:true}};
const menu=[
  {id:'classic',category:'Packages',name:'Classic buffet',price:59900,available:true},
  {id:'premium',category:'Packages',name:'Premium buffet',price:79900,available:false},
  {category:'Pork Grill',name:'Pork barbecue',price:0,available:true},
  {category:'Rice & Noodles',name:'Steamed rice',price:0,available:true},
  {category:'Extras',name:'Cheese dip',price:8500,available:true}
];
const fallback=bundleOptionsForProfile(enabled,menu);
assert.equal(fallback.enabled,true);
assert.deepEqual(fallback.options,[{id:'classic',name:'Classic buffet',priceMinor:59900,includes:['Pork Grill','Rice & Noodles'],available:true}]);
assert.equal(bundlePaymentCopy(enabled),'Pay before ordering');
assert.equal(bundlePaymentCopy({settings:{paymentTiming:'hybrid'}}),'Package paid before ordering; extras paid later');
assert.equal(bundlePaymentCopy({settings:{paymentTiming:'end'}}),'Pay after dining');

const configured=bundleOptionsForProfile({settings:{packageMode:'required',paymentTiming:'end',bundles:[{id:'family',name:'Family grill',priceMinor:129900,includes:['Pork barbecue','Rice']}]}},[]);
assert.equal(configured.options[0].name,'Family grill');
assert.equal(configured.error,'');

const incomplete=bundleOptionsForProfile({settings:{packageMode:'required',bundles:[{id:'empty',name:'Empty',priceMinor:1000,includes:[]}]}},[]);
assert.equal(incomplete.options.length,0);
assert.match(incomplete.error,/temporarily unavailable/);

const expired=bundleOptionsForProfile({settings:{packageMode:'required',bundles:[{id:'old',name:'Old package',priceMinor:1000,includes:['Rice'],expired:true}]}},[]);
assert.equal(expired.options.length,0);
assert.match(expired.error,/temporarily unavailable/);

console.log('Bundle gate enabled, disabled, pay timing, incomplete, and expired states passed.');
