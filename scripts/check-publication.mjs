import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const exists = async (path) => { try { await access(path); return true; } catch { return false; } };

export async function validate(root) {
  const errors = [];
  const dir = join(root, '.publication');
  if (!await exists(dir)) return errors; // Existing articles are migrated explicitly.
  const names = (await readdir(dir)).filter((name) => /^issue-\d+\.json$/.test(name));
  for (const name of names) {
    try {
      const state = JSON.parse(await readFile(join(dir, name), 'utf8'));
      const number = Number(name.match(/\d+/)[0]);
      if (state.number !== number || state.sourceRepo !== 'hufei365/notebook'
          || !/^[a-f0-9]{64}$/.test(state.sourceHash)) throw new Error('Invalid source provenance.');
      const file = join(root, 'src/content/blog', `issue-${number}.md`);
      if (state.intent === 'unpublish') {
        if (await exists(file)) throw new Error('Withdrawn article source still exists.');
        continue;
      }
      if (state.intent !== 'publish') throw new Error('Unknown publication intent.');
      const markdown = await readFile(file, 'utf8');
      if (createHash('sha256').update(markdown).digest('hex') !== state.renderedHash) {
        throw new Error('Rendered content hash mismatch.');
      }
      const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!frontmatter) throw new Error('Missing frontmatter.');
      const fields = {};
      for (const line of frontmatter[1].split(/\r?\n/)) {
        const pair = line.match(/^([A-Za-z]+): (.+)$/);
        if (!pair) throw new Error('Expected generated one-line JSON-compatible YAML values.');
        fields[pair[1]] = JSON.parse(pair[2]);
      }
      if (fields.sourceHash !== state.sourceHash || fields.sourceIssue !== number
          || fields.sourceUrl !== `https://github.com/hufei365/notebook/issues/${number}`) throw new Error('Source metadata mismatch.');
      if (!fields.title?.trim() || !fields.description?.trim() || Number.isNaN(Date.parse(fields.pubDate))) throw new Error('Missing title, description or valid date.');
      if (!Array.isArray(fields.tags)) throw new Error('Tags must be an array.');
      const urls = new Set();
      for (const hash of state.images) {
        if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid media hash.');
        const record = JSON.parse(await readFile(join(dir, 'images', `${hash}.json`), 'utf8'));
        if (record.sha256 !== hash || !record.backupPath?.startsWith(`blog/${hash}.`)
            || record.backupRepo !== 'hufei365/myimages' || !record.backupBranch) throw new Error('Invalid media backup record.');
        const primary = new URL(record.primaryUrl);
        if (primary.protocol !== 'https:') throw new Error('Image URL must use HTTPS.');
        urls.add(record.primaryUrl);
      }
      const body = markdown.slice(frontmatter[0].length);
      // Do not match sample images inside code blocks; the publisher performs reference extraction.
      const liveBody = body.replace(/^ {0,3}(?:`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}(?:`{3,}|~{3,})\s*$/gm, '')
        .replace(/`+[^`\n]*`+/g, '');
      for (const match of liveBody.matchAll(/!\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|([^\s)]+))|<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)) {
        if (!urls.has(match[1] ?? match[2] ?? match[3])) throw new Error('Article references an image without a dual-backup record.');
      }
    } catch (error) { errors.push(`${name}: ${error.message}`); }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = await validate(resolve(process.argv[2] || '.'));
  for (const error of errors) console.error(error);
  if (errors.length) process.exitCode = 1;
  else console.log('Publication provenance and media records are valid.');
}
