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
| 图标 | [Game-Icon-Pack](https://github.com/Nieobie/Game-Icon-Pack)—全圆角风格，以原生内联 SVG 组件形式收编（**零 npm 图标依赖**，经 `components/ui/icon.tsx` 按名取用） |
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
│   ├── globals.css       # 全局样式 + MD3 CSS 变量 + .glass-panel / .aki-immersive-bg / .aki-side-art / .prose-aki
│   ├── layout.tsx        # 全局根布局（纯编排：ThemeProvider + Sidebar + Header + main + footer）
│                         #   Header 顶部毛玻璃遮罩条内含面包屑导航（桌面端）
│   ├── page.tsx          # 首页文章流控制器（仅展示最新全量文章流，与分类路由解耦）
│   ├── posts/[slug]/     # 文章详情（generateStaticParams 静态生成 + generateMetadata）
│   ├── archive/          # 归档：按年份分组
│   ├── categories/       # 文章分类总览 + [category]/ 四个分类子页（SSG：tech/anime/life/notes）
│   ├── projects/         # 项目 / 作品总览 + [category]/ 三个分类子页（SSG：blog-source/personal/oss）
│   └── about/            # 关于：作者简介 + 社交外链
├── components/           # 【表现层】纯展示 UI 组件（仅靠 props 渲染）
│   ├── blog/             # 博客业务组件：PostCard、PostList、PostMeta、PostBody、SiteHero
│   ├── projects/         # 项目业务组件：ProjectCard、ProjectList
│   ├── layout/           # 结构级组件：Sidebar、Header、NavLinks（主导航，含「项目/作品」「文章分类」两组二级菜单）、Breadcrumbs（顶部面包屑）
│   ├── providers/        # 客户端上下文：ThemeProvider（包裹 next-themes）
│   └── ui/               # 原子级组件：Badge、Icon、ThemeToggle、Reveal、Avatar（站长头像，next/image）、CursorFx（自定义指针+涟漪交互层）
│       └── icons/        # Game-Icon-Pack 图标系统：index.ts（注册表）+ game/*.tsx（内联 SVG）
├── data/                 # 【静态配置层】navigation.ts（导航：href 可选 + 一级二级菜单 + desktopOnly；「文章分类」「项目/作品」二级由 categoryItems / projects 派生，含 CATEGORIES_BASE_PATH/categoryHref，分类子项跳转 /categories/<key>）、projects.ts（项目分类）、site-config.ts（站点+作者信息）
├── hooks/                # 【状态逻辑层】自定义 React Hooks（use-pointer-fx：自定义指针跟随 + 移动/点击涟漪逻辑）
├── lib/                  # 【核心服务层】mdx.ts（Markdown 解析 + slug→标题/分类映射）、breadcrumbs.ts（路由→面包屑层级纯函数，文章页穿过所属分类对齐「项目」格式）、motion.ts（动效变体）、utils.ts（cn()）
└── types/                # 【类型层】blog.ts → 文章数据字典；project.ts → 项目数据字典（ProjectCategory / ProjectItem）

scripts/
└── sync-game-icons.mjs   # 【开发工具】零依赖：清洗选定 Game-Icon-Pack SVG → 内联组件 + 注册表
```

完整拓扑及各层职责见 [`AGENTS.md` §2](./AGENTS.md)。

## MD3 主题与暗黑模式

- 所有 MD3 色彩（Primary / Secondary / Tertiary / Surface / Background / Outline 等）在 `src/app/globals.css` 中以 `--md-sys-color-*` CSS 变量声明，亮色挂在 `:root`、暗色挂在 `.dark`。
- `tailwind.config.ts` 将这些变量映射为嵌套色彩令牌，从而生成 `bg-surface`、`text-surface-onVariant`、`bg-secondary-container`、`bg-tertiary-container` 等贴合设计语义的工具类。
- 暗黑模式采用 **`darkMode: 'class'`** + `next-themes`：在根节点挂载 `.dark` 类即可整站换肤；`body` 上的 `transition-colors` 让切换过程平滑无闪烁。
- 复用型毛玻璃面板统一封装为 `.glass-panel`；首页四角的樱花 / 天空光晕用 `.aki-immersive-bg`（基于 `color-mix()` 取自 MD3 容器令牌，随主题自适应换色）。
- 右侧立绘背景用 `.aki-side-art`：以 `public/images/Alona_bg.jpg` 为满幅装饰，固定铺满视口右半区、贴右下对齐，左侧用 `mask-image` 柔和淡出以保证正文可读；仅桌面端（`md` 及以上）显示，移动端隐藏，亮 / 暗模式分别用不同透明度适配。要换立绘只需替换该图片或改 `.aki-side-art` 里的路径。
- 文章正文用自维护的 `.prose-aki` 组件层排版，颜色严格绑定 MD3 令牌，未引入额外排版插件。

## 图标系统（Game-Icon-Pack，零 npm 图标依赖）

图标来自开源的 [Game-Icon-Pack](https://github.com/Nieobie/Game-Icon-Pack)（全圆角、无尖锐边缘，贴合本站 MD3 + 玻璃拟态美学）。依据「零冗余依赖」原则，我们 **不安装任何 npm 图标包**，而是把用到的 SVG 收编为原生内联 React 组件。

- **结构**：`src/components/ui/icons/game/*.tsx` 每图标一个组件 → `icons/index.ts` 汇总为 `gameIconRegistry`（语义名 → 组件）。
- **用法**：`<Icon name="home" className="h-5 w-5 text-brand-primary" />`。数据层（`navigation.ts` / `site-config.ts`）只存语义名字符串，与图标实现解耦。
- **上色**：源 SVG 为单色路径、已剔除 `fill`，组件继承 `currentColor`，故可被任意 MD3 颜色令牌（`text-primary` / `text-surface-onVariant` …）染色；默认尺寸 `h-5 w-5`，可用 `className` 覆盖。
- **已登记图标**：`home`、`archive`、`user`、`folder`（主导航，`folder` 为「项目 / 作品」一级入口）；`code`、`sparkle`、`daily`、`notes`（文章分类）；`code`、`laptop`、`heart`（项目二级菜单：博客源码 / 个人项目 / 开源贡献）；`rss`、`mail`（社交）；`calendar`、`clock`、`tag`（文章元信息）；`arrow-left`、`chevron-down`、`dark-mode`、`light-mode`（交互，`chevron-down` 为二级菜单展开指示）；`cursor`（自定义鼠标指针，源 `3.Editing Tools/cursor-default.svg`）。
- **新增 / 替换图标**：从图标包 Releases 下载 SVG，在 `scripts/sync-game-icons.mjs` 的 `ICON_MAP` 里登记「语义名 → `<分类>/<文件>.svg`」，再运行：
  ```bash
  GAME_ICON_SRC=/path/to/Game-Icon-Pack/svg-v1.0.3 node scripts/sync-game-icons.mjs
  ```
  脚本会自动清洗并生成 `game/*.tsx` 与 `index.ts`（均已提交，**请勿手改**）。

## 自定义鼠标指针与涟漪动效

全站把系统原生箭头替换为 Game-Icon-Pack 的 `cursor` 图标，并在鼠标移动 / 点击时绽放涟漪，强化二次元交互气质。

- **结构**：逻辑收口于 `src/hooks/use-pointer-fx.ts`（设备探测、坐标跟随、涟漪节流与生成），表现交给客户端叶子 `src/components/ui/cursor-fx.tsx`（只渲染静态骨架并把 DOM 引用交给 Hook，在 `layout.tsx` 内挂载一次）。
- **性能**：指针位置由 `requestAnimationFrame` 每帧指数缓动并**直接改写 DOM transform**，涟漪以原生节点 `appendChild` 生成、`animationend` 自移除——全程**零 React 重渲染**，消除高频移动时的卡顿与跟手延迟（§1.5）。
- **指针**：复用注册表里的 `<Icon name="cursor" />`，用 MD3 令牌 `text-brand-primary` 上色，**随亮 / 暗主题自动换色**；箭尖热点已按 10×10 viewBox 校正，点击点与视觉箭尖对齐。
- **涟漪**：移动 = 薰衣草（tertiary）细环，点击 = **MD3 primary 蓝 → 白的径向渐变**晕开；关键帧 `aki-cursor-ripple` 定义在 `globals.css`。移动涟漪按「距离 + 时间」双重节流，避免 DOM 堆积。
- **降级与无障碍**：仅在「精细指针」（`pointer: fine`，鼠标 / 触控板）设备启用并隐藏原生指针（`html.cursor-fx-active` → `cursor: none`）；触屏自动回退系统交互，`prefers-reduced-motion` 下不生成涟漪。整层 `aria-hidden` + `pointer-events-none`，绝不拦截点击。

## 编码约定（摘要）

- **全中文注释**：核心逻辑 / 解析函数 / 复杂转换需用中文解释「为什么」。
- **严格语义化 HTML**：`<main>`/`<header>`/`<nav>`/`<aside>`/`<section>`/`<article>`/`<time>`，杜绝 div 汤。
- **数据-UI 分离**：`page.tsx` 只做取数 + 编排；文章放 `content/`、配置放 `data/`；组件仅靠 props 渲染。
- **RSC 优先**：`app/` 默认服务端组件，`"use client"` 只下沉到最小交互叶子组件（ThemeToggle、NavLinks、PostList、Reveal、CursorFx）。
- **动态类名**：一律走 `cn()`；MD3 色彩禁止硬编码 hex。

详尽规则与代码黄金范式见 [`AGENTS.md`](./AGENTS.md)。
