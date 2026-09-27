import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {createRnlIntegration} from './rnl-integration.mjs';
import {createPreviewAuthStore} from './preview-auth.mjs';

const args = process.argv.slice(2);
function arg(name, fallback) {
  const at = args.indexOf(name);
  return at < 0 ? fallback : args[at + 1];
}
const host = arg('--host', '127.0.0.1');
const port = Number(arg('--port', '4173'));
if (!host || !Number.isInteger(port) || port < 0 || port > 65535) {
  console.error('Usage: node scripts/serve.mjs [--host 127.0.0.1] [--port 4173]');
  process.exit(1);
}
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const rnlIntegration=createRnlIntegration({runtimeDir:path.join(projectRoot,'.qrk-runtime'),baseUrl:process.env.QRK_RNL_SUPABASE_URL,apiKey:process.env.QRK_RNL_API_KEY,publishableKey:process.env.QRK_RNL_PUBLISHABLE_KEY});
const previewAuth=createPreviewAuthStore({directory:path.join(projectRoot,'.qrk-runtime')});
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8' };
const tableSessions = new Map();
const tableEntrySecret=process.env.QRK_TABLE_ENTRY_SECRET||'local-preview-table-entry-secret';
const signEntry=value=>createHmac('sha256',tableEntrySecret).update(value).digest('base64url');
const makeEntryToken=(slug,table)=>{const value=`${slug}:${table}`;return`${Buffer.from(value).toString('base64url')}.${signEntry(value)}`};
const resolveEntryToken=(slug,token)=>{try{const [encoded,signature]=String(token||'').split('.'),value=Buffer.from(encoded,'base64url').toString(),expected=signEntry(value),[tokenSlug,table]=value.split(':');if(tokenSlug!==slug||!/^[1-9]\d{0,2}$/.test(table)||signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;return table}catch{return null}};
const sendJson=(res,status,value)=>{const bytes=Buffer.from(JSON.stringify(value));res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Content-Length':bytes.length,'Cache-Control':'no-store'});res.end(bytes)};
const readJson=req=>new Promise((resolve,reject)=>{let body='';req.on('data',chunk=>{body+=chunk;if(body.length>100000)reject(new Error('Request too large'))});req.on('end',()=>{try{resolve(body?JSON.parse(body):{})}catch(error){reject(error)}});req.on('error',reject)});
const loopback=req=>['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
async function previewAuthApi(req,res,pathname){
  if(!loopback(req)){sendJson(res,403,{error:'Local development access only'});return}
  if(pathname==='/__qrk/preview-auth/status'&&req.method==='GET'){sendJson(res,200,{available:true});return}
  if(req.method!=='POST'){res.writeHead(405,{Allow:'POST'});res.end();return}
  const input=await readJson(req);
  if(pathname==='/__qrk/preview-auth/provision'){sendJson(res,201,await previewAuth.provision(input.account));return}
  if(pathname==='/__qrk/preview-auth/migrate'){const result=await previewAuth.provision(input.account,{password:input.password,onlyIfMissing:true});sendJson(res,200,result);return}
  if(pathname==='/__qrk/preview-auth/reset'){sendJson(res,200,await previewAuth.reset(input.username,input.account));return}
  if(pathname==='/__qrk/preview-auth/sign-in'){const result=await previewAuth.signIn(input.identifier,input.password);if(!result){sendJson(res,401,{error:'Sign-in failed. Check your username or email and password.'});return}sendJson(res,200,result);return}
  if(pathname==='/__qrk/preview-auth/change-password'){sendJson(res,200,{account:await previewAuth.changePassword(input.token,input.password)});return}
  sendJson(res,404,{error:'Unknown preview-auth action'});
}
async function tableApi(req,res,pathname){
  const parts=pathname.split('/').filter(Boolean),slug=decodeURIComponent(parts[2]||''),action=String(parts[3]||'').replace(/\/$/,'').toLowerCase();let sessions=tableSessions.get(slug)||[];const readAt=Date.now();sessions.forEach(session=>{if(session.status==='pending'&&session.expiresAt&&Date.parse(session.expiresAt)<=readAt){session.status='expired';session.updatedAt=new Date(readAt).toISOString();session.events.push({type:'session_expired',at:session.updatedAt})}if(['active','bill_requested','inactivity_warning'].includes(session.status)){const idle=readAt-Date.parse(session.lastActivityAt||session.updatedAt||session.createdAt),warning=(Number(session.inactivityMinutes)||120)*60000,grace=(Number(session.inactivityGraceMinutes)||15)*60000;if(idle>=warning&&session.status!=='inactivity_warning'){session.status='inactivity_warning';session.warningAt=new Date(readAt).toISOString();session.events.push({type:'inactivity_warning',at:session.warningAt})}if(idle>=warning+grace)session.graceElapsed=true}(session.joinRequests||[]).forEach(request=>{if(request.status==='pending'&&request.expiresAt&&Date.parse(request.expiresAt)<=readAt){request.status='expired';request.resolvedAt=new Date(readAt).toISOString()}})});tableSessions.set(slug,sessions);
  if(req.method==='GET'){sendJson(res,200,sessions);return}
  if(req.method!=='POST'){res.writeHead(405,{Allow:'GET, POST'});res.end();return}
  const input=await readJson(req),now=new Date().toISOString();
  if(action==='request'){
    let session=sessions.find(item=>item.table===String(input.table)&&['pending','active','bill_requested','inactivity_warning'].includes(item.status));
    if(session){if(!session.participants.some(person=>person.deviceId===input.deviceId)&&!session.joinRequests.some(item=>item.deviceId===input.deviceId&&item.status==='pending'))session.joinRequests.push({id:crypto.randomUUID(),deviceId:input.deviceId,name:input.name||'Guest',status:'pending',requestedAt:now,expiresAt:new Date(Date.now()+(Number(input.acceptanceTimeoutSeconds)||90)*1000).toISOString(),approvalBy:input.joinPolicy||'host'});}
    else{session={id:crypto.randomUUID(),table:String(input.table),status:input.staffAcceptance?'pending':'active',guestCount:Number(input.guestCount)||1,packageId:input.packageId||null,createdAt:now,updatedAt:now,lastActivityAt:now,inactivityMinutes:Number(input.inactivityMinutes)||120,inactivityGraceMinutes:Number(input.inactivityGraceMinutes)||15,expiresAt:input.staffAcceptance?new Date(Date.now()+(Number(input.acceptanceTimeoutSeconds)||90)*1000).toISOString():null,participants:[{id:crypto.randomUUID(),deviceId:input.deviceId,name:input.name||'Guest',role:'host',permission:'approve',joinedAt:now}],joinRequests:[],events:[{type:'session_requested',at:now}]};sessions.push(session)}
    tableSessions.set(slug,sessions);sendJson(res,200,session);return;
  }
  const session=sessions.find(item=>item.id===input.sessionId);if(!session){sendJson(res,404,{error:'Table session not found'});return}
  if(action==='accept'){if(session.status!=='pending'){sendJson(res,409,{error:'This request is no longer waiting'});return}session.status='active';session.expiresAt=null;session.updatedAt=now;session.events.push({type:'session_accepted',at:now});sendJson(res,200,session);return}
  if(action==='cancel'){const join=session.joinRequests.find(item=>item.deviceId===input.deviceId&&item.status==='pending');if(join){join.status='cancelled';join.resolvedAt=now}else if(session.status==='pending'&&session.participants.some(person=>person.deviceId===input.deviceId)){session.status='cancelled';session.updatedAt=now;session.events.push({type:'session_cancelled',at:now})}else{sendJson(res,409,{error:'This request can no longer be cancelled'});return}sendJson(res,200,session);return}
  if(['clean','cleaned','release','reopen'].includes(action)){session.status='cleaned';session.updatedAt=now;session.events.push({type:'table_cleaned',at:now});sendJson(res,200,session);return}
  if(action==='paid'){session.status='settled';session.updatedAt=now;session.events.push({type:'customer_paid',at:now});sendJson(res,200,session);return}
  if(action==='approve-join'){const join=session.joinRequests.find(item=>item.id===input.requestId&&item.status==='pending');if(!join){sendJson(res,404,{error:'Join request not found'});return}join.status='approved';join.resolvedAt=now;session.participants.push({id:crypto.randomUUID(),deviceId:join.deviceId,name:join.name,role:'guest',permission:input.permission||'direct',joinedAt:now});sendJson(res,200,session);return}
  sendJson(res,404,{error:'Unknown table action'});
}
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://local.invalid').pathname);
    if(pathname==='/data/qrk-config.local.js'&&(req.method==='GET'||req.method==='HEAD')){const bytes=Buffer.from("globalThis.QRK_CONFIG=Object.freeze({environment:'local',authEnabled:true});\n");res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Content-Length':bytes.length,'Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:bytes);return}
    if(pathname.startsWith('/__qrk/preview-auth/')){await previewAuthApi(req,res,pathname);return}
    if(pathname==='/__qrk/integrations/rnl/catalog'&&req.method==='GET'){sendJson(res,200,await rnlIntegration.catalog());return}
    if(pathname.startsWith('/__qrk/integrations/rnl/assets/')&&(req.method==='GET'||req.method==='HEAD')){const fileName=pathname.slice('/__qrk/integrations/rnl/assets/'.length),asset=await rnlIntegration.asset(fileName);res.writeHead(200,{'Content-Type':asset.contentType,'Content-Length':asset.bytes.length,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:asset.bytes);return}
    if(pathname==='/__qrk/integrations/rnl/orders'&&req.method==='POST'){sendJson(res,201,await rnlIntegration.createOrder(await readJson(req)));return}
    if(pathname.startsWith('/__qrk/integrations/rnl/orders/')&&req.method==='GET'){const id=pathname.split('/').pop();sendJson(res,200,await rnlIntegration.status(id));return}
    if(pathname.startsWith('/__qrk/table-entry/')){const parts=pathname.split('/').filter(Boolean),slug=parts[2]||'',value=parts[3]||'';if(req.method==='GET'&&/^\d{1,3}$/.test(value)){sendJson(res,200,{table:value,token:makeEntryToken(slug,value)});return}if(req.method==='POST'&&value==='resolve'){const input=await readJson(req),table=resolveEntryToken(slug,input.token);if(!table){sendJson(res,403,{error:'Invalid table entry token'});return}sendJson(res,200,{table,authorizedAt:new Date().toISOString(),deviceId:input.deviceId||null});return}res.writeHead(405,{Allow:'GET, POST'});res.end();return}
    if(pathname.startsWith('/__qrk/table-sessions/')){await tableApi(req,res,pathname);return}
    if (req.method !== 'GET' && req.method !== 'HEAD') {res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;}
    const requestPath = pathname === '/' ? '/index.html' : pathname.endsWith('/') ? pathname + 'index.html' : pathname;
    const file = path.resolve(root, '.' + requestPath);
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    if (!(await stat(file)).isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch (error) {
    if(String(req.url||'').startsWith('/__qrk/')){sendJson(res,/not configured|not imported/i.test(error.message)?503:400,{error:error.message});return}
    res.writeHead(error instanceof URIError ? 400 : 404); res.end('Not found');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => {
  const address = server.address();
  console.log(`QRK MENU: http://${host}:${address.port}`);
  if (host === '0.0.0.0') console.log('For your phone, replace 0.0.0.0 with this computer\'s LAN IP.');
});
