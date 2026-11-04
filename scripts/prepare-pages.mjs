import { access, cp, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const decodeHtml = (text) => text.replace(/&#(x[0-9a-f]+|\d+);|&(amp|lt|gt|quot|apos);/gi, (_, number, name) =>
  number ? String.fromCodePoint(number[0].toLowerCase() === 'x' ? parseInt(number.slice(1), 16) : Number(number))
    : ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[name.toLowerCase()]);
const textOf = (value) => decodeHtml(value.replace(/<[^>]+>/g, '')).trim();
const SITE = 'https://hufeispace.com';

export function redirectPlan(legacy, current, aliases = []) {
  const targets = new Map();
  for (const item of legacy) {
    const target = current.has(item.number) ? `/blog/issue-${item.number}/` : item.path;
    targets.set(item.number, target);
  }
  const redirects = new Map();
  for (const item of legacy) {
    const target = targets.get(item.number);
    if (item.path !== target) redirects.set(item.path, target);
  }
  for (const path of aliases) {
    const match = path.match(/^\/blog\/(\d{4})_[^/]+\/$/);
    if (!match) continue;
    const number = path.includes('0038_影视飓风') ? 47 : Number(match[1]);
    const target = current.has(number) ? `/blog/issue-${number}/` : targets.get(number);
    if (target && path !== target) redirects.set(path, target);
  }
  return [...redirects].map(([from, to]) => `${encodeURI(from)} ${encodeURI(to)} 301`);
}

export async function prepare(root) {
  const dist = join(root, 'dist-blog');
  if (!await exists(join(dist, 'index.html'))) throw new Error('Missing dist-blog/index.html. Build first.');
  const out = join(root, '.pages-output');
  const marker = join(out, '.generated-by-publication-stager');
  if (await exists(out)) {
    if ((await lstat(out)).isSymbolicLink() || !await exists(marker)) throw new Error('Refusing to overwrite an unmarked output directory.');
    await rm(out, { recursive: true });
  }
  await mkdir(out);
  await writeFile(marker, 'Generated output only.\n');
  // Root homepage and its assets remain separate from the generated blog section.
  const roots = await readdir(root, { withFileTypes: true });
  for (const entry of roots) {
    if (entry.isSymbolicLink()) continue;
    if (['index.html', 'books', 'fonts', '_astro'].includes(entry.name)
        || /\.(?:ico|png|jpe?g|webp|svg|webmanifest)$/i.test(entry.name)) {
      await cp(join(root, entry.name), join(out, entry.name), { recursive: true });
    }
  }
  await cp(dist, join(out, 'blog'), { recursive: true });
  const posts = [];
  const current = new Set();
  for (const entry of await readdir(dist, { withFileTypes: true })) {
    const match = entry.name.match(/^issue-(\d+)$/);
    if (!entry.isDirectory() || !match) continue;
    const html = await readFile(join(dist, entry.name, 'index.html'), 'utf8');
    const title = textOf(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
    if (!title) throw new Error(`Missing page title: ${entry.name}`);
    const date = html.match(/<time\b[^>]*datetime=["']([^"']+)/i)?.[1];
    current.add(Number(match[1]));
    posts.push({ url: `${SITE}/blog/${entry.name}/`, title, date });
  }
  const withdrawals = new Set();
  const publicationStates = [];
  if (await exists(join(root, '.publication'))) {
    for (const name of await readdir(join(root, '.publication'))) {
      if (!/^issue-\d+\.json$/.test(name)) continue;
      const bytes = await readFile(join(root, '.publication', name));
      const state = JSON.parse(bytes.toString('utf8'));
      if (state.number !== Number(name.match(/\d+/)[0]) || !['publish', 'unpublish'].includes(state.intent)) {
        throw new Error(`Invalid publication state: ${name}`);
      }
      publicationStates.push({ state, stateHash: createHash('sha256').update(bytes).digest('hex') });
      if (state.intent === 'unpublish') withdrawals.add(state.number);
    }
  }
  const removedPaths = new Map([...withdrawals].map((number) => [number, new Set()]));
  const legacy = [];
  const oldDir = join(root, 'blog');
  if (await exists(oldDir)) {
    for (const entry of await readdir(oldDir, { withFileTypes: true })) {
      const match = entry.name.match(/^(\d{4})_/);
      if (!entry.isDirectory() || !match) continue;
      const number = Number(match[1]);
      const path = `/blog/${entry.name}/`;
      if (withdrawals.has(number)) { removedPaths.get(number).add(path); continue; }
      legacy.push({ number, path });
      if (!current.has(number)) {
        await cp(join(oldDir, entry.name), join(out, 'blog', entry.name), { recursive: true });
        const html = await readFile(join(oldDir, entry.name, 'index.html'), 'utf8');
        const title = textOf(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || entry.name);
        const date = html.match(/<time\b[^>]*datetime=["']([^"']+)/i)?.[1];
        posts.push({ url: SITE + encodeURI(path), title, date });
      }
    }
  }
  const aliases = [];
  if (await exists(join(root, 'sitemap-0.xml'))) {
    const oldSitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
    for (const match of oldSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = new URL(decodeHtml(match[1]));
      if (url.origin === SITE) aliases.push(decodeURIComponent(url.pathname));
    }
  }
  for (const path of aliases) {
    const match = path.match(/^\/blog\/(\d{4})_[^/]+\/$/);
    if (!match) continue;
    const number = path.includes('0038_影视飓风') ? 47 : Number(match[1]);
    removedPaths.get(number)?.add(path);
  }
  if (publicationStates.length) {
    const recordsDir = join(out, '.well-known', 'blog-publications');
    await mkdir(recordsDir, { recursive: true });
    for (const { state, stateHash } of publicationStates) {
      await writeFile(join(recordsDir, `issue-${state.number}.json`), JSON.stringify({
        number: state.number, sourceRepo: state.sourceRepo, sourceHash: state.sourceHash,
        intent: state.intent, stateHash, removedPaths: [...(removedPaths.get(state.number) || [])],
      }) + '\n');
    }
  }
  await writeFile(join(out, '_redirects'), redirectPlan(legacy, current, aliases).join('\n') + '\n');
  const urls = [SITE + '/', SITE + '/blog/', ...posts.map((post) => post.url)];
  await writeFile(join(out, 'sitemap-0.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    + urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join('') + '</urlset>\n');
  await writeFile(join(out, 'sitemap-index.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n'
    + `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap></sitemapindex>\n`);
  posts.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  await writeFile(join(out, 'rss.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>'
    + `<title>HuFei's Site</title><link>${SITE}/blog/</link><description>文章更新</description>`
    + posts.map((post) => `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(post.url)}</link>`
      + `<guid>${escapeXml(post.url)}</guid>`
      + (Number.isNaN(Date.parse(post.date)) ? '' : `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`)
      + '</item>').join('') + '</channel></rss>\n');
  await writeFile(join(out, '404.html'), '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面未找到</title></head><body><h1>页面未找到</h1><p><a href="/blog/">返回文章列表</a></p></body></html>\n');
  return { output: out, newArticles: current.size, retainedLegacy: legacy.filter((item) => !current.has(item.number)).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepare(resolve(process.argv[2] || '.')).then((result) => console.log(JSON.stringify(result)))
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
