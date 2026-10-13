import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRnlIntegration} from '../scripts/rnl-integration.mjs';

const runtimeDir=await mkdtemp(path.join(tmpdir(),'qrk-order-security-'));
let upstreamCalls=0;
const integration=createRnlIntegration({runtimeDir,baseUrl:'https://upstream.example',apiKey:'test-only',publishableKey:'test-only',fetchImpl:async()=>{upstreamCalls++;return new Response(JSON.stringify({workflowStatus:'PREPARING'}))}});
try{
  await writeFile(path.join(runtimeDir,'rnl-orders.json'),JSON.stringify({orders:{fixture:{qrkOrder:{rnlOrderId:'order-one',trackingToken:'secret-tracking-token'}}}}));
  await assert.rejects(()=>integration.status('order-one'),/tracking|authorized/i,'an order ID alone must not authorize a lookup');
  await assert.rejects(()=>integration.status('order-one','wrong'),/tracking|authorized/i);
  await assert.rejects(()=>integration.status('other-order','secret-tracking-token'),/tracking|authorized/i);
  assert.equal(upstreamCalls,0,'rejected requests must never reach the privileged upstream');
  assert.equal((await integration.status('order-one','secret-tracking-token')).workflowStatus,'PREPARING');
  assert.equal(upstreamCalls,1);
  const base={idempotencyKey:'new-order',fulfillmentType:'pickup',subtotalMinor:100,items:[{itemId:'item',quantity:1}]};
  for(const quantity of [-1,0,0.5,21,Infinity,NaN,'2'])await assert.rejects(()=>integration.createOrder({...base,items:[{itemId:'item',quantity}]}),/quantity/i);
  for(const subtotalMinor of [-1,NaN,Infinity,'100'])await assert.rejects(()=>integration.createOrder({...base,subtotalMinor}),/total/i);
  await assert.rejects(()=>integration.createOrder({...base,fulfillmentType:'unexpected'}),/fulfillment/i);
  await assert.rejects(()=>integration.createOrder({...base,fulfillmentType:'table',tableNumber:'-1'}),/table/i);
  assert.equal(upstreamCalls,1);
  console.log('RNL tracking authorization and order validation checks passed.');
}finally{await rm(runtimeDir,{recursive:true,force:true})}
