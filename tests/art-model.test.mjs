import test from 'node:test';
import assert from 'node:assert/strict';
import { motifProfile, schoolPalette } from '../scripts/art-model.mjs';

test('each motif exposes a distinct center symbol', () => {
  assert.equal(motifProfile('吉祥祈福').center, 'lotus');
  assert.equal(motifProfile('门神驱邪').center, 'shield');
  assert.equal(motifProfile('花鸟瑞兽').center, 'fish');
});

test('unknown motif falls back to auspicious profile', () => {
  assert.deepEqual(motifProfile('未知'), motifProfile('吉祥祈福'));
});

test('school palettes are deterministic and contain four colors', () => {
  const first = schoolPalette('桃花坞木版年画');
  const second = schoolPalette('桃花坞木版年画');
  assert.deepEqual(first, second);
  assert.equal(first.length, 4);
  assert.notDeepEqual(first, schoolPalette('朱仙镇木版年画'));
});
