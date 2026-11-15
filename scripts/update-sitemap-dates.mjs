// Rewrites every <lastmod> in sitemap.xml with the date its page file last
// changed in git. A single static date on every URL teaches Google to ignore
// lastmod, so run this (node scripts/update-sitemap-dates.mjs) before committing
// page edits or adding a page to the sitemap.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://www.dimolaw.com/';
const SITEMAP = 'sitemap.xml';

const today = new Date().toISOString().slice(0, 10);

// vercel.json has cleanUrls on, so /faq is served from faq.html and
// /blog from blog/index.html.
const fileForUrl = (url) => {
  const path = url.slice(SITE.length).replace(/\/$/, '');
  if (path === '') return 'index.html';
  const candidates = [`${path}.html`, `${path}/index.html`];
  const match = candidates.find((candidate) => existsSync(candidate));
  if (!match) throw new Error(`No file found for ${url} (tried ${candidates.join(', ')})`);
  return match;
};

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

const lastChanged = (file) => {
  if (git('status', '--porcelain', '--', file) !== '') return today;
  const committed = git('log', '-1', '--format=%cs', '--', file);
  if (!committed) throw new Error(`${file} is not tracked by git yet; commit it first`);
  return committed;
};

const sitemap = readFileSync(SITEMAP, 'utf8');
let changed = 0;

const updated = sitemap.replace(
  /(<loc>([^<]+)<\/loc>\s*<lastmod>)([^<]*)(<\/lastmod>)/g,
  (whole, before, url, oldDate, after) => {
    const newDate = lastChanged(fileForUrl(url));
    if (newDate !== oldDate) changed += 1;
    return `${before}${newDate}${after}`;
  },
);

const urlCount = (sitemap.match(/<url>/g) || []).length;
const lastmodCount = (updated.match(/<lastmod>/g) || []).length;
if (urlCount !== lastmodCount) {
  throw new Error(`${urlCount} <url> entries but ${lastmodCount} <lastmod> tags; check sitemap.xml by hand`);
}

writeFileSync(SITEMAP, updated);
console.log(`sitemap.xml: ${urlCount} URLs checked, ${changed} lastmod dates changed`);
