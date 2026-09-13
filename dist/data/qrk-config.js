// Safe browser configuration only. Leave blank to use the local demo adapter.
// Copy values from a Supabase project's Connect dialog only after the project is
// created. Never put an sb_secret_*, service_role key, database password, or JWT
// signing secret in this file.
export const qrkConfig = Object.freeze({
  environment: 'local',
  supabaseUrl: '',
  supabasePublishableKey: '',
  businessId: '',
  destinationSlug: 'kusina-manila',
  reconciliationIntervalMs: 15000,
  authEnabled: false
});

export function resolveQrkConfig(overrides={}){
  const config={...qrkConfig,...(globalThis.QRK_CONFIG||{}),...overrides};
  if(config.environment==='local'&&/^http:\/\/(127\.0\.0\.1|localhost):54321$/i.test(config.supabaseUrl||'')&&location.hostname&&!['127.0.0.1','localhost'].includes(location.hostname))config.supabaseUrl=`${location.protocol}//${location.hostname}:54321`;
  return config;
}
