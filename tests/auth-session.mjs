import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const store=new Map();
globalThis.localStorage={getItem:key=>store.has(key)?store.get(key):null,setItem:(key,value)=>store.set(key,String(value)),removeItem:key=>store.delete(key)};
const { QrkAuthService } = await import('../dist/data/qrk-auth-service.js');

const config={environment:'staging',authEnabled:true,supabaseUrl:'https://qrk.supabase.co',supabasePublishableKey:'sb_publishable_test'};
const now=()=>Math.floor(Date.now()/1000);
const session=(token,expiresIn=3600)=>({access_token:token,refresh_token:`refresh-${token}`,expires_at:now()+expiresIn,user:{user_metadata:{}}});
const context={businessId:'b1',businessSlug:'kusina',username:'kusina.admin',displayName:'Ana',role:'admin',permissions:{},mustChangePassword:true};
let routes;
globalThis.fetch=async(url,init)=>{const path=url.replace(config.supabaseUrl,'');const route=routes[path.split('?')[0]+(path.includes('grant_type=')?`?${path.split('?')[1]}`:'')];if(!route)throw new Error(`Unexpected ${path}`);return route(JSON.parse(init.body||'{}'),init)};
const reply=(status,body)=>async()=>{if(status==='offline')throw new TypeError('Failed to fetch');return new Response(body===undefined?null:JSON.stringify(body),{status})};
const fresh=()=>{store.clear();return new QrkAuthService(config)};

// A rejected password stays generic so it never reveals whether the account exists.
routes={'/auth/v1/token?grant_type=password':reply(400,{msg:'Invalid login credentials'})};
await assert.rejects(fresh().signIn('kusina.admin','wrong'),{message:'Sign-in failed. Check your username and password.'});

routes={'/auth/v1/token?grant_type=password':reply('offline')};
await assert.rejects(fresh().signIn('kusina.admin','x'),/offline/);

routes={'/auth/v1/token?grant_type=password':reply(429,{})};
await assert.rejects(fresh().signIn('kusina.admin','x'),/Too many attempts/);

// Correct password but no active workspace (paused business, removed membership) says so.
routes={'/auth/v1/token?grant_type=password':reply(200,session('a')),'/rest/v1/rpc/get_my_access_context':reply(200,null)};
let auth=fresh();
await assert.rejects(auth.signIn('kusina.admin','right'),/no active business workspace/);
assert.equal(auth.session,null,'a workspace-less session is cleared');

// The server decides whether the temporary password is still pending.
routes={'/auth/v1/token?grant_type=password':reply(200,session('a')),'/rest/v1/rpc/get_my_access_context':reply(200,context)};
auth=fresh();
assert.equal((await auth.signIn('kusina.admin','right')).mustChangePassword,true);

// A network failure during restore keeps the session; an invalid token clears it.
routes={'/rest/v1/rpc/get_my_access_context':reply('offline')};
auth=fresh();auth.saveSession(session('b'));
await assert.rejects(auth.restore(),/offline/);
assert.equal(auth.readSession().access_token,'b','offline restore keeps the stored session');
routes={'/rest/v1/rpc/get_my_access_context':reply(401,{})};
assert.equal(await auth.restore(),null);
assert.equal(auth.readSession(),null);

// Supabase's reason for rejecting a new password reaches the user.
routes={'/auth/v1/user':reply(422,{msg:'New password should be different from the old password.'})};
auth=fresh();auth.saveSession(session('c'));
await assert.rejects(auth.updatePassword('Temp-Pass-123'),{message:'New password should be different from the old password.'});

// A newer session written by another tab is adopted instead of reusing a rotated refresh token.
routes={};
auth=fresh();auth.saveSession(session('old',30));
localStorage.setItem('qrk_local_auth_session_v1',JSON.stringify(session('newer')));
assert.equal(await auth.freshSession(),true);
assert.equal(auth.accessToken(),'newer');

// An expiring token is refreshed in the background and handed to the page.
let refreshed=0;
routes={'/auth/v1/token?grant_type=refresh_token':async body=>{refreshed++;assert.equal(body.refresh_token,'refresh-d');return new Response(JSON.stringify(session('e')),{status:200})}};
auth=fresh();auth.saveSession(session('d',30));
const token=await new Promise(resolve=>auth.keepSessionFresh(resolve));
clearTimeout(auth.refreshTimer);
assert.equal(token,'e');assert.equal(refreshed,1);

// An expired refresh token ends the session instead of failing silently.
routes={'/auth/v1/token?grant_type=refresh_token':reply(400,{msg:'Invalid Refresh Token'})};
auth=fresh();auth.saveSession(session('f',30));
assert.equal(await new Promise(resolve=>auth.keepSessionFresh(resolve)),null);
assert.equal(auth.readSession(),null);

const [app,migration,edge,html]=await Promise.all(['../dist/app.js','../supabase/migrations/202610300001_sign_in_hardening.sql','../supabase/functions/platform-clients/index.ts','../dist/index.html'].map(file=>readFile(new URL(file,import.meta.url),'utf8')));
assert.match(app,/querySelectorAll\('dialog:not\(#first-login-dialog\)'\)/,'clicking outside must not dismiss the first-login dialog');
assert.match(app,/#first-login-dialog'\)\.addEventListener\('cancel',event=>event\.preventDefault\(\)\)/,'Escape must not dismiss the first-login dialog');
assert.match(app,/addEventListener\('close',\(\)=>\{if\(accessContext\?\.mustChangePassword\)/,'a dismissed first-login dialog reopens');
assert.match(app,/\$\('#add-staff'\)\.hidden=hostedAccount\|\|/,'hosted workspaces must not offer browser-only staff accounts');
assert.match(app,/authService\.keepSessionFresh\(onToken\)/,'open dashboards keep their token fresh');
assert.equal((migration.match(/and not private\.password_change_pending\(\)/g)||[]).length,3,'every membership helper blocks pending temporary passwords');
assert.equal((migration.match(/join public\.businesses business on business\.id = member\.business_id and business\.active/g)||[]).length,4,'paused businesses lose helper access');
assert.match(migration,/delete from auth\.sessions where user_id = p_user_id/);
assert.match(migration,/grant execute on function public\.issue_temporary_password\(uuid\) to service_role/);
assert.equal((edge.match(/rpc\('issue_temporary_password'/g)||[]).length,2,'create and reset both record the temporary password');
assert.match(html,/http-equiv="Content-Security-Policy"[^>]*script-src 'self'/);
console.log('Hosted sign-in errors, session refresh, workspace checks and first-login enforcement passed.');
