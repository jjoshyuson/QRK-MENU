export class QrkPlatformAdminService{
  constructor(config,auth){this.config=config;this.auth=auth}
  get enabled(){return this.config.environment==='staging'&&Boolean(this.config.supabaseUrl&&this.config.supabasePublishableKey)}
  async request(action,input={}){const token=this.auth.accessToken();if(!token)throw new Error('QRK Admin sign-in required.');const response=await fetch(`${this.config.supabaseUrl}/functions/v1/platform-clients`,{method:'POST',headers:{'content-type':'application/json',apikey:this.config.supabasePublishableKey,authorization:`Bearer ${token}`},body:JSON.stringify({action,...input})}),value=await response.json().catch(()=>({}));if(!response.ok)throw new Error(value.error||'Hosted client operation failed.');return value}
  async list(){return(await this.request('list')).clients||[]}
  create(client){return this.request('create',{client})}
  update(businessId,client){return this.request('update',{businessId,client})}
  pause(businessId,active){return this.request('pause',{businessId,active})}
  reset(businessId){return this.request('reset',{businessId})}
}
