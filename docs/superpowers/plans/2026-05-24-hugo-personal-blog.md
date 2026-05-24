# Hugo 个人博客实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建 Hugo 综合性个人博客，包含文章/随笔/项目三大板块，暗色模式、RSS、SEO、友链、归档等全功能。

**Architecture:** Hugo 站点部署在项目根目录，主题 `themes/myblog/` 从零编写（参考极简主题布局，不依赖外部依赖），CSS 通过 Hugo Pipes 编译 SCSS，JS 用于暗色模式切换和图片 lightbox。评论 (Waline) 和搜索 (Pagefind) 作为 Phase 2 接入。

**Tech Stack:** Hugo extended v0.146.5, SCSS, vanilla JS, GitHub Pages + GitHub Actions

---

### Task 1: 初始化 Hugo 站点结构

**Files:**
- Create: `config/_default/hugo.toml`
- Create: `config/_default/menus.toml`
- Create: `config/_default/params.toml`
- Create: `config/_default/languages.toml`

- [ ] **Step 1: 创建 Hugo 站点配置文件**

`config/_default/hugo.toml`:
```toml
baseURL = "https://yourusername.github.io/"
languageCode = "zh-CN"
defaultContentLanguage = "zh"
title = "我的博客"
theme = "myblog"

enableRobotsTXT = true
enableEmoji = true
hasCJKLanguage = true

[markup]
  [markup.highlight]
    style = "github-dark"
    noClasses = false

[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
  page = ["HTML"]

[taxonomies]
  category = "categories"
  tag = "tags"

[privacy]
  [privacy.youtube]
    privacyEnhanced = true
```

- [ ] **Step 2: 创建菜单配置**

`config/_default/menus.toml`:
```toml
[[main]]
  name = "文章"
  url = "/posts/"
  weight = 10

[[main]]
  name = "随笔"
  url = "/notes/"
  weight = 20

[[main]]
  name = "项目"
  url = "/projects/"
  weight = 30

[[main]]
  name = "友链"
  url = "/friends/"
  weight = 40

[[main]]
  name = "搜索"
  url = "/search/"
  weight = 50

[[main]]
  name = "关于"
  url = "/about/"
  weight = 60
```

- [ ] **Step 3: 创建主题参数配置**

`config/_default/params.toml`:
```toml
description = "个人博客 - 技术、生活与项目"
author = "Your Name"

[params.theme]
  accentColor = "#2563eb"
  bodyFontSize = "18px"
  bodyLineHeight = "1.8"
  contentMaxWidth = "680px"
```

- [ ] **Step 4: 创建语言配置（预留）**

`config/_default/languages.toml`:
```toml
[zh]
  languageName = "中文"
  weight = 1
  title = "我的博客"
```

- [ ] **Step 5: 验证 Hugo 能读取配置**

Run: `hugo config --environment production`
Expected: 输出包含 baseURL、title、theme 等配置项

- [ ] **Step 6: Commit**

```bash
git add config/ && git commit -m "feat: add Hugo site configuration"
```

---

### Task 2: 创建主题骨架及基础模板

**Files:**
- Create: `themes/myblog/theme.toml`
- Create: `themes/myblog/layouts/_default/baseof.html`
- Create: `themes/myblog/layouts/partials/head.html`
- Create: `themes/myblog/layouts/partials/header.html`
- Create: `themes/myblog/layouts/partials/footer.html`
- Create: `themes/myblog/layouts/partials/nav.html`
- Create: `themes/myblog/layouts/partials/seo.html`

- [ ] **Step 1: 创建 theme.toml**

`themes/myblog/theme.toml`:
```toml
name = "myblog"
license = "MIT"
description = "Personal blog theme - minimal, clean, reading-focused"
min_version = "0.140.0"

[author]
  name = "blog owner"
```

- [ ] **Step 2: 创建 SEO partial**

`themes/myblog/layouts/partials/seo.html`:
```html
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Summary }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}{{ end }}">

<meta property="og:title" content="{{ .Title }} | {{ .Site.Title }}">
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:site_name" content="{{ .Site.Title }}">

<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{{ .Title }}">
<meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">

{{ if .IsPage }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ .Title }}",
  "datePublished": "{{ .Date.Format "2006-01-02" }}",
  "dateModified": "{{ .Lastmod.Format "2006-01-02" }}",
  "description": "{{ with .Description }}{{ . }}{{ else }}{{ .Summary }}{{ end }}",
  "url": "{{ .Permalink }}"
}
</script>
{{ end }}

<link rel="canonical" href="{{ .Permalink }}">
```

- [ ] **Step 3: 创建 head partial**

`themes/myblog/layouts/partials/head.html`:
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>

  {{ partial "seo.html" . }}

  {{ $css := resources.Get "css/main.scss" | toCSS | minify | fingerprint }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">

  {{ range .AlternativeOutputFormats }}
    {{ printf `<link rel="%s" type="%s" href="%s" title="%s">` .Rel .MediaType.Type .RelPermalink $.Site.Title | safeHTML }}
  {{ end }}
</head>
```

- [ ] **Step 4: 创建 header partial**

`themes/myblog/layouts/partials/header.html`:
```html
<header class="site-header">
  <a class="site-title" href="{{ .Site.BaseURL }}">{{ .Site.Title }}</a>
  {{ partial "nav.html" . }}
</header>
```

- [ ] **Step 5: 创建 nav partial**

`themes/myblog/layouts/partials/nav.html`:
```html
<nav class="site-nav">
  {{ range .Site.Menus.main }}
    <a href="{{ .URL }}" {{ if $.IsMenuCurrent "main" . }}class="active"{{ end }}>{{ .Name }}</a>
  {{ end }}
  <button class="theme-toggle" aria-label="切换暗色模式">
    <span class="theme-toggle-icon"></span>
  </button>
</nav>
```

- [ ] **Step 6: 创建 footer partial**

`themes/myblog/layouts/partials/footer.html`:
```html
<footer class="site-footer">
  <p>&copy; {{ now.Format "2006" }} {{ .Site.Params.author }} · Powered by <a href="https://gohugo.io">Hugo</a></p>
</footer>
```

- [ ] **Step 7: 创建 baseof.html**

`themes/myblog/layouts/_default/baseof.html`:
```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
  {{ partial "head.html" . }}
  <body>
    {{ partial "header.html" . }}
    <main class="site-main">
      {{ block "main" . }}{{ end }}
    </main>
    {{ partial "footer.html" . }}
    {{ $js := resources.Get "js/theme.js" | minify | fingerprint }}
    <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
  </body>
</html>
```

- [ ] **Step 8: 创建空的 assets/css/main.scss 和 assets/js/theme.js 防止构建失败**

`assets/css/main.scss`:
```scss
body { margin: 0; }
```

`assets/js/theme.js`:
```js
console.log("blog");
```

_实际内容在后续 task 中替换。_

- [ ] **Step 9: 验证 Hugo 构建通过**

Run: `hugo build`
Expected: 无错误，输出到 `public/` 目录

- [ ] **Step 10: Commit**

```bash
git add themes/myblog/ assets/ && git commit -m "feat: add theme skeleton and base templates"
```

---

### Task 3: 编写 CSS 样式（排版、配色、布局、暗色模式）

**Files:**
- Modify: `assets/css/main.scss`

- [ ] **Step 1: 替换 main.scss 为完整样式**

`assets/css/main.scss`:
```scss
// Variables
$font-body: "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
$font-mono: "JetBrains Mono", "Fira Code", monospace;
$font-size: 18px;
$line-height: 1.8;
$max-width: 680px;
$color-bg: #fdfdfd;
$color-text: #333;
$color-muted: #888;
$color-accent: #2563eb;
$color-border: #eee;
$color-code-bg: #f5f5f5;

// Dark mode
:root {
  --bg: #{$color-bg};
  --text: #{$color-text};
  --muted: #{$color-muted};
  --accent: #{$color-accent};
  --border: #{$color-border};
  --code-bg: #{$color-code-bg};
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #d4d4d4;
  --muted: #777;
  --accent: #60a5fa;
  --border: #333;
  --code-bg: #252525;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #1a1a1a;
    --text: #d4d4d4;
    --muted: #777;
    --accent: #60a5fa;
    --border: #333;
    --code-bg: #252525;
  }
}

// Base
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: $font-size;
  line-height: $line-height;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: $font-body;
  color: var(--text);
  background: var(--bg);
  max-width: $max-width;
  margin: 0 auto;
  padding: 2rem 1rem;
}

// Links
a {
  color: var(--accent);
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

// Header & Nav
.site-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.site-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  &:hover { color: var(--accent); text-decoration: none; }
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;

  a {
    color: var(--muted);
    font-size: 0.95rem;
    &:hover, &.active { color: var(--accent); text-decoration: none; }
  }
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  &:hover { color: var(--accent); border-color: var(--accent); }
}

.theme-toggle-icon::before {
  content: "☀";
  [data-theme="dark"] & { content: "☽"; }
}

// Content
.site-main {
  min-height: 60vh;
}

// Typography
h1, h2, h3, h4, h5, h6 {
  line-height: 1.3;
  margin: 1.8em 0 0.6em;
  &:first-child { margin-top: 0; }
}

h1 { font-size: 1.8rem; }
h2 { font-size: 1.4rem; }
h3 { font-size: 1.15rem; }

p { margin: 0 0 1.2em; }

blockquote {
  margin: 1.5em 0;
  padding: 0.5em 1em;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  background: var(--code-bg);
}

code {
  font-family: $font-mono;
  font-size: 0.9em;
  background: var(--code-bg);
  padding: 0.15em 0.35em;
  border-radius: 3px;
}

pre {
  font-family: $font-mono;
  font-size: 0.85rem;
  line-height: 1.6;
  background: var(--code-bg);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  code {
    background: none;
    padding: 0;
    border-radius: 0;
  }
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2em 0;
}

// Post card (homepage & list)
.post-card {
  padding: 1.2em 0;
  border-bottom: 1px solid var(--border);

  h2 {
    margin: 0 0 0.2em;
    font-size: 1.2rem;
    a { color: var(--text); &:hover { color: var(--accent); text-decoration: none; } }
  }
}

.post-meta {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.5em;
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}

.post-summary {
  color: var(--muted);
  font-size: 0.95rem;
  margin: 0;
}

// Single post
.post-header {
  margin-bottom: 2em;
}

.post-content {
  margin-bottom: 3em;
}

.post-footer-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 3em;
  padding-top: 1.5em;
  border-top: 1px solid var(--border);
}

// Pagination
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 2em;
}

// Archive
.archive-year {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 2em 0 0.5em;
  color: var(--accent);
}

.archive-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3em 0;
  font-size: 0.95rem;
}

// Friends page
.friends-list {
  list-style: none;
  padding: 0;
  li {
    padding: 0.8em 0;
    border-bottom: 1px solid var(--border);
  }
}

// Search
.search-box {
  width: 100%;
  padding: 0.8em;
  font-size: 1rem;
  font-family: $font-body;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  margin-bottom: 2em;
  &:focus { outline: none; border-color: var(--accent); }
}

// Projects
.project-card {
  padding: 1em 0;
  border-bottom: 1px solid var(--border);
  h2 { margin: 0 0 0.2em; font-size: 1.15rem; }
  .project-links { margin-top: 0.3em; display: flex; gap: 1em; font-size: 0.9rem; }
}

// Comments
.comments {
  margin-top: 3em;
  padding-top: 1.5em;
  border-top: 1px solid var(--border);
}

// Footer
.site-footer {
  margin-top: 4em;
  padding-top: 1.5em;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
}

// 404
.error-page {
  text-align: center;
  padding: 4em 0;
  h1 { font-size: 4rem; margin: 0; color: var(--muted); }
}

// Responsive
@media (max-width: 480px) {
  body { padding: 1rem 0.8rem; }
  .site-header { flex-direction: column; align-items: flex-start; gap: 0.5em; }
  .site-nav { gap: 0.8rem; }
  html { font-size: 16px; }
}
```

- [ ] **Step 2: 验证 Hugo 构建通过且样式正确**

Run: `hugo build && ls public/css/`
Expected: 构建成功，`public/css/` 下有生成的 CSS 文件

- [ ] **Step 3: Commit**

```bash
git add assets/css/main.scss && git commit -m "feat: add complete CSS styles with dark mode"
```

---

### Task 4: 首页模板

**Files:**
- Create: `themes/myblog/layouts/index.html`
- Create: `themes/myblog/layouts/partials/post-card.html`
- Create: `themes/myblog/layouts/partials/pagination.html`
- Create: `themes/myblog/content/_index.md`

- [ ] **Step 1: 创建 post-card partial**

`themes/myblog/layouts/partials/post-card.html`:
```html
<article class="post-card">
  <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
  <div class="post-meta">
    <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006-01-02" }}</time>
    {{ with .Params.categories }}
      <span>{{ range . }}<a href="{{ "categories" | relURL }}/{{ . | urlize }}/">{{ . }}</a>{{ end }}</span>
    {{ end }}
  </div>
  {{ with .Description }}
    <p class="post-summary">{{ . }}</p>
  {{ else }}
    <p class="post-summary">{{ .Summary | truncate 150 }}</p>
  {{ end }}
</article>
```

- [ ] **Step 2: 创建 pagination partial**

`themes/myblog/layouts/partials/pagination.html`:
```html
{{ if gt .Paginator.TotalPages 1 }}
<nav class="pagination">
  {{ if .Paginator.HasPrev }}
    <a href="{{ .Paginator.Prev.URL }}">&larr; 较新</a>
  {{ else }}
    <span></span>
  {{ end }}
  {{ if .Paginator.HasNext }}
    <a href="{{ .Paginator.Next.URL }}">较旧 &rarr;</a>
  {{ else }}
    <span></span>
  {{ end }}
</nav>
{{ end }}
```

- [ ] **Step 3: 创建首页模板**

`themes/myblog/layouts/index.html`:
```html
{{ define "main" }}
  {{ $posts := where .Site.RegularPages "Type" "posts" }}
  {{ $paginator := .Paginate $posts 10 }}

  {{ range $paginator.Pages }}
    {{ partial "post-card.html" . }}
  {{ end }}

  {{ partial "pagination.html" . }}
{{ end }}
```

- [ ] **Step 4: 创建首页内容（content/_index.md 可选）**

`content/_index.md`:
```yaml
---
title: 首页
---
```

- [ ] **Step 5: Commit**

```bash
git add themes/myblog/layouts/index.html themes/myblog/layouts/partials/post-card.html themes/myblog/layouts/partials/pagination.html content/_index.md && git commit -m "feat: add home page template"
```

---

### Task 5: 列表和详情页模板（posts/notes/projects）

**Files:**
- Create: `themes/myblog/layouts/_default/list.html`
- Create: `themes/myblog/layouts/_default/single.html`
- Create: `themes/myblog/layouts/partials/post-meta.html`
- Create: `themes/myblog/layouts/projects/list.html`
- Create: `themes/myblog/layouts/projects/single.html`

- [ ] **Step 1: 创建 post-meta partial**

`themes/myblog/layouts/partials/post-meta.html`:
```html
<div class="post-meta">
  <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006-01-02" }}</time>
  {{ with .Params.categories }}
    {{ range . }}<a href="{{ "categories" | relURL }}/{{ . | urlize }}/">{{ . }}</a>{{ end }}
  {{ end }}
  {{ with .Params.tags }}
    {{ range . }}<a href="{{ "tags" | relURL }}/{{ . | urlize }}/">#{{ . }}</a>{{ end }}
  {{ end }}
</div>
```

- [ ] **Step 2: 创建默认列表模板**

`themes/myblog/layouts/_default/list.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ .Content }}
  {{ range .Paginator.Pages }}
    {{ partial "post-card.html" . }}
  {{ end }}
  {{ partial "pagination.html" . }}
{{ end }}
```

- [ ] **Step 3: 创建默认详情页模板**

`themes/myblog/layouts/_default/single.html`:
```html
{{ define "main" }}
  <article>
    <header class="post-header">
      <h1>{{ .Title }}</h1>
      {{ partial "post-meta.html" . }}
    </header>
    <div class="post-content">
      {{ .Content }}
    </div>
    <footer class="post-footer-nav">
      {{ with .PrevInSection }}
        <a href="{{ .RelPermalink }}">&larr; {{ .Title }}</a>
      {{ else }}
        <span></span>
      {{ end }}
      {{ with .NextInSection }}
        <a href="{{ .RelPermalink }}">{{ .Title }} &rarr;</a>
      {{ else }}
        <span></span>
      {{ end }}
    </footer>
  </article>
{{ end }}
```

- [ ] **Step 4: 创建项目列表页模板（网格布局）**

`themes/myblog/layouts/projects/list.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ .Content }}
  {{ range .Pages }}
    <article class="project-card">
      <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
      {{ with .Description }}<p>{{ . }}</p>{{ end }}
      {{ with .Params.tags }}
        <div class="post-meta">
          {{ range . }}<span>#{{ . }}</span>{{ end }}
        </div>
      {{ end }}
      <div class="project-links">
        {{ with .Params.link }}<a href="{{ . }}" target="_blank" rel="noopener">网站</a>{{ end }}
        {{ with .Params.repo }}<a href="{{ . }}" target="_blank" rel="noopener">GitHub</a>{{ end }}
      </div>
    </article>
  {{ end }}
{{ end }}
```

- [ ] **Step 5: 创建项目详情页模板**

`themes/myblog/layouts/projects/single.html`:
```html
{{ define "main" }}
  <article>
    <header class="post-header">
      <h1>{{ .Title }}</h1>
      <div class="post-meta">
        {{ .Date.Format "2006-01-02" }}
        {{ with .Params.tags }}{{ range . }}<span>#{{ . }}</span>{{ end }}{{ end }}
      </div>
      <div class="project-links">
        {{ with .Params.link }}<a href="{{ . }}" target="_blank" rel="noopener">网站</a>{{ end }}
        {{ with .Params.repo }}<a href="{{ . }}" target="_blank" rel="noopener">GitHub</a>{{ end }}
      </div>
    </header>
    <div class="post-content">
      {{ if .Params.image }}
        <img src="{{ .Params.image }}" alt="{{ .Title }}">
      {{ end }}
      {{ .Content }}
    </div>
  </article>
{{ end }}
```

- [ ] **Step 6: Commit**

```bash
git add themes/myblog/layouts/ && git commit -m "feat: add list and single page templates"
```

---

### Task 6: 分类/标签页模板

**Files:**
- Create: `themes/myblog/layouts/_default/terms.html`
- Create: `themes/myblog/layouts/_default/taxonomy.html`

- [ ] **Step 1: 创建 terms 模板（分类和标签总览）**

`themes/myblog/layouts/_default/terms.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  <ul>
    {{ range .Data.Terms.Alphabetical }}
      <li>
        <a href="{{ .Page.RelPermalink }}">{{ .Page.Title }}</a>
        <span>({{ .Count }})</span>
      </li>
    {{ end }}
  </ul>
{{ end }}
```

- [ ] **Step 2: 创建 taxonomy 模板（某个分类/标签下的文章列表）**

`themes/myblog/layouts/_default/taxonomy.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ range .Pages }}
    {{ partial "post-card.html" . }}
  {{ end }}
{{ end }}
```

- [ ] **Step 3: Commit**

```bash
git add themes/myblog/layouts/_default/terms.html themes/myblog/layouts/_default/taxonomy.html && git commit -m "feat: add taxonomy and terms page templates"
```

---

### Task 7: 归档页模板

**Files:**
- Create: `themes/myblog/layouts/_default/archives.html`

- [ ] **Step 1: 创建归档模板**

`themes/myblog/layouts/_default/archives.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ range (.Site.RegularPages.GroupByDate "2006") }}
    <div class="archive-year">{{ .Key }}</div>
    {{ range .Pages }}
      <div class="archive-item">
        <a href="{{ .RelPermalink }}">{{ .Title }}</a>
        <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "01-02" }}</time>
      </div>
    {{ end }}
  {{ end }}
{{ end }}
```

- [ ] **Note:** 归档页需要创建一个 content 页面来路由。将在 Task 9 中创建 `content/archives.md`。

- [ ] **Step 2: Commit**

```bash
git add themes/myblog/layouts/_default/archives.html && git commit -m "feat: add archives page template"
```

---

### Task 8: 暗色模式 JavaScript

**Files:**
- Modify: `assets/js/theme.js`

- [ ] **Step 1: 编写暗色模式切换逻辑**

`assets/js/theme.js`:
```js
(function () {
  const STORAGE_KEY = "theme";
  const DARK = "dark";
  const LIGHT = "light";

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply on load (before DOM ready to prevent flash)
  setTheme(getPreferredTheme());

  // Toggle button
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === DARK ? LIGHT : DARK);
    });
  });

  // Listen for system changes when no manual preference
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? DARK : LIGHT);
    }
  });
})();
```

- [ ] **Step 2: 验证 JS 构建**

Run: `hugo build && cat public/js/theme.*.js | head -3`
Expected: 构建成功，看到 minified 后的 JS

- [ ] **Step 3: Commit**

```bash
git add assets/js/theme.js && git commit -m "feat: add dark mode toggle JavaScript"
```

---

### Task 9: 内容页面（关于、友链、搜索、归档）及内容 Section 索引

**Files:**
- Create: `content/about.md`
- Create: `content/friends.md`
- Create: `content/search.md`
- Create: `content/archives.md`
- Create: `content/posts/_index.md`
- Create: `content/notes/_index.md`
- Create: `content/projects/_index.md`
- Create: `data/friends.json`

- [ ] **Step 1: 创建关于页面**

`content/about.md`:
```markdown
---
title: "关于"
date: 2026-05-24
layout: "single"
---

在这里写上你的个人介绍。
```

- [ ] **Step 2: 创建友链页面**

`content/friends.md`:
```markdown
---
title: "友链"
date: 2026-05-24
layout: "friends"
---

欢迎交换友链，联系我添加。
```

- [ ] **Step 3: 创建搜索页面**

`content/search.md`:
```markdown
---
title: "搜索"
date: 2026-05-24
layout: "search"
---

<input class="search-box" id="search" type="search" placeholder="输入关键词搜索...">
<div id="results"></div>
```

- [ ] **Step 4: 创建归档页面**

`content/archives.md`:
```markdown
---
title: "归档"
date: 2026-05-24
layout: "archives"
---
```

- [ ] **Step 5: 创建友链数据文件**

`data/friends.json`:
```json
[
  {
    "name": "示例博客",
    "url": "https://example.com",
    "description": "我朋友的博客"
  }
]
```

- [ ] **Step 6: 创建 Section 索引文件**

`content/posts/_index.md`:
```markdown
---
title: "文章"
---
```

`content/notes/_index.md`:
```markdown
---
title: "随笔"
---
```

`content/projects/_index.md`:
```markdown
---
title: "项目"
---
```

- [ ] **Step 7: 创建友链和搜索对应的布局模板**

`themes/myblog/layouts/_default/friends.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ .Content }}
  <ul class="friends-list">
    {{ range .Site.Data.friends }}
      <li>
        <a href="{{ .url }}" target="_blank" rel="noopener">{{ .name }}</a>
        {{ with .description }}<span style="color: var(--muted); font-size: 0.9rem;"> — {{ . }}</span>{{ end }}
      </li>
    {{ end }}
  </ul>
{{ end }}
```

`themes/myblog/layouts/_default/search.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ .Content }}
{{ end }}
```

- [ ] **Step 8: Commit**

```bash
git add content/ data/ themes/myblog/layouts/_default/friends.html themes/myblog/layouts/_default/search.html && git commit -m "feat: add content pages, sections, and friend links"
```

---

### Task 10: Archetypes（内容模板）

**Files:**
- Create: `archetypes/posts.md`
- Create: `archetypes/notes.md`
- Create: `archetypes/projects.md`

- [ ] **Step 1: 创建文章 archetype**

`archetypes/posts.md`:
```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date.Format "2006-01-02" }}
lastmod: {{ .Date.Format "2006-01-02" }}
description: ""
categories: [""]
tags: [""]
draft: true
---
```

- [ ] **Step 2: 创建随笔 archetype**

`archetypes/notes.md`:
```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date.Format "2006-01-02" }}
tags: [""]
draft: false
---
```

- [ ] **Step 3: 创建项目 archetype**

`archetypes/projects.md`:
```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date.Format "2006-01-02" }}
description: ""
tags: [""]
link: ""
repo: ""
image: ""
draft: true
---
```

- [ ] **Step 4: 验证 archetype**

Run: `hugo new posts/test-post.md && cat content/posts/test-post.md`
Expected: 生成带有正确 frontmatter 的 Markdown 文件

- [ ] **Step 5: 清理测试文件并 commit**

```bash
rm content/posts/test-post.md && git add archetypes/ && git commit -m "feat: add content archetypes"
```

---

### Task 11: 404 页面和 Static 文件

**Files:**
- Create: `themes/myblog/layouts/404.html`
- Create: `static/robots.txt`

- [ ] **Step 1: 创建 404 模板**

`themes/myblog/layouts/404.html`:
```html
{{ define "main" }}
  <div class="error-page">
    <h1>404</h1>
    <p>页面不存在</p>
    <p><a href="{{ .Site.BaseURL }}">返回首页</a></p>
  </div>
{{ end }}
```

- [ ] **Step 2: 创建 robots.txt**

`static/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: {{ .Site.BaseURL }}sitemap.xml
```

**Note:** 此文件需用 Hugo 模板语法，所以实际应放在 `layouts/robots.txt`。或者直接写硬编码 URL:

`static/robots.txt`:
```
User-agent: *
Allow: /
```

并在 `config/_default/hugo.toml` 已有 `enableRobotsTXT = true` 开启 Hugo 自动生成。

- [ ] **Step 3: 确认 Hugo 自动生成 robots.txt 和 sitemap.xml**

Run: `hugo build && ls public/robots.txt public/sitemap.xml 2>/dev/null`
Expected: 两个文件都存在

- [ ] **Step 4: Commit**

```bash
git add themes/myblog/layouts/404.html static/robots.txt && git commit -m "feat: add 404 page and static files"
```

---

### Task 12: 图片 Lightbox

**Files:**
- Create: `assets/js/lightbox.js`
- Modify: `themes/myblog/layouts/_default/baseof.html`

- [ ] **Step 1: 创建 lightbox.js**

`assets/js/lightbox.js`:
```js
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.style.cssText =
      "display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999;cursor:zoom-out;align-items:center;justify-content:center;";
    var img = document.createElement("img");
    img.style.cssText = "max-width:90vw;max-height:90vh;border-radius:4px;";
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function () {
      overlay.style.display = "none";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") overlay.style.display = "none";
    });

    document.querySelectorAll(".post-content img").forEach(function (el) {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", function () {
        img.src = el.src;
        overlay.style.display = "flex";
      });
    });
  });
})();
```

- [ ] **Step 2: 在 baseof.html 中加载 lightbox.js（合并到已有的 JS bundle）**

修改 `themes/myblog/layouts/_default/baseof.html` 中 `<script>` 加载部分。改为 Hugo Pipes 合并两个 JS 文件:

```html
    {{ $theme := resources.Get "js/theme.js" }}
    {{ $lightbox := resources.Get "js/lightbox.js" }}
    {{ $js := slice $theme $lightbox | resources.Concat "js/main.js" | minify | fingerprint }}
    <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
```

- [ ] **Step 3: 验证构建**

Run: `hugo build`
Expected: 构建成功

- [ ] **Step 4: Commit**

```bash
git add assets/js/lightbox.js themes/myblog/layouts/_default/baseof.html && git commit -m "feat: add image lightbox"
```

---

### Task 13: 示例内容

**Files:**
- Create: `content/posts/hello-world.md`

- [ ] **Step 1: 创建第一篇示例文章**

`content/posts/hello-world.md`:
```markdown
---
title: "你好，世界"
date: 2026-05-24
lastmod: 2026-05-24
description: "我的第一篇博客文章"
categories: ["技术"]
tags: ["博客", "Hugo"]
draft: false
---

欢迎来到我的博客。这是使用 Hugo 搭建的第一篇文章。

## 代码测试

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Hugo!")
}
```

## 图片测试

![示例图片](/images/placeholder.png)

## 引用测试

> 好的代码本身就是最好的文档。—— Steve McConnell
```

- [ ] **Step 2: 更新 about.md 为实际内容**

修改 `content/about.md` 的 Content 部分为占位文字。

- [ ] **Step 3: 构建并验证内容页面生成正确**

Run: `hugo build && ls public/posts/hello-world/`
Expected: 生成 `index.html` 文件

- [ ] **Step 4: Commit**

```bash
git add content/posts/hello-world.md content/about.md && git commit -m "feat: add sample first post"
```

---

### Task 14: Phase 2 - Waline 评论集成

**Files:**
- Create: `themes/myblog/layouts/partials/comments.html`
- Modify: `themes/myblog/layouts/_default/single.html`
- Modify: `themes/myblog/layouts/projects/single.html`

- [ ] **Step 1: 创建 Waline 评论 partial**

`themes/myblog/layouts/partials/comments.html`:
```html
{{ if and .Site.Params.waline.serverURL (not .Params.disableComments) }}
<div class="comments" id="comments">
  <h2>评论</h2>
  <script type="module">
    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
    init({
      el: '#comments',
      serverURL: '{{ .Site.Params.waline.serverURL }}',
      lang: 'zh-CN',
      dark: 'html[data-theme="dark"]',
    });
  </script>
</div>
{{ end }}
```

- [ ] **Step 2: 在 single.html 模板底部引入评论**

在 `themes/myblog/layouts/_default/single.html` 的 `</article>` 前添加：
```html
    {{ partial "comments.html" . }}
```

在 `themes/myblog/layouts/projects/single.html` 的 `</article>` 前添加：
```html
    {{ partial "comments.html" . }}
```

- [ ] **Step 3: 在 params.toml 中添加 Waline 配置占位**

在 `config/_default/params.toml` 末尾添加：
```toml
[params.waline]
  serverURL = ""  # 填入 LeanCloud 部署后获得的 URL
```

- [ ] **Step 4: Commit**

```bash
git add themes/myblog/layouts/partials/comments.html themes/myblog/layouts/_default/single.html themes/myblog/layouts/projects/single.html config/_default/params.toml && git commit -m "feat: add Waline comments integration"
```

---

### Task 15: Phase 2 - Pagefind 搜索集成

**Files:**
- Modify: `themes/myblog/layouts/_default/search.html`
- Create: `.github/workflows/deploy.yml` (search integration added later in Task 16)

- [ ] **Step 1: 更新搜索模板，加入 Pagefind UI**

`themes/myblog/layouts/_default/search.html`:
```html
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  <div class="search-box-wrapper">
    <input class="search-box" id="search" type="search" placeholder="输入关键词搜索...">
  </div>
  <div id="results"></div>

  <link href="/pagefind/pagefind-ui.css" rel="stylesheet">
  <script src="/pagefind/pagefind-ui.js"></script>
  <script>
    window.addEventListener('DOMContentLoaded', function () {
      new PagefindUI({
        element: '#results',
        showSubResults: true,
        showImages: false,
      });
    });
  </script>
{{ end }}
```

- [ ] **Step 2: 验证本地构建（Pagefind 在构建后运行）**

Run: `hugo build`
Expected: 构建成功，搜索页面生成

- [ ] **Step 3: Commit**

```bash
git add themes/myblog/layouts/_default/search.html && git commit -m "feat: add Pagefind search integration"
```

---

### Task 16: GitHub Actions 自动部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建 deploy workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy Hugo

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: false

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.146.5"
          extended: true

      - name: Build
        run: hugo --minify

      - name: Setup Pagefind
        run: |
          npx pagefind --site public

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml && git commit -m "feat: add GitHub Actions deployment workflow"
```

---

### Task 17: 最终验证

- [ ] **Step 1: 完整构建**

Run: `hugo build --minify`
Expected: 无错误，`public/` 目录包含所有页面

- [ ] **Step 2: 验证输出文件**

Run: `find public -name "*.html" | sort`
Expected: 包含首页、文章、随笔、项目、关于、友链、搜索、归档、404、分类、标签、RSS、sitemap

- [ ] **Step 3: 启动 Hugo 开发服务器验证**

Run: `hugo server -D`（在后台运行，手动在浏览器打开 `http://localhost:1313`）

- [ ] **Step 4: 最终 commit**

```bash
git add -A && git commit -m "chore: final verification and cleanup"
```

---

### 后续手动步骤（不在本次实现范围）

1. 在 GitHub 创建仓库，推送代码
2. 在仓库 Settings > Pages 中启用 GitHub Pages（Source: GitHub Actions）
3. 设置自定义域名（如有需要）
4. 注册 LeanCloud 账号，创建 Waline 应用，填入 `params.toml`
5. 更换 `hugo.toml` 中的 `baseURL` 为实际域名
6. 更新 `about.md` 为真实个人介绍
7. 替换 `data/friends.json` 为真实友链
