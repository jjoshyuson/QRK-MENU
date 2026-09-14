import {DEVELOPMENT_CLIENTS} from '../data/qrk-service-presets.js';

const DEVICE_COUNT=10;
const devices=Array.from({length:DEVICE_COUNT},(_,index)=>({id:`sim-${String(index+1).padStart(2,'0')}`,label:`Device ${index+1}`}));
const $=selector=>document.querySelector(selector);
const state={page:0,pageSize:4,menuUrl:new URL('/menu/?business=kusina-manila',location.origin).href,business:'kusina-manila'};

function normalizedMenuUrl(value){
  try{
    const url=new URL(value,location.origin);
    if(!/^https?:$/.test(url.protocol))throw new Error();
    url.hash='';url.searchParams.delete('simDevice');return url;
  }catch{throw new Error('Enter a valid HTTP or HTTPS menu URL.');}
}
function deviceUrl(device){const url=normalizedMenuUrl(state.menuUrl);url.searchParams.set('simDevice',device.id);return url.href}
function currentDevices(){const start=state.page*state.pageSize;return devices.slice(start,start+state.pageSize)}
function columnCount(){if(state.pageSize===1)return 1;if(state.pageSize<=4)return 2;if(state.pageSize<=9)return 3;return 5}
function renderBusinessTabs(){
  $('#business-tabs').innerHTML=DEVELOPMENT_CLIENTS.map(client=>`<button type="button" role="radio" aria-checked="${state.business===client.slug}" data-business="${client.slug}">${client.businessName}</button>`).join('');
}
function renderDevices(){
  const visible=currentDevices(),start=state.page*state.pageSize;
  $('#device-grid').style.setProperty('--grid-columns',columnCount());
  $('#device-grid').innerHTML=visible.map(device=>`<article class="device-tile"><header><div><span class="device-dot" aria-hidden="true"></span><strong>${device.label}</strong><small>${device.id}</small></div><button type="button" data-reload="${device.id}" aria-label="Reload ${device.label}" title="Reload ${device.label}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11a8.1 8.1 0 1 0-2.4 5.8M20 4v7h-7"/></svg></button></header><div class="phone-viewport"><iframe title="${device.label} customer menu" src="${deviceUrl(device)}" loading="eager"></iframe></div></article>`).join('');
  const pageCount=Math.ceil(DEVICE_COUNT/state.pageSize),end=start+visible.length;
  $('#visible-summary').textContent=`Devices ${start+1}–${end}`;
  $('#page-label').textContent=`Page ${state.page+1} of ${pageCount}`;
  $('#page-dots').innerHTML=Array.from({length:pageCount},(_,index)=>`<i class="${index===state.page?'active':''}"></i>`).join('');
  $('#previous-page').disabled=state.page===0;$('#next-page').disabled=state.page>=pageCount-1;
  requestAnimationFrame(sizePhones);
}
function sizePhones(){document.querySelectorAll('.phone-viewport').forEach(viewport=>viewport.style.setProperty('--phone-scale',String(viewport.clientWidth/390)))}
function applyUrl(value,business=''){
  const url=normalizedMenuUrl(value);state.menuUrl=url.href;state.business=business||url.searchParams.get('business')||'';state.page=0;$('#menu-url').value=state.menuUrl;renderBusinessTabs();renderDevices();$('#tester-status').textContent=`Opened ${state.business?DEVELOPMENT_CLIENTS.find(client=>client.slug===state.business)?.businessName||'menu':'menu URL'} on all 10 isolated devices.`;
}

$('#url-form').addEventListener('submit',event=>{event.preventDefault();try{applyUrl($('#menu-url').value)}catch(error){$('#tester-status').textContent=error.message;$('#menu-url').focus()}});
$('#business-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-business]');if(!button)return;applyUrl(new URL(`/menu/?business=${button.dataset.business}`,location.origin),button.dataset.business)});
$('#page-size').addEventListener('change',event=>{state.pageSize=Number(event.target.value);state.page=0;renderDevices();$('#tester-status').textContent=`Showing up to ${state.pageSize} device ${state.pageSize===1?'tile':'tiles'} per page.`});
$('#previous-page').addEventListener('click',()=>{if(state.page>0){state.page--;renderDevices();$('#device-grid').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}});
$('#next-page').addEventListener('click',()=>{if((state.page+1)*state.pageSize<DEVICE_COUNT){state.page++;renderDevices();$('#device-grid').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}});
$('#device-grid').addEventListener('click',event=>{const button=event.target.closest('[data-reload]');if(!button)return;const frame=[...document.querySelectorAll('.device-tile iframe')].find(item=>item.src.includes(`simDevice=${button.dataset.reload}`));if(frame){frame.src=deviceUrl(devices.find(device=>device.id===button.dataset.reload));$('#tester-status').textContent=`Reloaded ${button.dataset.reload}. Its isolated browser state was preserved.`}});

$('#menu-url').value=state.menuUrl;renderBusinessTabs();renderDevices();
new ResizeObserver(sizePhones).observe($('#device-grid'));
