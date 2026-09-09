import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the actual asynchronous photo handlers with controllable reads.
const source = fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const handlers = source.slice(source.indexOf("$('#remove-photo').onclick"), source.indexOf("$('#add-item').onclick"));
const nodes = new Map();
const readers = [];
const context = vm.createContext({
  $: selector => {
    if (!nodes.has(selector)) nodes.set(selector, {value:'', textContent:'', disabled:false, addEventListener(type, callback) {this[type]=callback;}});
    return nodes.get(selector);
  },
  FileReader: class {readAsDataURL() {readers.push(this);}},
  Image: class {async decode() {}},
  updatePhotoPreview() {}, requestAnimationFrame() {},
});
vm.runInContext('let photoVersion=0,pendingPhoto="original";', context);
vm.runInContext(handlers, context);
const read = () => nodes.get('#item-photo').onchange({target:{files:[{type:'image/png',size:100}],value:''}});
const finish = (reader, data) => {reader.result=data;reader.onload();};
const photo = () => vm.runInContext('pendingPhoto', context);
const first=read(),second=read();
finish(readers[1],'newer');await second;
finish(readers[0],'older');await first;
assert.equal(photo(),'newer','An older read must not replace the latest selection');
const cancelled=read();nodes.get('#item-dialog').close();
finish(readers[2],'cancelled');await cancelled;
assert.equal(photo(),'newer','Closing the dialog must invalidate the pending read');
const removed=read();nodes.get('#remove-photo').onclick();
finish(readers[3],'removed');await removed;
assert.equal(photo(),null,'Removing a photo must invalidate its pending replacement');
assert.equal(nodes.get('#save-item').disabled,false);
console.log('Photo supersession, dialog cancellation, and removal races passed.');
