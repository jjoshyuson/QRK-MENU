import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = path.join(projectRoot, 'dist');
const outputDir = path.join(projectRoot, '_site');
const buildVersion = String(process.env.QRK_BUILD_VERSION || process.env.GITHUB_SHA || 'local').slice(0, 12);

function defaultBasePath() {
  const repository = process.env.GITHUB_REPOSITORY?.split('/').pop();
  if (!repository || repository.toLowerCase().endsWith('.github.io')) return '/';
  return `/${repository}/`;
}

function normalizeBasePath(value) {
  const trimmed = (value || defaultBasePath()).trim();
  if (!trimmed || trimmed === '/') return '/';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`;
}

function rewriteForBasePath(source, extension, basePath) {
  if (basePath === '/') return source;
  let result = source;
  if (extension === '.html' || extension === '.js') {
    result = result
      .replace(/(\b(?:href|src|action)=["'])\/(?!\/)/g, `$1${basePath}`)
      .replace(/(["'`])\/photos\//g, `$1${basePath}photos/`)
      .replace(/(["'`])\/menu\//g, `$1${basePath}menu/`)
      .replace(/(["'`])\/admin\//g, `$1${basePath}admin/`)
      .replace(/(["'`])\/assets\//g, `$1${basePath}assets/`)
      .replace(/(["'`])\/photo-credits\.html/g, `$1${basePath}photo-credits.html`)
      .replace(/location\.href=(['"])\/\1/g, `location.href=$1${basePath}$1`)
      .replace(/\$\{location\.origin\}\//g, '${location.origin}' + basePath);
  }
  if (extension === '.css') {
    result = result.replace(/(url\(\s*["']?)\/(?!\/)/g, `$1${basePath}`);
  }
  return result;
}

function versionCodeReferences(source, extension) {
  if (extension === '.html') {
    return source.replace(
      /((?:href|src)=["'])(\/[^"'?#]+\.(?:css|js))(?:\?[^"']*)?(["'])/g,
      `$1$2?v=${buildVersion}$3`,
    );
  }
  if (extension === '.js') {
    return source.replace(
      /((?:from\s+|import\s*)["'])(\.{1,2}\/[^"'?]+\.js)(?:\?[^"']*)?(["'])/g,
      `$1$2?v=${buildVersion}$3`,
    );
  }
  return source;
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

const basePath = normalizeBasePath(process.env.PAGES_BASE_PATH);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });

await writeFile(
  path.join(outputDir, 'data', 'qrk-config.local.js'),
  "globalThis.QRK_CONFIG=Object.freeze({environment:'preview',authEnabled:true});\n",
  'utf8'
);

for (const file of await collectFiles(outputDir)) {
  const extension = path.extname(file).toLowerCase();
  if (!['.html', '.css', '.js'].includes(extension)) continue;
  const original = await readFile(file, 'utf8');
  let built = rewriteForBasePath(original, extension, basePath);
  built = versionCodeReferences(built, extension);
  if (built !== original) await writeFile(file, built, 'utf8');
}

await writeFile(path.join(outputDir, '.nojekyll'), '', 'utf8');

console.log(`Built GitHub Pages artifact at ${outputDir}`);
console.log(`Base path: ${basePath}`);
console.log(`Code asset version: ${buildVersion}`);
console.log('Published with browser-local preview sessions; no hosted backend credentials are injected.');
