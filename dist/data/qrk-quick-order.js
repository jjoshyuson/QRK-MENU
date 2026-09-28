const CONSUMPTION_MODES=['dine_in','takeaway'];
const FULFILLMENT_MODES=['pickup','table'];

function allowed(values,known,fallback){
  const source=Array.isArray(values)?values:fallback;
  return [...new Set(source.filter(value=>known.includes(value)))];
}

export function normalizeQuickOrderSettings(settings={}){
  return{
    consumptionModes:allowed(settings.consumptionModes,CONSUMPTION_MODES,['dine_in']),
    fulfillmentModes:allowed(settings.fulfillmentModes,FULFILLMENT_MODES,['pickup'])
  };
}

export function validQuickFulfillmentModes(settings,consumption){
  const normalized=normalizeQuickOrderSettings(settings);
  if(!normalized.consumptionModes.includes(consumption))return[];
  return normalized.fulfillmentModes.filter(mode=>consumption==='takeaway'?mode==='pickup':true);
}

export function isValidQuickOrderPair(settings,consumption,fulfillment){
  return validQuickFulfillmentModes(settings,consumption).includes(fulfillment);
}

export function resolveQuickOrderState(settings,state={},tableContext=''){
  const normalized=normalizeQuickOrderSettings(settings);
  let consumption=normalized.consumptionModes.includes(state.consumption)?state.consumption:'';
  let fulfillment=normalized.fulfillmentModes.includes(state.fulfillment)?state.fulfillment:'';
  let table=String(state.table||'');
  if(/^\d{1,3}$/.test(String(tableContext||''))&&normalized.consumptionModes.includes('dine_in')&&normalized.fulfillmentModes.includes('table')){
    consumption='dine_in';fulfillment='table';table=String(tableContext);
  }
  if(!consumption&&normalized.consumptionModes.length===1)consumption=normalized.consumptionModes[0];
  const valid=consumption?validQuickFulfillmentModes(normalized,consumption):[];
  if(!valid.includes(fulfillment)){fulfillment='';table=''}
  if(!fulfillment&&valid.length===1)fulfillment=valid[0];
  if(fulfillment!=='table')table='';
  return{...normalized,consumption,fulfillment,table,validFulfillmentModes:valid};
}
