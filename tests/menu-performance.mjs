import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [menu,app,imageService,styles]=await Promise.all([
 readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/data/qrk-image-service.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/menu/cart-dock.css',import.meta.url),'utf8')
]);
assert.match(menu,/img\.loading='lazy'/);
assert.match(menu,/img\.decoding='async'/);
assert.doesNotMatch(menu,/header-parallax/);
assert.doesNotMatch(styles,/background-attachment:\s*scroll,\s*fixed/);
assert.match(imageService,/MAX_EDGE=960/);
assert.match(imageService,/TARGET_BYTES=160\*1024/);
assert.match(imageService,/indexedDB\.open/);
assert.match(app,/optimizeLegacyMenuPhotos\(items\)/);
assert.match(styles,/dialog::backdrop\s*\{[^}]*background:\s*rgba\(248, 250, 252, \.16\)[^}]*backdrop-filter:\s*blur\(12px\) saturate\(\.85\)/s);
assert.match(styles,/dialog #add-item\s*\{[^}]*backdrop-filter:\s*none/s);
assert.match(styles,/dialog \.quick-service-card[\s\S]*transition-property:\s*none !important/);
console.log('Customer menu performance contract passed.');
