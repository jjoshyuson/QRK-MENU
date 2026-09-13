// Copy to qrk-config.local.js (gitignored) for local Docker development only.
// The publishable key is safe for browser use; RLS remains the security boundary.
globalThis.QRK_CONFIG={environment:'local',supabaseUrl:'http://127.0.0.1:54321',supabasePublishableKey:'PASTE_LOCAL_PUBLISHABLE_KEY',businessId:'10000000-0000-4000-8000-000000000001',destinationSlug:'kusina-manila',authEnabled:true};
