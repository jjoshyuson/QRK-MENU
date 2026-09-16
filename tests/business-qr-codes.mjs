import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DEVELOPMENT_CLIENTS} from '../dist/data/qrk-service-presets.js';
import {customerMenuUrl,testQrImageUrl} from '../dist/data/qrk-qr-code.js';

const pageUrl='https://jjoshyuson.github.io/QRK-MENU/';
const menuUrls=DEVELOPMENT_CLIENTS.map(client=>customerMenuUrl(pageUrl,client.slug));
assert.equal(menuUrls.length,DEVELOPMENT_CLIENTS.length);
assert.equal(new Set(menuUrls).size,DEVELOPMENT_CLIENTS.length);
for(const [index,menuUrl] of menuUrls.entries()){
  assert.equal(menuUrl,`${pageUrl}menu/?business=${DEVELOPMENT_CLIENTS[index].slug}`);
  const qrUrl=new URL(testQrImageUrl(menuUrl));
  assert.equal(qrUrl.protocol,'https:');
  assert.equal(qrUrl.searchParams.get('data'),menuUrl);
  assert.equal(qrUrl.searchParams.get('qzone'),'4');
}
const [markup,app]=await Promise.all([
  readFile(new URL('../dist/index.html',import.meta.url),'utf8'),
  readFile(new URL('../dist/app.js',import.meta.url),'utf8')
]);
assert.match(markup,/data-profile-dialog="menu-link-dialog"/);
assert.match(markup,/data-profile-dialog="table-qr-dialog"/);
assert.match(markup,/id="quick-menu-qr-entry"/);
assert.match(markup,/>Quick Menu QR</);
assert.match(markup,/id="table-qr-grid"/);
assert.doesNotMatch(markup,/id="table-qr-number"/);
assert.match(app,/count<=6\?3:count<=12\?4:count<=30\?5:6/);
assert.match(app,/data-table-qr=/);
assert.match(app,/Table \$\{selectedTableQr\} QR code/);
assert.match(app,/window\.QrkSheet\.create/);
assert.match(app,/materializeSheet\(\$\('#table-qr-dialog'\),\{readOnly:true\}\)/);
assert.match(app,/\.classList\.add\('qrk-settings-list'\)/);
assert.match(app,/serviceProfile\?\.serviceModes/);
assert.match(app,/hasQuickMenuQr=serviceModes\.has\('quick'\)/);
assert.match(app,/hasTableQr=serviceModes\.has\('table'\)/);
assert.match(app,/quickMenuQrEntry\.hidden=!hasQuickMenuQr/);
assert.match(app,/tableQrEntry\.hidden=!hasTableQr/);
console.log(`${DEVELOPMENT_CLIENTS.length} profile-specific menu links and adaptive table QR destinations passed.`);
