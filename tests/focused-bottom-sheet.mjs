import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, menu, css, style, handoff] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/ui-components.css', import.meta.url), 'utf8'),
  readFile(new URL('../AGENT/STYLE.md', import.meta.url), 'utf8'),
  readFile(new URL('../docs/TECHNICAL_HANDOFF.md', import.meta.url), 'utf8'),
]);

assert.match(html, /id="item-dialog" class="sheet focused-sheet item-sheet"/);
assert.match(html, /id="fulfillment-dialog" class="sheet focused-sheet fulfillment-sheet"/);
assert.match(html, /id="payment-dialog" class="sheet focused-sheet payment-sheet"/);
assert.match(html, /focused-sheet-actions[^>]*>.*id="cancel-item"[^>]*>Cancel<\/button>.*id="add-item"/s);
assert.match(html, /<details class="checkout-details" id="checkout-details"><summary><span>Add name or order notes<\/span>/);
assert.doesNotMatch(html, /focused-sheet[^>]*Add name or order notes/);

assert.match(menu, /itemOptionStep=0,itemOptionDraft=\[\],itemDialogInvoker=null/);
assert.match(menu, /function renderItemStep\(\)/);
assert.match(menu, /itemOptionStep\+\+;renderItemStep\(\)/);
assert.match(menu, /const options=itemOptionDraft\.flat\(\)/);
assert.match(menu, /itemDialogInvoker=invoker/);
assert.match(menu, /item-dialog'\)\.addEventListener\('close'.*invoker\.focus\(\)/s);
assert.match(menu, /focused-choice-list/);

assert.match(css, /--component-focused-sheet-max-height:90dvh/);
assert.match(css, /dialog\.focused-sheet\s*\{[^}]*margin:auto auto 0/s);
assert.match(css, /focused-sheet-card\s*\{[^}]*safe-area-inset-top/s);
assert.match(css, /focused-sheet-actions\s*\{[^}]*safe-area-inset-bottom/s);
assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*focused-sheet-card\{animation:none!important\}/);
assert.match(style, /Focused public-menu sheets/);
assert.match(handoff, /Item option state is drafted step-by-step in memory/);

console.log('Focused public-menu bottom-sheet contract passed.');
