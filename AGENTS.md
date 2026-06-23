<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# 🤖 Next.js Personal Blog Project - AI Coding Standards & Self-Maintenance Guide

# Role
You are an expert Frontend Engineer and UI/UX Designer specializing in Modern Web Development (Next.js, Tailwind CSS, TypeScript, and Framer Motion). 

# Project Overview
Build **AkiTuyu** (秋天的二次元小屋) — a highly aesthetic personal anime-flavored blog. The design language is heavily inspired by the "Mizuki" blog theme, implementing a Next-Generation Material Design 3 (MD3) style with a geeky/anime-inspired touch, glassmorphism panels, a sakura-tinted immersive background, smooth transitions, and flawless dark/light mode support. Blog posts are authored as local Markdown files and parsed at build time.

# Tech Stack & Requirements
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS (with custom MD3 color tokens and glassmorphism utilities)
- Animations: Framer Motion (to replicate Mizuki's smooth 'Swup' page transitions and micro-interactions)
- Icons: Game-Icon-Pack (https://github.com/Nieobie/Game-Icon-Pack) — vendored as native inline SVG React components (no npm icon package; see §2 Topology Notes)

# UI/UX & Design Specification (Mizuki Style)
1. **Layout & Grid:** 
   - A clean layout with a responsive sidebar for navigation/categories/author card and a main content area for the post feed and articles (desktop left sidebar collapses to a mobile bottom nav).
   - Use large border-radius (e.g., `rounded-3xl` for MD3 compliance) and elegant container shadows.
2. **Visual Aesthetics:**
   - Glassmorphism effects (`backdrop-blur`, semi-transparent backgrounds) for floating panels.
   - Immersive background support (allow subtle background image pattern or gradient with adjustable opacity).
   - Smooth light/dark mode transitions affecting all background colors, borders, and text tracking.
3. **Micro-interactions:**
   - Smooth hover scales, magnetic button effects, and staggered layout animations for cards using Framer Motion.

# Core Functional Features
1. **Home Post Feed:**
   - Display posts as beautiful MD3 glass cards with cover gradient, date, reading time, category badge, tags, title, and excerpt.
   - Shows the full latest-posts feed only (category filtering lives on its own routes — see #6 below, so the home feed stays decoupled from category state).
   - Staggered card entrance animations using Framer Motion.
2. **Post Detail (`/posts/[slug]`):**
   - Render the full article from compiled Markdown into a semantic `<article>` with `.prose-aki` typography bound to MD3 tokens.
   - Statically generated via `generateStaticParams`; per-post SEO metadata via `generateMetadata`.
3. **Archive (`/archive`):**
   - Posts grouped by year (newest first) in a timeline-style list.
4. **About (`/about`):**
   - Author biography and social links, sourced entirely from `data/site-config.ts`.
5. **Theme:**
   - Light/dark toggle powered by `next-themes` (class strategy), with smooth global color transitions.
6. **Categories (`/categories`, `/categories/[category]`):**
   - Standalone category routes, fully decoupled from the home feed (no more `/?category=<key>` query param). `/categories` is an overview page of all categories (cards with per-category post counts); `/categories/[category]` is statically generated via `generateStaticParams` over the category keys (`tech`/`anime`/`life`/`notes`, which double as the route slugs) with per-category `generateMetadata`, server-side filtering the parsed posts down to that category.

# Task Instruction
Please generate the initial project structure, layout component, and the global Tailwind configuration that sets up the Material Design 3 palette (Primary, Secondary, Surface, Background, etc.) suited for both light and dark modes. Ensure the code is production-ready, modular, and strictly typed.

> 📌 **Crucial Note for AI**: This document serves as the absolute source of truth for this project. You must unconditionally adhere to all clauses below when reading context, generating new code, refactoring existing logic, or modifying the directory structure.

---

## 0. Supreme Meta-Instructions: Automated Documentation & Strict Synchronization

As the AI co-developer of this project, your responsibilities encompass both **code authorship** and **documentation maintenance**. You must act like an exceptionally disciplined principal engineer:

* **Automated `README.md` Generation & Updates**: Whenever you initialize structures, add new features (e.g., comment systems, search, dark mode), introduce new dependencies, or alter start/deployment commands, **you must automatically and synchronously write/modify the `README.md` in the project root** to ensure human developers always see up-to-date and accurate instructions.
* **Specification Document Self-Evolution**: Whenever you refactor code, adjust the directory architecture, or introduce new coding standards due to tech stack upgrades, **you must simultaneously modify and update this file itself (`AGENTS.md`) if operating in an environment with file-write permissions (e.g., Cursor Agent Mode)**. This guarantees subsequent AI sessions or human developers work seamlessly under the latest rules.
* **Absolute Refusal of Outdated Docs**: It is strictly forbidden to have a situation where "code is updated, but the `README.md` or this specification document retains legacy descriptions." Updated documentation must be delivered alongside the code changes.

---

## 1. Core Coding Standards

### 1.1 Comprehensive Chinese Comment Standards (全中文注释规范)

* **Mandatory for Core Logic**: All complex business workflows, data filtering algorithms, custom Hooks, and High-Order Components must include clear and concise **Chinese comments** to assist the main developer.
* **Comment Quality**: Comments must explain "**Why things are done** (Why)", rather than merely repeating "What the code does" (What).
* **Inline & Block Comments**: Use inline comments for complex data transformations and standard JSDoc blocks above functions and components.

### 1.2 Strict Semantic HTML (严格的语义化标签)

The abuse of meaningless `<div>` and `<span>` tags is strictly prohibited. You must utilize HTML5 semantic tags in accordance with layout structures and Web Accessibility (A11y) standards:

| Layout Structure / Scenario | Mandatory HTML5 Tag | Avoid Instead |
| --- | --- | --- |
| **Main Content Area** | `<main>` (Exactly one per page) | `<div>` |
| **Header / Footer** | `<header>` / `<footer>` | `<div className="header">` |
| **Independent Logical Section** | `<section>` (e.g., recent posts, tag clouds) | `<div>` |
| **Blog Post Card / Content** | `<article>` (An independent, reusable entity) | `<div>` |
| **Time/Date Display** | `<time dateTime="YYYY-MM-DD">` | `<span>` |
| **Navigation Area** | `<nav>` (Menus, pagination, breadcrumbs) | `<div>` |
| **Sidebar / Auxiliary Info** | `<aside>` (e.g., author bio, recommended posts) | `<div>` |

### 1.3 Tailwind CSS Progressive Extraction & Pragmatic Utility-First Rules (Tailwind 渐进式抽离规范)

* **No Inline Styles**: Using `style={{...}}` for conventional styling is strictly forbidden. The only exception: width, height, positioning, or keyframe percentages dynamically calculated by JavaScript.
* **Pragmatic Classname Extraction**: To leverage Tailwind's "Utility-First" philosophy and preserve IDE autocomplete/color preview features, **do not over-extract short or standard class names**. Inline implementation is encouraged for typical layouts.
* **Mandatory Extraction Criteria**: You must extract Tailwind classes into a separate `const xxxStyles = "..."` block outside the JSX layout (at the top of the component) *only* under the following circumstances:
  1. The class names involve complex conditional structures or multi-tier ternary operators.
  2. The element integrates deep Framer Motion variants and state transitions.
  3. The identical, long utility class string is repeated more than 3 times within the same component.
* **Variable Naming Convention**: Extracted variable names must follow the `[element]Styles` or `[business]Variants` naming convention (e.g., `wrapperStyles`, `titleStyles`, `activeNavStyles`).
* **Dynamic Merging**: When dealing with dynamic states or conditional class names, you must use the project's built-in `cn()` utility function (powered by `clsx` and `tailwind-merge`).

### 1.4 Strict Data-UI Decoupling (数据内容与展示页面严格分离)

* **Pages as Controllers Only**: `page.tsx` files inside the `app/` directory are solely responsible for: 1. Fetching/reading data; 2. Orchestrating business components. Writing large HTML blocks or complex Tailwind layouts directly inside `page.tsx` is **strictly prohibited**.
* **De-codification of Content**: All blog post data (Markdown/MDX), static site configurations, and navigation menus must be stored in independent `content/` or `data/` directories. They must never be hardcoded into UI components.
* **Pure Presentation Layer**: Components inside `components/` must only accept data via `props` and render it. Components should remain "pure" and completely agnostic of where the data comes from (local files or remote APIs).

### 1.5 Dependency Control & Zero-Bloat Principle (依赖控制与性能至上原则)

* **Native First Philosophy**: Avoid importing external npm libraries for simple utilities. If a feature can be implemented using native modern JavaScript/TypeScript or standard Web APIs (e.g., custom hooks for simple animations, native date parsing, vanilla array filtering), **you must write it natively** instead of grabbing heavy utilities like `lodash`, `moment.js`, etc.
* **Size Evaluation**: If a new feature absolutely requires a third-party package, you must prioritize lightweight, tree-shakable, and modern packages. 
* **Zero Redundancy**: Never install multiple packages that solve the same problem. Always crosscheck existing dependencies in `package.json` before suggesting or installing a new one.

### 1.6 Server (RSC) vs Client Components (CC) Strict Boundary (组件边界流)

* **Default to Server**: All files in `src/app/` (pages, layouts, error boundaries) must remain Server Components by default to maintain optimal performance and SEO.
* **Leaf Component Isolation**: Since Framer Motion requires client-side execution, **you must isolate interactivity into smaller leaf components** inside `src/components/` and mark them with `"use client"`. Never turn an entire page into a Client Component just to add a simple click animation. Note: the Game-Icon-Pack icons (`components/ui/icons/game/*`) are pure stateless SVG components and render fine in Server Components — they must NOT carry `"use client"`.

### 1.7 Framer Motion & MD3 Token Abstraction (动画与主题变量化)

* **MD3 Theme Consistency**: Arbitrary hex colors (e.g., `bg-[#123456]`) are strictly forbidden. You must exclusively use Tailwind variables or theme tokens mapped to the Material Design 3 system.
* **Animation Variants Extraction**: Complex Framer Motion `variants` or transition configs exceeding 3 lines **must be extracted into independent `const` objects outside the JSX structure** (or in a dedicated file if reused) to keep the layout rendering nodes pure and clean.

### 1.8 MD3 Theme & Dark Mode Binding Standards (MD3与暗黑模式绑定规范)

* **CSS Variable Strategy**: All custom MD3 colors must map to global CSS variables defined within the Tailwind configuration (e.g., `bg-surface`, `text-onPrimary`).
* **Symmetrical Mode Configuration**: When writing components, light mode and dark mode classes must be systematically declared in tandem using the `dark:` prefix or matching global variable inheritance (e.g., `bg-surface text-onSurface dark:bg-surface-dark dark:text-onSurface-dark`).

---

## 2. Standard Project Directory Structure

When creating new files, adding routes, or adjusting the architecture, you must strictly follow and maintain this directory topology:

```text
akiblog/
├── .next/
├── node_modules/
├── content/                          # 【Content Layer】 Local Markdown posts (data source for lib/mdx.ts)
│   └── posts/                        # *.md articles with Frontmatter (title/date/excerpt/category/tags/cover)
├── public/
│   └── fonts/                        # Maruko Gothic CJK SC woff2 自托管字体文件（Light/Regular/Medium）
├── src/                              # 【Source Directory】
│   ├── app/                          # 【Page Layer】 Routing, data fetching, and page orchestration
│   │   ├── favicon.ico
│   │   ├── globals.css               # Global styles + MD3 CSS variables + `@config` mount
│   │   ├── layout.tsx                # Global root layout (RSC, pure orchestration only)
│   │   ├── page.tsx                  # Home post-feed controller (full latest feed, orchestrates only)
│   │   ├── posts/[slug]/page.tsx     # Post detail (SSG via generateStaticParams + generateMetadata)
│   │   ├── archive/page.tsx          # Archive: posts grouped by year
│   │   ├── categories/page.tsx       # Category overview (links to the 4 category sub-routes)
│   │   ├── categories/[category]/page.tsx # Category sub-page (SSG: tech/anime/life/notes)
│   │   ├── projects/page.tsx         # Projects/works overview (links to the 3 category sub-routes)
│   │   ├── projects/[category]/page.tsx # Project category sub-page (SSG: blog-source/personal/oss)
│   │   └── about/page.tsx            # About: author bio + social links
│   ├── components/                   # 【Presentation Layer】 Highly encapsulated UI components
│   │   ├── blog/                     # Blog business components (PostCard, PostList, PostMeta, PostBody, SiteHero, PostArticleLayout, TableOfContents)
│   │   ├── projects/                 # Project business components (ProjectCard, ProjectList)
│   │   ├── layout/                   # Structural layout components (Sidebar, Header, NavLinks, Breadcrumbs, LayoutShell)
│   │   ├── providers/                # Client context providers (ThemeProvider wrapping next-themes)
│   │   └── ui/                       # Atomic base components (Badge, Icon, ThemeToggle, Reveal, Avatar)
│   │       └── icons/                # Game-Icon-Pack icon system (native inline SVG, zero npm icon dep)
│   │           ├── index.ts          # gameIconRegistry (semantic-name → component) + GameIconName type
│   │           └── game/             # One generated component per icon (currentColor, MD3-tintable)
│   ├── data/                         # 【Static Config Layer】 Non-dynamic structural configs
│   │   ├── navigation.ts             # Nav items (optional href + one-level children submenu + desktopOnly) — «文章分类» (→ /categories routes) & «项目/作品» derive children here; + category matrix (with summary) + label map + CATEGORIES_BASE_PATH/categoryHref helpers
│   │   ├── projects.ts               # Project/works categories (blog-source/personal/oss) + items + key→category map
│   │   └── site-config.ts            # Site brand/SEO metadata + author info + social links + heroBackground (focal-point config system) + placeholderCover (post-card default placeholder image)
│   ├── hooks/                        # 【State/Logic Layer】 Custom React Hooks
│   │   └── use-media-query.ts        # 原生 matchMedia + useSyncExternalStore 断点匹配 Hook（零依赖，SSR 安全）
│   ├── lib/                          # 【Core Service Layer】 Utility functions and parsers
│   │   ├── mdx.ts                    # Markdown parsing/rendering (gray-matter + marked) → typed posts (+ slug→title / slug→category maps + heading extraction for TOC)
│   │   ├── breadcrumbs.ts            # Pure builder: pathname → breadcrumb trail (derived from nav + projects + category data)
│   │   ├── motion.ts                 # Shared Framer Motion variants (stagger / fade-up)
│   │   └── utils.ts                  # `cn()` class merger (clsx + tailwind-merge)
│   └── types/                        # 【Typing Layer】 Global TypeScript type declarations
│       ├── blog.ts                   # Strict blog data dictionary (Post, PostSummary, PostArchiveGroup, TocHeading)
│       └── project.ts                # Project data dictionary (ProjectCategory, ProjectItem, ProjectCategoryKey)
├── scripts/                          # 【Dev Tooling】 Dependency-free maintenance scripts
│   └── sync-game-icons.mjs           # Cleans selected Game-Icon-Pack SVGs → inline components + registry
├── .gitignore
├── AGENTS.md                         # 【AI Coding Standards & Rules】
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts                # 【Tailwind v4 JS config】 MD3 color/radius/shadow tokens + darkMode:'class'
├── README.md                         # 【Project Documentation】
└── tsconfig.json

```

> 🧩 **Topology Notes (kept in sync with code)**:
> - This project is a **personal Markdown blog (AkiTuyu)**. Article source lives at repo-root `content/posts/*.md`; `src/lib/mdx.ts` reads and compiles them into the strict types declared in `types/blog.ts`. Pages are pure controllers that call `lib/mdx` and orchestrate `components/blog/*`.
> - **Navigation submenus (one level, data-driven)**: `NavItem` carries an optional `children?: readonly NavItem[]`, an **optional `href`** (group-only parents with no standalone page may omit it), and an optional `desktopOnly` flag. `components/layout/nav-links.tsx` (the client leaf) renders each top-level entry in three forms: (1) no children → plain link; (2) children + `href` → parent link plus a separate expand/collapse toggle button; (3) children **without** `href` → the whole row is the toggle (no navigation). Both «文章分类» and «项目 / 作品» now use **form 2** (parent links to their overview `/categories` / `/projects`, with a toggle alongside). Both submenus live in the **same** main `<nav>` list (single column) and derive children from a single source: «项目 / 作品» from `data/projects.ts` (`/projects/[category]` is SSG over `blog-source`/`personal`/`oss`), «文章分类» from the `categoryItems` matrix (children link to `categoryHref(key)` → `/categories/<key>`). Submenus are **desktop-only**; the «文章分类» entry is additionally `desktopOnly` so it never reaches the mobile bottom-bar. Active state is purely **path-based** via `usePathname` (no `useSearchParams`, no `<Suspense>` boundary anymore — categories are real routes now, not a query param), so `/about`/`/archive` and the category highlight are all part of the static HTML.
> - **Category routes (文章分类独立路由)**: Article categories are **standalone routes, fully decoupled from the home feed** — there is no `/?category=<key>` query param anymore, and `app/page.tsx` is back to a plain full-feed controller that does not read `searchParams`. `data/navigation.ts` is the single source of truth: it exports the `categoryItems` matrix (each with a `summary`), `CATEGORIES_BASE_PATH` (`/categories`), `CATEGORIES_LABEL`, and a `categoryHref(key)` helper, and the «文章分类» nav item derives its children from them. `app/categories/page.tsx` (RSC) is an overview of category cards with per-category post counts; `app/categories/[category]/page.tsx` (RSC) is SSG via `generateStaticParams` over the category keys (`tech`/`anime`/`life`/`notes`, which double as the route slugs) + per-category `generateMetadata`, server-side filtering `getAllPosts()` to that category and handing the list to `components/blog/post-list.tsx`; an invalid slug triggers `notFound()`. This mirrors the Projects route topology exactly.
> - **Post detail immersive reading (文章详情沉浸阅读)**: When navigating to `/posts/[slug]`, the left sidebar smoothly hides (slides left via Framer Motion) and the main content takes full width — this is orchestrated by `components/layout/layout-shell.tsx` (client leaf, uses `usePathname`). Additionally, a floating **Table of Contents** (TOC) card appears on the right side: `components/blog/post-article-layout.tsx` manages TOC visibility state and drives a horizontal shift on the article container (shifted left when TOC visible, centered when hidden). **该位移仅在桌面端生效**：TOC 面板 / FAB 本就是 `md:` 起才渲染的桌面专属件，故 `post-article-layout.tsx` 借 `hooks/use-media-query.ts` 的 `useMediaQuery("(min-width: 768px)")` 把位移门控在桌面，移动端文章恒居中（修复手机端不居中）。The TOC itself (`components/blog/table-of-contents.tsx`) renders headings extracted by `lib/mdx.ts`'s `extractHeadings()` and `injectHeadingIds()` (which adds anchor `id` attributes to h2/h3 in the HTML). Hiding the TOC collapses it to a small FAB button at bottom-right; clicking the FAB restores the TOC panel. All animations use `type: "spring"` for a silky feel.
> - **Header breadcrumbs (顶部页眉面包屑)**: The glass `<header>` (`components/layout/header.tsx`, RSC) renders a breadcrumb trail on desktop. `lib/breadcrumbs.ts` exposes a pure `buildBreadcrumbs(pathname, postTitles, postCategories)` that derives the trail labels/links **from the data layer** — top-level labels reuse `navItems` (so «项目 / 作品», «文章分类», «归档»… never drift, since the «文章分类» item now has the `/categories` href), project sub-categories resolve through `projectCategoryMap`, and category sub-pages (`/categories/<key>`) resolve through `categoryLabelMap`. The **post detail route `/posts/<slug>` is special-cased to mirror the Projects breadcrumb shape** (section › category › current page): instead of a non-navigable «文章» placeholder, it renders «首页 › 文章分类 › «分类名» › «文章标题»», where «文章分类»→`/categories` and the category→`categoryHref(key)` are clickable and the title is the leaf. The slug→title and slug→category maps come from `getPostTitleMap()` / `getPostCategoryMap()` in `lib/mdx.ts`, threaded server-side through `header.tsx` (the client leaf cannot read the filesystem). `components/layout/breadcrumbs.tsx` is the **client leaf** (`usePathname`) and renders strict semantic markup (`<nav aria-label="面包屑"><ol><li>`, `aria-current="page"` on the last crumb, a rotated `chevron-down` icon as the separator). On the home route (only «首页») it falls back to the site tagline so the header stays balanced; the breadcrumb is desktop-only (`hidden md:block`), the mobile header keeps the brand link.
> - **Styling runs on Tailwind CSS v4**. `globals.css` uses `@import "tailwindcss";` and mounts the legacy JS config via `@config "../../tailwind.config.ts";`. The JS config exists so MD3 tokens can be declared as **nested color objects** (generating `bg-surface`, `text-surface-onVariant`, `text-brand-onPrimaryContainer`, `bg-secondary-container`, `bg-tertiary-container`, etc.) and so `darkMode: 'class'` toggles the whole theme via a single `.dark` class. The `.prose-aki` component layer styles compiled article HTML strictly with MD3 tokens (no `@tailwindcss/typography` dependency). `<html>` paints a solid `--md-sys-color-background` fill (with `min-height: 100%` + `overscroll-behavior-y: none`) while **`<body>` is kept transparent** (`layout.tsx`'s `bodyStyles` carries no `bg-*`)——为什么实底要落在 `<html>` 而非 `body`：手机浏览器滚到底地址栏收起触发动态视口 / 回弹时，文档底部一旦露出无背景的根元素，浏览器会用合成器陈旧帧（即顶部标签 / 书签栏）填缝、再被毛玻璃卡片 `backdrop-blur` 模糊成「浏览器顶栏」鬼影。**关键约束**：`.aki-side-art` / `.aki-immersive-bg` 是挂在 `<body>` 内的 `z-index:-10` 固定层，一旦给 `<body>` 设不透明背景，浏览器便不再把 body 背景上提到画布，body 自身的实底会盖住这两层立绘导致背景图消失；故实底统一交给 `<html>`、`<body>` 透明，主题切换的颜色过渡也随之上移到 `<html>`（§1.8 亮 / 暗对称）。The `.aki-immersive-bg` utility paints sakura/sky corner glows via `color-mix()` over MD3 container tokens, so it recolors with the theme. The `.aki-side-art` utility implements a **焦点配置系统（focal-point config system）** for the decorative background art: image path, `background-position`（焦点）, `background-size`, container width, and dark-mode mask preset are all declared in `data/site-config.ts` (`heroBackground` field) and injected at runtime via CSS custom properties (`--aki-side-art-src`, `--aki-side-art-position`, `--aki-side-art-size`) in `layout.tsx`—so swapping the background image only requires editing the data layer, no CSS/component changes. The dark-mode mask supports four presets (`none` / `vignette` / `gradient-left` / `bottom-fade`), applied via BEM-style modifier classes (`.aki-side-art--vignette`, etc.) scoped under `.dark`; light mode renders **no mask** for a clean, transparent feel. The element is `aria-hidden`, desktop-only (`hidden md:block`), with per-theme opacity (`opacity-80` light, `dark:opacity-50`).
> - **Icon system (Game-Icon-Pack, zero npm icon dependency)**: Icons come from the open-source [Game-Icon-Pack](https://github.com/Nieobie/Game-Icon-Pack) (fully rounded, no sharp edges — matches the MD3 + glassmorphism aesthetic). Per §1.5 we do **not** install any npm icon package. Instead, the needed SVGs are vendored as **native inline React components** under `src/components/ui/icons/game/*.tsx`, aggregated into `gameIconRegistry` (`semantic-name → component`) in `icons/index.ts`. `components/ui/icon.tsx` (`<Icon name="..." className="..." />`) looks a component up by name; the data layer (`navigation.ts` / `site-config.ts`) only stores the **semantic name** string, preserving data-UI decoupling. The source SVGs are single-path monochrome with `fill` stripped, so the components inherit `currentColor` and are tintable by any MD3 token (`text-primary`, `text-surface-onVariant`, …); default size is `h-5 w-5`, overridable via `className`. **Registered names**: `home`, `archive`, `user`, `code`, `sparkle`, `daily`, `notes`, `folder`, `laptop`, `heart`, `rss`, `mail`, `calendar`, `clock`, `tag`, `arrow-left`, `chevron-down`, `dark-mode`, `light-mode` (`folder`/`laptop`/`heart` drive the Projects menu + sub-pages; `chevron-down` is the submenu expand indicator). **To add/replace an icon**: register `semantic-name → "<Category>/<file>.svg"` in `scripts/sync-game-icons.mjs`'s `ICON_MAP`, then run `GAME_ICON_SRC=/path/to/Game-Icon-Pack/svg-v1.0.3 node scripts/sync-game-icons.mjs` (downloaded from the pack's Releases). The generated `game/*.tsx` and `index.ts` are committed; never hand-edit them.
> - **Post card cover (文章卡片封面)**: `components/blog/post-card.tsx` renders the card cover band from the post's `cover` Frontmatter field, falling back to `siteConfig.placeholderCover` (`data/site-config.ts`, default `/images/Node.js_logo.svg.png`) when a post declares no cover — the **placeholder image is the single data-layer source** for all coverless posts (mirrors the avatar/heroBackground pattern, §1.4). A pure `isImageCover(cover)` helper decides the render path by the data-layer contract: values starting with `/` (public asset) or `http` are **image resources** → rendered via `next/image` (`fill` + `sizes`), while any other value is treated as a **CSS gradient** → painted via inline `backgroundImage` (the §1.3 dynamic-value exception). The placeholder Logo uses `object-contain` + padding so it sits centered/uncropped; a real cover image uses `object-cover` to fill the band. The four sample posts no longer carry a gradient `cover` (the old `linear-gradient(...)` blocks were removed), so they all surface the shared placeholder image. The cover band stays decorative (`aria-hidden`, empty `alt`).
> - **Author avatar**: the site owner's avatar lives at `public/images/avatar.png` and its path is declared once in `data/site-config.ts` (`author.avatar`). The pure `components/ui/avatar.tsx` atom renders it via `next/image` (`fill` + `object-cover`), with size/radius supplied by the caller's `className` (sidebar brand `rounded-2xl`, author card / mobile header `rounded-full`, about page `rounded-3xl`). To change the avatar, replace the image file or repoint `author.avatar`.
> - **Global font (全站字体)**: [Maruko Gothic CJK SC](https://github.com/max32002/maruko-gothic) (まるこゴシック 简体中文版) — a round-style gothic typeface that complements the MD3 large-radius aesthetic. Three weights are self-hosted as woff2 under `public/fonts/` (Light 300, Regular 400, Medium 500) and loaded via `next/font/local` in `layout.tsx`, mounted onto the `--font-sans` CSS variable consumed by `tailwind.config.ts`. Licensed under SIL Open Font License 1.1. To update the font: replace the woff2 files in `public/fonts/` with new builds from the upstream repo.
> - **Installed dependencies**: `clsx` + `tailwind-merge` (mandated `cn()`, §1.3); `gray-matter` + `marked` (Markdown frontmatter + rendering); `next-themes` (class-based dark mode); `framer-motion` (staggered/fade-up animations). Icons are **not** an npm dependency — see the icon-system note above.

---

## 3. Standard Code Blueprints (标准代码黄金范式)

When generating code, you must treat the structure, separation of concerns, and style extraction of these blueprints as the gold standard:

### 3.1 [Presentation Component] Encapsulation + Conditional Style Extraction

```tsx
// src/components/blog/post-card.tsx
import React from 'react';
import Link from 'next/link';
import { Post } from '@/types/blog';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  className?: string; // Allows style tweaks from external layouts
}

/**
 * 博客文章卡片组件
 * 严格执行 HTML5 语义化及有条件的类名变量化声明
 */
export default function PostCard({ post, className }: PostCardProps) {
  
  // 对于复杂的、具有特定设计模式的容器，进行结构解耦声明
  const cardContainerStyles = "group relative flex flex-col items-start rounded-3xl border border-gray-200 p-6 transition-all hover:shadow-md dark:border-gray-800 bg-surface text-onSurface dark:bg-surface-dark dark:text-onSurface-dark";
  const timeStyles = "relative z-10 order-first flex items-center text-sm text-gray-400 dark:text-gray-500 pl-3.5";
  const titleStyles = "text-xl font-semibold tracking-tight mt-2 group-hover:text-primary transition-colors";

  return (
    // 强制使用语义化 <article> 标签
    <article className={cn(cardContainerStyles, className)}>
      
      <time dateTime={post.date} className={timeStyles}>
        <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
          <span className="h-4 w-0.5 rounded-full bg-gray-200 dark:bg-gray-700" />
        </span>
        {post.formattedDate}
      </time>
      
      <h2 className={titleStyles}>
        <Link href="{`/blog/${post.slug}`}">
          
          <span className="absolute -inset-x-6 -inset-y-4 z-20 sm:-inset-x-6 sm:rounded-3xl" />
          <span className="relative z-10">{post.title}</span>
        </Link>
      </h2>
      
      
      <p className="relative z-10 mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {post.excerpt}
      </p>
    </article>
  );
}

```

### 3.2 [Page Layer] Zero Layout Styling, Pure Orchestration

```tsx
// app/blog/page.tsx
import { getAllPosts } from '@/lib/mdx';
import PostCard from '@/components/blog/post-card';

/**
 * 博客列表页（服务端组件 RSC）
 * 仅作为核心控制器，本身不堆砌复杂的 HTML 样式细节与业务逻辑
 */
export default async function BlogPage() {
  // 1. 严格从数据层/服务层获取异步数据
  const posts = await getAllPosts();

  // 2. 纯粹的骨架与页面编排，使用正确的小括号返回结构
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          架构师的技术随笔
        </h1>
      </header>

      
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key="{post.slug}" post="{post}"/>
        ))}
      </section>
    </main>
  );
}

```

---

## 4. AI Verification Checklist

Before delivering any code, architecture, or configuration changes to the user, mentally verify the following items. **Regenerate the solution if any item fails to comply**:

* [ ] **Chinese Comments**: Have I added detailed Chinese comments explaining the "Why" for all non-trivial logic and parsing functions?
* [ ] **Pragmatic Tailwind Variables**: Did I avoid over-extracting simple utilities while correctly refactoring messy, conditional, or highly repetitive class paths into constants?
* [ ] **Semantic Inspection**: Did my output result in a "div soup"? Have I properly leveraged `main`, `article`, `section`, and `time` instead?
* [ ] **Data-UI Separation**: Did I hardcode any post arrays, category names, or static menus directly inside components or Page routing files?
* [ ] **Type Safety**: Is the code fully type-safe without bypassing the system via `any`?
* [ ] **【Meta-Instruction Trigger Check】**: If I am working in an environment with file-system write privileges and have updated code or architecture, have I updated `README.md` and `AGENTS.md` accordingly?
* [ ] **Dependency Control**: Did I introduce any external npm packages? If so, did I double-check that it couldn't be achieved easily via native TypeScript/Web APIs, and that it won't bloat the bundle size?
* [ ] **Client Component Minimization**: Did I isolate `"use client"` to the smallest possible interactive leaf component instead of leaking it up to the structural pages or layouts?
* [ ] **Framer Motion Cleanliness**: Are all animation `variants` and configurations extracted outside the JSX layout? Is the JSX tree free from messy inline animation logic?
* [ ] **MD3 Token Compliance**: Did I avoid using raw or hardcoded arbitrary hex codes? Do all applied colors correctly map to our standardized light/dark responsive MD3 tokens?

```

```