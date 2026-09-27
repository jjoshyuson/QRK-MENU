import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRnlIntegration,diffRnlCatalog,normalizeRnlCatalog} from '../scripts/rnl-integration.mjs';

const catalog={version:1,provider:'rnl',generatedAt:'2026-09-27T01:00:00Z',modifierSupport:'none',categories:[{externalId:'10000000-0000-4000-8000-000000000001',name:'Mains',sortOrder:0,active:true,updatedAt:'2026-09-27T00:00:00Z',items:[{externalId:'20000000-0000-4000-8000-000000000001',name:'Integration Test Rice',price:125,halfOrderPrice:null,availability:'available',active:true,stockCount:9,lowStock:false,imagePath:null,modifierGroups:[],updatedAt:'2026-09-27T00:00:00Z'}]}]},normalized=normalizeRnlCatalog(catalog);
assert.equal(normalized.menu.categories[0].items[0].priceMinor,12500);
assert.equal(normalizeRnlCatalog({...catalog,categories:[{...catalog.categories[0],items:[{...catalog.categories[0].items[0],stockCount:0}]}]}).menu.categories[0].items[0].available,true,'R&L availability status is authoritative; stock count remains metadata');
assert.equal(diffRnlCatalog(null,normalized).added.length,1);

const runtimeDir=await mkdtemp(path.join(tmpdir(),'qrk-rnl-')),calls=[];
const mockFetch=async(url,options)=>{const request=JSON.parse(options.body);calls.push({url,request});if(url.endsWith('qrk_read_catalog'))return new Response(JSON.stringify(catalog),{status:200});if(url.endsWith('qrk_ingest_order'))return new Response(JSON.stringify({version:1,acknowledged:true,idempotentReplay:false,rnlOrderId:'30000000-0000-4000-8000-000000000001',rnlDeviceOrderId:'QRK-DEV-TEST',workflowStatus:'PREPARING',paymentStatus:'UNPAID',createdAt:'2026-09-27T01:01:00Z'}),{status:200});throw new Error(`Unexpected ${url}`)};
const integration=createRnlIntegration({runtimeDir,baseUrl:'https://rnl.example',apiKey:'server-only-test-key',publishableKey:'publishable-test-key',fetchImpl:mockFetch}),preview=await integration.previewCatalog(),applied=await integration.applyCatalog(integration.fingerprint(preview.catalog));
assert.equal(applied.items,1);
assert.doesNotMatch(await readFile(path.join(runtimeDir,'rnl-catalog.json'),'utf8'),/server-only-test-key/);
const input={idempotencyKey:'40000000-0000-4000-8000-000000000001',createdAt:'2026-09-27T01:02:00Z',fulfillmentType:'pickup',items:[{itemId:'20000000-0000-4000-8000-000000000001',name:'Integration Test Rice',quantity:2,lineTotalMinor:25000}],subtotalMinor:25000,notes:'NON-DESTRUCTIVE QRK R&L INTEGRATION TEST'},first=await integration.createOrder(input),replay=await integration.createOrder({...input,createdAt:'2026-09-27T01:03:00Z'});
assert.equal(first.rnlOrderId,'30000000-0000-4000-8000-000000000001');
assert.equal(replay.idempotentReplay,true);
assert.equal(calls.filter(call=>call.url.endsWith('qrk_ingest_order')).length,1);
const sent=calls.find(call=>call.url.endsWith('qrk_ingest_order')).request.p_order;
assert.equal(sent.items[0].productId,'20000000-0000-4000-8000-000000000001');
assert.equal(sent.totals.total,250);
assert.equal(sent.customer.note,'NON-DESTRUCTIVE QRK R&L INTEGRATION TEST');
await assert.rejects(()=>integration.createOrder({...input,subtotalMinor:12400}),/different order details/);
console.log('R&L manual catalog, server-only secret, automatic order forwarding, and idempotent retry contract passed.');
