const DEVICE_KEY='qrk_table_device_v2';
const makeId=()=>globalThis.crypto?.randomUUID?.()||`demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export class QrkTableSessionService{
  constructor({businessSlug,profile}){this.businessSlug=businessSlug;this.profile=profile;this.deviceId=sessionStorage.getItem(DEVICE_KEY)||makeId();sessionStorage.setItem(DEVICE_KEY,this.deviceId);this.sessions=[];this.timer=null}
  async request(path='',body){const response=await fetch(`/__qrk/table-sessions/${encodeURIComponent(this.businessSlug)}${path}`,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined});if(!response.ok)throw new Error((await response.json().catch(()=>null))?.error||'Table service is unavailable.');return response.json()}
  async refresh(){this.sessions=await this.request();return this.sessions}
  find(table){return this.sessions.find(session=>session.table===String(table)&&['pending','active','bill_requested'].includes(session.status))||null}
  current(){return this.sessions.find(session=>(session.participants||[]).some(person=>person.deviceId===this.deviceId)||(session.joinRequests||[]).some(person=>person.deviceId===this.deviceId&&person.status==='pending'))||null}
  pending(){return this.sessions.filter(session=>session.status==='pending'||(session.joinRequests||[]).some(request=>request.status==='pending'))}
  async open({table,name,guestCount,packageId}){const session=await this.request('/request',{table,name,guestCount,packageId,deviceId:this.deviceId,staffAcceptance:this.profile.settings.staffAcceptance,joinPolicy:this.profile.settings.joinPolicy});await this.refresh();return session}
  async accept(sessionId){const session=await this.request('/accept',{sessionId});await this.refresh();return session}
  async clean(sessionId){const session=await this.request('/clean',{sessionId});await this.refresh();return session}
  async approveJoin(sessionId,requestId){const session=await this.request('/approve-join',{sessionId,requestId,permission:this.profile.settings.guestOrderPolicy});await this.refresh();return session}
  subscribe(callback){let signature='';const poll=async()=>{try{await this.refresh();const nextSignature=JSON.stringify(this.sessions);if(nextSignature===signature)return;signature=nextSignature;callback?.(this.pending())}catch{}};poll();this.timer=setInterval(poll,2000);return()=>clearInterval(this.timer)}
}
