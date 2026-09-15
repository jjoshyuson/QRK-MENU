const ACTIVE_SESSION_STATES=new Set(['active','bill_requested']);
const CHARGE_LATER_TIMINGS=new Set(['end','split','on_exit','hybrid']);

export function resolveEntitlement({settings={},item={},session=null,now=Date.now()}={}){
  if(settings.entitlementMode==='none'||!settings.entitlementMode)return{kind:'standard',label:'',action:'order',disabled:false};
  if(!session?.packageId)return{kind:'unavailable',label:'Package required',action:'unavailable',disabled:true,reason:'Choose a package before ordering.'};
  if(!ACTIVE_SESSION_STATES.has(session.status))return{kind:'unavailable',label:'Not available',action:'unavailable',disabled:true,reason:'This table is not open for ordering.'};
  if(session.expiresAt&&Date.parse(session.expiresAt)<=now)return{kind:'unavailable',label:'Package expired',action:'unavailable',disabled:true,reason:'Ask staff to renew this package.'};
  if(item.entitlement?.bundleIds&&!item.entitlement.bundleIds.includes(session.packageId))return{kind:'unavailable',label:'Not in package',action:'unavailable',disabled:true,reason:'This item is not included with your package.'};
  if(item.entitlement?.available===false)return{kind:'unavailable',label:'Unavailable',action:'unavailable',disabled:true,reason:item.entitlement.reason||'This item is unavailable for your package.'};
  if(item.entitlement?.counterOnly)return{kind:'counter-only',label:'Order at counter',action:'counter',disabled:true,reason:'Please order and pay for this item at the counter.'};
  if(Number(item.price)>0){
    if(!CHARGE_LATER_TIMINGS.has(settings.paymentTiming))return{kind:'counter-only',label:'Order at counter',action:'counter',disabled:true,reason:'Extras are paid for at the counter.'};
    return{kind:'extra',label:'Extra charge',action:'order',disabled:false};
  }
  if(settings.refillPolicy==='included')return{kind:'included',label:'Included',action:'refill',disabled:false};
  return{kind:'included',label:'Included',action:'order',disabled:false};
}
