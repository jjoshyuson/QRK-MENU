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
const profile={settings:{staffAcceptance:true,acceptanceTimeoutSeconds:90,joinPolicy:'host',guestOrderPolicy:'direct'}};
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
assert.equal(guest.current().participants.find(person=>person.name==='Josh').role,'guest');
assert.equal(guest.current().participants.find(person=>person.name==='Josh').permission,'direct');

await host.clean(pending.id);
assert.equal(host.find('1'),null);

globalThis.sessionStorage=storage();
const openTab=new QrkTableSessionService({businessSlug:'tambay-tab',profile:{settings:{staffAcceptance:false,acceptanceTimeoutSeconds:90,joinPolicy:'host',guestOrderPolicy:'direct'}}});
const openTabSession=await openTab.open({table:'1',name:'Mia',guestCount:'1'});
await openTab.markPaid(openTabSession.id);
assert.equal(openTab.sessions.find(session=>session.id===openTabSession.id).status,'settled');

globalThis.sessionStorage=storage();
const cancelling=new QrkTableSessionService({businessSlug:'salo-table',profile});
const cancelled=await cancelling.open({table:'2',name:'Lia',guestCount:'2'});
await cancelling.cancel(cancelled.id);
assert.equal(cancelling.current(),null);
assert.equal(cancelling.sessions.find(session=>session.id===cancelled.id).status,'cancelled');

const expiringProfile={settings:{...profile.settings,acceptanceTimeoutSeconds:-1}};
globalThis.sessionStorage=storage();
const expiring=new QrkTableSessionService({businessSlug:'salo-table',profile:expiringProfile});
await expiring.open({table:'3',name:'Noel',guestCount:'1'});
await expiring.refresh();
assert.equal(expiring.current(),null);

globalThis.sessionStorage=storage();
const automaticGuest=new QrkTableSessionService({businessSlug:'automatic-join',profile:{settings:{staffAcceptance:false,acceptanceTimeoutSeconds:90,additionalDevices:true,joinPolicy:'automatic',guestOrderPolicy:'host_approval'}}});
await automaticGuest.open({table:'4',name:'Host',guestCount:'2'});
globalThis.sessionStorage=storage();
const automaticJoiner=new QrkTableSessionService({businessSlug:'automatic-join',profile:automaticGuest.profile});
const autoJoined=await automaticJoiner.open({table:'4',name:'Guest',guestCount:'1'});
assert.equal(autoJoined.joinRequests.length,0);
assert.equal(autoJoined.participants.find(person=>person.name==='Guest').permission,'host_approval');

globalThis.sessionStorage=storage();
const closedHost=new QrkTableSessionService({businessSlug:'closed-join',profile:{settings:{staffAcceptance:false,acceptanceTimeoutSeconds:90,additionalDevices:false,joinPolicy:'disabled',guestOrderPolicy:'view_only'}}});
await closedHost.open({table:'5',name:'Host',guestCount:'2'});
globalThis.sessionStorage=storage();
const blockedGuest=new QrkTableSessionService({businessSlug:'closed-join',profile:closedHost.profile});
await assert.rejects(()=>blockedGuest.open({table:'5',name:'Guest',guestCount:'1'}),/does not allow additional devices/);

console.log('Browser-local Table session lifecycle passed.');
