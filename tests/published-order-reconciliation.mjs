import assert from 'node:assert/strict';
import { reconcilePublishedOrderItems } from '../dist/data/qrk-data-service.js';

const menu={menu:{categories:[{items:[
  {id:'current-flat-white',name:'Flat white',priceMinor:14500,available:true,optionGroups:[]},
  {id:'current-americano',name:'Americano',priceMinor:11000,available:true,optionGroups:[]},
  {id:'current-latte',name:'Latte',priceMinor:15000,available:true,optionGroups:[{name:'Milk',options:[{id:'current-oat',name:'Oat',priceDeltaMinor:2500}]}]},
  {id:'sold-out',name:'Cold brew',priceMinor:15000,available:false,optionGroups:[]}
]}]}};

const refreshed=reconcilePublishedOrderItems([
  {itemId:'prior-flat-white',name:'Flat white',quantity:1,unitPriceMinor:12000,lineTotalMinor:12000,selectedOptions:[]},
  {itemId:'prior-americano',name:'Americano',quantity:2,unitPriceMinor:10000,lineTotalMinor:20000,selectedOptions:[]},
  {itemId:'prior-latte',name:'Latte',quantity:1,unitPriceMinor:15000,lineTotalMinor:15000,selectedOptions:[{id:'prior-oat',group:'Milk',name:'Oat',priceMinor:2000}]}
],menu);
assert.deepEqual(refreshed.map(item=>item.itemId),['current-flat-white','current-americano','current-latte']);
assert.equal(refreshed[1].lineTotalMinor,22000,'current published price replaces a stale cart price');
assert.equal(refreshed[2].selectedOptions[0].id,'current-oat','current published option ID replaces a stale option ID');
assert.equal(refreshed[2].lineTotalMinor,17500,'current option pricing is recalculated');
assert.throws(()=>reconcilePublishedOrderItems([{itemId:'prior-cold-brew',name:'Cold brew',quantity:1,selectedOptions:[]}],menu),/no longer available/);

console.log('Published order reconciliation checks passed.');
