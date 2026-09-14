import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const url = String(process.env.QRK_SUPABASE_URL || '').replace(/\/$/, '');
const key = String(process.env.QRK_SUPABASE_PUBLISHABLE_KEY || '');
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !/^(?:sb_publishable_|eyJ)/.test(key)) throw new Error('Safe hosted Supabase configuration is required.');

const credentials = Object.fromEntries((await readFile(new URL('../.env.hosted-accounts', import.meta.url), 'utf8')).split(/\r?\n/).filter(Boolean).map(line => line.split(/=(.*)/s).slice(0, 2)));
const clients = [
  ['kusina-manila', 'kusina-admin', credentials.QRK_HOSTED_KUSINA_ADMIN_PASSWORD],
  ['salamat', 'salamat-admin', credentials.QRK_HOSTED_SALAMAT_ADMIN_PASSWORD],
  ['salo-table', 'salo-admin', credentials.QRK_HOSTED_SALO_ADMIN_PASSWORD],
  ['tambay-tab', 'tambay-admin', credentials.QRK_HOSTED_TAMBAY_ADMIN_PASSWORD],
  ['ihaw-buffet', 'ihaw-admin', credentials.QRK_HOSTED_IHAW_ADMIN_PASSWORD],
];
const headers = token => ({ 'content-type': 'application/json', apikey: key, authorization: `Bearer ${token || key}` });
async function request(path, { token, body, method = 'POST' } = {}) {
  const response = await fetch(`${url}${path}`, { method, headers: headers(token), body: body === undefined ? undefined : JSON.stringify(body) });
  if (!response.ok) throw new Error(`${path} failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
  return response.status === 204 ? null : response.json();
}

for (const [slug, username, password] of clients) {
  if (!password) throw new Error(`Missing local temporary password for ${username}.`);
  const session = await request('/auth/v1/token?grant_type=password', { body: { email: `${username}@accounts.qrkmenu.invalid`, password } });
  const context = await request('/rest/v1/rpc/get_my_access_context', { token: session.access_token, body: {} });
  if (context.businessSlug !== slug) throw new Error(`${username} resolved to ${context.businessSlug || 'no tenant'}.`);
  const publicMenu = await request('/rest/v1/rpc/get_public_menu', { body: { p_destination_slug: slug } });
  const firstItem = publicMenu?.menu?.categories?.flatMap(category => category.items || [])[0];
  if (!firstItem) throw new Error(`${slug} has no published item.`);
  const deviceId = randomUUID(), deviceSecret = `${randomUUID()}${randomUUID()}`;
  await request('/rest/v1/rpc/register_customer_device', { body: { p_destination_slug: slug, p_device_id: deviceId, p_device_secret: deviceSecret, p_label: 'Automated staging check', p_metadata: { check: true } } });
  const optionIds = (firstItem.optionGroups || []).filter(group => group.required).map(group => group.options?.[0]?.id).filter(Boolean);
  const order = await request('/rest/v1/rpc/create_device_order', { body: { p_destination_slug: slug, p_request_id: randomUUID(), p_fulfillment: 'table', p_table_number: '1', p_customer_label: 'Cloud check', p_order_notes: 'Automated staging verification', p_line_items: [{ itemId: firstItem.id, quantity: 1, optionIds, notes: '' }], p_device_id: deviceId, p_device_secret: deviceSecret, p_table_session_id: null, p_open_tab_id: null } });
  const visible = await request(`/rest/v1/orders?business_id=eq.${encodeURIComponent(context.businessId)}&id=eq.${encodeURIComponent(order.id)}&select=id`, { token: session.access_token, method: 'GET' });
  if (visible.length !== 1) throw new Error(`${username} cannot see the order created for ${slug}.`);
  if (slug === 'salo-table') {
    const table = String(700 + Math.floor(Math.random() * 200));
    const pending = await request('/rest/v1/rpc/request_table_session', { body: { p_destination_slug: slug, p_device_id: deviceId, p_device_secret: deviceSecret, p_table_number: table, p_name: 'Cloud table check', p_guest_count: 2, p_package_id: null, p_staff_acceptance: true, p_timeout_seconds: 90, p_join_policy: 'host' } });
    if (pending.status !== 'pending') throw new Error('Table request did not enter the pending state.');
    await request('/rest/v1/rpc/change_table_session', { token: session.access_token, body: { p_destination_slug: slug, p_session_id: pending.id, p_action: 'accept', p_device_id: deviceId, p_device_secret: deviceSecret, p_request_id: null, p_permission: 'direct' } });
    const active = await request('/rest/v1/rpc/get_table_sessions', { body: { p_destination_slug: slug, p_device_id: deviceId, p_device_secret: deviceSecret } });
    if (!active.some(item => item.id === pending.id && item.status === 'active')) throw new Error('Customer did not observe staff table acceptance.');
    await request('/rest/v1/rpc/change_table_session', { token: session.access_token, body: { p_destination_slug: slug, p_session_id: pending.id, p_action: 'clean', p_device_id: deviceId, p_device_secret: deviceSecret, p_request_id: null, p_permission: 'direct' } });
    console.log('salo-table: cross-device table request, staff acceptance, customer reconciliation, and cleanup passed.');
  }
  console.log(`${slug}: public menu, device registration, order creation, admin login, and tenant read passed.`);
}
