import { DEVELOPMENT_CLIENTS } from './qrk-service-presets.js';

const EVENT='qrk:menu-changed';
const key=slug=>`qrk_menu_studio_v1_${slug||'kusina-manila'}`;

const kusinaItems=[
  {id:1,name:'Chicken adobo',description:'Slow-braised chicken in soy, vinegar & garlic.',price:180,category:'Mains',available:true,photo:'/photos/adobo.jpg'},
  {id:2,name:'Sinigang na baboy',description:'Pork & fresh vegetables in a tangy tamarind broth.',price:220,category:'Mains',available:true,photo:'/photos/sinigang.jpg'},
  {id:3,name:'Crispy pork sisig',description:'Sizzling chopped pork, calamansi & chili.',price:195,category:'Mains',available:true,photo:'/photos/sisig.jpg'},
  {id:4,name:'Garlic fried rice',description:'Golden toasted garlic, perfectly fluffy rice.',price:55,category:'Sides',available:true,photo:'/photos/rice.jpg'},
  {id:5,name:'Lumpiang shanghai',description:'Crispy pork spring rolls with sweet chili sauce.',price:120,category:'Sides',available:false,photo:'/photos/lumpia.jpg'},
  {id:6,name:'Calamansi iced tea',description:'Freshly brewed tea with a bright citrus finish.',price:65,category:'Drinks',available:true,photo:'/photos/tea.jpg'}
];

function defaultState(slug){
  if(slug==='kusina-manila')return{menuName:'Main menu',categories:['Mains','Sides','Drinks','Breakfast','Desserts','Snacks','Specials','Platters'],items:kusinaItems.map(item=>({...item,options:'',hidden:false}))};
  const client=DEVELOPMENT_CLIENTS.find(entry=>entry.slug===slug);
  const items=(client?.menu||[]).map(([category,name,price],index)=>({id:index+1,category,name,description:'Development menu item for this service workflow.',price:price/100,photo:null,available:true,hidden:false,options:''}));
  return{menuName:'Main menu',categories:[...new Set(items.map(item=>item.category))],items};
}

function validState(value){return value&&typeof value.menuName==='string'&&Array.isArray(value.categories)&&Array.isArray(value.items)}

export function readMenuState(slug){
  try{const saved=JSON.parse(localStorage.getItem(key(slug))||'null');if(validState(saved))return saved}catch{}
  return defaultState(slug);
}

export function saveMenuState(slug,state){
  localStorage.setItem(key(slug),JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT,{detail:{slug}}));
}

export function subscribeMenuState(slug,listener){
  const storage=event=>{if(event.key===key(slug))listener(readMenuState(slug))};
  const local=event=>{if(event.detail?.slug===slug)listener(readMenuState(slug))};
  addEventListener('storage',storage);addEventListener(EVENT,local);
  return()=>{removeEventListener('storage',storage);removeEventListener(EVENT,local)};
}
