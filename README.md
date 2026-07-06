# 版上山河

中国传统木版年画多维信息可视化课程设计，包含国家级非遗名录数据分析、全国流派比较、历史演进、题材与色彩可视化，以及基于 p5.js 的生成艺术模块。

在线版本：https://hans200406.github.io/Carved-China/

## 本地运行

推荐双击 `启动项目.cmd`，程序会启动本地服务器并在 Microsoft Edge 中打开：

`http://127.0.0.1:8038`

也可在项目目录手动启动静态服务器：

```powershell
python -m http.server 8000
```

浏览器打开 `http://localhost:8000`。请勿直接双击 `index.html`，否则浏览器会限制模块和本地 JSON 加载。

执行数据审计并重新生成 `data/processed/audit-summary.json`：

```powershell
node tools/audit-data.mjs
```

## 数据来源

国家级项目名称、项目编号、批次、申报地区和保护单位来自中国非物质文化遗产网“国家级非物质文化遗产代表性项目名录”。历史、题材和工艺字段由中国非遗网、政府、文旅部门及博物馆公开资料补充。所有整理值保留来源链接和访问日期，不把推断值表述为官方统计。

主来源：https://www.ihchina.cn/project.html?tid=7

中国省级行政区边界使用 DataV GeoAtlas 的公开 GeoJSON，仅用于网页地图底图；非遗项目数据不来自该地图资源。
