const STORAGE_KEY='qrk_demo_branding_v1';
const HEX=/^#[0-9a-f]{6}$/i;
const DEFAULTS={businessName:"Kusina Nanay Mila's",businessSlug:'kusina-manila',primary:'#0fb9c0',nav:'#0b0c0e',logoDataUrl:'',tableCount:6};
const DEFAULT_MENU_BACKGROUND=Object.freeze({image:'',surfaceOpacity:.72});
const KUSINA_MENU_BACKGROUND='/assets/businesses/kusina-manila-menu-background.jpg';

const clamp=value=>Math.max(0,Math.min(255,Math.round(value)));
const hexToRgb=hex=>{const value=HEX.test(hex)?hex:'#0fb9c0';return[1,3,5].map(index=>parseInt(value.slice(index,index+2),16))};
const rgbToHex=rgb=>`#${rgb.map(value=>clamp(value).toString(16).padStart(2,'0')).join('')}`;
const mix=(hex,target,amount)=>rgbToHex(hexToRgb(hex).map((value,index)=>value+(target[index]-value)*amount));
const channel=value=>{const normalized=value/255;return normalized<=.04045?normalized/12.92:((normalized+.055)/1.055)**2.4};
const luminance=hex=>{const [r,g,b]=hexToRgb(hex).map(channel);return .2126*r+.7152*g+.0722*b};
const contrast=(a,b)=>{const [light,dark]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(light+.05)/(dark+.05)};
const readableOn=background=>contrast(background,'#ffffff')>=contrast(background,'#0b0c0e')?'#ffffff':'#0b0c0e';
const readableAccent=hex=>{let value=hex;while(contrast(value,'#ffffff')<4.5)value=mix(value,[0,0,0],.08);return value};
const safeNav=hex=>{let value=hex;while(contrast(value,'#ffffff')<7)value=mix(value,[0,0,0],.12);return value};
// Slugs are shared by the authenticated portal and its public menu URL, while
// preview business IDs can vary between those two surfaces.
const contextKey=context=>String(context?.businessSlug||context?.businessId||DEFAULTS.businessSlug);

function readAll(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}}
function normalizeMenuBackground(value,slug){const source=value&&typeof value==='object'?value:{},image=Object.prototype.hasOwnProperty.call(source,'image')?String(source.image||''):(slug==='kusina-manila'?KUSINA_MENU_BACKGROUND:DEFAULT_MENU_BACKGROUND.image),opacity=Number(source.surfaceOpacity);return{image,surfaceOpacity:Number.isFinite(opacity)?Math.max(.4,Math.min(.95,opacity)):DEFAULT_MENU_BACKGROUND.surfaceOpacity}}
export function getBusinessBrand(context={}){const saved=readAll()[contextKey(context)]||{},businessSlug=saved.businessSlug||context.businessSlug||DEFAULTS.businessSlug,tableCount=Number(saved.tableCount??(businessSlug==='salamat'?20:DEFAULTS.tableCount)),savedName=businessSlug==='kusina-manila'&&saved.businessName==='Kusina Manila'?DEFAULTS.businessName:saved.businessName;return{...DEFAULTS,...saved,businessName:savedName||context.businessName||DEFAULTS.businessName,businessSlug,tableCount:Number.isInteger(tableCount)?Math.max(1,Math.min(200,tableCount)):DEFAULTS.tableCount,publicMenuBackground:normalizeMenuBackground(saved.publicMenuBackground,businessSlug)}}
export function saveBusinessBrand(context,brand){const all=readAll(),next={...getBusinessBrand(context),...brand,updatedAt:new Date().toISOString()};all[contextKey(context)]=next;localStorage.setItem(STORAGE_KEY,JSON.stringify(all));return next}
export function themeValues(brand){const primary=HEX.test(brand.primary)?brand.primary:DEFAULTS.primary,nav=safeNav(HEX.test(brand.nav)?brand.nav:DEFAULTS.nav);return{primary,primaryStrong:readableAccent(primary),primarySoft:mix(primary,[255,255,255],.9),primaryRing:`rgba(${hexToRgb(primary).join(',')},.28)`,primaryForeground:readableOn(primary),nav}}
export function applyBusinessBrand(brand,root=document.documentElement){
  // Global QRK colors are authoritative. Tenant records keep their historical
  // values for compatibility, but only an explicit future custom mode may
  // override the shared palette.
  if(brand?.colorMode!=='custom')return null;
  const theme=themeValues(brand);root.style.setProperty('--brand-400',theme.primary);root.style.setProperty('--brand-500',theme.primary);root.style.setProperty('--brand-600',theme.primaryStrong);root.style.setProperty('--brand-soft',theme.primarySoft);root.style.setProperty('--brand-ring',theme.primaryRing);root.style.setProperty('--brand-foreground',theme.primaryForeground);root.style.setProperty('--nav',theme.nav);return theme
}

export async function prepareBusinessLogo(file){
  if(!file||!/^image\/(png|jpeg|webp)$/i.test(file.type))throw new Error('Choose a PNG, JPG, or WebP logo.');
  if(file.size>2*1024*1024)throw new Error('Choose a logo smaller than 2 MB.');
  const bitmap=await createImageBitmap(file),scale=Math.min(1,512/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
  const sample=document.createElement('canvas');sample.width=48;sample.height=48;const sampleContext=sample.getContext('2d',{willReadFrequently:true});sampleContext.drawImage(canvas,0,0,48,48);const pixels=sampleContext.getImageData(0,0,48,48).data,buckets=new Map();
  for(let index=0;index<pixels.length;index+=4){const r=pixels[index],g=pixels[index+1],b=pixels[index+2],a=pixels[index+3];if(a<100)continue;const max=Math.max(r,g,b),min=Math.min(r,g,b),saturation=max?((max-min)/max):0,brightness=(r+g+b)/3;if(saturation<.22||brightness<35||brightness>235)continue;const key=[r,g,b].map(value=>Math.round(value/32)*32).join(',');buckets.set(key,(buckets.get(key)||0)+1+saturation)}
  const winner=[...buckets.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0],primary=winner?rgbToHex(winner.split(',').map(Number)):DEFAULTS.primary;
  return{logoDataUrl:canvas.toDataURL('image/webp',.88),primary,nav:safeNav(mix(primary,[0,0,0],.72))};
}

export async function prepareBusinessMenuBackground(file){
  if(!file||!/^image\/(png|jpeg|webp)$/i.test(file.type))throw new Error('Choose a PNG, JPG, or WebP background.');
  if(file.size>6*1024*1024)throw new Error('Choose a background smaller than 6 MB.');
  const bitmap=await createImageBitmap(file),scale=Math.min(1,1800/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const context=canvas.getContext('2d');context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
  return canvas.toDataURL('image/webp',.82);
}

export const QRK_BRAND_STORAGE_KEY=STORAGE_KEY;
