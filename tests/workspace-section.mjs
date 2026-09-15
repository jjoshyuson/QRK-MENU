import assert from 'node:assert/strict';
import {rememberWorkspaceSection,resolveWorkspaceSection,workspaceDeepLink,workspaceSectionKey} from '../dist/data/qrk-workspace-section.js';

const storage=()=>{const values=new Map();return{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))}};
const admin={dashboard:true,profile:true,menu:true,staff:true,orders:true,settings:true};
const staff={dashboard:false,profile:false,menu:true,staff:false,orders:true,settings:false};
const kusinaAdmin={businessId:'business-kusina',userId:'user-admin',username:'kusina.admin'};
const kusinaStaff={businessId:'business-kusina',userId:'user-staff',username:'kusina.staff'};
const salamatAdmin={businessId:'business-salamat',userId:'user-admin',username:'salamat.admin'};

assert.notEqual(workspaceSectionKey(kusinaAdmin),workspaceSectionKey(kusinaStaff),'users in one business must not share a remembered section');
assert.notEqual(workspaceSectionKey(kusinaAdmin),workspaceSectionKey(salamatAdmin),'one user across businesses must not share a remembered section');
assert.equal(workspaceDeepLink('#orders'),'orders');
assert.equal(workspaceDeepLink('#section=menu'),'menu');
assert.equal(workspaceDeepLink('#unknown'),'');
assert.equal(workspaceDeepLink('#%E0%A4%A'),'');

const browser=storage();
assert.equal(resolveWorkspaceSection({context:kusinaAdmin,allowed:admin,storage:browser}),'dashboard','an unseen admin starts on Dashboard');
assert.equal(rememberWorkspaceSection(kusinaAdmin,'menu',{allowed:admin,storage:browser}),true);
assert.equal(resolveWorkspaceSection({context:kusinaAdmin,allowed:admin,storage:browser}),'menu','a valid remembered section survives refresh');
assert.equal(resolveWorkspaceSection({context:kusinaAdmin,allowed:admin,hash:'#orders',storage:browser}),'orders','an allowed deep link wins over remembered state');
assert.equal(resolveWorkspaceSection({context:kusinaAdmin,allowed:staff,hash:'#settings',storage:browser}),'menu','a forbidden deep link cannot bypass permissions');
assert.equal(resolveWorkspaceSection({context:kusinaStaff,allowed:staff,storage:browser}),'orders','an unseen staff identity keeps the existing permitted fallback');
assert.equal(rememberWorkspaceSection(kusinaStaff,'settings',{allowed:staff,storage:browser}),false,'an inaccessible section is never stored');
assert.equal(rememberWorkspaceSection(kusinaStaff,'orders',{allowed:staff,storage:browser}),true);
assert.equal(resolveWorkspaceSection({context:kusinaStaff,allowed:staff,storage:browser}),'orders');
assert.equal(resolveWorkspaceSection({context:salamatAdmin,allowed:admin,storage:browser}),'dashboard','a different business identity remains unseen');
browser.setItem(workspaceSectionKey(salamatAdmin),'not-a-section');
assert.equal(resolveWorkspaceSection({context:salamatAdmin,allowed:admin,storage:browser}),'dashboard','an invalid stored value returns to the safe default');
assert.equal(workspaceSectionKey({businessId:'tenant-only'}),'','both business and account identity are required');

console.log('Workspace section identity, access, refresh, switching, and deep-link contract passed.');
