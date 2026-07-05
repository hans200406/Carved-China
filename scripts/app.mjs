import { filterProjects, summarizeProjects } from './data-model.mjs';
import { motifProfile, schoolPalette } from './art-model.mjs';

const palette = ['#B6342B', '#D5A33A', '#39705A', '#704536', '#1E1915'];
const colorNames = { '#B6342B': '朱砂', '#D5A33A': '藤黄', '#39705A': '石绿', '#704536': '木褐', '#1E1915': '墨色' };
const response = await fetch('data/processed/projects.json');
if (!response.ok) throw new Error(`数据加载失败：${response.status}`);
const projects = await response.json();
let activeSchool = '';
const charts = [];

function chartAt(id, option) {
  const node = document.getElementById(id);
  if (!window.echarts) { node.textContent = '图表依赖加载失败，请检查网络或使用本地依赖。'; return null; }
  const chart = window.echarts.init(node);
  chart.setOption(option);
  charts.push(chart);
  return chart;
}

const text = { color: '#5f5047', fontFamily: 'Microsoft YaHei, sans-serif' };
const mapChart = chartAt('map-chart', {
  tooltip: { formatter: ({ data }) => `${data.name}<br>${data.city}<br>列入：${data.batch}年` },
  grid: { left: 54, right: 20, top: 30, bottom: 48 },
  xAxis: { name: '东经', min: 103, max: 123, axisLabel: text, splitLine: { lineStyle: { color: 'rgba(30,25,21,.08)' } } },
  yAxis: { name: '北纬', min: 20, max: 41, axisLabel: text, splitLine: { lineStyle: { color: 'rgba(30,25,21,.08)' } } },
  series: [{ type: 'scatter', symbolSize: 17, itemStyle: { color: palette[0], borderColor: '#F3EBDD', borderWidth: 2 }, data: projects.map(p => ({ name: p.school, value: [p.longitude, p.latitude], ...p })) }]
});

chartAt('timeline-chart', {
  tooltip: { formatter: ({ data }) => `${data.name}<br>${data.origin}` },
  grid: { left: 86, right: 36, top: 32, bottom: 40 },
  xAxis: { type: 'value', min: 950, max: 1700, axisLabel: { color: '#cdbfad', formatter: '{value}年' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.12)' } } },
  yAxis: { type: 'category', data: [...projects].sort((a,b) => a.originYear-b.originYear).map(p => p.school.replace('木版年画','')), axisLabel: { color: '#F3EBDD' } },
  series: [{ type: 'scatter', symbolSize: 15, data: [...projects].sort((a,b) => a.originYear-b.originYear).map(p => ({ name: p.school, value: p.originYear, origin: p.origin, itemStyle: { color: palette[1] } })) }]
});

function frequency(items, key) {
  const count = {};
  items.flatMap(item => item[key] || []).forEach(value => { count[value] = (count[value] || 0) + 1; });
  return Object.entries(count).sort((a,b) => b[1]-a[1]);
}

const subjectChart = chartAt('subject-chart', {});
const colorChart = chartAt('color-chart', {});
function updateLinkedCharts() {
  const selected = filterProjects(projects, activeSchool);
  const subjects = frequency(selected, 'subjects');
  const colors = frequency(selected, 'colors');
  subjectChart?.setOption({ tooltip: {}, grid: { left: 90, right: 30, top: 25, bottom: 30 }, xAxis: { type: 'value' }, yAxis: { type: 'category', data: subjects.map(d=>d[0]).reverse() }, series: [{ type: 'bar', data: subjects.map(d=>d[1]).reverse(), itemStyle: { color: palette[0], borderRadius: [0,5,5,0] }, label: { show: true, position: 'right' } }] }, true);
  colorChart?.setOption({ tooltip: { formatter: ({ name, value }) => `${name}：${value}个流派编码` }, grid: { left: 70, right: 30, top: 25, bottom: 35 }, xAxis: { type: 'category', data: colors.map(d=>colorNames[d[0]] || d[0]), axisLabel: { color: '#fff8ec' } }, yAxis: { type: 'value', axisLabel: { color: '#fff8ec' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.15)' } } }, series: [{ type: 'bar', data: colors.map(d=>({ value:d[1], itemStyle:{ color:d[0] } })), label: { show:true, position:'top', color:'#fff8ec' } }] }, true);
}

const filter = document.getElementById('school-filter');
projects.forEach(p => filter.add(new Option(p.school, p.school)));
const artSchool = document.getElementById('art-school');
projects.forEach(p => artSchool.add(new Option(p.school, p.school)));
filter.addEventListener('change', () => { activeSchool = filter.value; updateLinkedCharts(); });
document.getElementById('reset-filter').addEventListener('click', () => { activeSchool = ''; filter.value = ''; updateLinkedCharts(); });
mapChart?.on('click', ({ data }) => { activeSchool = data.school; filter.value = activeSchool; updateLinkedCharts(); document.getElementById('subjects').scrollIntoView({ behavior: 'smooth' }); });
updateLinkedCharts();

const summary = summarizeProjects(projects);
document.getElementById('project-count').textContent = summary.projects;
document.getElementById('province-count').textContent = summary.provinces;
document.getElementById('hero-project-count').textContent = summary.projects;
const topSubject = Object.entries(summary.subjects).sort((a,b)=>b[1]-a[1])[0];
const topColor = Object.entries(summary.colors).sort((a,b)=>b[1]-a[1])[0];
document.getElementById('insights').innerHTML = `
  <article class="insight"><strong>${summary.provinces}个省级地区</strong><p>${summary.projects}项首批国家级样本分布在${summary.provinces}个省级地区，形成跨越南北的年画地理谱系。</p></article>
  <article class="insight"><strong>${topSubject[0]}最常见</strong><p>统一编码后，该题材出现在${topSubject[1]}个样本中，显示年画首先承担春节空间中的仪式与祈愿功能。</p></article>
  <article class="insight"><strong>${colorNames[topColor[0]]}形成共性</strong><p>${topColor[1]}个样本的代表色编码包含${colorNames[topColor[0]]}；颜色比较是描述性编码，不等同于作品像素统计。</p></article>`;

window.addEventListener('resize', () => charts.forEach(chart => chart.resize()));

if (window.p5) {
  let seed = 20260705;
  const sketch = (p) => {
    p.setup = () => { const canvas = p.createCanvas(520, 520); canvas.parent('art-canvas'); p.noLoop(); };
    p.draw = () => {
      const profile = motifProfile(document.getElementById('motif').value);
      const artPalette = schoolPalette(artSchool.value);
      p.randomSeed(seed); p.background('#F3EBDD'); p.translate(p.width/2, p.height/2);
      const density = Number(document.getElementById('density').value);
      for (let ring=1; ring<=density; ring++) {
        const count = ring * profile.rhythm;
        for (let i=0; i<count; i++) {
          p.push(); p.rotate((p.TWO_PI/count)*i); p.translate(ring*31,0); p.rotate(p.PI/4);
          p.noStroke(); p.fill(artPalette[(ring+i)%4]);
          const size = 13 + p.random(8); p.quad(0,-size, size*.7,0,0,size,-size*.7,0); p.pop();
        }
      }
      p.noFill(); p.stroke('#1E1915'); p.strokeWeight(8); p.rectMode(p.CENTER); p.rect(0,0,470,470);
      p.noStroke(); p.fill(artPalette[0]);
      if (profile.center === 'shield') {
        p.beginShape(); p.vertex(-52,-60); p.vertex(52,-60); p.vertex(42,28); p.vertex(0,70); p.vertex(-42,28); p.endShape(p.CLOSE);
        p.fill(artPalette[1]); p.rect(0,-8,18,88);
      } else if (profile.center === 'fish') {
        p.ellipse(-12,0,104,58); p.triangle(30,0,76,-42,76,42); p.fill('#F3EBDD'); p.circle(-38,-8,8);
      } else {
        for (let i=0; i<profile.symmetry; i++) { p.push(); p.rotate(i*p.TWO_PI/profile.symmetry); p.ellipse(0,-34,30,72); p.pop(); }
        p.fill(artPalette[1]); p.circle(0,0,36);
      }
    };
    document.getElementById('regenerate').addEventListener('click', () => { seed += 1; p.redraw(); });
    document.getElementById('density').addEventListener('input', () => p.redraw());
    document.getElementById('motif').addEventListener('change', () => p.redraw());
    artSchool.addEventListener('change', () => p.redraw());
    document.getElementById('download-art').addEventListener('click', () => p.saveCanvas('版上山河-生成纹样', 'png'));
  };
  new window.p5(sketch);
} else {
  document.getElementById('art-canvas').textContent = '生成艺术依赖加载失败，请检查网络或使用本地依赖。';
}
