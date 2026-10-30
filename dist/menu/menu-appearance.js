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

export const featuredItems = items => items.filter(i => i.featured && i.available && !i.hidden).slice(0, 3);
const TAG_LABELS = { spicy: 'Spicy', sharing: 'Good for sharing', slow_cooked: 'Slow-cooked', vegetarian: 'Vegetarian' };
export const tagLabel = tag => TAG_LABELS[tag] || '';

export const sectionIndexLabel = index => String(index + 1).padStart(2, '0');

// Prices are minor units (centavos); whole pesos drop the decimals.
export function formatPriceParts(minor) {
  const pesos = Number(minor || 0) / 100;
  return { symbol: '₱', amount: pesos.toLocaleString('en-PH', { minimumFractionDigits: Number.isInteger(pesos) ? 0 : 2, maximumFractionDigits: 2 }) };
}

// Motion helpers. Alternating a/b classes restart a CSS animation without a reflow hack.
let toastEl = null, toastTimer = 0;
export function showToast(text, { duration = 1900 } = {}) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'menu-toast';
    toastEl.setAttribute('role', 'status');
    document.body.append(toastEl);
  }
  toastEl.textContent = text;
  clearTimeout(toastTimer);
  toastEl.classList.remove('is-on');
  void toastEl.offsetWidth; // restart the animation on repeat
  toastEl.classList.add('is-on');
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), duration);
}

const flip = (el, a, b) => { const next = el.classList.contains(a) ? b : a; el.classList.remove(next === a ? b : a); el.classList.add(next); };

export const popElement = el => flip(el, 'pop-a', 'pop-b');

export function staggerRise(container, { step = 50, max = 520, selector = '.dish' } = {}) {
  const seen = new Map(); // stagger restarts at 0 in each section
  container.querySelectorAll(selector).forEach(row => {
    const key = row.closest?.('.menu-section') || container, i = seen.get(key) || 0;
    seen.set(key, i + 1);
    row.style.setProperty('--rise-delay', `${Math.min(i * step, max)}ms`);
  });
  flip(container, 'rise-a', 'rise-b');
}

// Themed background. Strength 0-100 maps to pattern opacity .04-.18, photo veil .94-.39, glow .08-.30.
const round = n => Math.round(n * 1000) / 1000;
export function backgroundLayers(bg) {
  const s = Math.max(0, Math.min(100, Number(bg?.strength) || 0)) / 100, style = bg?.style;
  const isPattern = (style === 'pattern' || style === 'pattern-moving') && bg.pattern;
  return {
    photo: style === 'photo' && bg.imageUrl ? bg.imageUrl : null,
    veilOpacity: style === 'photo' && bg.imageUrl ? round(0.94 - s * 0.55) : null,
    glow: style === 'glow' ? round(0.08 + s * 0.22) : null,
    pattern: isPattern ? bg.pattern : null,
    patternOpacity: isPattern ? round(0.04 + s * 0.14) : null,
    moving: style === 'pattern-moving' && Boolean(isPattern)
  };
}

const MOTIFS = ['filipino', 'cafe', 'ramen', 'pizza', 'dessert'];

// Page-level: one fixed layer behind the content. Tiles, the header band and image fallbacks reuse `.motif`/`.m-<pattern>` via --motif-url on root.
export function applyMenuBackground(root, bg) {
  const layers = backgroundLayers(bg), doc = root.ownerDocument || root;
  root.classList.remove(...MOTIFS.map(name => `m-${name}`));
  // Tiles and the header band always need a motif, so glow/plain fall back to filipino.
  root.classList.add(`m-${layers.pattern || bg?.pattern || 'filipino'}`);
  let layer = doc.querySelector('.menu-bg');
  if (!layer) { layer = doc.createElement('div'); layer.className = 'menu-bg'; layer.setAttribute('aria-hidden', 'true'); doc.body.prepend(layer); }
  const photo = layers.photo ? safeImageUrl(layers.photo) : '';
  layer.classList.toggle('has-photo', Boolean(photo));
  layer.classList.toggle('has-pattern', Boolean(layers.pattern));
  layer.classList.toggle('is-moving', layers.moving);
  layer.classList.toggle('has-glow', layers.glow !== null);
  const set = (name, value) => value === null || value === '' ? layer.style.removeProperty(name) : layer.style.setProperty(name, value);
  set('--bg-photo', photo ? `url(${JSON.stringify(photo)})` : null);
  set('--bg-veil', layers.veilOpacity);
  set('--bg-glow', layers.glow);
  set('--bg-pattern-opacity', layers.patternOpacity);
}

// Failed images keep their box and show the pattern tile (or accent band / initials) instead.
export function bindImageFallbacks(root, getInitials) {
  const doc = root.ownerDocument || root;
  root.addEventListener('error', event => {
    const img = event.target;
    if (img?.tagName !== 'IMG' || img.dataset.failed) return;
    if (img.matches('[data-hero-cover]')) { img.hidden = true; img.removeAttribute('src'); img.closest('[data-hero-band]')?.classList.remove('has-cover'); return; }
    const logo = img.closest('[data-hero-logo]');
    if (logo) { logo.classList.remove('has-logo'); logo.textContent = getInitials(); return; }
    if (img.classList.contains('cart-item-photo')) {
      const tile = doc.createElement('span');
      tile.className = 'cart-item-photo cart-item-initials motif-tile';
      tile.setAttribute('aria-hidden', 'true');
      tile.textContent = img.dataset.initials || '';
      img.replaceWith(tile);
      return;
    }
    img.dataset.failed = '1';
    img.parentElement?.classList.add('motif-tile');
  }, true);
  // A reused <img> (item sheet) that loads again drops the fallback.
  root.addEventListener('load', event => {
    const img = event.target;
    if (img?.tagName === 'IMG' && img.dataset.failed) { delete img.dataset.failed; img.parentElement?.classList.remove('motif-tile'); }
  }, true);
}
