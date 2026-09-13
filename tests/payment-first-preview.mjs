import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, menu, staff, presets, businesses] = await Promise.all([
  readFile(new URL('../dist/menu/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/menu/menu.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/data/qrk-service-presets.js', import.meta.url), 'utf8'),
  readFile(new URL('../dist/data/qrk-businesses.js', import.meta.url), 'utf8')
]);

assert.match(html, /name="payment" value="cashless" disabled/);
assert.match(html, /name="payment" value="counter"/);
assert.match(menu, /paymentTiming==='upfront'&&serviceProfile\.settings\.packageMode==='none'/);
assert.match(menu, /paymentStatus:paymentMethod==='counter'\?'due_at_counter'/);
assert.match(menu, /received:'Waiting for staff'/);
assert.match(staff, /orderCompletionLabel=\(\)=>businessExperience\.serviceMode==='quick'\?'Mark paid':'Mark served'/);
assert.match(staff, /orderCard\(order,orderCompletionLabel\(\)\)/);
assert.match(staff, /order\.paymentMethod==='counter'\?'<span class="order-has-note">Pay at counter<\/span>'/);
assert.match(presets, /id:'kusina-manila'.*preset:'quick'.*settings:\{paymentTiming:'upfront'\}/);
assert.match(businesses, /'kusina-manila':.*serviceMode:'quick'.*preset:'quick'.*settings:\{paymentTiming:'upfront'\}/);

console.log('Payment-first preview contract passed.');
