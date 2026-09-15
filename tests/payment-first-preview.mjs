import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, menu, staff, presets, businesses] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/data/qrk-service-presets.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/data/qrk-businesses.js', import.meta.url), 'utf8')
]);

assert.match(html, /id="payment-dialog".*aria-label="Choose payment method"/);
assert.match(html, /id="quick-service-dialog".*aria-label="Choose dine in or takeout"/s);
assert.match(html, /data-fulfillment-choice="table"><span aria-hidden="true">🍽️<\/span><b>Dine in<\/b>/s);
assert.match(html, /data-fulfillment-choice="pickup"><span aria-hidden="true">🛍️<\/span><b>Takeout<\/b>/s);
assert.doesNotMatch(html, /quick-service-title|Choose your food, then enter your table|Order ahead and collect it at the counter/);
assert.doesNotMatch(html, /How would you like to pay\?|id="payment-title"/);
assert.match(html, /class="payment-card" id="pay-at-counter"/);
assert.match(html, /class="payment-card disabled-choice" type="button" disabled/);
assert.match(html, /<span class="payment-emoji" aria-hidden="true">💵<\/span><b>Pay at the counter<\/b>/);
assert.match(html, /<span class="payment-badge">Soon<\/span><span class="payment-emoji" aria-hidden="true">💳<\/span><b>Cashless<\/b>/);
assert.doesNotMatch(html, /Choose a payment method to continue your order|No payment is taken in this pilot|payment-total/);
assert.match(menu, /paymentTiming==='upfront'&&serviceProfile\.settings\.packageMode==='none'/);
assert.match(menu, /initializeQuickServiceChoice\(\)/);
assert.match(menu, /businessExperience\.serviceMode!==['"]quick['"]\)return/);
assert.match(menu, /quick-service-dialog'\)\.addEventListener\('cancel',event=>event\.preventDefault\(\)\)/);
assert.match(menu, /paymentStatus:paymentMethod==='counter'\?'due_at_counter'/);
assert.match(menu, /if\(paymentFirst\)\$\('#submit-order'\)\.textContent='Confirm payment'/);
assert.match(menu, /paymentFirst\?openPaymentStep\(\):createOrder\(\)/);
assert.match(html, /class="fulfillment review-fulfillment".*value="pickup".*<b>Pickup<\/b>.*value="table".*<b>Serve at table<\/b>/s);
assert.doesNotMatch(html, /id="choose-fulfillment"|id="fulfillment-summary"|id="fulfillment-popup-choices"|data-review-fulfillment/);
assert.match(html, /class="sheet-action cart-total hidden" id="cart-action"/);
assert.match(menu, /if\(reviewChoiceRequired\)\{document\.querySelectorAll\('input\[name="fulfillment"\]'\)\.forEach\(input=>input\.checked=false\)/);
assert.match(menu, /function updateCheckoutActionVisibility\(\).*reviewChoiceRequired&&!hasChoice/s);
assert.match(menu, /\.review-fulfillment'\)\.addEventListener\('change'.*input\.value==='table'.*fulfillment-dialog/s);
assert.match(menu, /\.review-fulfillment'\)\.addEventListener\('click'.*input\?\.value==='table'.*!selectedReviewTable/s);
assert.match(menu, /function closeTableSelection\(\).*tableChoice\.checked=false.*updateCheckoutActionVisibility/s);
assert.match(menu, /fulfillment-dialog'\)\.addEventListener\('cancel',event=>\{event\.preventDefault\(\);closeTableSelection\(\)\}\)/);
assert.match(menu, /function openTableMenu\(session\).*setFulfillmentChoice\('table'\)/);
assert.match(menu, /\$\('#pay-at-counter'\)\.addEventListener\('click',\(\)=>createOrder\('counter'\)\)/);
assert.match(html, /<p class="eyebrow">ORDER SENT<\/p>/);
assert.match(html, /<h2 id="confirmation-title">ORDER NUMBER<\/h2><strong id="confirmation-number"><\/strong>/);
assert.doesNotMatch(html, /confirmation-token|verification-mark|order-progress|refresh-status|close-confirmation|active-order/);
assert.match(menu, /\$\('#confirmation-dialog'\)\.addEventListener\('click',event=>\{if\(event\.target===event\.currentTarget\)event\.currentTarget\.close\(\)\}\)/);
assert.match(staff, /orderCompletionLabel=\(\)=>businessExperience\.serviceMode==='quick'\?'Mark paid':'Mark served'/);
assert.match(staff, /orderCard\(order,orderCompletionLabel\(\)\)/);
assert.match(staff, /order\.paymentMethod==='counter'\?'<span class="order-has-note">Pay at counter<\/span>'/);
assert.match(presets, /id:'kusina-manila'.*preset:'quick'.*settings:\{paymentTiming:'upfront'\}/);
assert.match(presets, /quick:.*fulfillmentModes:\['table','pickup'\]/);
assert.match(businesses, /'kusina-manila':.*serviceMode:'quick'.*preset:'quick'.*settings:\{paymentTiming:'upfront'\}/);

console.log('Payment-first preview contract passed.');
