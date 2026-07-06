# 版上山河

中国传统木版年画多维信息可视化课程设计，包含国家级非遗名录数据分析、全国流派比较、历史演进、题材与色彩可视化，以及基于 p5.js 的生成艺术模块。

在线版本：https://hans200406.github.io/Carved-China/

## 访问方式

使用 Microsoft Edge 打开在线版本：

https://hans200406.github.io/Carved-China/

如需重新生成数据审计文件，可运行：

```powershell
node tools/audit-data.mjs
```

## 数据来源

国家级项目名称、项目编号、批次、申报地区和保护单位来自中国非物质文化遗产网“国家级非物质文化遗产代表性项目名录”。历史、题材和工艺字段由中国非遗网、政府、文旅部门及博物馆公开资料补充。所有整理值保留来源链接和访问日期，不把推断值表述为官方统计。

主来源：https://www.ihchina.cn/project.html?tid=7

中国省级行政区边界使用 DataV GeoAtlas 的公开 GeoJSON，仅用于网页地图底图；非遗项目数据不来自该地图资源。
