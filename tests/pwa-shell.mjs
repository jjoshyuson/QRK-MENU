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

console.log('PWA shell contract passed.');
