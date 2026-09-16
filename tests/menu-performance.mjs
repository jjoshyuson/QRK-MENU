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
assert.match(imageService,/CARD_EDGE=480/);
assert.match(imageService,/CARD_TARGET_BYTES=72\*1024/);
assert.match(imageService,/photoCard:card\.dataUrl/);
assert.match(imageService,/item\.photoOptimized&&item\.photoCard/);
assert.match(imageService,/item\.photoOptimized\)\{const card=await optimizeMenuImage/);
assert.match(imageService,/indexedDB\.open/);
assert.match(app,/optimizeLegacyMenuPhotos\(items\)/);
assert.match(app,/i\.photoCard\|\|i\.photo/);
assert.match(menu,/img\.src=item\.photoCard\|\|item\.photo/);
assert.match(menu,/new IntersectionObserver/);
assert.doesNotMatch(menu,/window\.onscroll=/);
assert.match(styles,/\.menu-section \.dish\s*\{[^}]*backdrop-filter:\s*none/s);
assert.match(styles,/#cart-dialog \.cart-recommendation-list\s*\{[^}]*overscroll-behavior-inline:\s*none[^}]*scroll-snap-type:\s*inline mandatory/s);
assert.match(styles,/#cart-dialog \.cart-recommendation\s*\{[^}]*scroll-snap-stop:\s*always/s);
assert.match(styles,/dialog::backdrop\s*\{[^}]*background:\s*rgba\(248, 250, 252, \.16\)[^}]*backdrop-filter:\s*blur\(6px\) saturate\(\.92\)[^}]*backdrop-filter 90ms ease-out/s);
assert.match(styles,/dialog #add-item\s*\{[^}]*backdrop-filter:\s*none/s);
assert.match(styles,/dialog \.quick-service-card[\s\S]*transition-property:\s*none !important/);
console.log('Customer menu performance contract passed.');
