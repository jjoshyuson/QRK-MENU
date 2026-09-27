import {createClient} from 'npm:@supabase/supabase-js@2';

const cors={'access-control-allow-origin':'*','access-control-allow-headers':'authorization,apikey,content-type','access-control-allow-methods':'POST,OPTIONS'};
const json=(status:number,value:unknown)=>new Response(JSON.stringify(value),{status,headers:{...cors,'content-type':'application/json'}});
const password=()=>{const sets=['ABCDEFGHJKLMNPQRSTUVWXYZ','abcdefghijkmnopqrstuvwxyz','23456789','!@#$%'];const bytes=crypto.getRandomValues(new Uint32Array(20));return [...sets.map((set,i)=>set[bytes[i]%set.length]),...Array.from({length:10},(_,i)=>sets.join('')[bytes[i+4]%sets.join('').length])].sort(()=>Math.random()-.5).join('')};
const segment=(value:unknown)=>String(value||'').toLowerCase().replace(/[^a-z0-9_-]+/g,'');

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response(null,{headers:cors});
  if(req.method!=='POST')return json(405,{error:'Method not allowed'});
  const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authorization=req.headers.get('authorization')||'',caller=createClient(url,anon,{global:{headers:{authorization}}}),admin=createClient(url,service);
  const {data:{user}}=await admin.auth.getUser(authorization.replace(/^Bearer\s+/i,''));
  if(!user)return json(401,{error:'Authentication required'});
  const {data:authority}=await admin.from('platform_admins').select('user_id').eq('user_id',user.id).eq('active',true).maybeSingle();
  if(!authority)return json(403,{error:'Platform admin required'});
  const input=await req.json().catch(()=>({})),action=String(input.action||'');
  try{
    if(action==='list'){
      const {data,error}=await caller.rpc('list_platform_clients');if(error)throw error;return json(200,{clients:data});
    }
    const businessId=String(input.businessId||'');
    if(['pause','reset','update'].includes(action)){const {data:target}=await admin.from('platform_clients').select('business_id').eq('business_id',businessId).maybeSingle();if(!target)return json(404,{error:'Client not found'})}
    if(action==='pause'){
      const active=Boolean(input.active),{error}=await admin.from('businesses').update({active,updated_at:new Date().toISOString()}).eq('id',businessId);if(error)throw error;
      return json(200,{active});
    }
    if(action==='reset'){
      const {data:client,error}=await admin.from('platform_clients').select('initial_admin_user_id').eq('business_id',businessId).single();if(error)throw error;
      const temporaryPassword=password(),{error:updateError}=await admin.auth.admin.updateUserById(client.initial_admin_user_id,{password:temporaryPassword,user_metadata:{must_change_password:true}});if(updateError)throw updateError;
      const {data:profile}=await admin.from('user_profiles').select('username').eq('user_id',client.initial_admin_user_id).single();
      return json(200,{username:profile?.username,temporaryPassword});
    }
    const record=input.client||{},slug=String(record.slug||'').toLowerCase().replace(/[^a-z0-9-]+/g,''),prefix=segment(record.prefix),username=String(record.admin?.username||'').toLowerCase();
    if(!record.businessName||!slug||!prefix||!username||!record.admin?.email||!record.admin?.name)return json(400,{error:'Complete client and administrator details'});
    if(action==='update'){
      const {error:b}=await admin.from('businesses').update({name:record.businessName,public_slug:slug,updated_at:new Date().toISOString()}).eq('id',businessId);if(b)throw b;
      const {error:p}=await admin.from('business_profiles').update({address:record.serviceProfile?.locationName||'',settings:record.serviceProfile?.settings||{}}).eq('business_id',businessId);if(p)throw p;
      const {error:s}=await admin.from('business_service_configs').upsert({business_id:businessId,foundation:record.serviceProfile?.serviceModes?.[0]||record.serviceProfile?.settings?.serviceMode||'quick',gates:record.serviceProfile||{}},{onConflict:'business_id'});if(s)throw s;
      const {error:c}=await admin.from('platform_clients').update({username_prefix:prefix,location_name:record.serviceProfile?.locationName||'',initial_admin_email:record.admin.email,service_profile:record.serviceProfile,updated_at:new Date().toISOString()}).eq('business_id',businessId);if(c)throw c;
      return json(200,{updated:true});
    }
    if(action!=='create')return json(400,{error:'Unknown action'});
    const temporaryPassword=password(),email=`${username}@accounts.qrkmenu.invalid`;
    const {data:created,error:userError}=await admin.auth.admin.createUser({email,password:temporaryPassword,email_confirm:true,user_metadata:{must_change_password:true,contact_email:record.admin.email}});if(userError)throw userError;
    const uid=created.user.id;
    const {data:existing}=await admin.from('businesses').select('id').eq('public_slug',slug).maybeSingle();let createdBusiness=false,business=existing;if(!business){const result=await admin.from('businesses').insert({name:record.businessName,public_slug:slug,active:true}).select('id').single();if(result.error){await admin.auth.admin.deleteUser(uid);throw result.error}business=result.data;createdBusiness=true}else if(record.provider!=='rnl'||slug!=='rnl'){await admin.auth.admin.deleteUser(uid);throw new Error('That portal slug is already in use.')}
    const id=business.id;
    const serviceMode=record.serviceProfile?.settings?.serviceMode==='table'?'table':'quick';
    const operations=[
      admin.from('business_profiles').upsert({business_id:id,address:record.serviceProfile?.locationName||'',open_for_orders:true,order_prefix:prefix.toUpperCase().slice(0,8),settings:record.serviceProfile?.settings||{}},{onConflict:'business_id'}),
      admin.from('business_service_configs').upsert({business_id:id,foundation:serviceMode,gates:record.serviceProfile||{}},{onConflict:'business_id'}),
      admin.from('user_profiles').insert({user_id:uid,username,display_name:record.admin.name}),
      admin.from('business_members').insert({business_id:id,user_id:uid,role:'admin',can_manage_orders:true,can_manage_menu:true,can_manage_staff:true,can_view_orders:true,can_accept_orders:true,can_prepare_orders:true,can_mark_ready:true,can_complete_orders:true,can_cancel_orders:true,can_change_availability:true,can_edit_menu:true,can_view_order_history:true,can_view_sales:true}),
      admin.from('platform_clients').insert({business_id:id,username_prefix:prefix,location_name:record.serviceProfile?.locationName||'',initial_admin_user_id:uid,initial_admin_email:record.admin.email,service_profile:record.serviceProfile||{},provider:record.provider||'qrk',provider_config:record.providerConfig||{},created_by:user.id})
    ];
    for(const operation of operations){const {error}=await operation;if(error){if(createdBusiness)await admin.from('businesses').delete().eq('id',id);await admin.auth.admin.deleteUser(uid);throw error}}
    return json(201,{businessId:id,username,temporaryPassword});
  }catch(error){return json(400,{error:error instanceof Error?error.message:String((error as {message?:unknown})?.message||JSON.stringify(error)||'Request failed')})}
});
