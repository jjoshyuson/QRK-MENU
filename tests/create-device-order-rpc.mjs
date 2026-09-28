import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const migration=await readFile(new URL('../supabase/migrations/202609280001_create_device_order_rpc_unification.sql',import.meta.url),'utf8');

assert.match(migration,/alter function public\.create_device_order\([\s\S]*?\) set schema private;/);
assert.match(migration,/alter function private\.create_device_order\([\s\S]*?\) rename to create_device_order_core;/);
assert.match(migration,/revoke all on function private\.create_device_order_core\([\s\S]*?\) from public, anon, authenticated, service_role;/);
assert.match(migration,/create or replace function public\.create_device_order\([\s\S]*?p_experience text default 'quick'[\s\S]*?private\.create_device_order_core\(/);
assert.doesNotMatch(migration,/result:=public\.create_device_order\(/);
assert.match(migration,/grant execute on function public\.create_device_order\([\s\S]*?\) to anon,authenticated,service_role;/);

console.log('Unified public create_device_order RPC contract passed.');
