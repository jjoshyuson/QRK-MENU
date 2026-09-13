import assert from 'node:assert/strict';
import {DEVELOPMENT_CLIENTS} from '../dist/data/qrk-service-presets.js';
import {customerMenuUrl,testQrImageUrl} from '../dist/data/qrk-qr-code.js';

const pageUrl='https://jjoshyuson.github.io/QRK-MENU/';
const menuUrls=DEVELOPMENT_CLIENTS.map(client=>customerMenuUrl(pageUrl,client.slug));
assert.equal(menuUrls.length,5);
assert.equal(new Set(menuUrls).size,5);
for(const [index,menuUrl] of menuUrls.entries()){
  assert.equal(menuUrl,`${pageUrl}menu/?business=${DEVELOPMENT_CLIENTS[index].slug}`);
  const qrUrl=new URL(testQrImageUrl(menuUrl));
  assert.equal(qrUrl.protocol,'https:');
  assert.equal(qrUrl.searchParams.get('data'),menuUrl);
  assert.equal(qrUrl.searchParams.get('qzone'),'4');
}
console.log('Five profile-specific customer QR destinations passed.');
