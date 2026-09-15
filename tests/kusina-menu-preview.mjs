import assert from 'node:assert/strict';

const storage=new Map();
globalThis.localStorage={
  getItem:key=>storage.get(key)??null,
  setItem:(key,value)=>storage.set(key,String(value))
};

const {readMenuState}=await import('../dist/data/qrk-menu-store.js');
const {DEVELOPMENT_CLIENTS}=await import('../dist/data/qrk-service-presets.js');

const state=readMenuState('kusina-manila');
const preset=DEVELOPMENT_CLIENTS.find(client=>client.slug==='kusina-manila');
const expectedCategories=[...new Set(preset.menu.map(([category])=>category))];

assert.deepEqual(state.categories,expectedCategories);
assert.equal(expectedCategories.length,10);
assert.equal(state.items.length,50);
for(const category of expectedCategories){
  assert.equal(state.items.filter(item=>item.category===category).length,5,`${category} should have five products`);
}
for(const item of state.items){
  assert.ok(item.name);
  assert.ok(item.description);
  assert.ok(Number.isFinite(item.price)&&item.price>0);
  assert.equal(item.available,true);
  assert.match(item.photo,/^https:\/\/images\.unsplash\.com\/photo-/);
}

assert.equal(preset.menu.length,50);
for(const category of expectedCategories){
  assert.equal(preset.menu.filter(item=>item[0]===category).length,5,`${category} preset should have five products`);
}

console.log('Kusina responsive test menu contract passed.');
