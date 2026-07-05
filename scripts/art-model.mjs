const PROFILES = {
  '吉祥祈福': { center: 'lotus', symmetry: 8, rhythm: 4 },
  '门神驱邪': { center: 'shield', symmetry: 6, rhythm: 3 },
  '花鸟瑞兽': { center: 'fish', symmetry: 10, rhythm: 5 },
};

const BASE = ['#B6342B', '#D5A33A', '#39705A', '#704536', '#1E1915'];
const SCHOOL_PALETTES = {
  '桃花坞木版年画': ['#B6342B', '#39705A', '#D5A33A', '#704536'],
  '朱仙镇木版年画': ['#B6342B', '#D5A33A', '#1E1915', '#39705A'],
  '杨柳青木版年画': ['#B6342B', '#D5A33A', '#39705A', '#1E1915'],
  '绵竹木版年画': ['#D5A33A', '#B6342B', '#39705A', '#1E1915'],
};

export function motifProfile(name) {
  return { ...(PROFILES[name] || PROFILES['吉祥祈福']) };
}

export function schoolPalette(name = '') {
  if (SCHOOL_PALETTES[name]) return [...SCHOOL_PALETTES[name]];
  let hash = 0;
  for (const char of name || '全国') hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  const offset = hash % BASE.length;
  return Array.from({ length: 4 }, (_, index) => BASE[(offset + index) % BASE.length]);
}
