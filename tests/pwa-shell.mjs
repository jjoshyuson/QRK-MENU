import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../dist/manifest.webmanifest', import.meta.url), 'utf8'));
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, './');
assert.ok(manifest.icons.some((icon) => icon.src === 'assets/brand/qrk-mark.png'));

for (const route of ['../dist/index.html', '../dist/admin/index.html', '../dist/menu/index.html']) {
  const html = await readFile(new URL(route, import.meta.url), 'utf8');
  assert.match(html, /rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(html, /src="\/pwa\.js"/);
  assert.match(html, /href="\/pwa\.css\?v=1"/);
  assert.match(html, /viewport-fit=cover/);
}

const css = await readFile(new URL('../dist/pwa.css', import.meta.url), 'utf8');
assert.match(css, /touch-action:\s*manipulation/);
assert.doesNotMatch(css, /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i);

const dashboardCss = await readFile(new URL('../dist/dashboard.css', import.meta.url), 'utf8');
assert.match(dashboardCss, /sidebar-bottom\{display:block;flex:0 0 auto/);
assert.match(dashboardCss, /sidebar-bottom \.profile>\.profile-copy/);
assert.match(dashboardCss, /sidebar-bottom \.profile \.profile-copy strong.*text-overflow:ellipsis/);
assert.match(dashboardCss, /safe-area-inset-bottom/);

const serviceWorker = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');
assert.match(serviceWorker, /const isCodeRequest =/);
assert.match(serviceWorker, /if \(isCodeRequest\)[\s\S]*fetch\(event\.request\)[\s\S]*catch\(\(\) => caches\.match\(event\.request\)\)/);

const pagesBuild = await readFile(new URL('../scripts/build-pages.mjs', import.meta.url), 'utf8');
assert.match(pagesBuild, /process\.env\.GITHUB_SHA/);
assert.match(pagesBuild, /versionCodeReferences/);

console.log('PWA shell contract passed.');
