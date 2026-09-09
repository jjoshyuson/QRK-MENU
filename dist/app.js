const paths={menu:'M4 5h16M4 12h16M4 19h16M8 3v4M16 10v4M9 17v4',spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',utensils:'M4 3v5a3 3 0 0 0 6 0V3M7 3v18M19 3c-3 3-4 6-4 9h4M19 3v18',edit:'m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Z',plus:'M12 5v14M5 12h14',search:'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',info:'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',close:'m6 6 12 12M6 18 18 6'};
Object.assign(paths,{mobile:'M7 2h10v20H7ZM11 19h2',tablet:'M4 2h16v20H4ZM11 19h2',desktop:'M2 3h20v14H2ZM12 17v4M7 21h10',expand:'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5'});
Object.assign(paths,{hamburger:'M4 6h16M4 12h16M4 18h16',home:'M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3Z',store:'M4 9v12h16V9M3 9l2-6h14l2 6M8 21v-6h8v6',users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',receipt:'M5 3h14v18l-3-2-4 2-4-2-3 2ZM8 8h8M8 12h8M8 16h5',settings:'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.04.08H10l-.04-.08a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1L3.92 14v-4L4 9.96a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.04-.08h4L14.08 4a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.11.38.32.72.6 1l.08.04v4L20 14a1.7 1.7 0 0 0-.6 1Z',sales:'M4 20V10M10 20V4M16 20v-7M22 20V7',arrow:'M5 12h14M13 6l6 6-6 6',qr:'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM15 14h2v2h-2ZM19 14h2v4h-2ZM14 19h4v2h-4ZM20 20h1v1h-1',check:'m5 12 4 4L19 6',download:'M12 3v12M7 10l5 5 5-5M5 21h14',link:'M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.15 1.15M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.15-1.15',more:'M5 12h.01M12 12h.01M19 12h.01',reorder:'M4 7h16M4 12h16M4 17h16',devices:'M4 4h14v11H4ZM9 20h4M20 8h2v12h-6v-3',logout:'M10 17l5-5-5-5M15 12H3M15 4h5v16h-5'});
const $=s=>document.querySelector(s);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if('scrollRestoration' in history)history.scrollRestoration='manual';
function icons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>{e.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[e.dataset.icon]||paths.menu}"/></svg>`})}
let categories=['Mains','Sides','Drinks','Breakfast','Desserts','Snacks','Specials','Platters'],active='All items',phoneActive='Mains',menuName='Main menu',editingId=null,nameMode='category',previewDevice='mobile',mobileCategory='Mains',mobileCustomer=false,mobileTable=false,pendingPhoto=null,photoVersion=0,toastTimer;
let items=[{id:1,name:'Chicken adobo',description:'Slow-braised chicken in soy, vinegar & garlic.',price:180,category:'Mains',available:true},{id:2,name:'Sinigang na baboy',description:'Pork & fresh vegetables in a tangy tamarind broth.',price:220,category:'Mains',available:true},{id:3,name:'Crispy pork sisig',description:'Sizzling chopped pork, calamansi & chili.',price:195,category:'Mains',available:true},{id:4,name:'Garlic fried rice',description:'Golden toasted garlic, perfectly fluffy rice.',price:55,category:'Sides',available:true},{id:5,name:'Lumpiang shanghai',description:'Crispy pork spring rolls with sweet chili sauce.',price:120,category:'Sides',available:false},{id:6,name:'Calamansi iced tea',description:'Freshly brewed tea with a bright citrus finish.',price:65,category:'Drinks',available:true}];
const samplePhotos=['adobo','sinigang','sisig','rice','lumpia','tea'];
items.forEach((i,index)=>{i.photo='/photos/'+samplePhotos[index]+'.jpg';i.options='';i.hidden=false});
function foodPhoto(i,cls=''){return i.photo?`<img class="${cls}" src="${esc(i.photo)}" alt="${esc(i.name)}" loading="lazy" decoding="async" width="600" height="450">`:`<span class="food-photo-empty ${cls}"><span data-icon="utensils"></span>No photo</span>`}
const price=n=>'₱'+Number(n).toLocaleString('en-PH',{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});
function stamp(i){return `<span class="item-stamp ${i.category==='Drinks'?'drinks':i.category==='Sides'?'sides':''}" aria-hidden="true">${esc(i.name.split(' ').slice(0,2).map(x=>x[0].toUpperCase()).join(''))}</span>`}
function announce(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800)}
function changed(message){$('#change-status').textContent='Preview updated';render();announce(message)}
function render(){
 $('#menu-name-display').textContent=menuName;$('#phone-menu-name').textContent=menuName;$('#total-count').textContent=items.length;$('#item-count').textContent=items.length;
 document.querySelector('[data-dashboard-nav="menu"] .nav-count').textContent=items.length;
 $('#category-tabs').innerHTML=['All items',...categories].map(c=>`<button class="category-tab ${active===c?'active':''}" data-category="${esc(c)}" aria-pressed="${active===c}">${esc(c)}<span>${c==='All items'?items.length:items.filter(i=>i.category===c).length}</span></button>`).join('');
 const q=$('#search').value.toLowerCase();const filtered=items.filter(i=>(active==='All items'||i.category===active)&&`${i.name} ${i.description}`.toLowerCase().includes(q));$('#results-label').textContent=`${filtered.length} item${filtered.length===1?'':'s'}`;
 $('#items').innerHTML=filtered.length?filtered.map(i=>`<div class="item-row ${i.available?'':'sold-out'} ${i.hidden?'hidden-item':''}"><button class="item-details" data-edit="${i.id}" aria-label="Edit ${esc(i.name)}">${stamp(i)}<div class="item-info"><strong>${esc(i.name)}</strong><p>${esc(i.description)}</p><span class="item-category">${esc(i.category)}${i.options?' · '+esc(i.options):''}</span></div></button><span class="item-price">${price(i.price)}</span><div class="availability"><button class="switch" role="switch" aria-label="${esc(i.name)} available" aria-checked="${i.available&&!i.hidden}" data-toggle="${i.id}" ${i.hidden?'disabled':''}></button><small>${i.hidden?'Hidden':i.available?'':'Sold out'}</small></div><button class="icon-button" data-edit="${i.id}" aria-label="Edit ${esc(i.name)}"><span data-icon="edit"></span></button></div>`).join(''):`<div class="empty"><strong>${q?'No matching items':'A fresh category awaits'}</strong>${q?'Try a different name or clear your search.':'Add your first item to bring this menu to life.'}</div>`;
 renderPhone();renderMobileMenu();icons();
}
function customerCategories(){return categories.filter(c=>items.some(i=>i.category===c&&!i.hidden))}
function renderPhone(){
 const shown=customerCategories();
 if(!shown.includes(phoneActive))phoneActive=shown[0]||'';
 $('#phone-tabs').innerHTML=shown.map(c=>`<button class="phone-tab" data-phone-category="${esc(c)}" aria-pressed="${phoneActive===c}">${esc(c)}</button>`).join('');
 $('#phone-items').innerHTML=shown.map(c=>`<section class="phone-section" data-menu-section="${esc(c)}"><h4>${esc(c)}</h4><div class="phone-dishes">${items.filter(i=>i.category===c&&!i.hidden).map(i=>`<article class="phone-item ${i.available?'':'sold-out'}"><div class="phone-photo">${foodPhoto(i)}${i.available?'':'<span class="photo-sold-label">Sold out</span>'}</div><div class="phone-item-copy"><strong>${esc(i.name)}</strong><b>${price(i.price)}</b></div></article>`).join('')}</div></section>`).join('')||'<p class="empty">Items coming soon.</p>';
 bindCategoryScroll($('.preview-panel .phone-content'));
 if($('#preview-dialog').open)syncExpanded();
}
// Keep navigation local to each scrolling menu, including the scaled preview.
function bindCategoryScroll(root){
 const mobile=root===document,scope=mobile?$('.mobile-menu-app'):root;
 const nav=scope.querySelector(mobile?'#mobile-category-tabs':'.phone-tabs');
 const sections=[...scope.querySelectorAll('[data-menu-section]')];
 const buttons=[...nav.querySelectorAll('button')];
 function select(name){
  buttons.forEach(b=>{const selected=(b.dataset.mobileCategory||b.dataset.phoneCategory)===name;b.setAttribute('aria-pressed',String(selected));b.classList.toggle('active',selected)});
  const button=buttons.find(b=>(b.dataset.mobileCategory||b.dataset.phoneCategory)===name);
  if(button){const r=button.getBoundingClientRect(),n=nav.getBoundingClientRect();const scale=n.width/nav.offsetWidth||1;nav.scrollLeft+=(r.left+r.width/2-n.left-n.width/2)/scale;}
  if(mobile)mobileCategory=name;else phoneActive=name;
 }
 function update(){
  if(!nav.getClientRects().length||!sections.length)return;
  nav.style.paddingLeft=Math.max(0,(nav.clientWidth-buttons[0].offsetWidth)/2)+'px';
  nav.style.paddingRight=Math.max(0,(nav.clientWidth-buttons.at(-1).offsetWidth)/2)+'px';
  const line=(mobile?nav.closest('.mobile-category-nav'):nav).getBoundingClientRect().bottom+16;
  let current=sections[0];
  for(const section of sections)if(section.getBoundingClientRect().top<=line)current=section;
  const scroller=mobile?document.scrollingElement:root;
  if(scroller.scrollHeight>scroller.clientHeight+1&&scroller.scrollTop+scroller.clientHeight>=scroller.scrollHeight-2)current=sections.at(-1);
  select(current.dataset.menuSection);
 }
 nav.onclick=e=>{
  const button=e.target.closest('button');if(!button)return;
  const name=button.dataset.mobileCategory||button.dataset.phoneCategory;
  const section=sections.find(s=>s.dataset.menuSection===name);if(!section)return;
  const scale=mobile?1:root.getBoundingClientRect().height/root.offsetHeight;
  const scroller=mobile?document.scrollingElement:root;
  const top=mobile?nav.closest('.mobile-category-nav').offsetHeight+12:root.getBoundingClientRect().top+nav.getBoundingClientRect().height+12;
  scroller.scrollTop+=(section.getBoundingClientRect().top-top)/scale;
  select(name);
 };
 if(mobile){document.onscroll=()=>requestAnimationFrame(update);window.addEventListener('resize',update,{signal:categoryResize.signal});}
 else root.onscroll=()=>requestAnimationFrame(update);
 requestAnimationFrame(update);
}
let categoryResize=new AbortController();
function renderMobileMenu(){
 const shownCategories=mobileCustomer?customerCategories():categories;
 if(!shownCategories.includes(mobileCategory))mobileCategory=shownCategories[0]||'';
 const app=$('.mobile-menu-app');app.dataset.mode=mobileCustomer?'customer':'owner';app.dataset.layout=mobileTable?'table':'grid';
 $('#mobile-menu-name').textContent=menuName;
 $('#mobile-studio-mode').textContent=mobileCustomer?'Customer preview':mobileTable?'Availability table':'Photo editor';
 $('#mobile-view-toggle').innerHTML=`<span data-icon="${mobileCustomer?'edit':'eye'}"></span><span>${mobileCustomer?'Back to editing':'Customer view'}</span>`;
 $('#mobile-view-toggle').setAttribute('aria-label',mobileCustomer?'Return to owner editing':'Show customer view');
 $('#mobile-view-toggle').setAttribute('aria-pressed',String(mobileCustomer));
 $('#mobile-table-toggle').innerHTML=`<span data-icon="${mobileTable?'mobile':'reorder'}"></span><span>${mobileTable?'Photo view':'Table view'}</span>`;
 $('#mobile-table-toggle').setAttribute('aria-label',mobileTable?'Show photo editor':'Show availability table');
 $('#mobile-table-toggle').setAttribute('aria-pressed',String(mobileTable));
 $('#mobile-category-tabs').innerHTML=shownCategories.map(c=>`<button type="button" data-mobile-category="${esc(c)}" aria-pressed="${c===mobileCategory}">${esc(c)}</button>`).join('');
 const visible=shownCategories;
 $('#mobile-menu-sections').innerHTML=visible.map(c=>{
  const dishes=items.filter(i=>i.category===c&&(!mobileCustomer||!i.hidden));
  if(mobileCustomer&&!dishes.length)return '';
  return `<section class="mobile-menu-section" data-menu-section="${esc(c)}"><div class="mobile-section-heading"><h3>${esc(c)}</h3><span>${dishes.length} item${dishes.length===1?'':'s'}</span></div><div class="mobile-dishes">${dishes.map(i=>`<article class="mobile-dish ${i.available&&!i.hidden?'':'is-sold-out'}"><div class="mobile-dish-photo">${foodPhoto(i)}${mobileCustomer?'':`<button class="mobile-icon-control" data-edit="${i.id}" aria-label="Edit ${esc(i.name)}"><span data-icon="edit"></span></button>`}${i.hidden?'<span class="photo-sold-label">Hidden</span>':i.available?'':'<span class="photo-sold-label">Sold out</span>'}</div><div class="mobile-dish-content"><h4>${esc(i.name)}</h4><strong>${price(i.price)}</strong>${mobileCustomer?'':`<button class="mobile-stock-button" type="button" role="switch" aria-checked="${i.available&&!i.hidden}" data-mobile-stock="${i.id}" aria-label="${esc(i.name)} available" ${i.hidden?'disabled':''}><span class="mobile-stock-dot"></span>${i.hidden?'Hidden':i.available?'Available':'Sold out'}</button>`}</div></article>`).join('')}${mobileCustomer?'':`<button class="mobile-add-in-category" data-mobile-add="${esc(c)}"><span data-icon="plus"></span>${dishes.length?'Add item':'Add first item'}</button>`}</div></section>`;
 }).join('')||'<div class="empty"><strong>Something delicious is on its way.</strong>Check back for menu items soon.</div>';
 $('#mobile-table-view').hidden=!mobileTable;
 $('#mobile-table-view').innerHTML=`<div class="mobile-table-heading"><div><p>QUICK AVAILABILITY</p><h2>${esc(menuName)}</h2></div><span>${items.filter(i=>i.available&&!i.hidden).length} of ${items.filter(i=>!i.hidden).length} available</span></div>${categories.map(category=>{const rows=items.filter(item=>item.category===category);if(!rows.length)return '';return `<section class="mobile-table-group"><div class="mobile-table-group-title"><h3>${esc(category)}</h3><span>${rows.length}</span></div>${rows.map(item=>`<article class="mobile-table-row ${item.hidden?'is-hidden':''}">${foodPhoto(item,'mobile-table-photo')}<div><strong>${esc(item.name)}</strong></div><button type="button" role="switch" aria-checked="${item.available&&!item.hidden}" data-mobile-stock="${item.id}" aria-label="${esc(item.name)} ${item.available?'available':'out of stock'}" ${item.hidden?'disabled':''}><span></span>${item.hidden?'Hidden':item.available?'Available':'Out of stock'}</button></article>`).join('')}</section>`}).join('')}`;
 icons(app);
 categoryResize.abort();categoryResize=new AbortController();bindCategoryScroll(document);
}
$('#mobile-view-toggle').onclick=()=>{mobileCustomer=!mobileCustomer;mobileTable=false;renderMobileMenu()};
$('#mobile-table-toggle').onclick=()=>{mobileTable=!mobileTable;mobileCustomer=false;renderMobileMenu()};
$('#mobile-add-item').onclick=()=>{active=categories.includes(mobileCategory)?mobileCategory:'All items';openItem()};
$('#mobile-add-category').onclick=()=>openName('category');
$('#mobile-rename-menu').onclick=()=>openName('menu');
document.addEventListener('click',e=>{
 const add=e.target.closest('[data-mobile-add]'),stock=e.target.closest('[data-mobile-stock]');
 
 if(add){active=add.dataset.mobileAdd;openItem()}
 if(stock){const item=items.find(i=>i.id===Number(stock.dataset.mobileStock));item.available=!item.available;changed(`${item.name} marked ${item.available?'available':'out of stock'}`);document.querySelector(`${mobileTable?'#mobile-table-view ':'#mobile-menu-sections '}[data-mobile-stock="${item.id}"]`)?.focus()}
});

const deviceWidths={mobile:390,tablet:768,desktop:1280};
function syncExpanded(){
 const scroll=$('#expanded-preview .phone-content')?.scrollTop||0;
 const clone=$('.preview-panel .phone').cloneNode(true);clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
 clone.dataset.device=previewDevice;clone.style.width=deviceWidths[previewDevice]+'px';
 $('#expanded-preview').replaceChildren(clone);clone.querySelector('.phone-content').scrollTop=scroll;bindCategoryScroll(clone.querySelector('.phone-content'));
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

let itemOpener=null;
function openItem(id=null){itemOpener=document.activeElement;editingId=id;const i=items.find(x=>x.id===id),f=$('#item-form');f.reset();f.elements.name.setCustomValidity('');photoVersion++;pendingPhoto=i?.photo||null;$('#photo-error').textContent='';$('#save-item').disabled=false;updatePhotoPreview();f.elements.category.innerHTML=categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');$('#dialog-title').textContent=i?'Edit menu item':'Add a menu item';$('#save-item').textContent=i?'Save changes':'Add item';$('#delete-item').hidden=!i;if(i){['name','description','price','category','options'].forEach(k=>f.elements[k].value=i[k]||'');f.elements.available.checked=i.available;f.elements.hidden.checked=Boolean(i.hidden)}else if(categories.includes(active))f.elements.category.value=active;$('#item-dialog').showModal();f.elements.name.focus()}
function updatePhotoPreview(){const img=$('#item-photo-preview');img.hidden=!pendingPhoto;$('#remove-photo').hidden=!pendingPhoto;if(pendingPhoto)img.src=pendingPhoto;else img.removeAttribute('src')}
$('#remove-photo').onclick=()=>{photoVersion++;pendingPhoto=null;$('#item-photo').value='';$('#photo-error').textContent='';$('#save-item').disabled=false;updatePhotoPreview()};
$('#item-dialog').addEventListener('close',()=>{photoVersion++;$('#save-item').disabled=false;requestAnimationFrame(()=>{if($('#item-dialog').open)return;const mobile=getComputedStyle($('.mobile-menu-app')).display!=='none';const target=itemOpener?.isConnected?itemOpener:document.querySelector((mobile?'.mobile-menu-app':'#items')+' [data-edit="'+editingId+'"]')||$(mobile?'#mobile-add-item':'#add-item');target?.focus()})});
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
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),toggle=e.target.closest('[data-toggle]'),cat=e.target.closest('[data-category]');const device=e.target.closest('[data-preview-device]'),view=e.target.closest('button[data-workspace-view]');if(device)openPreview(device.dataset.previewDevice);if(view)workspaceView(view.dataset.workspaceView);if(edit)openItem(Number(edit.dataset.edit));if(toggle){const i=items.find(i=>i.id===Number(toggle.dataset.toggle));i.available=!i.available;changed(`${i.name} marked ${i.available?'available':'sold out'}`);document.querySelector(`[data-toggle="${i.id}"]`)?.focus()}if(cat){active=cat.dataset.category;render();Array.from(document.querySelectorAll('[data-category]')).find(e=>e.dataset.category===active)?.focus()}if(e.target.closest('.close-dialog'))e.target.closest('dialog').close()});
$('#item-form').onsubmit=e=>{e.preventDefault();const f=e.currentTarget,name=f.elements.name.value.trim();if(!name){f.elements.name.setCustomValidity('Enter an item name.');f.elements.name.reportValidity();return}const data={name,description:f.elements.description.value.trim(),price:Number(f.elements.price.value),category:f.elements.category.value,options:f.elements.options.value.trim(),available:f.elements.available.checked,hidden:f.elements.hidden.checked,photo:pendingPhoto};if(editingId!==null)items=items.map(i=>i.id===editingId?{...i,...data}:i);else items.push({...data,id:Date.now()});active='All items';if(mobileCategory!=='All')mobileCategory=data.category;$('#search').value='';$('#item-dialog').close();changed(editingId!==null?'Item updated in your preview':'New item added to your menu')};
$('#item-form').elements.name.oninput=e=>e.target.setCustomValidity('');
$('#delete-item').onclick=()=>$('#delete-dialog').showModal();$('#confirm-delete').onclick=()=>{items=items.filter(i=>i.id!==editingId);$('#delete-dialog').close();$('#item-dialog').close();changed('Item removed from the menu')};
function openName(mode){nameMode=mode;$('#name-form').reset();$('#name-error').textContent='';$('#name-title').textContent=mode==='menu'?'Rename menu':'Add category';$('#name-label').firstChild.textContent=mode==='menu'?'Menu name':'Category name';$('#name-input').value=mode==='menu'?menuName:'';$('#name-input').placeholder=mode==='menu'?'e.g. All-day menu':'e.g. Desserts';$('#name-dialog').showModal();$('#name-input').focus()}
$('#add-category').onclick=()=>openName('category');$('#rename-menu').onclick=()=>openName('menu');
$('#name-form').onsubmit=e=>{e.preventDefault();const name=$('#name-input').value.trim();if(!name){$('#name-error').textContent='Please enter a name.';return}if(nameMode==='category'&&['All','All items',...categories].some(c=>c.toLowerCase()===name.toLowerCase())){$('#name-error').textContent='That category name is already in use.';return}if(nameMode==='menu')menuName=name;else{categories.push(name);active=name;mobileCategory=name;$('#search').value=''}$('#name-dialog').close();changed(nameMode==='menu'?'Menu renamed':'Category added — ready for your first item');if(nameMode==='category')requestAnimationFrame(()=>{if($('.mobile-menu-app').getClientRects().length)[...document.querySelectorAll('[data-mobile-category]')].find(b=>b.dataset.mobileCategory===name)?.click()})};
$('#preview-button').onclick=()=>openPreview();
$('#expand-preview').onclick=()=>openPreview();
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));render();

const dashboardLabels={dashboard:'Dashboard',profile:'Business profile',menu:'Menu studio',staff:'Staff access',orders:'Orders',settings:'Settings'};
function showDashboardPage(page){
 if(!dashboardLabels[page])return;
 const compact=matchMedia('(max-width:1100px)').matches;document.body.classList.remove('mobile-nav-open');
 if(page==='menu'&&compact){document.body.classList.remove('mobile-dashboard-open');mobileCustomer=false;mobileTable=false;renderMobileMenu();document.title='QRK MENU — Menu studio';window.scrollTo({top:0,behavior:'instant'});return}
 if(compact)document.body.classList.add('mobile-dashboard-open');
 document.querySelectorAll('[data-dashboard-page]').forEach(panel=>panel.hidden=panel.dataset.dashboardPage!==page);
 document.querySelectorAll('[data-dashboard-nav]').forEach(button=>button.classList.toggle('nav-active',button.dataset.dashboardNav===page));
 $('#current-page-label').textContent=dashboardLabels[page];
 document.title=`QRK MENU — ${dashboardLabels[page]}`;
 window.scrollTo({top:0,behavior:'instant'});
 if(page==='menu')requestAnimationFrame(()=>{render();fitPreview()});
}
document.querySelectorAll('[data-dashboard-nav],[data-dashboard-go]').forEach(button=>button.addEventListener('click',()=>showDashboardPage(button.dataset.dashboardNav||button.dataset.dashboardGo)));
function openMobileNav(){document.body.classList.add('mobile-nav-open');requestAnimationFrame(()=>$('#mobile-nav-close').focus())}
function closeMobileNav(){document.body.classList.remove('mobile-nav-open')}
$('#mobile-menu-nav-toggle').onclick=openMobileNav;$('#mobile-dashboard-menu').onclick=openMobileNav;$('#mobile-nav-close').onclick=closeMobileNav;$('#mobile-nav-backdrop').onclick=closeMobileNav;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('mobile-nav-open'))closeMobileNav()});

let storeOpen=true;
function updateStoreStatus(open){
 storeOpen=open;
 $('#store-status-label').textContent=open?'Open for orders':'Closed for orders';
 $('#settings-status-label').textContent=open?'Open for orders':'Closed for orders';
 $('#store-status-toggle').textContent=open?'Set as closed':'Open store';
 $('#accept-orders-toggle').checked=open;
 document.querySelectorAll('.status-icon').forEach(icon=>icon.classList.toggle('open',open));
}
$('#store-status-toggle').onclick=()=>{updateStoreStatus(!storeOpen);announce(storeOpen?'Store shown as open in this demo':'Store shown as closed in this demo')};
$('#accept-orders-toggle').onchange=e=>{updateStoreStatus(e.target.checked);announce(storeOpen?'Store shown as open in this demo':'Store shown as closed in this demo')};

document.querySelectorAll('.demo-action').forEach(button=>button.addEventListener('click',()=>announce(button.dataset.demoMessage||'Updated for this UI preview')));
$('#business-profile-form').onsubmit=e=>{e.preventDefault();announce('Business profile updated for this preview')};
document.querySelectorAll('.color-swatch').forEach(button=>button.onclick=()=>{document.querySelectorAll('.color-swatch').forEach(swatch=>{const selected=swatch===button;swatch.classList.toggle('selected',selected);swatch.setAttribute('aria-pressed',String(selected))});announce('Menu accent selected for this preview')});
$('#copy-menu-link').onclick=async()=>{try{await navigator.clipboard.writeText('https://qrk.menu/m/kusina-manila');announce('Sample menu link copied')}catch{announce('Sample link: qrk.menu/m/kusina-manila')}};

function renderCategoryOrder(){
 $('#category-order-list').innerHTML=categories.map((category,index)=>`<div class="category-order-row"><span aria-hidden="true">⋮⋮</span><span><strong>${esc(category)}</strong><small>${items.filter(item=>item.category===category).length} item${items.filter(item=>item.category===category).length===1?'':'s'}</small></span><span class="category-order-actions"><button type="button" data-category-move="up" data-category-index="${index}" aria-label="Move ${esc(category)} up" ${index===0?'disabled':''}>↑</button><button type="button" data-category-move="down" data-category-index="${index}" aria-label="Move ${esc(category)} down" ${index===categories.length-1?'disabled':''}>↓</button></span></div>`).join('');
}
$('#arrange-categories').onclick=()=>{renderCategoryOrder();$('#category-dialog').showModal()};
$('#category-order-list').onclick=e=>{const button=e.target.closest('[data-category-move]');if(!button)return;const index=Number(button.dataset.categoryIndex),next=button.dataset.categoryMove==='up'?index-1:index+1;if(next<0||next>=categories.length)return;[categories[index],categories[next]]=[categories[next],categories[index]];renderCategoryOrder();render();announce('Category order updated in this preview')};

$('#add-staff').onclick=()=>{$('#staff-form').reset();$('#staff-dialog').showModal();$('#staff-form').elements.firstName.focus()};
$('#staff-form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,first=form.elements.firstName.value.trim(),last=form.elements.lastName.value.trim(),email=form.elements.email.value.trim(),role=form.elements.role.value,access=[form.elements.orders.checked?'Orders':'',form.elements.menu.checked?'Menu':'',form.elements.reports.checked?'Reports':''].filter(Boolean).join(', ')||'No permissions';const initials=(first[0]+last[0]).toUpperCase();$('#staff-list').insertAdjacentHTML('beforeend',`<article class="staff-row" data-staff-row><span class="staff-avatar">${esc(initials)}</span><span class="staff-person"><strong>${esc(first+' '+last)}</strong><small>${esc(email)}</small></span><span><strong>${esc(role)}</strong><small>Limited</small></span><span class="permission-list">${esc(access)}</span><span class="staff-status active">Active</span><button class="button subtle staff-toggle" type="button">Disable</button></article>`);$('#staff-count').textContent=document.querySelectorAll('[data-staff-row]').length+1;$('#staff-dialog').close();announce('Demo staff account added')};
$('#staff-list').onclick=e=>{const button=e.target.closest('.staff-toggle');if(!button)return;const row=button.closest('[data-staff-row]'),status=row.querySelector('.staff-status'),disabled=status.classList.toggle('disabled');status.classList.toggle('active',!disabled);status.textContent=disabled?'Disabled':'Active';button.textContent=disabled?'Enable':'Disable';announce(`Staff access ${disabled?'disabled':'enabled'} in this preview`)};

const orderSamples={
 1048:{title:'#1048 · Table 7',time:'Placed 8 minutes ago',state:'Preparing',lines:[['2 × Chicken adobo','Extra rice','₱400'],['1 × Lumpiang shanghai','No special request','₱120'],['1 × Calamansi iced tea','Less ice','₱65']],total:'₱645'},
 1047:{title:'#1047 · Pickup',time:'Ana R. · placed 12 minutes ago',state:'Ready',lines:[['1 × Crispy pork sisig','Extra spicy','₱195'],['1 × Chicken adobo','No special request','₱180']],total:'₱375'},
 1046:{title:'#1046 · Table 3',time:'Placed 2 minutes ago',state:'New',lines:[['2 × Sinigang na baboy','','₱440'],['1 × Chicken adobo','','₱180'],['2 × Garlic fried rice','','₱110'],['1 × Calamansi iced tea','','₱65'],['Sample service charge','','₱25']],total:'₱820'},
 1045:{title:'#1045 · Table 5',time:'Placed 15 minutes ago',state:'Preparing',lines:[['1 × Sinigang na baboy','Less sour','₱220']],total:'₱220'},
 1044:{title:'#1044 · Table 2',time:'Completed at 6:42 PM',state:'Completed',lines:[['3 × Chicken adobo','','₱540']],total:'₱540'},
 1043:{title:'#1043 · Pickup',time:'Completed at 6:31 PM',state:'Completed',lines:[['1 × Crispy pork sisig','','₱195'],['1 × Lumpiang shanghai','','₱120']],total:'₱315'},
 1042:{title:'#1042 · Table 4',time:'Cancelled at 6:12 PM',state:'Cancelled',lines:[['1 × Chicken adobo','','₱180']],total:'₱180'}
};
const orderStates=['New','Preparing','Ready','Completed'];let selectedOrder=1048;
function selectOrder(id){
 const order=orderSamples[id];if(!order)return;selectedOrder=Number(id);
 document.querySelectorAll('[data-order-id]').forEach(button=>button.classList.toggle('selected',Number(button.dataset.orderId)===selectedOrder));
 const inboxState=document.querySelector(`[data-order-id="${selectedOrder}"] .order-state`);if(inboxState){inboxState.textContent=order.state;inboxState.className='order-state '+order.state.toLowerCase()}
 $('#order-detail-title').textContent=order.title;$('#order-detail-time').textContent=order.time;
 const state=$('#order-detail-state');state.textContent=order.state;state.className='order-state '+order.state.toLowerCase();
 $('#order-detail-lines').innerHTML=order.lines.map(line=>`<div><span><strong>${esc(line[0])}</strong><small>${esc(line[1]||'No special request')}</small></span><b>${esc(line[2])}</b></div>`).join('')+`<div class="order-total"><span>Sample total</span><strong>${esc(order.total)}</strong></div>`;
 const index=orderStates.indexOf(order.state);document.querySelectorAll('.status-progress span').forEach((step,i)=>{step.classList.toggle('done',index>=0&&i<index);step.classList.toggle('active',i===index)});
 $('#previous-order-status').disabled=index<=0;$('#next-order-status').disabled=index<0||index===orderStates.length-1;$('#next-order-status').textContent=index>=0&&index<orderStates.length-1?`Mark ${orderStates[index+1].toLowerCase()}`:'Order complete';
}
document.querySelectorAll('[data-order-id]').forEach(button=>button.onclick=()=>selectOrder(button.dataset.orderId));
document.querySelectorAll('[data-order-select]').forEach(button=>button.onclick=()=>{showDashboardPage('orders');selectOrder(button.dataset.orderSelect)});
document.querySelectorAll('[data-order-filter]').forEach(button=>button.onclick=()=>{const view=button.dataset.orderFilter;document.querySelectorAll('[data-order-filter]').forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active))});document.querySelectorAll('[data-order-view]').forEach(list=>list.hidden=list.dataset.orderView!==view);const first=document.querySelector(`[data-order-view="${view}"] [data-order-id]`);if(first)selectOrder(first.dataset.orderId)});
function moveOrderStatus(direction){const order=orderSamples[selectedOrder],index=orderStates.indexOf(order.state),next=index+direction;if(!order||next<0||next>=orderStates.length)return;order.state=orderStates[next];selectOrder(selectedOrder);announce(`Order ${order.title.split(' ')[0]} marked ${order.state.toLowerCase()} in this demo`)}
$('#previous-order-status').onclick=()=>moveOrderStatus(-1);$('#next-order-status').onclick=()=>moveOrderStatus(1);
selectOrder(1048);
if(matchMedia('(max-width:1100px)').matches){document.body.classList.add('mobile-dashboard-open');showDashboardPage('dashboard');requestAnimationFrame(()=>window.scrollTo(0,0))}
