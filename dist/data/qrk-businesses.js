import {DEVELOPMENT_CLIENTS,findPreviewClient,normalizeServiceProfile} from './qrk-service-presets.js';

const BUSINESSES={
  'kusina-manila':{businessName:'Kusina Manila',serviceMode:'quick',serviceLabel:'QRK Quick',description:'Filipino favorites, made with love.',location:'Ermita, Manila',serviceProfile:normalizeServiceProfile({preset:'quick',locationName:'Ermita',settings:{paymentTiming:'upfront'}})},
  'salamat':{businessName:'Salamat',serviceMode:'table',serviceLabel:'QRK Table',description:'Filipino food and attentive table service.',location:'Makati, Metro Manila',serviceProfile:normalizeServiceProfile({preset:'direct_table',locationName:'Makati'})}
};

export function getBusinessExperience(slug='kusina-manila'){
  const normalized=String(slug||'kusina-manila').toLowerCase();
  const preview=DEVELOPMENT_CLIENTS.find(client=>client.slug===normalized)||findPreviewClient(normalized),fallback=BUSINESSES[normalized]||{businessName:normalized.split('-').map(part=>part.charAt(0).toUpperCase()+part.slice(1)).join(' '),serviceMode:'quick',serviceLabel:'QRK Quick',description:'Browse the menu and order when ready.',location:'Metro Manila',serviceProfile:normalizeServiceProfile({preset:'quick'})};
  if(!preview)return{slug:normalized,...fallback};
  const serviceProfile=normalizeServiceProfile(preview.serviceProfile),serviceMode=serviceProfile.settings.serviceMode;
  return{slug:normalized,businessName:preview.businessName,serviceMode,serviceLabel:serviceMode==='table'?'QRK Table':'QRK Quick',description:preview.description||'Browse the menu and order when ready.',location:serviceProfile.locationName,serviceProfile,menu:preview.menu||null,developmentClient:DEVELOPMENT_CLIENTS.some(client=>client.slug===normalized)};
}
