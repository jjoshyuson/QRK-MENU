import assert from 'node:assert/strict';
import { menuOptionGroupsForItem } from '../dist/data/qrk-menu-store.js';

const state={optionGroups:[
  {id:'business',scope:'business'},
  {id:'drinks',scope:'category',category:'Drinks'},
  {id:'mains',scope:'category',category:'Mains'},
  {id:'latte',scope:'item',itemId:42},
  {id:'other',scope:'item',itemId:7}
]};

assert.deepEqual(menuOptionGroupsForItem(state,{id:42,category:'Drinks'}).map(group=>group.id),['business','drinks','latte']);
assert.deepEqual(menuOptionGroupsForItem(state,{id:'42',category:'Drinks'}).map(group=>group.id),['business','drinks','latte']);
assert.deepEqual(menuOptionGroupsForItem(state,{id:7,category:'Mains'}).map(group=>group.id),['business','mains','other']);
assert.deepEqual(menuOptionGroupsForItem({},{}),[]);
console.log('Menu option inheritance passed.');
