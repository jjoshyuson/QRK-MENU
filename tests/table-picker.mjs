import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
const {getBusinessBrand}=await import('../dist/data/qrk-brand-service.js');
assert.equal(getBusinessBrand({businessSlug:'salamat',businessName:'Salamat'}).tableCount,20);
assert.equal(getBusinessBrand({businessSlug:'kusina-manila'}).tableCount,6);

const menu=await readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8');
const markup=await readFile(new URL('../dist/menu/index.html',import.meta.url),'utf8');
assert.match(menu,/configuredTableCount>10/);
assert.match(menu,/Number\(qrTable\)<=configuredTableCount/);
assert.match(markup,/role="radiogroup"/);
assert.doesNotMatch(markup,/id="table-number" type="text"/);
console.log('Table-count defaults, compact picker threshold, QR bounds, and no-manual-entry contract passed.');
