const DEVICE_KEY='qrk_device_identity_v1';
const COOKIE_KEY='qrk_device';

const uuid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now().toString(16)}-${Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('')}`;
const readCookie=()=>document.cookie.split('; ').find(value=>value.startsWith(`${COOKIE_KEY}=`))?.slice(COOKIE_KEY.length+1)||'';
const valid=value=>value&&/^[0-9a-f-]{36}$/i.test(value.id||'')&&String(value.secret||'').length>=32;

export function getDeviceIdentity(){
  let identity;
  try{identity=JSON.parse(localStorage.getItem(DEVICE_KEY)||'null')}catch{}
  if(!valid(identity)){
    const cookieId=readCookie();
    identity={id:/^[0-9a-f-]{36}$/i.test(cookieId)?cookieId:uuid(),secret:`${uuid()}${uuid()}`,createdAt:new Date().toISOString()};
  }
  localStorage.setItem(DEVICE_KEY,JSON.stringify(identity));
  document.cookie=`${COOKIE_KEY}=${encodeURIComponent(identity.id)}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
  return identity;
}

export function deviceScopedKey(businessSlug,name){return`qrk:${businessSlug}:device:${getDeviceIdentity().id}:${name}`}
