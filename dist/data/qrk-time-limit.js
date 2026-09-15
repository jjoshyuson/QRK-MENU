export function getTimeLimitGate(settings={},session=null,now=Date.now()){
  if(settings.timeLimitEnabled!==true)return{enabled:false};
  const minutes=Number(settings.timeLimitMinutes),startedAt=session?.serviceStartedAt||session?.startedAt||session?.createdAt,endValue=session?.serviceEndsAt||session?.timeLimitEndsAt;
  const startMs=Date.parse(startedAt||''),explicitEndMs=Date.parse(endValue||''),endMs=Number.isFinite(explicitEndMs)?explicitEndMs:Number.isFinite(startMs)&&minutes>0?startMs+minutes*60000:NaN;
  if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<=startMs)return{enabled:true,state:'incomplete'};
  const remainingMs=Math.max(0,endMs-now),state=remainingMs<=0?'expired':remainingMs<=5*60000?'urgent':remainingMs<=15*60000?'warning':'active';
  return{enabled:true,state,startedAt:new Date(startMs).toISOString(),endsAt:new Date(endMs).toISOString(),remainingMs,extension:session?.timeLimitExtension||session?.serviceTimeExtension||null};
}
export function formatTimeRemaining(milliseconds){const seconds=Math.max(0,Math.ceil(milliseconds/1000)),hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),remainder=String(seconds%60).padStart(2,'0');return hours?`${hours}:${String(minutes).padStart(2,'0')}:${remainder}`:`${minutes}:${remainder}`}
