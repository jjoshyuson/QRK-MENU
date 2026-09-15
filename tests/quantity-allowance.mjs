import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, menu, styles] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/quantity-allowance.css', import.meta.url), 'utf8')
]);

assert.match(menu, /entitlementMode==='quantity'&&settings\.refillPolicy==='limited'/);
assert.match(menu, /Math\.floor\(Number\(settings\.quantityLimit\)/);
assert.match(menu, /order\.status!=='cancelled'/);
assert.match(menu, /remaining:Math\.max\(0,included-submitted-inCart\)/);
assert.match(menu, /maximumLineQuantity\(editingIndex\)/);
assert.match(menu, /maximumLineQuantity\(index\)<=line\.quantity\?' disabled':''/);
assert.match(menu, /Only \$\{allowance\.included\} included servings are available/);
assert.match(menu, /openTabEnabled\|\|quantityAllowanceSettings\(\)/);
assert.match(html, /id="menu-quantity-allowance" aria-live="polite"/);
assert.match(html, /id="item-quantity-allowance" aria-live="polite"/);
assert.match(html, /id="cart-quantity-allowance" aria-live="polite"/);
assert.match(html, /quantity-allowance\.css\?v=1/);
assert.match(styles, /\.quantity-allowance-summary/);

console.log('Quantity allowance customer gate contract passed.');
