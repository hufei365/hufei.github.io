import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { validate } from './check-publication.mjs';

const hash = 'a'.repeat(64);

async function fixture(t, extra = {}) {
  const root = await mkdtemp(join(tmpdir(), 'authored-blog-validation-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, '.publication'), { recursive: true });
  await mkdir(join(root, 'src/content/blog'), { recursive: true });
  const fields = { title: '文章', pubDate: '2026-05-27', description: '文章说明', tags: [],
    sourceIssue: 53, sourceUrl: 'https://github.com/hufei365/notebook/issues/53', sourceHash: hash };
  const state = { number: 53, sourceRepo: 'hufei365/notebook', sourceHash: hash,
    intent: 'publish', images: [], ...extra };
  const markdown = '---\n' + Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
    + '\n---\n\n正文\n';
  state.renderedHash = createHash('sha256').update(markdown).digest('hex');
  await writeFile(join(root, '.publication/issue-53.json'), JSON.stringify(state));
  await writeFile(join(root, 'src/content/blog/issue-53.md'), markdown);
  return root;
}

async function refreshHash(root) {
  const file = join(root, '.publication/issue-53.json');
  const state = JSON.parse(await readFile(file, 'utf8'));
  state.renderedHash = createHash('sha256').update(await readFile(join(root, 'src/content/blog/issue-53.md'))).digest('hex');
  await writeFile(file, JSON.stringify(state));
}

test('valid source metadata passes', async (t) => {
  assert.deepEqual(await validate(await fixture(t)), []);
});

test('stale source hash fails validation', async (t) => {
  const errors = await validate(await fixture(t, { sourceHash: 'b'.repeat(64) }));
  assert.match(errors.join(), /Source metadata mismatch/);
});

test('withdrawal fails while the source is still present', async (t) => {
  const root = await fixture(t, { intent: 'unpublish' });
  assert.match((await validate(root)).join(), /still exists/);
  await rm(join(root, 'src/content/blog/issue-53.md'));
  assert.deepEqual(await validate(root), []);
});

test('unmapped image stops publication', async (t) => {
  const root = await fixture(t);
  const path = join(root, 'src/content/blog/issue-53.md');
  const { appendFile } = await import('node:fs/promises');
  await appendFile(path, '\n![图](https://files.seeusercontent.com/image.png)\n');
  await refreshHash(root);
  assert.match((await validate(root)).join(), /without a dual-backup record/);
});

test('an example image in a code fence is not an actual publication image', async (t) => {
  const root = await fixture(t);
  const { appendFile } = await import('node:fs/promises');
  await appendFile(join(root, 'src/content/blog/issue-53.md'), '\n```md\n![例](https://example.com/example.png)\n```\n');
  await refreshHash(root);
  assert.deepEqual(await validate(root), []);
});
