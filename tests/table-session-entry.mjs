import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

globalThis.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
globalThis.sessionStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const {tableSessionInactivityState}=await import('../dist/data/qrk-table-session-service.js');

const createdAt='2026-09-15T10:00:00.000Z';
const session={status:'active',createdAt,updatedAt:createdAt};
const settings={inactivityWarningMinutes:120,inactivityGraceMinutes:15};
assert.equal(tableSessionInactivityState(session,settings,Date.parse('2026-09-15T11:59:59.000Z')).state,'active');
assert.equal(tableSessionInactivityState(session,settings,Date.parse('2026-09-15T12:00:00.000Z')).state,'warning');
assert.equal(tableSessionInactivityState(session,settings,Date.parse('2026-09-15T12:15:00.000Z')).state,'expired');

const menu=await readFile(new URL('../dist/menu/menu.js',import.meta.url),'utf8');
assert.match(menu,/history\.replaceState\(null,'',/);
assert.match(menu,/settings\.tableEntryEnabled===false\|\|settings\.acceptingTableSessions===false/);
assert.match(menu,/This table QR is incomplete/);
assert.match(menu,/exchangeEntryToken\(entryToken\)/);

const server=await readFile(new URL('../scripts/serve.mjs',import.meta.url),'utf8');
assert.match(server,/tableEntryTokens\.delete\(String\(input\.entryToken\)\)/);
assert.match(server,/if\(action==='touch'\)/);

console.log('Table Session Entry states and token hygiene passed.');
