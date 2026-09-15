const STORAGE_PREFIX='qrk_client_workspace_section_v1';
const SECTION_ORDER=['dashboard','profile','menu','staff','orders','settings'];

const identityPart=value=>encodeURIComponent(String(value||'').trim().toLowerCase());

export function workspaceSectionKey(context={}){
  const business=identityPart(context.businessId||context.businessSlug);
  const user=identityPart(context.userId||context.username);
  return business&&user?`${STORAGE_PREFIX}:${business}:${user}`:'';
}

export function workspaceDeepLink(hash=''){
  let value='';
  try{value=decodeURIComponent(String(hash).replace(/^#/,''))}catch{return ''}
  if(SECTION_ORDER.includes(value))return value;
  const section=new URLSearchParams(value).get('section');
  return SECTION_ORDER.includes(section)?section:'';
}

export function resolveWorkspaceSection({context,allowed,hash='',storage=localStorage}){
  const permitted=SECTION_ORDER.filter(section=>allowed?.[section]);
  const deepLink=workspaceDeepLink(hash);
  if(deepLink&&permitted.includes(deepLink))return deepLink;
  const key=workspaceSectionKey(context);
  let remembered='';
  try{remembered=key?storage.getItem(key)||'':''}catch{}
  if(permitted.includes(remembered))return remembered;
  return permitted.includes('dashboard')?'dashboard':permitted.includes('orders')?'orders':permitted[0]||'';
}

export function rememberWorkspaceSection(context,section,{allowed,storage=localStorage}={}){
  const key=workspaceSectionKey(context);
  if(!key||!SECTION_ORDER.includes(section)||allowed&&!allowed[section])return false;
  try{storage.setItem(key,section);return true}catch{return false}
}
