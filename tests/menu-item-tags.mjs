import assert from 'node:assert/strict';
const mem=new Map();
globalThis.localStorage={getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>mem.set(k,String(v))};
globalThis.window={dispatchEvent(){}};
globalThis.CustomEvent=class{constructor(t,o){this.type=t;this.detail=o?.detail}};
const {readMenuState,saveMenuState,MENU_ITEM_TAGS}=await import('../dist/data/qrk-menu-store.js');

assert.deepEqual(MENU_ITEM_TAGS,['spicy','sharing','slow_cooked','vegetarian']);
const slug='kusina-manila';
assert.ok(readMenuState(slug).items.every(i=>i.featured===false&&Array.isArray(i.tags)&&!i.tags.length),'defaults');

mem.set(`qrk_menu_studio_v1_${slug}`,JSON.stringify({menuName:'M',categories:['A'],items:[{id:1,category:'A',name:'x',price:1}]}));
const old=readMenuState(slug).items[0];
assert.equal(old.featured,false);assert.deepEqual(old.tags,[]);

const state=readMenuState(slug);
state.items[0]={...state.items[0],featured:true,tags:['spicy','bogus','spicy','vegetarian']};
saveMenuState(slug,state);
const back=readMenuState(slug).items[0];
assert.equal(back.featured,true);
assert.deepEqual(back.tags,['spicy','vegetarian']);
console.log('menu item tags ok');
