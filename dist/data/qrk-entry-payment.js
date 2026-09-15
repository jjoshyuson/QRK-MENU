const MODES=new Set(['none','deposit','minimum_spend','full_prepayment']);
const SATISFIED_STATUSES=new Set(['satisfied','paid','complete','completed']);

const minor=value=>Number.isFinite(Number(value))?Math.max(0,Math.round(Number(value))):0;

export function normalizeEntryPayment(value={}){
  const source=value&&typeof value==='object'?value:{};
  const rawMode=String(source.mode||source.type||'none').trim().toLowerCase().replace(/[ -]+/g,'_');
  const mode={minimum:'minimum_spend',minimum_commitment:'minimum_spend',prepayment:'full_prepayment',full:'full_prepayment'}[rawMode]||rawMode;
  const requiredMinor=minor(source.requiredMinor??source.amountMinor??source.minimumMinor);
  const paidMinor=minor(source.paidMinor??source.appliedCreditMinor??source.creditMinor);
  const expiresAt=source.expiresAt?String(source.expiresAt):null;
  const expired=Boolean(source.expired)||Boolean(expiresAt&&Number.isFinite(Date.parse(expiresAt))&&Date.parse(expiresAt)<=Date.now());
  const status=String(source.status||'pending').trim().toLowerCase();
  const configurationError=mode!=='none'&&(!MODES.has(mode)||requiredMinor<=0);
  const satisfied=mode==='none'||(!configurationError&&!expired&&(mode==='minimum_spend'?SATISFIED_STATUSES.has(status):SATISFIED_STATUSES.has(status)&&paidMinor>=requiredMinor));
  return{mode:MODES.has(mode)?mode:'invalid',requiredMinor,paidMinor,expiresAt,expired,status,error:String(source.error||''),configurationError,satisfied};
}

export function entryPaymentFromExperience(experience,search=''){
  const configured=experience?.serviceProfile?.settings?.entryPayment??experience?.capabilities?.entryPayment??experience?.entryPayment??{};
  const params=new URLSearchParams(search);
  if(!params.has('entry-payment'))return normalizeEntryPayment(configured);
  return normalizeEntryPayment({
    mode:params.get('entry-payment'),
    requiredMinor:params.get('entry-required'),
    paidMinor:params.get('entry-paid'),
    status:params.get('entry-status'),
    expiresAt:params.get('entry-expires'),
    expired:params.get('entry-expired')==='1',
    error:params.get('entry-error')||''
  });
}

export function entryPaymentAmounts(payment,subtotalMinor){
  const subtotal=minor(subtotalMinor),credit=['deposit','full_prepayment'].includes(payment.mode)&&payment.satisfied?Math.min(payment.paidMinor,subtotal):0;
  return{creditMinor:credit,remainingCreditMinor:Math.max(0,payment.paidMinor-credit),dueMinor:Math.max(0,subtotal-credit),shortfallMinor:payment.mode==='minimum_spend'?Math.max(0,payment.requiredMinor-subtotal):0};
}
