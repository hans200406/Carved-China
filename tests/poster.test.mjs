import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('poster canvas is exactly 1080 by 1920 pixels', async () => {
  const html = await readFile(new URL('poster/poster.html', root), 'utf8');
  assert.match(html, /\.poster\s*\{[^}]*width:\s*1080px/i);
  assert.match(html, /\.poster\s*\{[^}]*height:\s*1920px/i);
});

test('poster includes title, data evidence, insights, and generative artwork', async () => {
  const html = await readFile(new URL('poster/poster.html', root), 'utf8');
  for (const marker of ['版上山河', '12项', '11个省级地区', 'data-insights', 'generative-art']) {
    assert.match(html, new RegExp(marker));
  }
});
