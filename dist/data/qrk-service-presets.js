export const QRK_CLIENTS_KEY='qrk_platform_clients_v1';
export const SERVICE_LAYER_ORDER=['tableSelection','bundleSelection','bundlePayment','staffAcceptance','openOrderTab','joinControl','tabPayment','staffReopen'];

export function deriveServiceLayers(settings){const table=settings.serviceMode==='table',bundle=table&&settings.packageMode==='required',upfront=['upfront','hybrid'].includes(settings.paymentTiming);return{tableSelection:table,bundleSelection:bundle,bundlePayment:bundle&&upfront,staffAcceptance:table&&settings.staffAcceptance,openOrderTab:table,joinControl:table&&settings.additionalDevices,tabPayment:table&&['end','hybrid'].includes(settings.paymentTiming),staffReopen:table&&settings.billLocksOrdering}}

const tableBase={
  serviceMode:'table',tableIdentification:'qr',staffAcceptance:true,guestCountRequired:true,
  packageMode:'none',paymentTiming:'end',additionalDevices:true,joinPolicy:'host',
  guestOrderPolicy:'host_approval',proximityPolicy:'fallback',proximityRadiusM:250,
  acceptanceTimeoutSeconds:90,sessionExpiryMinutes:180,billLocksOrdering:true
};

export const SERVICE_PRESETS={
  quick:{id:'quick',name:'Quick / counter service',summary:'Customers choose dine-in or takeout, then order and pay.',settings:{serviceMode:'quick',fulfillmentModes:['table','pickup'],tableIdentification:'none',staffAcceptance:false,guestCountRequired:false,packageMode:'none',paymentTiming:'counter',additionalDevices:false,joinPolicy:'disabled',guestOrderPolicy:'direct',proximityPolicy:'off',proximityRadiusM:250,acceptanceTimeoutSeconds:90,sessionExpiryMinutes:60,billLocksOrdering:false}},
  direct_table:{id:'direct_table',name:'Direct table ordering',summary:'A table QR opens ordering immediately.',settings:{...tableBase,staffAcceptance:false,guestOrderPolicy:'direct'}},
  table_approval:{id:'table_approval',name:'Table approval',summary:'Guests may build a cart while staff confirms the table.',settings:{...tableBase}},
  open_tab:{id:'open_tab',name:'Open table tab',summary:'Staff opens the table once for multiple order rounds.',settings:{...tableBase,staffAcceptance:false,guestCountRequired:false,guestOrderPolicy:'direct'}},
  buffet_approval:{id:'buffet_approval',name:'Buffet package approval',summary:'Choose a package, then wait for staff before ordering.',settings:{...tableBase,packageMode:'required',paymentTiming:'upfront'}},
  traditional:{id:'traditional',name:'Traditional restaurant',summary:'Open a table, order in rounds, and settle at the end.',settings:{...tableBase}},
  traditional_prepaid:{id:'traditional_prepaid',name:'Restaurant · pay first',summary:'Payment is required before an order reaches staff.',settings:{...tableBase,paymentTiming:'upfront'}},
  buffet_end:{id:'buffet_end',name:'Bundled buffet · pay later',summary:'Choose a package, order included items, and settle at the end.',settings:{...tableBase,packageMode:'required'}},
  buffet_hybrid:{id:'buffet_hybrid',name:'Bundled buffet · hybrid',summary:'Pay the initial package first; keep chargeable extras on an open tab.',settings:{...tableBase,packageMode:'required',paymentTiming:'hybrid'}},
  buffet_upfront:{id:'buffet_upfront',name:'Bundled buffet · upfront',summary:'Confirm and pay for the package before ordering begins.',settings:{...tableBase,packageMode:'required',paymentTiming:'upfront'}},
  cafe_tab:{id:'cafe_tab',name:'Café or bar tab',summary:'Keep a named table tab open across multiple order rounds.',settings:{...tableBase,guestCountRequired:false,staffAcceptance:false,joinPolicy:'host',guestOrderPolicy:'direct'}},
  custom:{id:'custom',name:'Custom table service',summary:'Start with safe Table defaults and adjust each rule.',settings:{...tableBase}}
};

export const DEVELOPMENT_CLIENTS=[
  {id:'kusina-manila',businessName:'Kusina Manila',slug:'kusina-manila',prefix:'kusina',description:'Filipino favorites, made with love.',serviceProfile:{preset:'quick',locationName:'Ermita',settings:{paymentTiming:'upfront'}},admin:{name:'Jonathan Yuson',email:'owner@kusinamanila.example',username:'kusina-admin'},menu:[['Mains','Chicken adobo',18000],['Mains','Sinigang na baboy',22000],['Mains','Crispy pork sisig',19500],['Sides','Garlic fried rice',5500],['Sides','Lumpiang shanghai',12000],['Sides','Atchara',4500],['Drinks','Calamansi iced tea',6500],['Drinks','Sago at gulaman',7500],['Drinks','Fresh buko juice',8500],['Breakfast','Tapsilog',17500],['Breakfast','Longsilog',16500],['Breakfast','Champorado',9500],['Desserts','Leche flan',11000],['Desserts','Turon',8000],['Desserts','Ube halaya',10500],['Snacks','Pancit canton',14500],['Snacks','Tokwa’t baboy',13500],['Snacks','Banana cue',6500],['Specials','Kare-kare',28500],['Specials','Bistek Tagalog',24500],['Specials','Laing',15500],['Platters','Barkada boodle',82000],['Platters','Pancit party tray',69000],['Platters','Inihaw sampler',76000]]},
  {id:'salamat',businessName:'Salamat',slug:'salamat',prefix:'salamat',description:'Filipino food and attentive table service.',serviceProfile:{preset:'direct_table',locationName:'Makati'},admin:{name:'Maya Santos',email:'maya@salamat.example',username:'salamat-admin'},menu:[['Mains','Chicken inasal',19500],['Sides','Garlic rice',5500],['Drinks','Sago at gulaman',7000]]},
  {id:'salo-table',businessName:'Salo Table',slug:'salo-table',prefix:'salo',description:'Casual Filipino dining with staff-confirmed tables.',serviceProfile:{preset:'table_approval',locationName:'Quezon City'},admin:{name:'Ana Reyes',email:'ana@salo.example',username:'salo-admin'},menu:[['Shared plates','Crispy pata',78000],['Shared plates','Kare-kare',52000],['Drinks','Fresh buko',9000]]},
  {id:'tambay-tab',businessName:'Tambay Café',slug:'tambay-tab',prefix:'tambay',description:'Coffee, snacks, and an open table tab for every visit.',serviceProfile:{preset:'open_tab',locationName:'Pasig'},admin:{name:'Luis Garcia',email:'luis@tambay.example',username:'tambay-admin'},menu:[['Coffee','Spanish latte',16500],['Coffee','Cold brew',15000],['Snacks','Truffle fries',19000]]},
  {id:'ihaw-buffet',businessName:'Ihaw Buffet',slug:'ihaw-buffet',prefix:'ihaw',description:'Choose a buffet package before ordering grill selections.',serviceProfile:{preset:'buffet_approval',locationName:'Taguig'},admin:{name:'Bea Cruz',email:'bea@ihaw.example',username:'ihaw-admin'},menu:[['Packages','Classic buffet',59900],['Packages','Premium buffet',79900],['Extras','Cheese dip',8500]]}
].map(client=>({...client,status:'active',createdAt:'2026-09-13T00:00:00.000Z',serviceProfile:normalizeServiceProfile(client.serviceProfile),admin:{...client.admin,access:'Development shortcut'}}));

export function presetSettings(id='traditional'){return structuredClone(SERVICE_PRESETS[id]?.settings||SERVICE_PRESETS.traditional.settings)}
export function normalizeServiceProfile(profile={}){
  const preset=SERVICE_PRESETS[profile.preset]?.id||'traditional';
  const settings={...presetSettings(preset),...(profile.settings||{})};
  return{preset,locationName:String(profile.locationName||'Main location'),inheritsBusinessDefaults:profile.inheritsBusinessDefaults!==false,settings,layers:deriveServiceLayers(settings)};
}
export function describeServiceProfile(profile){
  const value=normalizeServiceProfile(profile),s=value.settings;
  if(s.serviceMode==='quick')return `${value.locationName} uses QRK Quick. Customers order without opening a table session and ${s.paymentTiming==='counter'?'pay at the counter':'follow the configured payment step'}.`;
  const entry=s.tableIdentification==='qr'?'a table-specific QR':s.tableIdentification==='choose'?'a table they choose':'a table assigned by staff';
  const join=!s.additionalDevices?'additional devices cannot join':s.joinPolicy==='host'?'the table host approves additional devices':s.joinPolicy==='staff'?'staff approves additional devices':s.joinPolicy==='code'?'additional devices enter a join code':'additional devices join automatically';
  const orders=s.guestOrderPolicy==='host_approval'?'guest orders require host approval':s.guestOrderPolicy==='shared_cart'?'guests suggest items in a shared cart':s.guestOrderPolicy==='view_only'?'guests can only view':'approved guests order directly';
  const proximity=s.proximityPolicy==='off'?'no proximity check':s.proximityPolicy==='advisory'?'proximity is advisory':s.proximityPolicy==='required'?'proximity is required with staff recovery':'uncertain proximity falls back to staff approval';
  return `${value.locationName} opens Table service from ${entry}; ${join}; ${orders}; ${proximity}.`;
}
export function readPreviewClients(){try{const value=JSON.parse(localStorage.getItem(QRK_CLIENTS_KEY)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
export function findPreviewClient(slug){return readPreviewClients().find(client=>client.slug===slug)}
