import assert from 'node:assert/strict';

const storage=new Map();
globalThis.localStorage={
  getItem:key=>storage.get(key)??null,
  setItem:(key,value)=>storage.set(key,String(value))
};

const {readMenuState}=await import('../dist/data/qrk-menu-store.js');
const {DEVELOPMENT_CLIENTS}=await import('../dist/data/qrk-service-presets.js');

const expected=Object.fromEntries(DEVELOPMENT_CLIENTS.map(client=>[client.slug,[...new Set(client.menu.map(([category])=>category))]]));

for(const [slug,categories] of Object.entries(expected)){
  const state=readMenuState(slug);
  const preset=DEVELOPMENT_CLIENTS.find(client=>client.slug===slug);
  assert.deepEqual(state.categories,categories,`${slug} should keep its business-specific category order`);
  assert.equal(categories.length,10,`${slug} should seed 10 categories`);
  assert.equal(state.items.length,50,`${slug} should seed 50 products`);
  assert.equal(preset.menu.length,50,`${slug} preset should seed 50 products`);
  for(const category of categories){
    assert.equal(state.items.filter(item=>item.category===category).length,5,`${slug}/${category} should have five products`);
    assert.equal(preset.menu.filter(item=>item[0]===category).length,5,`${slug}/${category} preset should have five products`);
  }
  for(const item of state.items){
    assert.ok(item.name);
    assert.ok(item.description);
    assert.ok(Number.isFinite(item.price)&&item.price>=0);
    assert.match(item.photo,/^https:\/\/images\.unsplash\.com\/photo-/,`${slug}/${item.name} should use a curated online development image`);
    assert.equal(item.available,true);
    assert.equal(item.hidden,false);
  }
}

const states=Object.keys(expected).map(slug=>readMenuState(slug));
assert.equal(new Set(states.map(state=>state.categories.join('|'))).size,states.length,'businesses should not share one generic category set');
localStorage.setItem('qrk_menu_studio_v1_salamat',JSON.stringify({...states[0],menuName:'Salamat private edit'}));
assert.equal(readMenuState('salamat').menuName,'Salamat private edit');
assert.equal(readMenuState('salo-table').menuName,'Main menu','a Salamat edit must not leak into Salo Table');

console.log('Development business menu density and isolation passed.');
