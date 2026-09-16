import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, menu, css, customerCss, style, handoff] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/ui-components.css', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/cart-dock.css', import.meta.url), 'utf8'),
  readFile(new URL('../AGENT/STYLE.md', import.meta.url), 'utf8'),
  readFile(new URL('../docs/TECHNICAL_HANDOFF.md', import.meta.url), 'utf8'),
]);

assert.match(html, /id="item-dialog" class="sheet focused-sheet item-sheet"/);
assert.match(html, /id="fulfillment-dialog" class="sheet focused-sheet fulfillment-sheet"/);
assert.match(html, /id="payment-dialog" class="sheet focused-sheet payment-sheet"/);
assert.match(html, /class="item-hero".*id="item-photo".*id="cancel-item"/s);
assert.match(html, /id="fulfillment-back"[^>]*aria-label="Back to review order"/);
assert.doesNotMatch(html, /id="close-fulfillment"/);
assert.match(html, /class="special-request-field".*id="item-notes"/s);
assert.match(html, /class="sheet-action item-add-footer".*id="add-item".*id="item-total"/s);
assert.doesNotMatch(html, /Customize item|special-request-trigger|confirm-icon-button/);
assert.match(html, /<details class="checkout-details" id="checkout-details"><summary><span>Add name or order notes<\/span>/);
assert.doesNotMatch(html, /focused-sheet[^>]*Add name or order notes/);

assert.doesNotMatch(menu, /itemOptionStep|renderItemStep/);
assert.match(menu, /function renderItemOptions\(\)/);
assert.match(menu, /function closeSheet\(dialog,after\)/);
assert.match(menu, /dialog\.close\(\);dialog\.classList\.remove\('is-visible','is-closing'\)/);
assert.match(menu, /function showCartDialog\(\)/);
assert.match(menu, /card\?\.animate\(\[\{transform:'translate3d\(0,100dvh,0\)'\},\{transform:'translate3d\(0,0,0\)'\}\]/);
assert.match(menu, /\{transform:'translate3d\(0,0,0\)'\},\{transform:'translate3d\(0,100dvh,0\)'\}/);
assert.match(menu, /duration:540,easing:'cubic-bezier\(\.2,\.8,\.2,1\)'/);
assert.match(menu, /duration:107,easing:'cubic-bezier\(\.4,0,\.8,\.2\)'/);
assert.doesNotMatch(menu, /cart-dialog'\)\.showModal\(\)/);
assert.doesNotMatch(menu, /data-action==='edit'[^}]*cart-dialog'\)\.close/s);
assert.match(menu, /cancel-item'\)\.addEventListener\('click',\(\)=>closeSheet/);
assert.match(menu, /option-group-heading/);
assert.doesNotMatch(menu, /renderItemOptions[\s\S]*requestAnimationFrame\(\(\)=>\(\$\('#item-options input/s);
assert.match(menu, /itemOptionDraft=\(selectedItem\?\.options\|\|\[\]\)\.map/);
assert.match(menu, /const options=itemOptionDraft\.flat\(\)/);
assert.match(menu, /itemDialogInvoker=invoker/);
assert.match(menu, /item-dialog'\)\.addEventListener\('close'.*fallback=.*data-action=.*edit.*target\.focus\(\)/s);
assert.match(menu, /focused-choice-list/);
assert.match(menu, /pointerType==='touch'\|\|event\.pointerType==='pen'/);
assert.match(menu, /event\.key==='Tab'.*delete document\.body\.dataset\.inputModality/);
assert.match(customerCss, /dialog #add-item\s*\{[^}]*background:\s*var\(--brand-500\) !important[^}]*color:\s*var\(--brand-foreground\) !important/s);
assert.match(html, /ui-components\.css\?v=14[\s\S]*cart-dock\.css\?v=26/);
assert.match(customerCss, /dialog\.focused-sheet::backdrop,[\s\S]*dialog\.quick-service-dialog::backdrop,[\s\S]*dialog\.table-entry::backdrop\s*\{[^}]*background:\s*rgba\(248, 250, 252, \.16\)[^}]*backdrop-filter:\s*blur\(6px\) saturate\(\.92\)/s);
assert.match(customerCss, /dialog\.is-closing::backdrop\s*\{[^}]*backdrop-filter:\s*blur\(0\) saturate\(1\)/s);
assert.match(customerCss, /#cart-dialog \.sheet-card\s*\{[^}]*height:\s*min\(90dvh,[^}]*max-height:\s*min\(90dvh,/s);
assert.match(customerCss, /#cart-dialog \.cart-content\s*\{[^}]*flex:\s*1[^}]*min-height:\s*0/s);

assert.match(css, /--component-focused-sheet-max-height:90dvh/);
assert.match(css, /dialog\.focused-sheet\s*\{[^}]*margin:auto auto 0/s);
assert.match(css, /focused-sheet-card\s*\{[^}]*safe-area-inset-top/s);
assert.match(css, /focused-sheet-card\s*\{[^}]*border:0/s);
assert.match(css, /\.focused-choice-list\{[^}]*border:0!important[^}]*background:color-mix/s);
assert.match(css, /\.fulfillment-choice-list button\{[^}]*border:0[^}]*background:var\(--surface-muted\)/s);
assert.match(menu, /item-action-label/);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*focused-sheet-card\{animation:none!important\}/);
assert.match(style, /Focused public-menu sheets/);
assert.match(handoff, /Item option state is drafted in memory/);

console.log('Focused public-menu bottom-sheet contract passed.');
