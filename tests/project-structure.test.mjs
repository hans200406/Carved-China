import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('page exposes all seven narrative chapters', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const id of ['opening', 'atlas', 'timeline', 'subjects', 'palette', 'studio', 'legacy']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
});

test('project design tokens include required New Year picture colors', async () => {
  const css = await readFile(new URL('styles/tokens.css', root), 'utf8');
  for (const token of ['--paper', '--ink', '--cinnabar', '--rattan', '--stone-green']) {
    assert.match(css, new RegExp(`${token}:`), `missing ${token}`);
  }
});

test('cinnabar chapter overrides muted lead text for readable contrast', async () => {
  const css = await readFile(new URL('styles/main.css', root), 'utf8');
  assert.match(css, /\.red-band\s+\.lede\s*\{[^}]*color:\s*#fff8ec/i);
});

test('generated canvas scales within narrow viewports', async () => {
  const css = await readFile(new URL('styles/main.css', root), 'utf8');
  assert.match(css, /#art-canvas\s+canvas\s*\{[^}]*max-width:\s*100%/i);
});

test('processed project dataset has provenance and required fields', async () => {
  const projects = JSON.parse(await readFile(new URL('data/processed/projects.json', root), 'utf8'));
  assert.ok(projects.length >= 12);
  assert.ok(projects.some((item) => item.id === 'mianzhu'));
  assert.ok(projects.some((item) => item.id === 'fengxiang'));
  for (const project of projects) {
    assert.ok(project.id);
    assert.ok(project.school);
    assert.ok(project.province);
    assert.ok(Number.isFinite(project.longitude));
    assert.ok(Number.isFinite(project.latitude));
    assert.match(project.sourceUrl, /^https:\/\//);
  }
});

test('README documents local startup and data provenance', async () => {
  const readme = await readFile(new URL('README.md', root), 'utf8');
  assert.match(readme, /本地运行/);
  assert.match(readme, /数据来源/);
});

test('page uses bundled chart and generative-art dependencies for offline delivery', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.match(html, /vendor\/echarts\.min\.js/);
  assert.match(html, /vendor\/p5\.min\.js/);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
});

test('atlas registers a local China GeoJSON map instead of a coordinate-only plot', async () => {
  const app = await readFile(new URL('scripts/app.mjs', root), 'utf8');
  const geo = JSON.parse(await readFile(new URL('data/processed/china.geojson', root), 'utf8'));
  assert.match(app, /registerMap\(['"]中国['"]/);
  assert.match(app, /type:\s*['"]map['"]/);
  assert.equal(geo.type, 'FeatureCollection');
  assert.ok(geo.features.length >= 30);
});

test('page includes reduced-motion-aware scroll reveal behavior', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const app = await readFile(new URL('scripts/app.mjs', root), 'utf8');
  assert.match(html, /class="section[^"\n]*reveal/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /prefers-reduced-motion/);
});
