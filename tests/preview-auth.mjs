import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createPreviewAuthStore} from '../scripts/preview-auth.mjs';

const directory=await mkdtemp(path.join(tmpdir(),'qrk-preview-auth-')),store=createPreviewAuthStore({directory});
try{
  const rnl=await store.provision({displayName:'R&L Admin',username:'rnl.rnl',email:'admin@rnl.example',role:'admin',businessId:'preview:rnl',businessName:'R&L',businessSlug:'rnl',permissions:{manageStaff:true}});
  const other=await store.provision({displayName:'Other Admin',username:'other.admin',email:'other@example.test',role:'admin',businessId:'preview:other',businessName:'Other',businessSlug:'other'});
  assert.equal(await store.signIn('rnl.rnl','wrong-password'),null,'wrong passwords must fail');
  assert.equal((await store.signIn('rnl.rnl',rnl.temporaryPassword)).account.businessSlug,'rnl');
  assert.equal((await store.signIn('other.admin',other.temporaryPassword)).account.businessSlug,'other','unrelated accounts must remain valid');
  const reset=await store.reset('rnl.rnl',{serviceMode:'table',businessName:'R&L',businessSlug:'rnl'});
  assert.notEqual(reset.temporaryPassword,rnl.temporaryPassword);
  assert.equal(await store.signIn('rnl.rnl',rnl.temporaryPassword),null,'reset must revoke the old temporary password');
  const signedIn=await store.signIn('rnl.rnl',reset.temporaryPassword);
  assert.equal(signedIn.account.mustChangePassword,true);
  assert.equal(signedIn.account.serviceMode,'table','reset must refresh the bridged client context');
  const changed=await store.changePassword(signedIn.token,'NewLongPassword!42');
  assert.equal(changed.mustChangePassword,false);
  const persisted=await readFile(path.join(directory,'preview-auth.json'),'utf8');
  assert.doesNotMatch(persisted,new RegExp(rnl.temporaryPassword.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.doesNotMatch(persisted,new RegExp(reset.temporaryPassword.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(persisted,/"passwordHash"/);
  console.log('Local preview credential bridge, reset, hashing, and account isolation passed.');
}finally{await rm(directory,{recursive:true,force:true})}
