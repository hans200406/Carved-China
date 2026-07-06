# 版上山河

中国传统木版年画多维信息可视化课程设计。当前阶段包含真实国家级非遗名录数据、网页叙事骨架和可测试的数据模型；设计报告按要求暂缓制作。

在线版本：https://hans200406.github.io/Carved-China/

## 本地运行

在项目目录启动任意静态服务器，例如：

```powershell
python -m http.server 8000
```

浏览器打开 `http://localhost:8000`。直接双击 `index.html` 也可查看页面，但部分浏览器会限制本地 JSON 加载。

## 测试

```powershell
node --test tests/*.test.mjs
```

执行数据审计并重新生成 `data/processed/audit-summary.json`：

```powershell
node tools/audit-data.mjs
```

## 数据来源

国家级项目名称、项目编号、批次、申报地区和保护单位来自中国非物质文化遗产网“国家级非物质文化遗产代表性项目名录”。历史、题材和工艺字段将优先由中国非遗网、政府、文旅部门及博物馆资料补充。所有整理值保留来源链接和访问日期，不把推断值表述为官方统计。

主来源：https://www.ihchina.cn/project.html?tid=7

中国省级行政区边界使用 DataV GeoAtlas 的公开 GeoJSON，仅用于网页地图底图；非遗项目数据不来自该地图资源。
