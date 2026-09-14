import { DEVELOPMENT_CLIENTS } from './qrk-service-presets.js';

const EVENT='qrk:menu-changed';
const key=slug=>`qrk_menu_studio_v1_${slug||'kusina-manila'}`;

const kusinaItems=[
  {id:1,name:'Chicken adobo',description:'Slow-braised chicken in soy, vinegar & garlic.',price:180,category:'Mains',available:true,photo:'/photos/adobo.jpg'},
  {id:2,name:'Sinigang na baboy',description:'Pork & fresh vegetables in a tangy tamarind broth.',price:220,category:'Mains',available:true,photo:'/photos/sinigang.jpg'},
  {id:3,name:'Crispy pork sisig',description:'Sizzling chopped pork, calamansi & chili.',price:195,category:'Mains',available:true,photo:'/photos/sisig.jpg'},
  {id:4,name:'Garlic fried rice',description:'Golden toasted garlic, perfectly fluffy rice.',price:55,category:'Sides',available:true,photo:'/photos/rice.jpg'},
  {id:5,name:'Lumpiang shanghai',description:'Crispy pork spring rolls with sweet chili sauce.',price:120,category:'Sides',available:true,photo:'/photos/lumpia.jpg'},
  {id:6,name:'Atchara',description:'Pickled green papaya with carrots and sweet peppers.',price:45,category:'Sides',available:true,photo:'/photos/lumpia.jpg'},
  {id:7,name:'Calamansi iced tea',description:'Freshly brewed tea with a bright citrus finish.',price:65,category:'Drinks',available:true,photo:'/photos/tea.jpg'},
  {id:8,name:'Sago at gulaman',description:'Brown sugar cooler with tapioca pearls and jelly.',price:75,category:'Drinks',available:true,photo:'/photos/tea.jpg'},
  {id:9,name:'Fresh buko juice',description:'Chilled young coconut juice with tender coconut strips.',price:85,category:'Drinks',available:true,photo:'/photos/tea.jpg'},
  {id:10,name:'Tapsilog',description:'Cured beef tapa with garlic rice and a fried egg.',price:175,category:'Breakfast',available:true,photo:'/photos/rice.jpg'},
  {id:11,name:'Longsilog',description:'Sweet pork longganisa with garlic rice and a fried egg.',price:165,category:'Breakfast',available:true,photo:'/photos/rice.jpg'},
  {id:12,name:'Champorado',description:'Chocolate rice porridge served with evaporated milk.',price:95,category:'Breakfast',available:true,photo:'/photos/rice.jpg'},
  {id:13,name:'Leche flan',description:'Silky caramel custard made with egg yolks and milk.',price:110,category:'Desserts',available:true,photo:'/photos/tea.jpg'},
  {id:14,name:'Turon',description:'Crisp caramelized banana rolls with ripe jackfruit.',price:80,category:'Desserts',available:true,photo:'/photos/lumpia.jpg'},
  {id:15,name:'Ube halaya',description:'Creamy purple yam pudding topped with coconut curds.',price:105,category:'Desserts',available:true,photo:'/photos/tea.jpg'},
  {id:16,name:'Pancit canton',description:'Stir-fried egg noodles with vegetables and sliced pork.',price:145,category:'Snacks',available:true,photo:'/photos/sisig.jpg'},
  {id:17,name:'Tokwa’t baboy',description:'Fried tofu and pork with a tangy soy-vinegar dressing.',price:135,category:'Snacks',available:true,photo:'/photos/sisig.jpg'},
  {id:18,name:'Banana cue',description:'Caramelized saba bananas served on bamboo skewers.',price:65,category:'Snacks',available:true,photo:'/photos/lumpia.jpg'},
  {id:19,name:'Kare-kare',description:'Beef and vegetables in a rich roasted peanut sauce.',price:285,category:'Specials',available:true,photo:'/photos/sinigang.jpg'},
  {id:20,name:'Bistek Tagalog',description:'Calamansi-soy beef with soft onions and pan juices.',price:245,category:'Specials',available:true,photo:'/photos/adobo.jpg'},
  {id:21,name:'Laing',description:'Taro leaves simmered in coconut milk with gentle heat.',price:155,category:'Specials',available:true,photo:'/photos/sinigang.jpg'},
  {id:22,name:'Barkada boodle',description:'Adobo, sisig, spring rolls and rice for three to four.',price:820,category:'Platters',available:true,photo:'/photos/adobo.jpg'},
  {id:23,name:'Pancit party tray',description:'Celebration-size pancit canton for five to six guests.',price:690,category:'Platters',available:true,photo:'/photos/sisig.jpg'},
  {id:24,name:'Inihaw sampler',description:'Grilled pork, chicken and vegetables with spiced vinegar.',price:760,category:'Platters',available:true,photo:'/photos/adobo.jpg'}
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
