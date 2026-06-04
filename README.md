# AkiPrompt 🌸 — Next-Gen MD3 Prompt Workspace

高度美学化、可交互的**提示词工程工作台**。设计语言取自 Mizuki 博客主题，落地新一代 **Material Design 3（MD3）** 风格，带有极客 / 二次元气质，支持亮 / 暗双模式平滑切换。

> 本仓库的所有编码标准与目录规范以根目录 [`AGENTS.md`](./AGENTS.md) 为**绝对真理源**。改代码前请先阅读它。

## 技术栈

| 维度 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router，Turbopack，React Compiler） |
| 语言 | TypeScript（`strict`） |
| 样式 | Tailwind CSS **v4**（MD3 色彩令牌 + 毛玻璃工具类） |
| 类名合并 | `clsx` + `tailwind-merge`（封装为 `cn()`） |
| 字体 | `next/font/google` — Inter（变量字体） |
| 规划中（尚未安装） | Framer Motion（动效）、Lucide React（图标） |

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

## 目录结构

```text
src/
├── app/                  # 【页面层】路由 + 数据读取 + 页面编排（RSC）
│   ├── globals.css       # 全局样式 + MD3 CSS 变量 + @config 挂载
│   ├── layout.tsx        # 全局根布局（纯编排：Sidebar + Header + main）
│   └── page.tsx          # 提示词工作台主页控制器
├── components/           # 【表现层】纯展示 UI 组件（仅靠 props 渲染）
│   ├── layout/           # 结构级组件：Sidebar、Header
│   ├── prompt/           # 提示词业务组件：WorkspaceIntro（后续 PromptCard / Workspace）
│   └── ui/               # 原子级基础组件：Button、Badge 等
├── data/                 # 【静态配置层】navigation.ts（导航矩阵）、site-config.ts（站点元数据）
├── hooks/                # 【状态逻辑层】自定义 React Hooks
├── lib/                  # 【核心服务层】utils.ts → cn() 类名合并器
└── types/                # 【类型层】prompt.ts → 提示词 / 工作流类型字典
```

完整拓扑及各层职责见 [`AGENTS.md` §2](./AGENTS.md)。

## MD3 主题与暗黑模式

- 所有 MD3 色彩（Primary / Surface / Background / Outline 等）在 `src/app/globals.css` 中以 `--md-sys-color-*` CSS 变量声明，亮色挂在 `:root`、暗色挂在 `.dark`。
- `tailwind.config.ts` 将这些变量映射为嵌套色彩令牌，从而生成 `bg-surface`、`text-surface-onVariant`、`text-brand-onPrimaryContainer` 等贴合设计语义的工具类。
- 暗黑模式采用 **`darkMode: 'class'`**：只需在根节点挂载 `.dark` 类即可整站换肤；`body` 上的 `transition-colors` 让切换过程平滑无闪烁。
- 复用型毛玻璃面板统一封装为 `.glass-panel` 工具类。

> 客户端的明暗切换（注入 `.dark`）将由后续接入的 `next-themes` 等方案在叶子组件中处理；根布局已预留 `suppressHydrationWarning` 以规避 SSR 类名不一致告警。

## 编码约定（摘要）

- **全中文注释**：核心逻辑 / Hooks / 复杂转换需用中文解释「为什么」。
- **严格语义化 HTML**：`<main>`/`<header>`/`<nav>`/`<aside>`/`<section>`/`<article>`/`<time>`，杜绝 div 汤。
- **数据-UI 分离**：`page.tsx` 只做取数 + 编排；数据放 `data/`；组件仅靠 props 渲染。
- **RSC 优先**：`app/` 默认服务端组件，`"use client"` 只下沉到最小交互叶子组件。
- **动态类名**：一律走 `cn()`；MD3 色彩禁止硬编码 hex。

详尽规则与代码黄金范式见 [`AGENTS.md`](./AGENTS.md)。
