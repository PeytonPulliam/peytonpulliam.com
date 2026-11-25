import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
const home = await readFile(join(output, 'index.html'), 'utf8');

async function htmlFiles(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? path : [];
  }))).flat();
}

test('home leads with projects and links to four projects and three notes', () => {
  const headings = [...home.matchAll(/<h2[^>]*><span[^>]*>\d+<\/span>([^<]+)/g)]
    .map(([, heading]) => heading.trim());
  assert.deepEqual(headings, ['Projects', 'How I build', 'Experience', 'Writing', 'Background']);
  assert.equal([...home.matchAll(/href="\/projects\/[a-z-]+\/"/g)].length, 4);
  assert.equal([...home.matchAll(/href="\/writing\/[a-z-]+\/"/g)].length, 3);
  assert.equal([...home.matchAll(/<article class="project-card"/g)].length, 4);
  assert.match(home, /href="\/resume\/"/);
});

test('printable resume has the same sections without writing', async () => {
  const page = await readFile(join(output, 'resume', 'index.html'), 'utf8');
  const headings = [...page.matchAll(/<h2[^>]*><span[^>]*>\d+<\/span>([^<]+)/g)].map(([, h]) => h.trim());
  assert.deepEqual(headings, ['Education', 'Experience', 'Projects', 'Technical Skills', 'Certifications']);
});

test('project pages include their diagrams, draft status, and all eight sections', async () => {
  const files = await htmlFiles(join(output, 'projects'));
  assert.equal(files.length, 4);
  for (const path of files) {
    const page = await readFile(path, 'utf8');
    assert.equal([...page.matchAll(/<h2 /g)].length, 8, path);
    assert.match(page, /Design draft|In progress/);
    assert.match(page, /No measurements yet/);
    assert.match(page, /<ol class="pipeline">/);
    assert.match(page, /<pre [^>]*><code><span class="syntax">(def|func)<\/span>/);
  }
});

test('every internal link, asset, and anchor resolves in the static build', async () => {
  const files = await htmlFiles(output);
  assert.equal(files.length, 10);
  for (const file of files) {
    const page = await readFile(file, 'utf8');
    for (const [, href] of page.matchAll(/\bhref="([^"]+)"/g)) {
      if (!/^[\/#]/.test(href)) continue;
      const [path, anchor] = href.split('#');
      const target = path ? join(output, path, path.endsWith('/') ? 'index.html' : '') : file;
      await access(target);
      if (anchor) assert.ok((await readFile(target, 'utf8')).includes(`id="${anchor}"`), href);
    }
    assert.doesNotMatch(page, /<script\b/, file);
  }
});

test('sitemap matches the public routes and excludes the custom 404', async () => {
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>https:\/\/www\.peytonpulliam\.com\//g)].length, 9);
  assert.doesNotMatch(sitemap, /404\.html/);
  assert.match(await readFile(join(output, '404.html'), 'utf8'), /name="robots" content="noindex"/);
});
