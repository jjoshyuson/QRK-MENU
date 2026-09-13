import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const migrationDir=resolve(root,'supabase','migrations');
const migrations=(await readdir(migrationDir)).filter(name=>name.endsWith('.sql')).sort();
if(migrations.length<2)throw new Error('Expected portable and Supabase-specific migrations.');
const sql=(await Promise.all(migrations.map(name=>readFile(resolve(migrationDir,name),'utf8')))).join('\n');
const tests=await readFile(resolve(root,'supabase','tests','001_security_and_orders.sql'),'utf8');
const authTests=await readFile(resolve(root,'supabase','tests','002_auth_and_permissions.sql'),'utf8');
const seed=await readFile(resolve(root,'supabase','seed.sql'),'utf8');
const requiredTables=['businesses','business_members','business_profiles','menus','menu_revisions','categories','menu_items','item_option_groups','item_options','orders','order_items','order_item_options','order_status_events','public_destinations','photo_assets'];
const requiredFunctions=['get_public_menu','create_public_order','get_public_order_status','transition_order_status','set_business_ordering_open'];
const requiredSecurity=['enable row level security','revoke all on all tables','qrk_staff_receive_order_broadcasts','realtime.send','qrk_public_read_published_menu_photos'];
for(const name of requiredTables)if(!new RegExp(`create table public\\.${name}\\b`,'i').test(sql))throw new Error(`Missing table ${name}`);
for(const name of requiredFunctions)if(!new RegExp(`create function public\\.${name}\\b`,'i').test(sql))throw new Error(`Missing function ${name}`);
for(const marker of requiredSecurity)if(!sql.toLowerCase().includes(marker.toLowerCase()))throw new Error(`Missing security marker ${marker}`);
for(const marker of ['tenant B cannot read tenant A','idempotency created exactly one order','public RPC hides hidden items','permitted staff can advance'])if(!tests.includes(marker))throw new Error(`Missing SQL test: ${marker}`);
for(const marker of ['salamat-admin','salamat-staff','{"serviceMode":"quick"}','{"serviceMode":"table"}'])if(!seed.includes(marker))throw new Error(`Missing two-tenant seed marker: ${marker}`);
for(const marker of ['Salamat admin resolves to the second tenant','Salamat resolves to QRK Table mode'])if(!authTests.includes(marker))throw new Error(`Missing Auth test: ${marker}`);

const files=['.env.example','dist/data/qrk-config.js','dist/data/qrk-config.example.js',...migrations.map(name=>`supabase/migrations/${name}`),'supabase/seed.sql'];
const secretPatterns=[/sb_secret_[A-Za-z0-9_-]{10,}/,/service_role\s*[:=]\s*['"][A-Za-z0-9._-]{20,}/i,/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/];
for(const file of files){const content=await readFile(resolve(root,file),'utf8');for(const pattern of secretPatterns)if(pattern.test(content))throw new Error(`Possible secret in ${file}`)}
console.log(`Backend static validation passed (${requiredTables.length} tables, ${requiredFunctions.length} RPCs, ${migrations.length} migrations).`);
