import assert from 'node:assert/strict';

const values=new Map();
globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))};
const {getBusinessBrand,saveBusinessBrand,QRK_BRAND_STORAGE_KEY}=await import('../dist/data/qrk-brand-service.js');

const kusina={businessSlug:'kusina-manila',businessName:"Kusina Nanay Mila's"};
const salamat={businessSlug:'salamat',businessName:'Salamat'};
assert.deepEqual(getBusinessBrand(kusina).publicMenuBackground,{image:'/assets/businesses/kusina-manila-menu-background.jpg',surfaceOpacity:.72});
assert.equal(getBusinessBrand(kusina).businessName,"Kusina Nanay Mila's");
assert.deepEqual(getBusinessBrand(salamat).publicMenuBackground,{image:'',surfaceOpacity:.72});

values.set(QRK_BRAND_STORAGE_KEY,JSON.stringify({'kusina-manila':{businessName:'Kusina Manila'}}));
assert.equal(getBusinessBrand(kusina).businessName,"Kusina Nanay Mila's");

saveBusinessBrand(kusina,{publicMenuBackground:{image:'data:image/webp;base64,TEST',surfaceOpacity:.81}});
assert.deepEqual(getBusinessBrand(kusina).publicMenuBackground,{image:'data:image/webp;base64,TEST',surfaceOpacity:.81});
assert.equal(JSON.parse(values.get(QRK_BRAND_STORAGE_KEY))['kusina-manila'].publicMenuBackground.surfaceOpacity,.81);

saveBusinessBrand(kusina,{publicMenuBackground:{image:'',surfaceOpacity:.55}});
assert.deepEqual(getBusinessBrand(kusina).publicMenuBackground,{image:'',surfaceOpacity:.55});
console.log('Business-scoped public menu background contract passed.');
