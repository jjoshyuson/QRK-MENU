import { themeValues } from '../data/qrk-brand-service.js';

// Tenant-written URLs must never reach src/background unchecked.
export const safeImageUrl = value => { const candidate = String(value || ''); return /^(?:\/|https:\/\/|data:image\/(?:png|jpeg|webp);base64,)/i.test(candidate) ? candidate : ''; };

export function businessInitials(name) {
  const letters = String(name || '').split(/\s+/).filter(word => /^[\p{L}\p{N}]/u.test(word)).slice(0, 2).map(word => word[0].toUpperCase());
  return letters.join('') || 'Q';
}

export function headerModel(brand, { isTable, tableNumber, orderCount, openForOrders, prepLabel, area }) {
  const name = String(brand.businessName || '');
  return {
    name,
    tagline: String(brand.tagline || ''),
    initials: businessInitials(name),
    logoUrl: safeImageUrl(brand.logoDataUrl),
    coverUrl: safeImageUrl(brand.coverPhotoUrl),
    statusLabel: openForOrders ? 'Open' : 'Closed',
    metaParts: [prepLabel, area].filter(Boolean),
    tableLabel: isTable && tableNumber ? `Table ${tableNumber}` : null,
    orderBadge: orderCount > 0 ? String(orderCount) : null
  };
}

export const accentFor = brand => themeValues(brand).primaryStrong;

function fillLogo(tile, model) {
  tile.classList.toggle('has-logo', Boolean(model.logoUrl));
  if (!model.logoUrl) { tile.textContent = model.initials; return; }
  const image = document.createElement('img');
  Object.assign(image, { src: model.logoUrl, alt: '', width: 96, height: 96 });
  tile.replaceChildren(image);
}

export function applyHeader(root, model) {
  const set = (selector, text) => root.querySelectorAll(selector).forEach(node => { node.textContent = text; });
  root.querySelectorAll('[data-hero-logo]').forEach(tile => fillLogo(tile, model));
  set('[data-hero-name]', model.name);
  set('[data-hero-tagline]', model.tagline);
  set('[data-hero-status]', model.statusLabel);
  set('[data-hero-meta]', model.metaParts.map(part => ` · ${part}`).join(''));
  root.querySelectorAll('[data-hero-status-line]').forEach(line => line.classList.toggle('is-closed', model.statusLabel === 'Closed'));
  root.querySelectorAll('[data-hero-table]').forEach(pill => { pill.hidden = !model.tableLabel; pill.textContent = model.tableLabel || ''; });
  const cover = root.querySelector('[data-hero-cover]');
  cover.hidden = !model.coverUrl;
  if (model.coverUrl) cover.src = model.coverUrl; else cover.removeAttribute('src');
  root.querySelector('[data-hero-band]').classList.toggle('has-cover', Boolean(model.coverUrl));
  const badge = root.querySelector('#order-history-count');
  badge.textContent = model.orderBadge || '';
  badge.hidden = !model.orderBadge;
}

export function bindScrollChrome(scroller, { threshold = 140 } = {}) {
  const top = () => scroller === window ? window.scrollY : scroller.scrollTop;
  const update = () => { document.body.toggleAttribute('data-scrolled', top() > threshold); };
  scroller.addEventListener('scroll', update, { passive: true });
  update();
  return () => { scroller.removeEventListener('scroll', update); document.body.removeAttribute('data-scrolled'); };
}
