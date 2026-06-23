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
| 动效 | `framer-motion`（卡片交错入场、上浮淡入、文章页侧边栏隐藏 + TOC 展开/收起动画） |
| 图标 | [Game-Icon-Pack](https://github.com/Nieobie/Game-Icon-Pack)—全圆角风格，以原生内联 SVG 组件形式收编（**零 npm 图标依赖**，经 `components/ui/icon.tsx` 按名取用） |
| 类名合并 | `clsx` + `tailwind-merge`（封装为 `cn()`） |
| 字体 | [Maruko Gothic CJK SC](https://github.com/max32002/maruko-gothic)（まるこゴシック 简体中文版）— 圆体风格，`next/font/local` 自托管 woff2（Light 300 / Regular 400 / Medium 500） |

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
cover: "/images/my-cover.png"   # 可选，卡片封面：public 下图片路径（next/image 渲染）或 CSS 渐变串；省略则回退到站点占位图
---

正文用标准 Markdown 书写（标题、列表、引用、代码块均会套用 `.prose-aki` 排版）。
```

阅读时长、本地化日期、按年份归档等派生字段全部由 `src/lib/mdx.ts` 自动计算，无需手填。

> 📌 **卡片封面**：`cover` 省略时，卡片封面区统一回退到 `data/site-config.ts` 的 `placeholderCover` 占位图（默认 `/images/Node.js_logo.svg.png`，以 `next/image` `object-contain` 居中展示）；换全站占位图只需改这一处配置。若 `cover` 填 public 下图片路径，则按真实封面 `object-cover` 满铺；填 CSS 渐变串则铺为渐变色块。

## 目录结构

```text
content/
└── posts/                # 【内容层】本地 Markdown 文章（lib/mdx.ts 的数据源）

public/
└── fonts/                # Maruko Gothic CJK SC woff2 自托管字体文件（Light/Regular/Medium）

src/
├── app/                  # 【页面层】路由 + 数据读取 + 页面编排（RSC）
│   ├── globals.css       # 全局样式 + MD3 CSS 变量 + .glass-panel / .aki-immersive-bg / .aki-side-art / .prose-aki
│   ├── layout.tsx        # 全局根布局（纯编排：ThemeProvider + Sidebar + Header + main + footer）
│                         #   Header 顶部毛玻璃遮罩条内含面包屑导航（桌面端）
│   ├── not-found.tsx     # 自定义 404（RSC）：渲染在根布局内、不铺不透明底，背景立绘照常透出
│   ├── error.tsx         # 自定义运行时错误边界（CC）：同理保留背景，提供重试 / 返回首页
│   ├── page.tsx          # 首页文章流控制器（仅展示最新全量文章流，与分类路由解耦）
│   ├── posts/[slug]/     # 文章详情（generateStaticParams 静态生成 + generateMetadata）
│   ├── archive/          # 归档：按年份分组
│   ├── categories/       # 文章分类总览 + [category]/ 四个分类子页（SSG：tech/anime/life/notes）
│   ├── projects/         # 项目 / 作品总览 + [category]/ 三个分类子页（SSG：blog-source/personal/oss）
│   └── about/            # 关于：作者简介 + 社交外链
├── components/           # 【表现层】纯展示 UI 组件（仅靠 props 渲染）
│   ├── blog/             # 博客业务组件：PostCard、PostList、PostMeta、PostBody、SiteHero、PostArticleLayout（目录状态+文章偏移，偏移仅桌面端生效）、TableOfContents（浮动目录卡片）
│   ├── projects/         # 项目业务组件：ProjectCard、ProjectList
│   ├── layout/           # 结构级组件：Sidebar、Header、NavLinks、Breadcrumbs、LayoutShell（文章页侧边栏隐藏动画壳）
│   ├── providers/        # 客户端上下文：ThemeProvider（包裹 next-themes）
│   └── ui/               # 原子级组件：Badge、Icon、ThemeToggle、Reveal、Avatar（站长头像，next/image）
│       └── icons/        # Game-Icon-Pack 图标系统：index.ts（注册表）+ game/*.tsx（内联 SVG）
├── data/                 # 【静态配置层】navigation.ts（导航：href 可选 + 一级二级菜单 + desktopOnly；「文章分类」「项目/作品」二级由 categoryItems / projects 派生，含 CATEGORIES_BASE_PATH/categoryHref，分类子项跳转 /categories/<key>）、projects.ts（项目分类）、site-config.ts（站点+作者信息+文章卡片占位图 placeholderCover）
├── hooks/                # 【状态逻辑层】自定义 React Hooks：use-media-query.ts（原生 matchMedia + useSyncExternalStore 的断点匹配 Hook）
├── lib/                  # 【核心服务层】mdx.ts（Markdown 解析 + slug→标题/分类映射 + 标题提取与键入供 TOC）、breadcrumbs.ts、motion.ts、utils.ts
└── types/                # 【类型层】blog.ts → 文章数据字典（含 TocHeading）；project.ts → 项目数据字典

scripts/
└── sync-game-icons.mjs   # 【开发工具】零依赖：清洗选定 Game-Icon-Pack SVG → 内联组件 + 注册表
```

完整拓扑及各层职责见 [`AGENTS.md` §2](./AGENTS.md)。

## MD3 主题与暗黑模式

- 所有 MD3 色彩（Primary / Secondary / Tertiary / Surface / Background / Outline 等）在 `src/app/globals.css` 中以 `--md-sys-color-*` CSS 变量声明，亮色挂在 `:root`、暗色挂在 `.dark`。
- `tailwind.config.ts` 将这些变量映射为嵌套色彩令牌，从而生成 `bg-surface`、`text-surface-onVariant`、`bg-secondary-container`、`bg-tertiary-container` 等贴合设计语义的工具类。
- 暗黑模式采用 **`darkMode: 'class'`** + `next-themes`：在根节点挂载 `.dark` 类即可整站换肤；`body` 上的 `transition-colors` 让切换过程平滑无闪烁。
- 实底背景铺在 `<html>`（**而非 `body`**）并设 `overscroll-behavior-y: none`：避免手机浏览器滚到底回弹时露出无背景的根元素、被毛玻璃卡片采样到「浏览器顶栏」鬼影；实底随 `.dark` 自动换色，符合亮 / 暗对称。**关键**：`body` 必须保持透明（`layout.tsx` 的 `bodyStyles` 不含 `bg-*`），否则 `body` 的不透明背景会盖住挂在其内、`z-index:-10` 的 `.aki-side-art` / `.aki-immersive-bg` 立绘层，导致背景图消失。
- 复用型毛玻璃面板统一封装为 `.glass-panel`；首页四角的樱花 / 天空光晕用 `.aki-immersive-bg`（基于 `color-mix()` 取自 MD3 容器令牌，随主题自适应换色）。
- 右侧立绘背景用 `.aki-side-art`（**焦点配置系统**）：图片路径、`background-position`（焦点）、`background-size`、容器宽度和暗色遮罩模式全部由 `data/site-config.ts` 的 `heroBackground` 字段驱动，通过 CSS 自定义属性注入——换图只需改配置，无需动 CSS 或组件代码。亮色模式无遮罩（全图通透展示），暗色模式可选 `vignette`（四周暗角）/ `gradient-left`（左侧渐隐）/ `bottom-fade`（底部渐隐）/ `none`。仅桌面端显示，亮 / 暗分别用不同透明度适配。
- 文章正文用自维护的 `.prose-aki` 组件层排版，颜色严格绑定 MD3 令牌，未引入额外排版插件。
- 错误页（`app/not-found.tsx` 404、`app/error.tsx` 运行时错误边界）均自定义：Next.js 内置默认 UI 会铺满屏白色实底盖住 `-z-10` 立绘背景，故两页改为渲染在根布局内、只用 `.glass-panel` 卡片承载文案而不铺全屏不透明底，使背景图照常透出（`error.tsx` 按 Next 规定为客户端组件，提供 `reset()` 重试与返回首页入口）。

## 图标系统（Game-Icon-Pack，零 npm 图标依赖）

图标来自开源的 [Game-Icon-Pack](https://github.com/Nieobie/Game-Icon-Pack)（全圆角、无尖锐边缘，贴合本站 MD3 + 玻璃拟态美学）。依据「零冗余依赖」原则，我们 **不安装任何 npm 图标包**，而是把用到的 SVG 收编为原生内联 React 组件。

- **结构**：`src/components/ui/icons/game/*.tsx` 每图标一个组件 → `icons/index.ts` 汇总为 `gameIconRegistry`（语义名 → 组件）。
- **用法**：`<Icon name="home" className="h-5 w-5 text-brand-primary" />`。数据层（`navigation.ts` / `site-config.ts`）只存语义名字符串，与图标实现解耦。
- **上色**：源 SVG 为单色路径、已剔除 `fill`，组件继承 `currentColor`，故可被任意 MD3 颜色令牌（`text-primary` / `text-surface-onVariant` …）染色；默认尺寸 `h-5 w-5`，可用 `className` 覆盖。
- **已登记图标**：`home`、`archive`、`user`、`folder`（主导航，`folder` 为「项目 / 作品」一级入口）；`code`、`sparkle`、`daily`、`notes`（文章分类）；`code`、`laptop`、`heart`（项目二级菜单：博客源码 / 个人项目 / 开源贡献）；`rss`、`mail`（社交）；`calendar`、`clock`、`tag`（文章元信息）；`arrow-left`、`chevron-down`、`dark-mode`、`light-mode`（交互，`chevron-down` 为二级菜单展开指示）。
- **新增 / 替换图标**：从图标包 Releases 下载 SVG，在 `scripts/sync-game-icons.mjs` 的 `ICON_MAP` 里登记「语义名 → `<分类>/<文件>.svg`」，再运行：
  ```bash
  GAME_ICON_SRC=/path/to/Game-Icon-Pack/svg-v1.0.3 node scripts/sync-game-icons.mjs
  ```
  脚本会自动清洗并生成 `game/*.tsx` 与 `index.ts`（均已提交，**请勿手改**）。

## 编码约定（摘要）

- **全中文注释**：核心逻辑 / 解析函数 / 复杂转换需用中文解释「为什么」。
- **严格语义化 HTML**：`<main>`/`<header>`/`<nav>`/`<aside>`/`<section>`/`<article>`/`<time>`，杜绝 div 汤。
- **数据-UI 分离**：`page.tsx` 只做取数 + 编排；文章放 `content/`、配置放 `data/`；组件仅靠 props 渲染。
- **RSC 优先**：`app/` 默认服务端组件，`"use client"` 只下沉到最小交互叶子组件（ThemeToggle、NavLinks、PostList、Reveal、LayoutShell、PostArticleLayout、TableOfContents）。
- **动态类名**：一律走 `cn()`；MD3 色彩禁止硬编码 hex。

详尽规则与代码黄金范式见 [`AGENTS.md`](./AGENTS.md)。
