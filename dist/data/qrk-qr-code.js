const QR_API='https://api.qrserver.com/v1/create-qr-code/';

export function customerMenuUrl(pageUrl,businessSlug){
  const appRoot=new URL('./',pageUrl);
  return new URL(`menu/?business=${encodeURIComponent(businessSlug)}`,appRoot).href;
}

export function testQrImageUrl(menuUrl,size=320){
  const url=new URL(QR_API);
  url.searchParams.set('data',menuUrl);
  url.searchParams.set('size',`${size}x${size}`);
  url.searchParams.set('format','png');
  url.searchParams.set('ecc','M');
  url.searchParams.set('qzone','4');
  url.searchParams.set('charset-source','UTF-8');
  return url.href;
}
