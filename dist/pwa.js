const scriptUrl = new URL(document.currentScript.src);

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('sw.js', scriptUrl), {
      scope: new URL('./', scriptUrl).pathname,
    }).catch((error) => {
      console.warn('QRK app shell was not registered.', error);
    });
  }, { once: true });
}

document.addEventListener('dragstart', (event) => {
  if (event.target instanceof HTMLImageElement) event.preventDefault();
});
