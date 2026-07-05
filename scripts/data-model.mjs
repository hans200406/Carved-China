export function normalizeHex(value) {
  if (!/^#[0-9a-f]{6}$/i.test(value || '')) {
    throw new TypeError(`无效 HEX 色值：${value}`);
  }
  return value.toUpperCase();
}

export function summarizeProjects(projects) {
  const subjects = {};
  const colors = {};
  for (const project of projects) {
    for (const subject of project.subjects || []) {
      subjects[subject] = (subjects[subject] || 0) + 1;
    }
    for (const color of project.colors || []) {
      const normalized = normalizeHex(color);
      colors[normalized] = (colors[normalized] || 0) + 1;
    }
  }
  return {
    projects: projects.length,
    provinces: new Set(projects.map((item) => item.province)).size,
    schools: new Set(projects.map((item) => item.school)).size,
    subjects,
    colors,
  };
}

export function filterProjects(projects, school) {
  return school ? projects.filter((item) => item.school === school) : [...projects];
}

export function validateProjects(projects) {
  const errors = [];
  const ids = new Set();
  projects.forEach((project, index) => {
    if (!project.id) errors.push(`第 ${index + 1} 条缺少 id`);
    if (ids.has(project.id)) errors.push(`重复 id：${project.id}`);
    ids.add(project.id);
    if (!project.sourceUrl) errors.push(`${project.id || index + 1} 缺少来源`);
    (project.colors || []).forEach((color) => {
      try {
        normalizeHex(color);
      } catch {
        errors.push(`${project.id || index + 1} 含无效 HEX 色值：${color}`);
      }
    });
  });
  return errors;
}
