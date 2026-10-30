import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';
import {once} from 'node:events';

const child=spawn(process.execPath,['scripts/serve.mjs','--port','0'],{cwd:new URL('../',import.meta.url),stdio:['ignore','pipe','pipe']});
let output='';
const base=await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('Server startup timed out')),5000);
  child.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/http:\/\/127\.0\.0\.1:(\d+)/);if(match){clearTimeout(timeout);resolve(match[0])}});
  child.once('exit',code=>{clearTimeout(timeout);reject(new Error(`Server exited ${code}`))});
});
const request=(route,headers={},body,method=body===undefined?'GET':'POST')=>new Promise((resolve,reject)=>{
  const req=http.request(`${base}${route}`,{method,headers,path:route},res=>{let text='';res.on('data',chunk=>text+=chunk);res.on('end',()=>resolve({status:res.statusCode,text,headers:res.headers}))});
  req.on('error',reject);req.end(body);
});
try{
  assert.equal((await request('/__qrk/table-entry/kusina-manila/1',{Origin:'https://attacker.example'})).status,403,'cross-site API reads must be blocked');
  for(const route of ['/%5f_qrk/table-entry/test/1','/prefix/../__qrk/table-entry/test/1','/%5f_qrk/preview-auth/status'])assert.equal((await request(route,{Origin:'https://attacker.example'})).status,403,'encoded/normalized API paths must remain protected');
  assert.equal((await request('/',{Host:'attacker.example'})).status,403,'hostile Host must be blocked');
  assert.equal((await request('/__qrk/preview-auth/status',{'Sec-Fetch-Site':'cross-site'})).status,403);
  assert.equal((await request('/__qrk/preview-auth/status',{Origin:'null'})).status,403);
  assert.equal((await request('/__qrk/preview-auth/status',{Origin:base})).status,200);
  assert.equal((await request('/__qrk/preview-auth/status')).status,200,'local CLI requests continue working');
  const json={'Content-Type':'application/json',Origin:base};
  assert.equal((await request('/__qrk/table-entry/test/resolve',json,'{"token":"bad"}')).status,403);
  assert.equal((await request('/__qrk/table-entry/test/resolve',{'Content-Type':'text/plain'},'{}')).status,415);
  assert.equal((await request('/__qrk/table-entry/test/resolve',json,'{')).status,400);
  assert.equal((await request('/__qrk/table-entry/test/resolve',json,'null')).status,400);
  assert.equal((await request('/__qrk/table-entry/test/resolve',json,'[]')).status,400);
  assert.equal((await request('/__qrk/table-entry/test/resolve',json,JSON.stringify({token:'x'.repeat(100001)}))).status,413);
  assert.equal((await request('/__qrk/table-entry/test/resolve',{...json,'Transfer-Encoding':'chunked'},JSON.stringify({token:'x'.repeat(100001)}))).status,413,'chunked bodies must receive an error response rather than a socket reset');
  assert.equal((await request('/__qrk/integrations/rnl/orders/unknown')).status,403);
  const minted=await request('/__qrk/table-entry/test/7');
  assert.equal(minted.status,200,'loopback operators can mint table entry tokens');
  const resolved=await request('/__qrk/table-entry/test/resolve',json,JSON.stringify({token:JSON.parse(minted.text).token}));
  assert.equal(JSON.parse(resolved.text).table,'7');
  const server=await (await import('node:fs/promises')).readFile(new URL('../scripts/serve.mjs',import.meta.url),'utf8');
  assert.match(server,/\.test\(value\)\)\{if\(!loopback\(req\)\)/,'table entry minting must stay loopback-only for LAN previews');
  const response=await request('/');
  assert.equal(response.headers['x-frame-options'],'DENY');
  assert.equal(response.headers['referrer-policy'],'no-referrer');
  console.log('Request origin, Host, body limits and response security checks passed.');
}finally{child.kill();await once(child,'exit')}
