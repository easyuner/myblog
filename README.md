# myblog

基于 [Hugo](https://gohugo.io) 的个人博客，部署在 GitHub Pages。

## 目录结构

```
├── config/_default/     # Hugo 配置
├── content/
│   ├── posts/           # 技术文章
│   ├── notes/           # 随笔
│   └── projects/        # 项目展示
├── themes/myblog/       # 自定义主题
├── assets/              # SCSS / JS
└── data/                # 友链等数据文件
```

## 发布文章

```bash
# 1. 创建文章
hugo new posts/文章文件名.md

# 2. 编辑 content/posts/文章文件名.md
#    - 修改 frontmatter：categories、tags、description
#    - 将 draft: true 改为 draft: false
#    - 写正文（Markdown）

# 3. 本地预览
hugo server -D
# 浏览器打开 http://localhost:1313/，确认无误后 Ctrl+C 停止

# 4. 构建并部署
hugo --minify
git add .
git commit -m "add: 文章标题"
git push
```

推送后 GitHub Actions 自动构建部署，稍等片刻即可在 https://easyuner.github.io/myblog/ 看到新文章。

## 本地开发

```bash
# 安装 Hugo (macOS)
brew install hugo

# 启动开发服务器（含草稿）
hugo server -D

# 构建
hugo --minify
```
