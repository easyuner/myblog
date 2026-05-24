# Hugo 个人博客设计文档

## 概述

基于 Hugo 静态站点生成器搭建综合性个人博客，包含技术文章、生活随笔、项目展示三大内容板块，支持暗色模式、评论、搜索、RSS、SEO 等全功能。

## 站点架构

### 目录结构

```
myblog/
├── config/_default/
│   ├── hugo.toml
│   ├── menus.toml
│   ├── params.toml
│   └── languages.toml          # 预留多语言扩展
├── content/
│   ├── posts/                  # 技术文章
│   ├── notes/                  # 随笔
│   ├── projects/               # 项目展示
│   ├── about.md                # 关于页
│   ├── friends.md              # 友链页
│   └── search.md               # 搜索页
├── assets/                     # SCSS/JS 源文件
├── static/                     # 静态文件
├── themes/
│   └── myblog/                 # Fork 自极简主题，渐进定制
├── archetypes/                 # 内容模板
├── layouts/                    # 模板覆盖
└── data/                       # 数据文件
```

### 技术选型

| 层面 | 选择 | 说明 |
|------|------|------|
| 静态生成 | Hugo (extended) | Go 实现，构建快，单二进制 |
| 主题策略 | Fork 极简主题 (hugo-bearblog 或同类) | 轻量起点，渐进定制 |
| 部署 | GitHub Pages + GitHub Actions | 免费，推送即部署 |

## 内容模型

### Sections

每个 section 独立首页、独立列表、独立 RSS：

- `posts/` — 技术文章，更新最频繁
- `notes/` — 随笔、生活记录
- `projects/` — 项目展示，每个项目一个页面

### 分类法

- `categories`（文章专属）：技术 / 生活 / 阅读 等，一篇一个
- `tags`（全部内容）：细粒度标签

### 文章 Frontmatter

```yaml
title: "标题"
date: 2026-05-24
lastmod: 2026-05-24
description: "摘要"
categories: ["技术"]
tags: ["Go", "后端"]
draft: false
```

### 随笔 Frontmatter

```yaml
title: "标题"
date: 2026-05-24
tags: ["碎碎念"]
```

### 项目 Frontmatter

```yaml
title: "项目名"
date: 2026-05-24
description: "一句话介绍"
tags: ["开源"]
link: "https://example.com"
repo: "https://github.com/..."
image: "screenshot.png"
```

### 独立页面

- `about.md` — 个人介绍，无分类标签
- `friends.md` — 友链页面，数据来自 `data/friends.json`
- `search.md` — 搜索入口，嵌入 Pagefind 组件

## 功能清单

### Phase 1 — 上线前

| 功能 | 实现方式 |
|------|----------|
| RSS | Hugo 内置，每个 section 独立 + 全站聚合 |
| SEO | Open Graph / Twitter Card / JSON-LD / sitemap.xml / robots.txt |
| 暗色模式 | `prefers-color-scheme` 跟随系统 + JS 手动切换按钮 |
| 图片处理 | Hugo Image Processing，多尺寸 + 懒加载 + lightbox |
| 友链 | `data/friends.json` 驱动模板渲染 |
| 代码高亮 | Hugo 内置 Chroma |
| 归档页 | 按年份分组 |

### Phase 2 — 上线后接入

| 功能 | 实现方式 | 依赖 |
|------|----------|------|
| 评论 | Waline | LeanCloud 账号 |
| 搜索 | Pagefind | 构建后扫描生成索引 |

### 暂不实施

- 邮件订阅：初期读者有限，后续可考虑 Buttondown 或微信公众号
- 多语言：架构预留，一期不实现

## 视觉设计

### 排版

- 正文字体：`"PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`
- 代码等宽：`"JetBrains Mono", "Fira Code", monospace`
- 字号 18px，行高 1.8
- 内容区最大宽度 680px，单列居中

### 配色

- 亮色：深灰文字 `#333`，暖白背景 `#fdfdfd`
- 暗色：浅灰文字 `#d4d4d4`，深灰背景 `#1a1a1a`
- 强调色：`#2563eb`（蓝），其余只用黑白灰

### 布局

- 顶部：站点标题 + 导航栏（文章 / 随笔 / 项目 / 关于 / 友链 / 搜索）
- 首页：最新文章列表（标题、日期、分类、摘要）
- 文章页：标题 → 元信息 → 正文 → 前后导航
- 无侧边栏，无多余装饰

### 设计原则

- 干净、安静，以阅读体验为中心
- 不做花哨交互动效
- 内容就是最好的设计

## 开发路线

1. 初始化 Hugo 站点，引入主题
2. 搭建内容骨架（sections + archetypes）
3. 定制模板与样式（排版、配色、布局、暗色模式）
4. 实现 SEO 相关（meta tags、sitemap、RSS）
5. 实现友链、归档、图片处理等辅助功能
6. 接入 Waline 评论和 Pagefind 搜索
7. 配置 GitHub Actions 自动部署
8. 发布首篇文章
