const list=value=>Array.isArray(value)?value.filter(Boolean):[];
const text=value=>String(value??'').trim();

export function bundleGateEnabled(profile={}){
  return Boolean(profile.layers?.bundleSelection||profile.settings?.packageMode==='required');
}

export function bundlePaymentCopy(profile={}){
  const timing=profile.settings?.paymentTiming;
  if(timing==='upfront')return'Pay before ordering';
  if(timing==='hybrid')return'Package paid before ordering; extras paid later';
  return'Pay after dining';
}

function configuredBundles(profile={}){
  const settings=profile.settings||{};
  return list(profile.bundles).length?profile.bundles:
    list(settings.bundles).length?settings.bundles:
    list(settings.packages).length?settings.packages:
    list(settings.servicePackages);
}

function normalizeConfiguredBundle(bundle,index){
  const included=list(bundle.includes||bundle.includedItems||bundle.inclusions).map(item=>text(item.name||item.label||item));
  return{id:text(bundle.id||bundle.slug||`bundle-${index+1}`),name:text(bundle.name||bundle.label),priceMinor:Number(bundle.priceMinor??bundle.price_minor??bundle.price??0),includes:included,available:bundle.available!==false&&!bundle.expired};
}

function fallbackBundles(menu=[]){
  const packageItems=menu.filter(item=>/^packages?$/i.test(text(item.category))&&!item.hidden);
  const includedCategories=[...new Set(menu.filter(item=>item.available&&!item.hidden&&Number(item.price)===0&&!/^packages?$|^extras?$/i.test(text(item.category))).map(item=>text(item.category)))];
  return packageItems.map((item,index)=>({id:text(item.id||`bundle-${index+1}`),name:text(item.name),priceMinor:Number(item.price||0),includes:includedCategories,available:item.available!==false}));
}

export function bundleOptionsForProfile(profile={},menu=[]){
  if(!bundleGateEnabled(profile))return{enabled:false,options:[],error:''};
  const source=configuredBundles(profile);
  const options=(source.length?source.map(normalizeConfiguredBundle):fallbackBundles(menu)).filter(bundle=>bundle.available&&bundle.id&&bundle.name&&bundle.priceMinor>=0);
  const complete=options.filter(bundle=>bundle.includes.length);
  return complete.length?{enabled:true,options:complete,error:''}:{enabled:true,options:[],error:'Bundle details are temporarily unavailable. Ask staff for help before ordering.'};
}
