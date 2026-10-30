import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [app,menu,data,brand,migration,styles]=await Promise.all([
  readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-data-service.js',import.meta.url),'utf8'),
  readFile(new URL('../dist/data/qrk-brand-service.js',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/202609150003_business_cosmetics.sql',import.meta.url),'utf8'),
  readFile(new URL('../dist/dashboard.css',import.meta.url),'utf8')
]);

assert.match(app,/Business cosmetics/);
// Hosted logo URLs are tenant-written text; they must never be parsed as HTML.
assert.doesNotMatch(menu,/innerHTML=[^;]*logoDataUrl/,'customer logo must not be built with innerHTML');
assert.doesNotMatch(app,/src="\$\{currentBrand\.logoDataUrl\}"/,'staff logo must be escaped');
const {safeImageUrl}=await import('../dist/menu/menu-appearance.js');
assert.equal(safeImageUrl('x" onerror="alert(1)'),'');
assert.equal(safeImageUrl('javascript:alert(1)'),'');
assert.equal(safeImageUrl('https://cdn.example/logo.webp'),'https://cdn.example/logo.webp');
assert.equal(safeImageUrl('data:image/webp;base64,AAAA'),'data:image/webp;base64,AAAA');
assert.match(app,/backgroundEntry\.hidden=true/);
assert.match(app,/cosmetics-menu-preview/);
assert.match(app,/cosmetics-preview-cover/);
assert.match(app,/cosmetics-preview-logo/);
assert.doesNotMatch(app,/Browsing surface image/);
assert.match(styles,/\.qrk-sheet \.cosmetics-color-row input\[type=color\]\{[^}]*width:44px;[^}]*height:44px;/);
assert.match(app,/coverPhotoUrl/);
assert.match(app,/saveBusinessCosmetics/);
assert.match(menu,/getBusinessCosmetics/);
assert.match(menu,/colorMode:'custom'/);
assert.match(menu,/customerBrand\.coverPhotoUrl/);
assert.match(data,/storage\/v1\/object\/business-cosmetics/);
assert.match(data,/business_profiles\?business_id=eq\./);
assert.match(brand,/primary:'#1683ff'/);
assert.match(brand,/logo:100\*1024,cover:200\*1024,background:200\*1024/);
assert.match(brand,/encodeUnderBudget\(canvas,BUSINESS_IMAGE_BUDGETS\.logo,160\)/);
assert.match(brand,/encodeUnderBudget\(canvas,BUSINESS_IMAGE_BUDGETS\.background,480\)/);
assert.match(brand,/blob\.size<=maxBytes/);
const saveSource=data.slice(data.indexOf('async saveBusinessCosmetics(cosmetics){\n'));
assert.match(saveSource.slice(0,saveSource.indexOf('async registerDevice')),/menuCosmetics=\{[^}]*background:/,'background is written inside menuCosmetics');
assert.match(migration,/create function public\.get_public_business_cosmetics/);
assert.match(migration,/private\.has_business_role/);
assert.match(migration,/grant execute .* to anon,authenticated/);

// Owner background editor: style, pattern swatches and strength drive one preview through backgroundLayers.
assert.match(app,/import \{[^}]*backgroundLayers[^}]*\} from '\.\/menu\/menu-appearance\.js/);
assert.match(app,/<fieldset class="menu-bg-style"[^>]*><legend>Style<\/legend>/);
for(const [value,label] of [['photo','Photo'],['pattern','Pattern'],['pattern-moving','Moving pattern'],['glow','Glow'],['plain','Plain']])assert.match(app,new RegExp(`name="menu-bg-style" value="${value}"[^>]*><span>${label}</span>`),`style option ${label}`);
for(const name of ['filipino','cafe','ramen','pizza','dessert'])assert.match(app,new RegExp(`data-menu-pattern="${name}" aria-pressed="false"`),`pattern swatch ${name}`);
assert.match(app,/<label[^>]*for="menu-bg-strength"[^>]*><span>Strength/);
assert.match(app,/id="menu-bg-strength" type="range" min="0" max="100" step="5"/);
assert.match(app,/backgroundLayers\(/);
assert.match(app,/background:\{style:[^}]*pattern:[^}]*strength:/,'hosted save carries background {style,pattern,strength}');
assert.match(app,/menuBackground:\{backgroundStyle:/,'demo save keeps raw menuBackground keys');
assert.match(styles,/\.menu-bg-swatch\{[^}]*min-height:44px/);

console.log('Tenant-owned hosted business cosmetics contract passed.');
