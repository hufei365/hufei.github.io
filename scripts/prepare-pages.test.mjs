import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { redirectPlan, prepare } from './prepare-pages.mjs';
import { createHash } from 'node:crypto';

const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
async function put(root, path, body) {
  const full = join(root, path);
  await mkdir(join(full, '..'), { recursive: true });
  await writeFile(full, body);
}
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'authored-blog-stage-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await put(root, 'index.html', '<title>Existing home</title>');
  await put(root, 'fonts/font.woff2', 'fixture');
  await put(root, 'dist-blog/index.html', '<title>Blog</title>');
  await put(root, 'dist-blog/issue-1/index.html', '<title>New &amp; article</title><time datetime="2026-05-27T00:00:00Z">date</time>');
  await put(root, 'blog/0001_old_title/index.html', '<title>Old one</title>');
  await put(root, 'blog/0002_old_title/index.html', '<title>Legacy two</title>');
  await put(root, 'sitemap-0.xml', '<urlset><url><loc>https://hufeispace.com/blog/0001_old-title/</loc></url></urlset>');
  return root;
}

test('legacy aliases redirect to existing destinations only', () => {
  const redirects = redirectPlan([{ number: 1, path: '/blog/0001_old_title/' },
    { number: 47, path: '/blog/0047_video/' }], new Set([1]), ['/blog/0001_old-title/', '/blog/0038_影视飓风旧名/']);
  assert.ok(redirects.includes('/blog/0001_old_title/ /blog/issue-1/ 301'));
  assert.ok(redirects.includes('/blog/0001_old-title/ /blog/issue-1/ 301'));
  assert.ok(redirects.some((line) => line.endsWith('/blog/0047_video/ 301')));
});

test('staging keeps homepage and unmigrated articles while regenerating indexes', async (t) => {
  const root = await fixture(t);
  const result = await prepare(root);
  assert.equal(result.newArticles, 1);
  assert.equal(result.retainedLegacy, 1);
  assert.equal(await readFile(join(result.output, 'index.html'), 'utf8'), '<title>Existing home</title>');
  assert.equal(await exists(join(result.output, 'fonts/font.woff2')), true);
  assert.equal(await exists(join(result.output, 'blog/0001_old_title/index.html')), false);
  assert.equal(await exists(join(result.output, 'blog/0002_old_title/index.html')), true);
  assert.equal(await exists(join(result.output, '404.html')), true);
  const sitemap = await readFile(join(result.output, 'sitemap-0.xml'), 'utf8');
  assert.ok(sitemap.includes('/blog/issue-1/'));
  assert.ok(sitemap.includes('/blog/0002_old_title/'));
  assert.ok(!sitemap.includes('0001_old-title'));
  const rss = await readFile(join(result.output, 'rss.xml'), 'utf8');
  assert.ok(rss.includes('New &amp; article'));
  await put(root, '.pages-output/stale.html', 'stale');
  await prepare(root);
  assert.equal(await exists(join(result.output, 'stale.html')), false);
});

test('withdrawal removes old legacy copies from the staged output too', async (t) => {
  const root = await fixture(t);
  await put(root, '.publication/issue-2.json', JSON.stringify({ number: 2, intent: 'unpublish' }));
  const result = await prepare(root);
  assert.equal(result.retainedLegacy, 0);
  assert.equal(await exists(join(result.output, 'blog/0002_old_title/index.html')), false);
  assert.ok(!(await readFile(join(result.output, 'sitemap-0.xml'), 'utf8')).includes('0002'));
});

test('deployed publication records bind exact state bytes and list withdrawn legacy aliases', async (t) => {
  const root = await fixture(t);
  const publish = JSON.stringify({ number: 1, intent: 'publish', sourceRepo: 'hufei365/notebook', sourceHash: 'a'.repeat(64) }) + '\n';
  const withdraw = JSON.stringify({ number: 2, intent: 'unpublish', sourceRepo: 'hufei365/notebook', sourceHash: 'b'.repeat(64) }) + '\n';
  await put(root, '.publication/issue-1.json', publish);
  await put(root, '.publication/issue-2.json', withdraw);
  await put(root, 'sitemap-0.xml', '<urlset><url><loc>https://hufeispace.com/blog/0002_old-title/</loc></url></urlset>');
  const result = await prepare(root);
  const readMarker = async (number) => JSON.parse(await readFile(join(result.output, '.well-known/blog-publications', `issue-${number}.json`), 'utf8'));
  const one = await readMarker(1);
  const two = await readMarker(2);
  assert.equal(one.stateHash, createHash('sha256').update(publish).digest('hex'));
  assert.equal(two.stateHash, createHash('sha256').update(withdraw).digest('hex'));
  assert.equal(two.intent, 'unpublish');
  assert.deepEqual(one.removedPaths, []);
  assert.deepEqual(two.removedPaths.sort(), ['/blog/0002_old-title/', '/blog/0002_old_title/'].sort());
  assert.equal(await exists(join(result.output, 'blog/0002_old_title/index.html')), false);
});

test('stager refuses to delete an unrelated unmarked directory', async (t) => {
  const root = await fixture(t);
  await put(root, '.pages-output/important.txt', 'keep');
  await assert.rejects(prepare(root), /unmarked output/);
  assert.equal(await readFile(join(root, '.pages-output/important.txt'), 'utf8'), 'keep');
});
