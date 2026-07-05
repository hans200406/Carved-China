import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { summarizeProjects, validateProjects } from '../scripts/data-model.mjs';

const ALLOWED_SUBJECTS = new Set(['门神驱邪', '吉祥祈福', '娃娃仕女', '戏曲故事', '花鸟瑞兽', '民俗生活']);

export function auditDataset(projects) {
  const errors = validateProjects(projects);
  projects.forEach((project) => {
    if (!project.detailSource) errors.push(`${project.id} 缺少细节来源`);
    if (!Number.isFinite(project.longitude) || !Number.isFinite(project.latitude)) errors.push(`${project.id} 缺少有效坐标`);
    (project.subjects || []).forEach((subject) => {
      if (!ALLOWED_SUBJECTS.has(subject)) errors.push(`${project.id} 使用未知题材：${subject}`);
    });
  });

  const total = projects.length || 1;
  return {
    generatedAt: new Date().toISOString(),
    summary: summarizeProjects(projects),
    coverage: {
      detailSources: projects.filter((item) => item.detailSource).length / total,
      coordinates: projects.filter((item) => Number.isFinite(item.longitude) && Number.isFinite(item.latitude)).length / total,
      subjects: projects.filter((item) => item.subjects?.length).length / total,
      colors: projects.filter((item) => item.colors?.length).length / total,
    },
    errors,
  };
}

async function main() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const input = resolve(root, 'data/processed/projects.json');
  const output = resolve(root, 'data/processed/audit-summary.json');
  const projects = JSON.parse(await readFile(input, 'utf8'));
  const audit = auditDataset(projects);
  await writeFile(output, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  if (audit.errors.length) {
    console.error(audit.errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`数据审计通过：${audit.summary.projects} 项，${audit.summary.provinces} 个省级地区。`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
