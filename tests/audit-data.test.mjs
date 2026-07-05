import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { auditDataset } from '../tools/audit-data.mjs';

test('audit confirms the current project dataset is complete and traceable', async () => {
  const projects = JSON.parse(await readFile(new URL('../data/processed/projects.json', import.meta.url), 'utf8'));
  const audit = auditDataset(projects);
  assert.equal(audit.errors.length, 0);
  assert.equal(audit.summary.projects, 12);
  assert.equal(audit.summary.provinces, 11);
  assert.equal(audit.coverage.detailSources, 1);
  assert.equal(audit.coverage.coordinates, 1);
});

test('audit rejects unsupported subject categories and missing detail sources', () => {
  const audit = auditDataset([{ id: 'bad', school: '测试', province: '测试省', subjects: ['未知题材'], colors: ['#B6342B'], longitude: 1, latitude: 1, sourceUrl: 'https://example.com', detailSource: '' }]);
  assert.ok(audit.errors.some((item) => item.includes('未知题材')));
  assert.ok(audit.errors.some((item) => item.includes('细节来源')));
});
