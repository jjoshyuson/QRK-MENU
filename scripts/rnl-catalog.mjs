import {fileURLToPath} from 'node:url';
import {createRnlIntegration} from './rnl-integration.mjs';

const apply=process.argv.includes('--apply'),expected=process.argv.find(value=>value.startsWith('--fingerprint='))?.split('=')[1],root=fileURLToPath(new URL('..',import.meta.url)),integration=createRnlIntegration({runtimeDir:`${root}/.qrk-runtime`,baseUrl:process.env.QRK_RNL_SUPABASE_URL,apiKey:process.env.QRK_RNL_API_KEY,publishableKey:process.env.QRK_RNL_PUBLISHABLE_KEY});
try{const result=apply?await integration.applyCatalog(expected):(await integration.previewCatalog());console.log(JSON.stringify(apply?result:{fingerprint:integration.fingerprint(result.catalog),...result.diff,assets:result.assets,generatedAt:result.catalog.generatedAt},null,2));if(!apply)console.log('Preview only. Re-run with --apply --fingerprint=<fingerprint> to copy assets and store this catalog.')}catch(error){console.error(error.message);process.exitCode=1}
