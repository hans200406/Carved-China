import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeHex,
  summarizeProjects,
  filterProjects,
  validateProjects,
} from '../scripts/data-model.mjs';

const fixtures = [
  {
    id: 'yangliuqing',
    school: '杨柳青木版年画',
    province: '天津市',
    subjects: ['吉祥祈福', '娃娃仕女'],
    colors: ['#B6322C', '#D7A72E'],
    sourceUrl: 'https://example.gov.cn/a',
  },
  {
    id: 'taohuawu',
    school: '桃花坞木版年画',
    province: '江苏省',
    subjects: ['吉祥祈福'],
    colors: ['#B6322C', '#39735A'],
    sourceUrl: 'https://example.gov.cn/b',
  },
];

test('normalizeHex accepts CSS hex and normalizes case', () => {
  assert.equal(normalizeHex('#b6322c'), '#B6322C');
});

test('normalizeHex rejects malformed colors', () => {
  assert.throws(() => normalizeHex('red'), /HEX/);
});

test('summarizeProjects returns project, province, subject, and color counts', () => {
  assert.deepEqual(summarizeProjects(fixtures), {
    projects: 2,
    provinces: 2,
    schools: 2,
    subjects: { '吉祥祈福': 2, '娃娃仕女': 1 },
    colors: { '#B6322C': 2, '#D7A72E': 1, '#39735A': 1 },
  });
});

test('filterProjects filters by school and returns all for empty selection', () => {
  assert.equal(filterProjects(fixtures, '桃花坞木版年画').length, 1);
  assert.equal(filterProjects(fixtures, '').length, 2);
});

test('validateProjects reports duplicate ids and missing provenance', () => {
  const invalid = [...fixtures, { ...fixtures[0], sourceUrl: '' }];
  const errors = validateProjects(invalid);
  assert.ok(errors.some((message) => message.includes('重复 id')));
  assert.ok(errors.some((message) => message.includes('来源')));
});
