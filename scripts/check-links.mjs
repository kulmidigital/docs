// Crawls a running copy of the site and reports broken internal links and
// anchors, plus any Mintlify URL that stopped working.
//
//   npm run build && npm start
//   npm run check:links              (or: node scripts/check-links.mjs <base-url>)

import { readFileSync } from 'node:fs';

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const parity = JSON.parse(readFileSync(new URL('./mintlify-urls.json', import.meta.url), 'utf8'));

const pages = new Map(); // path -> { status, ids }
const links = []; // { from, path, hash }

function extract(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

async function crawl(path) {
  if (pages.has(path)) return;
  pages.set(path, { status: 0, ids: new Set() });

  const response = await fetch(base + path, { redirect: 'follow' });
  const page = pages.get(path);
  page.status = response.status;
  if (!response.headers.get('content-type')?.includes('text/html')) return;

  const html = await response.text();
  // Rendered markup only: the RSC payload in <script> tags repeats every link.
  const markup = html.replace(/<script[\s\S]*?<\/script>/g, '');
  page.ids = new Set(extract(markup, /\sid="([^"]+)"/g));

  const next = [];
  for (const href of extract(markup, /<a\s[^>]*?href="([^"]+)"/g)) {
    const url = new URL(href.replace(/&amp;/g, '&'), base + path);
    if (url.origin !== base) continue;
    const target = url.pathname.replace(/\/$/, '') || '/';
    links.push({ from: path, path: target, hash: decodeURIComponent(url.hash.slice(1)) });
    next.push(target);
  }
  for (const target of next) await crawl(target);
}

for (const path of parity.pages) await crawl(path);

const failures = [];

for (const path of parity.pages) {
  const { status } = pages.get(path);
  if (status !== 200) failures.push(`Mintlify page ${path} returned ${status}`);
}

for (const [source, destination] of Object.entries(parity.redirects)) {
  const response = await fetch(base + source, { redirect: 'manual' });
  const location = response.headers.get('location');
  const target = location ? new URL(location, base).pathname : null;
  if (response.status < 300 || response.status >= 400 || target !== destination) {
    failures.push(`Redirect ${source} expected ${destination}, got ${response.status} ${location}`);
  }
}

for (const path of parity.files) {
  const response = await fetch(base + path);
  if (response.status !== 200) failures.push(`File ${path} returned ${response.status}`);
}

const seen = new Set();
for (const { from, path, hash } of links) {
  const key = `${from} ${path} ${hash}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const target = pages.get(path);
  if (target.status !== 200) failures.push(`${from} links to ${path} (${target.status})`);
  else if (hash && !target.ids.has(hash)) failures.push(`${from} links to missing anchor ${path}#${hash}`);
}

console.log(`Crawled ${pages.size} pages, ${seen.size} internal links.`);
if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('No broken links.');
