import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [menu,app,imageService,styles,dataService,markup]=await Promise.all([
 readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/app.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/data/qrk-image-service.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/menu/cart-dock.css',import.meta.url),'utf8'),
 readFile(new URL('../dist/data/qrk-data-service.js',import.meta.url),'utf8'),
 readFile(new URL('../dist/menu/index.html',import.meta.url),'utf8')
]);
assert.match(menu,/img\.loading=isPriority\?'eager':'lazy'/);
assert.match(menu,/img\.decoding='async'/);
assert.match(menu,/img\.fetchPriority=isPriority\?'high':'low'/);
assert.match(menu,/img\.classList\.add\('is-loaded'\)/);
assert.match(dataService,/this\.publicMenuPromise/);
assert.match(dataService,/Promise\.all\(photoItems\.map/);
assert.match(markup,/class="menu-section menu-loading"/);
assert.match(markup,/id="menu-sections" aria-busy="true"/);
assert.doesNotMatch(menu,/header-parallax/);
assert.doesNotMatch(styles,/background-attachment:\s*scroll,\s*fixed/);
assert.match(menu,/function updateMenuChrome\(\).*requestAnimationFrame/s);
assert.match(menu,/const heroHeight=restaurant\.offsetHeight[^;]*progress=Math\.max\(0,Math\.min\(heroHeight,-restaurant\.getBoundingClientRect\(\)\.top\)\)/);
assert.match(menu,/\?0:progress/);
assert.match(menu,/reducedMotionQuery\.matches.*\?0:/);
assert.match(menu,/menuTools\.classList\.toggle\('is-stuck'/);
assert.match(styles,/\.restaurant-visual\s*\{[^}]*transform:\s*translate3d\(0,var\(--restaurant-parallax-y,0px\),0\)[^}]*will-change:\s*transform/s);
assert.match(styles,/\.restaurant\s*\{[^}]*overflow:\s*visible/s);
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
assert.doesNotMatch(menu,/new IntersectionObserver/);
assert.match(menu,/categoryNavigationId=id/);
assert.match(menu,/if\(categoryNavigationId\)\{activate\(categoryNavigationId\);return\}/);
assert.match(menu,/categoryNavigationScrollHandler=.*addEventListener\('scroll',categoryNavigationScrollHandler,\{passive:true\}\)/s);
assert.match(menu,/categoryNavigationIdleTimer=setTimeout\(\(\)=>finishNavigation\(id\),140\)/);
assert.match(menu,/const activationLine=\(\)=>.*toolbar\?\.getBoundingClientRect\(\)\.bottom.*\+4/);
assert.match(menu,/box\.top<=line&&box\.bottom>line/);
assert.match(menu,/targetY=section\?scrollY\+section\.getBoundingClientRect\(\)\.top-\(toolbar\?\.offsetHeight\|\|0\)\+1:scrollY/);
assert.match(menu,/categoryTrackingFrame=requestAnimationFrame\(activateAtLine\)/);
assert.doesNotMatch(menu,/window\.onscroll=/);
assert.match(styles,/\.menu-section \.dish\s*\{[^}]*backdrop-filter:\s*none/s);
assert.match(styles,/#cart-dialog \.cart-recommendation-list\s*\{[^}]*overscroll-behavior-inline:\s*none[^}]*scroll-snap-type:\s*inline mandatory/s);
assert.match(styles,/#cart-dialog \.cart-recommendation\s*\{[^}]*scroll-snap-stop:\s*always/s);
assert.match(styles,/dialog::backdrop\s*\{[^}]*background:\s*rgba\(248, 250, 252, \.16\)[^}]*backdrop-filter:\s*blur\(6px\) saturate\(\.92\)[^}]*backdrop-filter 90ms ease-out/s);
assert.match(styles,/dialog #add-item\s*\{[^}]*backdrop-filter:\s*none/s);
assert.match(styles,/dialog \.quick-service-card[\s\S]*transition-property:\s*none !important/);
console.log('Customer menu performance contract passed.');
