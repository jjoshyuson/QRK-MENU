const DEVICE_KEY='qrk_table_device_v2';
const PREVIEW_SESSIONS_KEY='qrk_preview_table_sessions_v1';
const makeId=()=>globalThis.crypto?.randomUUID?.()||`demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export class QrkTableSessionService{
  constructor({businessSlug,profile}){this.businessSlug=businessSlug;this.profile=profile;this.previewMode=globalThis.QRK_CONFIG?.environment==='preview';this.previewKey=`${PREVIEW_SESSIONS_KEY}_${businessSlug}`;this.deviceId=sessionStorage.getItem(DEVICE_KEY)||makeId();sessionStorage.setItem(DEVICE_KEY,this.deviceId);this.sessions=[];this.timer=null}
  readPreviewSessions(){try{const value=JSON.parse(localStorage.getItem(this.previewKey)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
  savePreviewSessions(sessions){localStorage.setItem(this.previewKey,JSON.stringify(sessions))}
  previewRequest(path='',input={}){
    const sessions=this.readPreviewSessions();if(!path)return structuredClone(sessions);
    const now=new Date().toISOString();
    if(path==='/request'){
      let session=sessions.find(item=>item.table===String(input.table)&&['pending','active','bill_requested'].includes(item.status));
      if(session){if(!session.participants.some(person=>person.deviceId===input.deviceId)&&!session.joinRequests.some(item=>item.deviceId===input.deviceId&&item.status==='pending'))session.joinRequests.push({id:makeId(),deviceId:input.deviceId,name:input.name||'Guest',status:'pending',requestedAt:now,approvalBy:input.joinPolicy||'host'});}
      else{session={id:makeId(),table:String(input.table),status:input.staffAcceptance?'pending':'active',guestCount:Number(input.guestCount)||1,packageId:input.packageId||null,createdAt:now,updatedAt:now,participants:[{id:makeId(),deviceId:input.deviceId,name:input.name||'Guest',role:'host',permission:'approve',joinedAt:now}],joinRequests:[],events:[{type:'session_requested',at:now}]};sessions.push(session)}
      this.savePreviewSessions(sessions);return structuredClone(session);
    }
    const session=sessions.find(item=>item.id===input.sessionId);if(!session)throw new Error('Table session not found');
    if(path==='/accept'){session.status='active';session.updatedAt=now;session.events.push({type:'session_accepted',at:now})}
    else if(path==='/clean'){session.status='cleaned';session.updatedAt=now;session.events.push({type:'table_cleaned',at:now})}
    else if(path==='/approve-join'){const join=session.joinRequests.find(item=>item.id===input.requestId&&item.status==='pending');if(!join)throw new Error('Join request not found');join.status='approved';join.resolvedAt=now;session.participants.push({id:makeId(),deviceId:join.deviceId,name:join.name,role:'guest',permission:input.permission||'direct',joinedAt:now})}
    else throw new Error('Unknown table action');
    this.savePreviewSessions(sessions);return structuredClone(session);
  }
  async request(path='',body){if(this.previewMode)return this.previewRequest(path,body);const response=await fetch(`/__qrk/table-sessions/${encodeURIComponent(this.businessSlug)}${path}`,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined});if(!response.ok)throw new Error((await response.json().catch(()=>null))?.error||'Table service is unavailable.');return response.json()}
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
