import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('delivery includes a one-click local launcher', async () => {
  const launcher = await readFile(new URL('启动项目.cmd', root), 'utf8');
  assert.match(launcher, /http\.server/);
  assert.match(launcher, /127\.0\.0\.1:8038/);
});

test('GitHub Pages workflow publishes the static project', async () => {
  const workflow = await readFile(new URL('.github/workflows/pages.yml', root), 'utf8');
  assert.match(workflow, /actions\/upload-pages-artifact/);
  assert.match(workflow, /actions\/deploy-pages/);
  assert.match(workflow, /path:\s*\./);
  assert.match(workflow, /enablement:\s*true/);
});

test('submission checklist covers all task-book deliverables', async () => {
  const checklist = await readFile(new URL('提交清单.md', root), 'utf8');
  for (const item of ['前端源代码', '生成艺术源文件', '原始数据', '清洗后的数据', '在线访问', '设计说明', '1080×1920', 'ZIP']) {
    assert.match(checklist, new RegExp(item));
  }
});

test('offline dependencies and poster exist', async () => {
  await Promise.all([
    access(new URL('vendor/echarts.min.js', root)),
    access(new URL('vendor/p5.min.js', root)),
    access(new URL('poster/版上山河-课程展览海报.png', root)),
  ]);
});

test('online access document records the verified Pages URL', async () => {
  const online = await readFile(new URL('在线访问说明.md', root), 'utf8');
  assert.match(online, /https:\/\/hans200406\.github\.io\/Carved-China\//);
  assert.match(online, /已验证/);
});
