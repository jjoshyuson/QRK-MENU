import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [app,menu,data,brand,migration]=await Promise.all([
  readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-data-service.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-brand-service.js',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609150003_business_cosmetics.sql',import.meta.url),'utf8')
]);

assert.match(app,/Business cosmetics/);
assert.match(app,/backgroundEntry\.hidden=true/);
assert.match(app,/coverPhotoUrl/);
assert.match(app,/saveBusinessCosmetics/);
assert.match(menu,/getBusinessCosmetics/);
assert.match(menu,/colorMode:'custom'/);
assert.match(menu,/customerBrand\.coverPhotoUrl/);
assert.match(data,/storage\/v1\/object\/business-cosmetics/);
assert.match(data,/business_profiles\?business_id=eq\./);
assert.match(brand,/primary:'#1683ff'/);
assert.match(migration,/create function public\.get_public_business_cosmetics/);
assert.match(migration,/private\.has_business_role/);
assert.match(migration,/grant execute .* to anon,authenticated/);

console.log('Tenant-owned hosted business cosmetics contract passed.');
