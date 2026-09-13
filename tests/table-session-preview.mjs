import assert from 'node:assert/strict';

function storage(seed=new Map()){
  return{
    getItem:key=>seed.has(key)?seed.get(key):null,
    setItem:(key,value)=>seed.set(key,String(value)),
    removeItem:key=>seed.delete(key)
  };
}

globalThis.localStorage=storage();
globalThis.sessionStorage=storage();
globalThis.QRK_CONFIG={environment:'preview'};

const {QrkTableSessionService}=await import('../dist/data/qrk-table-session-service.js');
const profile={settings:{staffAcceptance:true,joinPolicy:'host',guestOrderPolicy:'direct'}};
const host=new QrkTableSessionService({businessSlug:'salo-table',profile});

assert.deepEqual(await host.refresh(),[]);
const pending=await host.open({table:'1',name:'Ana',guestCount:'4'});
assert.equal(pending.status,'pending');
assert.equal(host.current().participants[0].name,'Ana');

await host.accept(pending.id);
assert.equal(host.current().status,'active');

globalThis.sessionStorage=storage();
const guest=new QrkTableSessionService({businessSlug:'salo-table',profile});
await guest.refresh();
const joining=await guest.open({table:'1',name:'Josh',guestCount:'1'});
assert.equal(joining.joinRequests[0].status,'pending');

await host.refresh();
await host.approveJoin(pending.id,host.current().joinRequests[0].id);
await guest.refresh();
assert.equal(guest.current().participants.some(person=>person.name==='Josh'),true);

await host.clean(pending.id);
assert.equal(host.find('1'),null);

console.log('Browser-local Table session lifecycle passed.');
