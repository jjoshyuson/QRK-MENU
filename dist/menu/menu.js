const ORDER_KEY='qrk_demo_orders_v1';
const CART_KEY='qrk_demo_cart_v1';
const ACTIVE_KEY='qrk_demo_active_order_v1';
const STORE_KEY='qrk_demo_store_open_v1';
const money=new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0});
const menu=[
  {id:'adobo',category:'Mains',name:'Chicken adobo',description:'Soy-vinegar braised chicken with steamed rice.',price:18000,photo:'/photos/adobo.jpg',available:true,options:[{name:'Serving',required:true,choices:[['Regular',0],['Large',6500]]},{name:'Add-ons',choices:[['Fried egg',2500],['Extra rice',3000]],multiple:true}]},
  {id:'sinigang',category:'Mains',name:'Sinigang na baboy',description:'Pork and vegetables in a bright tamarind broth.',price:22000,photo:'/photos/sinigang.jpg',available:true,options:[{name:'Serving',required:true,choices:[['Solo',0],['For two',14000]]},{name:'Add-on',choices:[['Extra rice',3000]],multiple:true}]},
  {id:'sisig',category:'Mains',name:'Crispy pork sisig',description:'Sizzling chopped pork with calamansi and onion.',price:19500,photo:'/photos/sisig.jpg',available:true,options:[{name:'Spice level',required:true,choices:[['Mild',0],['Spicy',0]]},{name:'Add-ons',choices:[['Fried egg',2500],['Extra rice',3000]],multiple:true}]},
  {id:'rice',category:'Sides',name:'Garlic fried rice',description:'Toasted garlic rice, good for one.',price:5500,photo:'/photos/rice.jpg',available:true,options:[{name:'Serving',required:true,choices:[['Single',0],['Sharing',5000]]}]},
  {id:'lumpia',category:'Sides',name:'Lumpiang shanghai',description:'Crisp pork spring rolls with sweet chili dip.',price:12000,photo:'/photos/lumpia.jpg',available:false,options:[]},
  {id:'tea',category:'Drinks',name:'Calamansi iced tea',description:'House-brewed tea with fresh calamansi.',price:6500,photo:'/photos/tea.jpg',available:true,options:[{name:'Size',required:true,choices:[['Regular',0],['Large',2000]]},{name:'Sweetness',required:true,choices:[['Regular sugar',0],['Less sugar',0],['No sugar',0]]}]}
];
const categories=[...new Set(menu.map(item=>item.category))];
const $=selector=>document.querySelector(selector);
const safeParse=(value,fallback)=>{try{return value?JSON.parse(value):fallback}catch{return fallback}};
const readCart=()=>{const value=safeParse(localStorage.getItem(CART_KEY),[]);return Array.isArray(value)?value:[]};
let cart=readCart(),selectedItem=null,itemQuantity=1,editingIndex=-1;
const storeOpen=()=>new URLSearchParams(location.search).get('closed')!=='1'&&localStorage.getItem(STORE_KEY)!=='false';
const format=minor=>money.format(minor/100);
const escapeText=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function persistCart(){try{localStorage.setItem(CART_KEY,JSON.stringify(cart));return true}catch{return false}}
function cartTotals(){return{count:cart.reduce((sum,line)=>sum+line.quantity,0),subtotal:cart.reduce((sum,line)=>sum+line.lineTotalMinor,0)}}
function renderMenu(filter=''){
  const query=filter.trim().toLowerCase();
  const visible=menu.filter(item=>`${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query));
  $('#item-count').textContent=`${visible.length} ${visible.length===1?'item':'items'}`;
  $('#categories').innerHTML=query?'':categories.filter(category=>visible.some(item=>item.category===category)).map((category,index)=>`<a class="${index?'':'active'}" href="#${category.toLowerCase()}" ${index?'':'aria-current="true"'}>${escapeText(category)}</a>`).join('');
  $('#menu-sections').innerHTML='';
  categories.forEach(category=>{
    const items=visible.filter(item=>item.category===category);if(!items.length)return;
    const section=document.createElement('section');section.className='menu-section';section.id=category.toLowerCase();section.setAttribute('aria-labelledby',`${section.id}-title`);
    section.innerHTML=`<div class="section-heading"><h3 id="${section.id}-title">${escapeText(category)}</h3><span>${items.length} ${items.length===1?'item':'items'}</span></div><div class="dish-grid"></div>`;
    items.forEach(item=>{
      const card=$('#dish-template').content.firstElementChild.cloneNode(true);const button=card.querySelector('button');const img=card.querySelector('img');
      img.src=item.photo;img.alt=item.name;card.querySelector('h4').textContent=item.name;card.querySelector('p').textContent=item.description;card.querySelector('strong').textContent=format(item.price);
      if(!item.available){card.classList.add('sold-out');card.querySelector('.sold-label').classList.remove('hidden');button.disabled=true;button.setAttribute('aria-label',`${item.name}, sold out`)}else button.addEventListener('click',()=>openItem(item));
      section.querySelector('.dish-grid').append(card);
    });$('#menu-sections').append(section);
  });
  $('#menu-empty').classList.toggle('hidden',visible.length>0);bindCategoryLinks();
}
function bindCategoryLinks(){
  const links=[...document.querySelectorAll('.categories a')],sections=links.map(link=>document.querySelector(link.hash)).filter(Boolean);
  const activate=id=>links.forEach(link=>{const on=link.hash===`#${id}`;link.classList.toggle('active',on);on?link.setAttribute('aria-current','true'):link.removeAttribute('aria-current')});
  links.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();history.replaceState(null,'',link.hash);document.querySelector(link.hash)?.scrollIntoView({behavior:'smooth',block:'start'});activate(link.hash.slice(1))}));
  window.onscroll=()=>{if(!sections.length)return;const marker=scrollY+70;let current=sections[0];sections.forEach(section=>{if(section.offsetTop<=marker)current=section});if(innerHeight+scrollY>=document.documentElement.scrollHeight-2)current=sections.at(-1);activate(current.id)};
}
function optionPrice(){return[...$('#item-options').querySelectorAll('input:checked')].reduce((sum,input)=>sum+Number(input.dataset.price),0)}
function updateItemTotal(){if(!selectedItem)return;$('#item-quantity').textContent=itemQuantity;$('#item-minus').disabled=itemQuantity<=1;$('#item-plus').disabled=itemQuantity>=20;$('#item-total').textContent=format((selectedItem.price+optionPrice())*itemQuantity)}
function openItem(item,index=-1){
  if(!storeOpen())return showStoreNotice();selectedItem=item;editingIndex=index;const existing=index>=0?cart[index]:null;itemQuantity=existing?.quantity||1;
  $('#item-name').textContent=item.name;$('#item-description').textContent=item.description;$('#item-price').textContent=format(item.price);$('#item-photo').src=item.photo;$('#item-photo').alt=item.name;$('#item-notes').value=existing?.notes||'';
  $('#item-options').innerHTML=item.options.map((group,groupIndex)=>`<fieldset class="option-group"><legend>${escapeText(group.name)} <span>${group.required?'Choose one':'Optional'}</span></legend>${group.choices.map((choice,choiceIndex)=>{const id=`option-${groupIndex}-${choiceIndex}`,checked=existing?existing.selectedOptions.some(option=>option.name===choice[0]):(!group.multiple&&choiceIndex===0);return`<label for="${id}"><span><input id="${id}" type="${group.multiple?'checkbox':'radio'}" name="group-${groupIndex}" value="${escapeText(choice[0])}" data-group="${escapeText(group.name)}" data-price="${choice[1]}" ${checked?'checked':''}>${escapeText(choice[0])}</span><span>${choice[1]?`+${format(choice[1])}`:'Included'}</span></label>`}).join('')}</fieldset>`).join('');
  $('#add-item span').textContent=existing?'Update item':'Add to order';$('#item-options').onchange=updateItemTotal;updateItemTotal();$('#item-dialog').showModal();
}
function renderCart(){
  const totals=cartTotals();$('#header-count').textContent=totals.count;$('#header-order').setAttribute('aria-label',`Open cart, ${totals.count} ${totals.count===1?'item':'items'}`);$('#cart-count').textContent=totals.count;$('#cart-label').textContent=totals.count===1?'item':'items';$('#cart-subtotal').textContent=format(totals.subtotal);$('#checkout-subtotal').textContent=format(totals.subtotal);$('#cart-bar').classList.toggle('hidden',!totals.count);
  $('#cart-items').innerHTML=cart.map((line,index)=>`<article class="cart-item"><div class="cart-item-head"><div><h3>${escapeText(line.name)}</h3><p>${escapeText(line.selectedOptions.map(option=>option.name).join(' · ')||'Standard')}</p>${line.notes?`<p>Note: ${escapeText(line.notes)}</p>`:''}</div><strong>${format(line.lineTotalMinor)}</strong></div><div><div class="stepper"><button type="button" data-action="minus" data-index="${index}" aria-label="Decrease ${escapeText(line.name)} quantity">−</button><output>${line.quantity}</output><button type="button" data-action="plus" data-index="${index}" aria-label="Increase ${escapeText(line.name)} quantity">+</button></div><button class="remove-item" type="button" data-action="edit" data-index="${index}">Edit</button><button class="remove-item" type="button" data-action="remove" data-index="${index}">Remove</button></div></article>`).join('');
  $('#cart-empty').classList.toggle('hidden',cart.length>0);$('#checkout-fields').classList.toggle('hidden',!cart.length);$('#cart-action').classList.toggle('hidden',!cart.length);$('#submit-order').disabled=!storeOpen();
}
function openCart(){renderCart();$('#checkout-error').classList.add('hidden');$('#cart-dialog').showModal()}
function showStoreNotice(){const notice=$('#store-notice');notice.innerHTML='<h2>Ordering is paused</h2><p>You can still browse the menu, but Kusina Manila is not accepting demo orders right now.</p>';notice.classList.remove('hidden');renderCart()}
function addSelectedItem(){
  const options=[...$('#item-options').querySelectorAll('input:checked')].map(input=>({group:input.dataset.group,name:input.value,priceMinor:Number(input.dataset.price)})),unitPriceMinor=selectedItem.price+options.reduce((sum,option)=>sum+option.priceMinor,0);
  const line={itemId:selectedItem.id,name:selectedItem.name,quantity:itemQuantity,unitPriceMinor,selectedOptions:options,lineTotalMinor:unitPriceMinor*itemQuantity,notes:$('#item-notes').value.trim()};
  if(editingIndex>=0)cart[editingIndex]=line;else cart.push(line);persistCart();renderCart();$('#item-dialog').close();
}
function updateLine(index,delta){const line=cart[index];if(!line)return;line.quantity=Math.max(1,Math.min(20,line.quantity+delta));line.lineTotalMinor=line.unitPriceMinor*line.quantity;persistCart();renderCart()}
function makeId(){return globalThis.crypto?.randomUUID?.()||`demo-${Date.now()}-${Math.random().toString(16).slice(2)}`}
function makeToken(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',bytes=new Uint8Array(6);crypto.getRandomValues(bytes);return[...bytes].map(byte=>chars[byte%chars.length]).join('')}
function createOrder(){
  const fulfillment=$('input[name="fulfillment"]:checked').value,table=$('#table-number').value.trim(),error=$('#checkout-error');
  if(!cart.length)return;if(!storeOpen()){error.textContent='Ordering is paused. Your cart is saved so you can try again later.';error.classList.remove('hidden');return}if(fulfillment==='table'&&!/^\d{1,3}$/.test(table)){error.textContent='Enter the table number shown at your seat.';error.classList.remove('hidden');$('#table-number').focus();return}
  const now=new Date().toISOString(),token=makeToken(),number=`KM-${Date.now().toString(36).slice(-5).toUpperCase()}`,order={id:makeId(),orderNumber:number,verificationToken:token,createdAt:now,updatedAt:now,fulfillmentType:fulfillment,tableNumber:fulfillment==='table'?table:null,customerLabel:$('#customer-label').value.trim()||undefined,status:'received',items:cart.map(line=>({...line})),subtotalMinor:cartTotals().subtotal,notes:$('#order-notes').value.trim(),source:'customer-demo',events:[{status:'received',at:now,label:'Order received'}]};
  try{const current=safeParse(localStorage.getItem(ORDER_KEY),[]),orders=Array.isArray(current)?current:[];orders.push(order);localStorage.setItem(ORDER_KEY,JSON.stringify(orders));localStorage.setItem(ACTIVE_KEY,order.id);localStorage.removeItem(CART_KEY);window.dispatchEvent(new CustomEvent('qrk:demo-orders-changed',{detail:{key:ORDER_KEY,order}}));window.dispatchEvent(new CustomEvent('qrk-demo-orders-changed',{detail:{key:ORDER_KEY,order}}));window.dispatchEvent(new StorageEvent('storage',{key:ORDER_KEY,newValue:JSON.stringify(orders),storageArea:localStorage}));cart=[];renderCart();$('#cart-dialog').close();showConfirmation(order)}catch{error.textContent='We could not save this demo order. Your cart is safe—check browser storage and try again.';error.classList.remove('hidden')}
}
function verificationMark(token){let seed=[...token].reduce((sum,char)=>sum+char.charCodeAt(0),0);return Array.from({length:49},(_,index)=>{seed=(seed*9301+49297)%233280;const finder=index<15&&(index%7<3||Math.floor(index/7)<3);return`<i class="${finder||seed/233280>.49?'on':''}"></i>`}).join('')}
const statusLabels={received:'Received',preparing:'Preparing',ready:'Ready',completed:'Completed'};
function showConfirmation(order){$('#confirmation-number').textContent=order.orderNumber;$('#confirmation-token').textContent=order.verificationToken;$('#verification-mark').innerHTML=verificationMark(order.verificationToken);renderProgress(order);if(!$('#confirmation-dialog').open)$('#confirmation-dialog').showModal()}
function renderProgress(order){const statuses=Object.keys(statusLabels),at=statuses.indexOf(order.status);$('#order-error').classList.toggle('hidden',order.status!=='cancelled');if(order.status==='cancelled')$('#order-error').textContent='This demo order was cancelled. Please speak with staff if you need help.';$('#order-progress').innerHTML=statuses.map((status,index)=>`<div class="progress-step ${index<=at?'done':''} ${index===at?'current':''}">${statusLabels[status]}</div>`).join('')}
function readActiveOrder(){const id=localStorage.getItem(ACTIVE_KEY);if(!id)return null;const orders=safeParse(localStorage.getItem(ORDER_KEY),[]);return Array.isArray(orders)?orders.find(order=>order.id===id)||null:null}
function refreshActive(show=false){const order=readActiveOrder(),panel=$('#active-order');if(!order){panel.classList.add('hidden');if(show){$('#order-error').textContent='This order is no longer available in local demo storage.';$('#order-error').classList.remove('hidden')}return}panel.innerHTML=`<div><h2>${escapeText(order.orderNumber)} · ${escapeText(statusLabels[order.status]||'Cancelled')}</h2><p>${order.status==='completed'?'Order completed':order.status==='ready'?'Ready for pickup or table service':`Last updated ${new Date(order.updatedAt).toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit'})}`}</p></div><button class="secondary-button" type="button">View</button>`;panel.classList.remove('hidden');panel.querySelector('button').onclick=()=>showConfirmation(order);if(show&&$('#confirmation-dialog').open)showConfirmation(order)}
$('#menu-search').addEventListener('input',event=>renderMenu(event.target.value));$('#clear-search').addEventListener('click',()=>{$('#menu-search').value='';renderMenu();$('#menu-search').focus()});
$('#header-order').addEventListener('click',openCart);$('#open-cart').addEventListener('click',openCart);$('#item-minus').addEventListener('click',()=>{itemQuantity--;updateItemTotal()});$('#item-plus').addEventListener('click',()=>{itemQuantity++;updateItemTotal()});$('#add-item').addEventListener('click',event=>{event.preventDefault();addSelectedItem()});
$('#cart-items').addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;const index=Number(button.dataset.index);if(button.dataset.action==='remove'){cart.splice(index,1);persistCart();renderCart()}else if(button.dataset.action==='edit'){const item=menu.find(entry=>entry.id===cart[index].itemId);$('#cart-dialog').close();openItem(item,index)}else updateLine(index,button.dataset.action==='plus'?1:-1)});
document.querySelectorAll('input[name="fulfillment"]').forEach(input=>input.addEventListener('change',()=>{const table=input.value==='table'&&input.checked;$('#table-label').classList.toggle('hidden',!table);$('#table-number').classList.toggle('hidden',!table)}));
$('#submit-order').addEventListener('click',event=>{event.preventDefault();createOrder()});$('#close-confirmation').addEventListener('click',()=>$('#confirmation-dialog').close());$('#refresh-status').addEventListener('click',()=>refreshActive(true));
addEventListener('storage',event=>{if([ORDER_KEY,STORE_KEY].includes(event.key)){if(!storeOpen())showStoreNotice();else $('#store-notice').classList.add('hidden');refreshActive(true)}});addEventListener('qrk:demo-orders-changed',()=>refreshActive(true));addEventListener('qrk-demo-orders-changed',()=>refreshActive(true));
renderMenu();renderCart();if(!storeOpen())showStoreNotice();refreshActive();setInterval(()=>refreshActive($('#confirmation-dialog').open),4000);
