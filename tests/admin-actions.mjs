import assert from 'node:assert/strict';
import {BAND_COLORS,adminRow,bandColor,clientCard,clientStatus,filterClients,filterCounts,manageSheetBody,overviewStats} from '../dist/admin/admin-view.js';

const mk=(id,businessName,preset,username,status='active',modes)=>({id,businessName,slug:id,prefix:id.slice(0,3),status,serviceProfile:modes?{preset,serviceModes:modes}:{preset},admin:{name:`${businessName} Owner`,email:`${id}@x.test`,username}});
const quick=mk('kusina','Kusina','quick','kusina-admin'),salo=mk('salo','Salo','traditional','salo-admin'),both=mk('both','Both Place','quick','both-admin','paused',['quick','table']),evil=mk('evil','Kain & "Inom" <b>','quick','evil-admin');
const clients=[quick,salo,both,evil],statuses=new Map([['salo-admin',{mustChangePassword:true}],['both-admin',{mustChangePassword:true}]]);

assert.equal(bandColor('Salamat'),bandColor('Salamat'));
assert.ok(BAND_COLORS.includes(bandColor('Salamat')));
assert.equal(clientStatus(both,statuses),'paused');
assert.equal(clientStatus(salo,statuses),'pending');
assert.equal(clientStatus(salo,null),'active');
assert.equal(clientStatus(salo,new Map()),'active');

const stats=overviewStats(clients,statuses);
assert.deepEqual([stats.total,stats.active,stats.paused,stats.pending,stats.attentionCount],[4,3,1,1,2]);
assert.equal(stats.mix.reduce((sum,item)=>sum+item.count,0),4);
assert.ok(stats.mix.every((item,i,all)=>!i||all[i-1].count>=item.count));

assert.deepEqual(filterClients(clients,{query:'  SALO '},statuses),[salo]);
assert.deepEqual(filterClients(clients,{filter:'paused',query:'salo'},statuses),[]);
assert.deepEqual(filterClients(clients,{filter:'attention'},statuses),[salo,both]);
const counts=filterCounts(clients,statuses);
for(const key of ['all','quick','table','paused','attention'])assert.equal(counts[key],filterClients(clients,{filter:key},statuses).length,key);

for(const client of [quick,salo]){const html=clientCard(client,{statuses})+manageSheetBody(client,{statuses});
  for(const needle of ['data-open-client','data-manage-client','Open client login','Customer view','data-reset-client-password','data-configure-client','data-toggle-client','Pause'])assert.ok(html.includes(needle),`${client.id} lacks ${needle}`)}
const pausedHtml=clientCard(both,{statuses})+manageSheetBody(both,{statuses});
assert.ok(!pausedHtml.includes('Open client login')&&!pausedHtml.includes('data-reset-client-password')&&pausedHtml.includes('Activate'));

const hostedCard=clientCard(quick,{hosted:true,statuses});
assert.ok(hostedCard.includes('Client sign-in')&&!hostedCard.includes('Preview as admin'));

const escaped='Kain &amp; &quot;Inom&quot; &lt;b&gt;';
for(const html of [clientCard(evil,{statuses}),manageSheetBody(evil,{statuses}),adminRow(evil,statuses)]){assert.ok(html.includes(escaped));assert.ok(!html.includes('<b>'))}
