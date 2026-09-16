'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(x => x[1]);
let checked = 0;
for (const ref of refs) {
  if (ref.startsWith('#') || /^https:\/\//.test(ref)) continue;
  assert(!ref.startsWith('/'), 'Assets must be relative for project-site hosting');
  const name = ref.split('?')[0];
  assert(fs.statSync(path.join(root, name)).isFile(), `Missing file: ${name}`);
  if (/\.(js|css|svg)$/.test(name)) assert(ref.endsWith(`?v=${version}`), `Cache version: ${name}`);
  checked++;
}
assert(html.includes("connect-src 'none'"));
assert(html.includes("script-src 'self'"));
assert(html.includes("form-action 'none'"));
assert(!html.includes('unsafe-inline'));
assert(!html.includes('unsafe-eval'));
assert(!/\son\w+=/i.test(html), 'No inline event handlers');
assert(!fs.existsSync(path.join(root, 'CNAME')), 'Custom domain must be explicitly configured');
assert(fs.existsSync(path.join(root, '.nojekyll')));
const script = fs.readFileSync(path.join(root, 'Publish-GitHub.ps1'), 'utf8');
for (const name of [...script.matchAll(/^    '([^']+)'/gm)].map(m => m[1])) {
  assert(fs.existsSync(path.join(root, name)), `Publish file missing: ${name}`);
}
console.log(`PASS: ${checked} local assets exist, version ${version}, relative paths, static CSP checks and no active custom domain.`);
