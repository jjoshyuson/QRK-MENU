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

// Item sheet: required-group validation state, restyle and pop motion.
import { readFile } from 'node:fs/promises';
const [menuJs, sheetsCss, menuCss] = await Promise.all(['menu.js', 'menu-sheets.css', 'menu.css'].map(f => readFile(new URL(`../dist/menu/${f}`, import.meta.url), 'utf8')));
assert.match(menuJs, /Choose one to continue\./);
assert.match(menuJs, /dataset\.invalid=|setAttribute\('data-invalid'/);
assert.doesNotMatch(menuJs, /setCustomValidity\('Choose an option\.'\)/);
assert.match(menuJs, /'Update':'Add to order'/);
assert.match(sheetsCss, /\.item-sheet \.option-group\[data-invalid\][^{]*\{[^}]*var\(--danger\)/);
assert.match(sheetsCss, /\.item-sheet \.item-hero > #item-photo\s*\{[^}]*height:\s*236px/);
assert.match(sheetsCss, /\.item-hero:has\(#item-photo\[hidden\]\)\s*\{[^}]*height:\s*150px/);
assert.match(sheetsCss, /animation:\s*check-pop 220ms/);
assert.match(menuCss, /--danger:\s*#B42318/);
assert.match(menuCss, /--danger:\s*#F97066/);
console.log('Item sheet validation checks passed.');
