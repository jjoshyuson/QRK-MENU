const paths={menu:'M4 5h16M4 12h16M4 19h16M8 3v4M16 10v4M9 17v4',spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',utensils:'M4 3v5a3 3 0 0 0 6 0V3M7 3v18M19 3c-3 3-4 6-4 9h4M19 3v18',edit:'m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Z',plus:'M12 5v14M5 12h14',search:'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',info:'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',close:'m6 6 12 12M6 18 18 6'};
Object.assign(paths,{mobile:'M7 2h10v20H7ZM11 19h2',tablet:'M4 2h16v20H4ZM11 19h2',desktop:'M2 3h20v14H2ZM12 17v4M7 21h10',expand:'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5'});
const $=s=>document.querySelector(s);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function icons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>{e.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[e.dataset.icon]||paths.menu}"/></svg>`})}
let categories=['Mains','Sides','Drinks'],active='All items',phoneActive='All',menuName='Main menu',editingId=null,nameMode='category',previewDevice='mobile',mobileCategory='All',mobileCustomer=false,pendingPhoto=null,photoVersion=0,toastTimer;
let items=[{id:1,name:'Chicken adobo',description:'Slow-braised chicken in soy, vinegar & garlic.',price:180,category:'Mains',available:true},{id:2,name:'Sinigang na baboy',description:'Pork & fresh vegetables in a tangy tamarind broth.',price:220,category:'Mains',available:true},{id:3,name:'Crispy pork sisig',description:'Sizzling chopped pork, calamansi & chili.',price:195,category:'Mains',available:true},{id:4,name:'Garlic fried rice',description:'Golden toasted garlic, perfectly fluffy rice.',price:55,category:'Sides',available:true},{id:5,name:'Lumpiang shanghai',description:'Crispy pork spring rolls with sweet chili sauce.',price:120,category:'Sides',available:false},{id:6,name:'Calamansi iced tea',description:'Freshly brewed tea with a bright citrus finish.',price:65,category:'Drinks',available:true}];
const samplePhotos=['adobo','sinigang','sisig','rice','lumpia','tea'];
items.forEach((i,index)=>i.photo='/photos/'+samplePhotos[index]+'.jpg');
function foodPhoto(i,cls=''){return i.photo?`<img class="${cls}" src="${esc(i.photo)}" alt="${esc(i.name)}" loading="lazy" decoding="async" width="600" height="450">`:`<span class="food-photo-empty ${cls}"><span data-icon="utensils"></span>No photo</span>`}
const price=n=>'₱'+Number(n).toLocaleString('en-PH',{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});
function stamp(i){return `<span class="item-stamp ${i.category==='Drinks'?'drinks':i.category==='Sides'?'sides':''}" aria-hidden="true">${esc(i.name.split(' ').slice(0,2).map(x=>x[0].toUpperCase()).join(''))}</span>`}
function announce(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800)}
function changed(message){$('#change-status').textContent='Preview updated';render();announce(message)}
function render(){
 $('#menu-name-display').textContent=menuName;$('#phone-menu-name').textContent=menuName;$('#total-count').textContent=items.length;$('#item-count').textContent=items.length;
 $('#category-tabs').innerHTML=['All items',...categories].map(c=>`<button class="category-tab ${active===c?'active':''}" data-category="${esc(c)}" aria-pressed="${active===c}">${esc(c)}<span>${c==='All items'?items.length:items.filter(i=>i.category===c).length}</span></button>`).join('');
 const q=$('#search').value.toLowerCase();const filtered=items.filter(i=>(active==='All items'||i.category===active)&&`${i.name} ${i.description}`.toLowerCase().includes(q));$('#results-label').textContent=`${filtered.length} item${filtered.length===1?'':'s'}`;
 $('#items').innerHTML=filtered.length?filtered.map(i=>`<div class="item-row ${i.available?'':'sold-out'}"><button class="item-details" data-edit="${i.id}" aria-label="Edit ${esc(i.name)}">${stamp(i)}<div class="item-info"><strong>${esc(i.name)}</strong><p>${esc(i.description)}</p><span class="item-category">${esc(i.category)}</span></div></button><span class="item-price">${price(i.price)}</span><div class="availability"><button class="switch" role="switch" aria-label="${esc(i.name)} available" aria-checked="${i.available}" data-toggle="${i.id}"></button><small>${i.available?'':'Sold out'}</small></div><button class="icon-button" data-edit="${i.id}" aria-label="Edit ${esc(i.name)}"><span data-icon="edit"></span></button></div>`).join(''):`<div class="empty"><strong>${q?'No matching items':'A fresh category awaits'}</strong>${q?'Try a different name or clear your search.':'Add your first item to bring this menu to life.'}</div>`;
 renderPhone();renderMobileMenu();icons();
}
function renderPhone(){
 $('#phone-tabs').innerHTML=['All',...categories].map(c=>`<button class="phone-tab ${phoneActive===c?'active':''}" data-phone-category="${esc(c)}" aria-pressed="${phoneActive===c}">${esc(c)}</button>`).join('');
 const visible=items.filter(i=>phoneActive==='All'||i.category===phoneActive);
 $('#phone-items').innerHTML=visible.length?visible.map(i=>`<article class="phone-item ${i.available?'':'sold-out'}"><div class="phone-photo">${foodPhoto(i)}${i.available?'':'<span class="photo-sold-label">Sold out</span>'}</div><div class="phone-item-copy"><strong>${esc(i.name)}</strong><b>${price(i.price)}</b></div></article>`).join(''):'<p class="empty">Items coming soon.</p>';
 if($('#preview-dialog').open)syncExpanded();
}
function renderMobileMenu(){
 const app=$('.mobile-menu-app');app.dataset.mode=mobileCustomer?'customer':'owner';
 $('#mobile-menu-name').textContent=menuName;
 $('.owner-mode-label').textContent=mobileCustomer?'Customer preview':'Editing your menu';
 $('#mobile-view-toggle').innerHTML=`<span data-icon="${mobileCustomer?'edit':'eye'}"></span><span>${mobileCustomer?'Back to editing':'Customer view'}</span>`;
 $('#mobile-category-tabs').innerHTML=['All',...categories].map(c=>`<button type="button" data-mobile-category="${esc(c)}" aria-pressed="${c===mobileCategory}">${esc(c)}</button>`).join('');
 const visible=categories.filter(c=>mobileCategory==='All'||c===mobileCategory);
 $('#mobile-menu-sections').innerHTML=visible.map(c=>{
  const dishes=items.filter(i=>i.category===c);
  if(mobileCustomer&&!dishes.length)return '';
  return `<section class="mobile-menu-section"><div class="mobile-section-heading"><h3>${esc(c)}</h3><span>${dishes.length} item${dishes.length===1?'':'s'}</span></div><div class="mobile-dishes">${dishes.map(i=>`<article class="mobile-dish ${i.available?'':'is-sold-out'}"><div class="mobile-dish-photo">${foodPhoto(i)}${mobileCustomer?'':`<button class="mobile-icon-control" data-edit="${i.id}" aria-label="Edit ${esc(i.name)}"><span data-icon="edit"></span></button>`}${i.available?'':'<span class="photo-sold-label">Sold out</span>'}</div><div class="mobile-dish-content"><h4>${esc(i.name)}</h4><strong>${price(i.price)}</strong>${mobileCustomer?'':`<button class="mobile-stock-button" type="button" role="switch" aria-checked="${i.available}" data-mobile-stock="${i.id}" aria-label="${esc(i.name)} available"><span class="mobile-stock-dot"></span>${i.available?'Available':'Sold out'}</button>`}</div></article>`).join('')}${mobileCustomer?'':`<button class="mobile-add-in-category" data-mobile-add="${esc(c)}"><span data-icon="plus"></span>${dishes.length?'Add item':'Add first item'}</button>`}</div></section>`;
 }).join('')||'<div class="empty"><strong>Something delicious is on its way.</strong>Check back for menu items soon.</div>';
 icons(app);
}
$('#mobile-view-toggle').onclick=()=>{mobileCustomer=!mobileCustomer;renderMobileMenu()};
$('#mobile-add-item').onclick=()=>{active=categories.includes(mobileCategory)?mobileCategory:'All items';openItem()};
$('#mobile-add-category').onclick=()=>openName('category');
$('#mobile-rename-menu').onclick=()=>openName('menu');
document.addEventListener('click',e=>{
 const category=e.target.closest('[data-mobile-category]'),add=e.target.closest('[data-mobile-add]'),stock=e.target.closest('[data-mobile-stock]');
 if(category){mobileCategory=category.dataset.mobileCategory;renderMobileMenu();Array.from(document.querySelectorAll('[data-mobile-category]')).find(b=>b.dataset.mobileCategory===mobileCategory)?.focus()}
 if(add){active=add.dataset.mobileAdd;openItem()}
 if(stock){const item=items.find(i=>i.id===Number(stock.dataset.mobileStock));item.available=!item.available;changed(`${item.name} marked ${item.available?'available':'sold out'}`);document.querySelector(`[data-mobile-stock="${item.id}"]`)?.focus()}
});

const deviceWidths={mobile:390,tablet:768,desktop:1280};
function syncExpanded(){
 const scroll=$('#expanded-preview .phone-content')?.scrollTop||0;
 const clone=$('.preview-panel .phone').cloneNode(true);clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
 clone.dataset.device=previewDevice;clone.style.width=deviceWidths[previewDevice]+'px';
 $('#expanded-preview').replaceChildren(clone);clone.querySelector('.phone-content').scrollTop=scroll;
 $('#preview-dialog').dataset.device=previewDevice;
 $('#preview-dialog').querySelectorAll('[data-preview-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewDevice===previewDevice)));
 requestAnimationFrame(fitPreview);
}
function fitPreview(){
 if(!$('#preview-dialog').open)return;
 const stage=$('.preview-stage'),frame=$('#expanded-preview'),screen=frame.firstElementChild;
 if(!screen)return;
 const width=deviceWidths[previewDevice],scale=Math.min(1,stage.clientWidth/width);
 screen.style.transform=`scale(${scale})`;frame.style.width=(width*scale)+'px';frame.style.height=(screen.offsetHeight*scale)+'px';
 $('#preview-size').textContent=`${width} px${scale<.99?' · scaled to fit':''}`;
}
function openPreview(device=previewDevice){previewDevice=device;syncExpanded();if(!$('#preview-dialog').open)$('#preview-dialog').showModal();requestAnimationFrame(fitPreview)}
new ResizeObserver(fitPreview).observe($('.preview-stage'));
window.addEventListener('resize',fitPreview);
function workspaceView(view){
 $('.workbench').dataset.workspaceView=view;
 document.querySelectorAll('button[data-workspace-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workspaceView===view)));
}

function openItem(id=null){editingId=id;const i=items.find(x=>x.id===id),f=$('#item-form');f.reset();photoVersion++;pendingPhoto=i?.photo||null;$('#photo-error').textContent='';$('#save-item').disabled=false;updatePhotoPreview();f.elements.category.innerHTML=categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');$('#dialog-title').textContent=i?'Edit menu item':'Add a menu item';$('#save-item').textContent=i?'Save changes':'Add item';$('#delete-item').hidden=!i;if(i){['name','description','price','category'].forEach(k=>f.elements[k].value=i[k]);f.elements.available.checked=i.available}else if(categories.includes(active))f.elements.category.value=active;$('#item-dialog').showModal();f.elements.name.focus()}
function updatePhotoPreview(){const img=$('#item-photo-preview');img.hidden=!pendingPhoto;$('#remove-photo').hidden=!pendingPhoto;if(pendingPhoto)img.src=pendingPhoto;else img.removeAttribute('src')}
$('#remove-photo').onclick=()=>{photoVersion++;pendingPhoto=null;$('#item-photo').value='';$('#photo-error').textContent='';$('#save-item').disabled=false;updatePhotoPreview()};
$('#item-photo').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 const version=++photoVersion;$('#photo-error').textContent='';$('#save-item').disabled=false;
 if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)||file.size>5*1024*1024){$('#photo-error').textContent='Choose a JPG, PNG, WebP or AVIF image under 5 MB.';e.target.value='';return}
 $('#save-item').disabled=true;
 try{const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});const img=new Image();img.src=data;await img.decode();if(version!==photoVersion)return;pendingPhoto=data;updatePhotoPreview()}
 catch{if(version===photoVersion){$('#photo-error').textContent='That image could not be opened. Try another photo.';e.target.value=''}}
 finally{if(version===photoVersion)$('#save-item').disabled=false}
};

$('#add-item').onclick=()=>openItem();$('#add-another').onclick=()=>openItem();$('#search').oninput=render;
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),toggle=e.target.closest('[data-toggle]'),cat=e.target.closest('[data-category]'),p=e.target.closest('[data-phone-category]');const device=e.target.closest('[data-preview-device]'),view=e.target.closest('button[data-workspace-view]');if(device)openPreview(device.dataset.previewDevice);if(view)workspaceView(view.dataset.workspaceView);if(edit)openItem(Number(edit.dataset.edit));if(toggle){const i=items.find(i=>i.id===Number(toggle.dataset.toggle));i.available=!i.available;changed(`${i.name} marked ${i.available?'available':'sold out'}`);document.querySelector(`[data-toggle="${i.id}"]`)?.focus()}if(cat){active=cat.dataset.category;render();Array.from(document.querySelectorAll('[data-category]')).find(e=>e.dataset.category===active)?.focus()}if(p){const expanded=!!p.closest('#preview-dialog');phoneActive=p.dataset.phoneCategory;renderPhone();const scope=expanded?$('#expanded-preview'):$('.preview-panel');Array.from(scope.querySelectorAll('[data-phone-category]')).find(b=>b.dataset.phoneCategory===phoneActive)?.focus()}if(e.target.closest('.close-dialog'))e.target.closest('dialog').close()});
$('#item-form').onsubmit=e=>{e.preventDefault();const f=e.currentTarget,name=f.elements.name.value.trim();if(!name){f.elements.name.setCustomValidity('Enter an item name.');f.elements.name.reportValidity();return}const data={name,description:f.elements.description.value.trim(),price:Number(f.elements.price.value),category:f.elements.category.value,available:f.elements.available.checked,photo:pendingPhoto};if(editingId!==null)items=items.map(i=>i.id===editingId?{...i,...data}:i);else items.push({...data,id:Date.now()});active='All items';if(mobileCategory!=='All')mobileCategory=data.category;$('#search').value='';$('#item-dialog').close();changed(editingId!==null?'Item updated in your preview':'New item added to your menu')};
$('#item-form').elements.name.oninput=e=>e.target.setCustomValidity('');
$('#delete-item').onclick=()=>$('#delete-dialog').showModal();$('#confirm-delete').onclick=()=>{items=items.filter(i=>i.id!==editingId);$('#delete-dialog').close();$('#item-dialog').close();changed('Item removed from the menu')};
function openName(mode){nameMode=mode;$('#name-form').reset();$('#name-error').textContent='';$('#name-title').textContent=mode==='menu'?'Rename menu':'Add category';$('#name-label').firstChild.textContent=mode==='menu'?'Menu name':'Category name';$('#name-input').value=mode==='menu'?menuName:'';$('#name-input').placeholder=mode==='menu'?'e.g. All-day menu':'e.g. Desserts';$('#name-dialog').showModal();$('#name-input').focus()}
$('#add-category').onclick=()=>openName('category');$('#rename-menu').onclick=()=>openName('menu');
$('#name-form').onsubmit=e=>{e.preventDefault();const name=$('#name-input').value.trim();if(!name){$('#name-error').textContent='Please enter a name.';return}if(nameMode==='category'&&['All','All items',...categories].some(c=>c.toLowerCase()===name.toLowerCase())){$('#name-error').textContent='That category name is already in use.';return}if(nameMode==='menu')menuName=name;else{categories.push(name);active=name;mobileCategory=name;$('#search').value=''}$('#name-dialog').close();changed(nameMode==='menu'?'Menu renamed':'Category added — ready for your first item')};
$('#preview-button').onclick=()=>openPreview();
$('#expand-preview').onclick=()=>openPreview();
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));render();
