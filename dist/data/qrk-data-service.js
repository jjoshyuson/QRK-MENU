import { resolveQrkConfig } from './qrk-config.js';

const ORDER_EVENT='qrk:demo-orders-changed',STORE_EVENT='qrk:demo-store-status-changed';
const allowedStatuses=['received','preparing','ready','completed','cancelled'];
const safeParse=(value,fallback)=>{try{return value?JSON.parse(value):fallback}catch{return fallback}};
const validOrders=value=>Array.isArray(value)?value.filter(order=>order&&order.id!=null&&order.orderNumber!=null&&allowedStatuses.includes(order.status)&&Array.isArray(order.items)):[];
const makeId=()=>globalThis.crypto?.randomUUID?.()||`demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const makeToken=()=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',bytes=new Uint8Array(6);crypto.getRandomValues(bytes);return[...bytes].map(byte=>chars[byte%chars.length]).join('')};

function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail}))}

class DemoDataService{
  constructor(config){this.mode='demo';this.environment=config.environment||'local';this.destinationSlug=config.destinationSlug||'kusina-manila';const suffix=`_${this.destinationSlug}`;this.orderKey=`qrk_demo_orders_v2${suffix}`;this.activeKey=`qrk_demo_active_order_v2${suffix}`;this.storeKey=`qrk_demo_store_open_v1${suffix}`}
  async getPublicMenu(){return null}
  async listOrders({fallback=[]}={}){const raw=localStorage.getItem(this.orderKey);if(raw!==null)return validOrders(safeParse(raw,[]));const seeded=validOrders(fallback);localStorage.setItem(this.orderKey,JSON.stringify(seeded));return seeded}
  async replaceOrders(orders){localStorage.setItem(this.orderKey,JSON.stringify(validOrders(orders)));emit(ORDER_EVENT,{key:this.orderKey})}
  async createOrder(input){
    const current=validOrders(safeParse(localStorage.getItem(this.orderKey),[])),now=new Date().toISOString(),prefix=this.destinationSlug==='salamat'?'SL':'KM';
    const order={...input,id:makeId(),orderNumber:`${prefix}-${Date.now().toString(36).slice(-5).toUpperCase()}`,verificationToken:makeToken(),trackingToken:makeId(),createdAt:now,updatedAt:now,status:'received',source:'customer-demo',events:[{status:'received',at:now,label:'Order received'}]};
    current.push(order);localStorage.setItem(this.orderKey,JSON.stringify(current));localStorage.setItem(this.activeKey,order.id);emit(ORDER_EVENT,{key:this.orderKey,order});return order;
  }
  async getActiveOrder(){const id=localStorage.getItem(this.activeKey);return id?(await this.listOrders()).find(order=>String(order.id)===id)||null:null}
  async getOrderStatus(){return this.getActiveOrder()}
  async transitionOrder({orderId,expectedStatus,nextStatus,handoffToken}){
    const orders=await this.listOrders(),order=orders.find(entry=>String(entry.id)===String(orderId));if(!order)throw new Error('Order not found');
    if(order.status!==expectedStatus)throw new Error('Order status changed; refresh and try again');
    if(nextStatus==='completed'&&String(handoffToken||'').trim().toLowerCase()!==String(order.verificationToken||'').trim().toLowerCase())throw new Error('Handoff token does not match');
    const labels={preparing:'Started preparing',ready:'Marked ready',completed:'Handoff completed',cancelled:'Order cancelled'},now=new Date().toISOString();
    order.status=nextStatus;order.updatedAt=now;if(nextStatus==='completed')order.handoffVerifiedAt=now;order.events=[...(order.events||[]),{status:nextStatus,at:now,label:labels[nextStatus]}];
    await this.replaceOrders(orders);return order;
  }
  async getStoreOpen(){return localStorage.getItem(this.storeKey)!=='false'}
  async setStoreOpen(open){localStorage.setItem(this.storeKey,String(Boolean(open)));emit(STORE_EVENT,{key:this.storeKey,open:Boolean(open)});return Boolean(open)}
  subscribe({onOrdersChanged,onStoreChanged}={}){
    const storage=event=>{if(event.key===this.orderKey)onOrdersChanged?.();if(event.key===this.storeKey)onStoreChanged?.()};
    const orders=()=>onOrdersChanged?.(),store=()=>onStoreChanged?.();
    addEventListener('storage',storage);addEventListener(ORDER_EVENT,orders);addEventListener(STORE_EVENT,store);
    return()=>{removeEventListener('storage',storage);removeEventListener(ORDER_EVENT,orders);removeEventListener(STORE_EVENT,store)};
  }
}

class SupabaseDataService{
  constructor(config){this.mode='supabase';this.config=config;this.environment=config.environment;this.destinationSlug=config.destinationSlug;this.activeKey=`qrk_demo_active_order_v1_${this.destinationSlug}`;this.channel=null;this.timer=null}
  headers(authenticated=false){const token=authenticated&&(this.config.staffAccessToken||globalThis.QRK_ACCESS_TOKEN)?(this.config.staffAccessToken||globalThis.QRK_ACCESS_TOKEN):this.config.supabasePublishableKey;return{'content-type':'application/json','apikey':this.config.supabasePublishableKey,'authorization':`Bearer ${token}`}}
  async request(path,{body,authenticated=false,method='POST'}={}){const response=await fetch(`${this.config.supabaseUrl}${path}`,{method,headers:this.headers(authenticated),body:body===undefined?undefined:JSON.stringify(body)});if(!response.ok){const detail=await response.text();throw new Error(`Backend request failed (${response.status}): ${detail.slice(0,240)}`)}return response.status===204?null:response.json()}
  rpc(name,body,authenticated=false){return this.request(`/rest/v1/rpc/${name}`,{body,authenticated})}
  async getPublicMenu(){
    const result=await this.rpc('get_public_menu',{p_destination_slug:this.destinationSlug});
    for(const category of result?.menu?.categories||[])for(const item of category.items||[])if(item.photo?.path){
      const response=await fetch(`${this.config.supabaseUrl}/storage/v1/object/authenticated/${encodeURIComponent(item.photo.bucket)}/${item.photo.path.split('/').map(encodeURIComponent).join('/')}`,{headers:this.headers()});
      if(response.ok)item.photo.url=URL.createObjectURL(await response.blob());else item.photo=null;
    }
    return result;
  }
  async listOrders(){
    const rows=await this.request(`/rest/v1/orders?business_id=eq.${encodeURIComponent(this.config.businessId)}&select=id,order_number,verification_token,created_at,updated_at,fulfillment_type,table_number,customer_label,status,subtotal_minor,handoff_verified_at,notes,order_items(id,item_name,quantity,unit_price_minor,line_total_minor,notes,order_item_options(group_name,option_name,price_delta_minor)),order_status_events(to_status,label,created_at)&order=created_at.asc`,{authenticated:true,method:'GET'});
    return rows.map(row=>({id:row.id,orderNumber:row.order_number,verificationToken:row.verification_token,createdAt:row.created_at,updatedAt:row.updated_at,fulfillmentType:row.fulfillment_type,tableNumber:row.table_number,customerLabel:row.customer_label,status:row.status,subtotalMinor:row.subtotal_minor,handoffVerifiedAt:row.handoff_verified_at,notes:row.notes,items:(row.order_items||[]).map(item=>({itemId:item.id,name:item.item_name,quantity:item.quantity,unitPriceMinor:item.unit_price_minor,lineTotalMinor:item.line_total_minor,notes:item.notes,selectedOptions:(item.order_item_options||[]).map(option=>option.price_delta_minor?`${option.option_name} +${option.price_delta_minor}`:option.option_name)})),events:(row.order_status_events||[]).map(event=>({status:event.to_status,label:event.label,at:event.created_at}))}));
  }
  async createOrder(input){
    return this.rpc('create_public_order',{p_destination_slug:this.destinationSlug,p_request_id:input.idempotencyKey,p_fulfillment:input.fulfillmentType,p_table_number:input.tableNumber||null,p_customer_label:input.customerLabel||null,p_order_notes:input.notes||'',p_line_items:input.items.map(item=>({itemId:item.itemId,quantity:item.quantity,optionIds:(item.selectedOptions||[]).map(option=>option.id).filter(Boolean),notes:item.notes||''}))});
  }
  getActiveOrder(){const tracking=safeParse(localStorage.getItem(this.activeKey),null);return tracking?this.getOrderStatus(tracking):null}
  getOrderStatus(tracking){return this.rpc('get_public_order_status',{p_destination_slug:this.destinationSlug,p_order_number:tracking.orderNumber,p_tracking_token:tracking.trackingToken})}
  async transitionOrder({orderId,expectedStatus,nextStatus,handoffToken}){return this.rpc('transition_order_status',{p_order_id:orderId,p_expected_status:expectedStatus,p_next_status:nextStatus,p_handoff_token:handoffToken||null},true)}
  async getStoreOpen(){const result=await this.getPublicMenu();return result?.business?.openForOrders===true}
  setStoreOpen(open){return this.rpc('set_business_ordering_open',{p_business_id:this.config.businessId,p_open:Boolean(open)},true)}
  rememberActiveOrder(order){localStorage.setItem(this.activeKey,JSON.stringify({orderNumber:order.orderNumber,trackingToken:order.trackingToken}))}
  subscribe({onOrdersChanged,onStoreChanged}={}){
    const refresh=()=>{onOrdersChanged?.();onStoreChanged?.()};
    const focus=()=>{if(document.visibilityState==='visible')refresh()};addEventListener('online',refresh);addEventListener('focus',refresh);addEventListener('visibilitychange',focus);
    this.timer=setInterval(refresh,Math.max(5000,this.config.reconciliationIntervalMs||15000));
    const client=globalThis.QRK_SUPABASE_CLIENT;
    if(client&&this.config.staffAccessToken&&this.config.businessId){
      client.realtime?.setAuth?.(this.config.staffAccessToken);
      this.channel=client.channel(`business:${this.config.businessId}:orders`,{config:{private:true}}).on('broadcast',{event:'order_changed'},()=>onOrdersChanged?.()).subscribe(status=>{if(status==='SUBSCRIBED')onOrdersChanged?.()});
    }
    return()=>{clearInterval(this.timer);removeEventListener('online',refresh);removeEventListener('focus',refresh);removeEventListener('visibilitychange',focus);if(this.channel)client?.removeChannel?.(this.channel)};
  }
}

export function createQrkDataService(overrides={}){
  const config=resolveQrkConfig(overrides);
  const hosted=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl||'');
  const local=config.environment==='local'&&/^http:\/\/(127\.0\.0\.1|localhost|(?:\d{1,3}\.){3}\d{1,3}):54321$/i.test(config.supabaseUrl||'');
  const configured=(hosted||local)&&(/^(sb_publishable_|eyJ)/i.test(config.supabasePublishableKey||''));
  return configured?new SupabaseDataService(config):new DemoDataService(config);
}
