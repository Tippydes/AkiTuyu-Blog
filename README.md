# AkiTuyu 🌸 — 秋天的二次元小屋

一个高度美学化的**个人二次元博客**：记录技术随笔、番剧杂感与日常碎碎念。设计语言取自 Mizuki 博客主题，落地新一代 **Material Design 3（MD3）** 风格，带有极客 / 二次元气质，毛玻璃面板 + 樱花色沉浸背景，支持亮 / 暗双模式平滑切换。文章以本地 Markdown 文件撰写，构建时解析渲染。

> 本仓库的所有编码标准与目录规范以根目录 [`AGENTS.md`](./AGENTS.md) 为**绝对真理源**。改代码前请先阅读它。

## 技术栈

| 维度 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router，Turbopack，React Compiler） |
| 语言 | TypeScript（`strict`） |
| 样式 | Tailwind CSS **v4**（MD3 色彩令牌 + 毛玻璃工具类 + `.prose-aki` 正文排版） |
| 内容 | 本地 Markdown（`content/posts/*.md`），由 `gray-matter` 解析 Frontmatter、`marked` 渲染正文 |
| 主题 | `next-themes`（`class` 策略的亮 / 暗切换） |
| 动效 | `framer-motion`（卡片交错入场、上浮淡入） |
| 图标 | `lucide-react`（经 `components/ui/icon.tsx` 按名取用） |
| 类名合并 | `clsx` + `tailwind-merge`（封装为 `cn()`） |
| 字体 | `next/font/google` — Inter（变量字体） |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 3. 生产构建 / 启动
npm run build
npm run start

# 4. 代码规范检查
npm run lint
```

## 写一篇新文章

在 `content/posts/` 下新建一个 `.md` 文件，文件名即文章 `slug`（如 `my-post.md` → `/posts/my-post`）。文件顶部用 Frontmatter 声明元信息：

```markdown
---
title: "文章标题"
date: "2026-05-28"            # ISO 日期 YYYY-MM-DD，用于排序与 <time>
excerpt: "列表/卡片中展示的摘要"
category: "tech"              # tech | anime | life | notes
tags: ["标签A", "标签B"]
cover: "linear-gradient(135deg, #ffd1e8 0%, #d1e4ff 100%)"   # 可选，卡片封面（CSS 渐变或图片地址）
---

正文用标准 Markdown 书写（标题、列表、引用、代码块均会套用 `.prose-aki` 排版）。
```

阅读时长、本地化日期、按年份归档等派生字段全部由 `src/lib/mdx.ts` 自动计算，无需手填。

## 目录结构

```text
content/
└── posts/                # 【内容层】本地 Markdown 文章（lib/mdx.ts 的数据源）

src/
├── app/                  # 【页面层】路由 + 数据读取 + 页面编排（RSC）
│   ├── globals.css       # 全局样式 + MD3 CSS 变量 + .glass-panel / .aki-immersive-bg / .prose-aki
│   ├── layout.tsx        # 全局根布局（纯编排：ThemeProvider + Sidebar + Header + main + footer）
│   ├── page.tsx          # 首页文章流控制器（读取 ?category 筛选）
│   ├── posts/[slug]/     # 文章详情（generateStaticParams 静态生成 + generateMetadata）
│   ├── archive/          # 归档：按年份分组
│   └── about/            # 关于：作者简介 + 社交外链
├── components/           # 【表现层】纯展示 UI 组件（仅靠 props 渲染）
│   ├── blog/             # 博客业务组件：PostCard、PostList、PostMeta、PostBody、SiteHero
│   ├── layout/           # 结构级组件：Sidebar、Header、NavLinks
│   ├── providers/        # 客户端上下文：ThemeProvider（包裹 next-themes）
│   └── ui/               # 原子级组件：Badge、Icon、ThemeToggle、Reveal
├── data/                 # 【静态配置层】navigation.ts（导航+分类矩阵）、site-config.ts（站点+作者信息）
├── hooks/                # 【状态逻辑层】自定义 React Hooks
├── lib/                  # 【核心服务层】mdx.ts（Markdown 解析）、motion.ts（动效变体）、utils.ts（cn()）
└── types/                # 【类型层】blog.ts → 文章数据字典（Post / PostSummary / PostArchiveGroup）
```

完整拓扑及各层职责见 [`AGENTS.md` §2](./AGENTS.md)。

## MD3 主题与暗黑模式

- 所有 MD3 色彩（Primary / Secondary / Tertiary / Surface / Background / Outline 等）在 `src/app/globals.css` 中以 `--md-sys-color-*` CSS 变量声明，亮色挂在 `:root`、暗色挂在 `.dark`。
- `tailwind.config.ts` 将这些变量映射为嵌套色彩令牌，从而生成 `bg-surface`、`text-surface-onVariant`、`bg-secondary-container`、`bg-tertiary-container` 等贴合设计语义的工具类。
- 暗黑模式采用 **`darkMode: 'class'`** + `next-themes`：在根节点挂载 `.dark` 类即可整站换肤；`body` 上的 `transition-colors` 让切换过程平滑无闪烁。
- 复用型毛玻璃面板统一封装为 `.glass-panel`；首页四角的樱花 / 天空光晕用 `.aki-immersive-bg`（基于 `color-mix()` 取自 MD3 容器令牌，随主题自适应换色）。
- 文章正文用自维护的 `.prose-aki` 组件层排版，颜色严格绑定 MD3 令牌，未引入额外排版插件。

## 编码约定（摘要）

- **全中文注释**：核心逻辑 / 解析函数 / 复杂转换需用中文解释「为什么」。
- **严格语义化 HTML**：`<main>`/`<header>`/`<nav>`/`<aside>`/`<section>`/`<article>`/`<time>`，杜绝 div 汤。
- **数据-UI 分离**：`page.tsx` 只做取数 + 编排；文章放 `content/`、配置放 `data/`；组件仅靠 props 渲染。
- **RSC 优先**：`app/` 默认服务端组件，`"use client"` 只下沉到最小交互叶子组件（ThemeToggle、NavLinks、PostList、Reveal）。
- **动态类名**：一律走 `cn()`；MD3 色彩禁止硬编码 hex。

详尽规则与代码黄金范式见 [`AGENTS.md`](./AGENTS.md)。
