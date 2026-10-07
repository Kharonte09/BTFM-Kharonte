// Checks every internal link (href/src) and in-page anchor in the built site.
// Usage: npm run build && npm run check:links
// Honours BASE_PATH (e.g. BASE_PATH=/btfm) so project-pages builds can be verified too.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const base = (process.env.BASE_PATH || '/').replace(/\/+$/, '');

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) htmlFiles.push(p);
  }
})(DIST);

const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
};

const resolve = (pathname) => {
  if (base && !pathname.startsWith(`${base}/`) && pathname !== base) return null;
  const rel = decodeURIComponent(pathname.slice(base.length)).replace(/^\/+/, '');
  const candidates = [join(DIST, rel), join(DIST, rel, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
};

let broken = 0;
let checked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const pageUrl = '/' + relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  for (const [, attr] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|javascript:)/.test(attr)) continue;
    checked++;
    const [path, hash] = attr.split('#');
    let target = file;
    if (path) {
      if (!path.startsWith('/')) {
        console.log(`RELATIVE  ${pageUrl} → ${attr}`);
        broken++;
        continue;
      }
      target = resolve(path);
      if (!target) {
        console.log(`MISSING   ${pageUrl} → ${attr}`);
        broken++;
        continue;
      }
    }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) {
      console.log(`ANCHOR    ${pageUrl} → ${attr}`);
      broken++;
    }
  }
}

console.log(`\n${htmlFiles.length} pages, ${checked} internal links checked, ${broken} broken.`);
process.exit(broken ? 1 : 0);
