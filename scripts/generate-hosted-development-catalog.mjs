import { writeFile } from 'node:fs/promises';
import { DEVELOPMENT_CLIENTS, deriveGateOrder } from '../dist/data/qrk-service-presets.js';

const target = new URL('../supabase/development_catalog.sql', import.meta.url);
const clients = DEVELOPMENT_CLIENTS;
const prefixes = { 'kusina-manila': '10', salamat: '21', 'salo-table': '31', 'tambay-tab': '41', 'ihaw-buffet': '51', 'hapag-buffet': '61', 'oras-buffet': '71', 'pito-package': '81', 'sulit-table': '91', 'tiwala-table': '11' };
const orderPrefixes = { 'kusina-manila': 'KM', salamat: 'SA', 'salo-table': 'ST', 'tambay-tab': 'TC', 'ihaw-buffet': 'IB', 'hapag-buffet': 'HB', 'oras-buffet': 'OB', 'pito-package': 'PP', 'sulit-table': 'SU', 'tiwala-table': 'TT' };
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const slug = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const uuid = (prefix, group, index = 1) => `${prefix}000000-0000-4000-8000-${String(group * 1000 + index).padStart(12, '0')}`;

const statements = [];
if (clients.length !== 10) throw new Error(`Development catalog requires exactly 10 clients, received ${clients.length}`);
for (const client of clients) {
  const prefix = prefixes[client.slug];
  if (!prefix || !orderPrefixes[client.slug] || !client.menu?.length) throw new Error(`Incomplete canonical development fixture: ${client.slug}`);
  const businessId = uuid(prefix, 0, 1), adminId = uuid(prefix, 0, 101), menuId = uuid(prefix, 0, 201), revisionId = uuid(prefix, 1, 301), destinationId = uuid(prefix, 0, 801);
  const gateOrder = client.serviceProfile.settings.gateOrder || deriveGateOrder(client.serviceProfile.settings);
  const settings = JSON.stringify({ ...client.serviceProfile.settings, gateOrder, serviceMode: client.serviceProfile.settings.serviceMode });
  const gates = JSON.stringify({ preset: client.serviceProfile.preset, serviceModes: client.serviceProfile.serviceModes, gateOrder });
  statements.push(`insert into public.businesses (id,name,public_slug,currency_code,active) values (${quote(businessId)},${quote(client.businessName)},${quote(client.slug)},'PHP',true) on conflict (id) do update set name=excluded.name,public_slug=excluded.public_slug,active=true;`);
  statements.push(`insert into public.business_profiles (business_id,description,address,open_for_orders,order_prefix,next_order_number,settings) values (${quote(businessId)},${quote(client.description)},${quote(`${client.serviceProfile.locationName}, Philippines`)},true,${quote(orderPrefixes[client.slug])},1,${quote(settings)}::jsonb) on conflict (business_id) do update set description=excluded.description,address=excluded.address,open_for_orders=true,order_prefix=excluded.order_prefix,settings=excluded.settings;`);
  statements.push(`insert into public.business_service_configs (business_id,foundation,gates) values (${quote(businessId)},${quote(client.serviceProfile.settings.serviceMode)},${quote(gates)}::jsonb) on conflict (business_id) do update set foundation=excluded.foundation,gates=excluded.gates,updated_at=now();`);
  statements.push(`insert into public.menus (id,business_id,name) values (${quote(menuId)},${quote(businessId)},'Main menu') on conflict (id) do nothing;`);
  statements.push(`insert into public.menu_revisions (id,business_id,menu_id,version,state,published_at,created_by) values (${quote(revisionId)},${quote(businessId)},${quote(menuId)},2,'draft',null,${quote(adminId)}) on conflict (id) do update set state='draft',published_at=null;`);
  const categories = [...new Set(client.menu.map(([category]) => category))];
  categories.forEach((name, index) => statements.push(`insert into public.categories (id,business_id,menu_id,revision_id,name,public_slug,sort_order) values (${quote(uuid(prefix, 1, 401 + index))},${quote(businessId)},${quote(menuId)},${quote(revisionId)},${quote(name)},${quote(slug(name))},${index}) on conflict (id) do update set name=excluded.name,public_slug=excluded.public_slug,sort_order=excluded.sort_order;`));
  client.menu.forEach(([category, name, price, description], index) => statements.push(`insert into public.menu_items (id,business_id,revision_id,category_id,stable_key,name,description,price_minor,available,sort_order) values (${quote(uuid(prefix, 1, 501 + index))},${quote(businessId)},${quote(revisionId)},${quote(uuid(prefix, 1, 401 + categories.indexOf(category)))},${quote(uuid(prefix, 1, 901 + index))},${quote(name)},${quote(description)},${Number(price)},true,${index}) on conflict (id) do update set category_id=excluded.category_id,name=excluded.name,description=excluded.description,price_minor=excluded.price_minor,available=true,sort_order=excluded.sort_order;`));
  statements.push(`update public.menu_revisions set state='archived' where menu_id=${quote(menuId)} and state='published' and id<>${quote(revisionId)};`);
  statements.push(`update public.menu_revisions set state='published',published_at=now() where id=${quote(revisionId)};`);
  statements.push(`update public.menus set published_revision_id=${quote(revisionId)} where id=${quote(menuId)};`);
  statements.push(`insert into public.public_destinations (id,business_id,menu_id,slug) values (${quote(destinationId)},${quote(businessId)},${quote(menuId)},${quote(client.slug)}) on conflict (id) do update set active=true;`);
}

await writeFile(target, `do $qrk$\nbegin\n${statements.map(value => `  ${value}`).join('\n')}\nend\n$qrk$;\n`, 'utf8');
console.log(`Generated ${clients.length} development catalogs at ${target.pathname}`);
