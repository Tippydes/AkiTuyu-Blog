---
name: testing-akituyu-blog
description: Run and E2E-test the AkiTuyu personal blog (Next.js App Router + MD3 + Markdown). Use when verifying blog UI, post rendering, category filtering, theming, or responsive layout changes.
---

# Testing the AkiTuyu Blog

A Next.js 16 (App Router) personal blog. Posts are local Markdown in `content/posts/*.md`, parsed by `src/lib/mdx.ts` (`gray-matter` + `marked`) into the types in `src/types/blog.ts`. Pages are RSC controllers that call `lib/mdx` and orchestrate `src/components/blog/*`. Theme is `next-themes` (class strategy). It is frontend-only — no backend, no auth, no secrets required.

## Run it locally

```bash
npm install        # first time only
npm run dev        # serves http://localhost:3000
# quality gates
npm run lint
npm run build      # expect 10/10 pages; /posts/[slug] prerendered as SSG
```

No environment variables or secrets are needed.

## Route map (where each feature lives)

| Route | Source page | What to verify |
|---|---|---|
| `/` | `src/app/page.tsx` | Home feed; reads `?category` and filters `getAllPosts()` |
| `/?category=<key>` | same | Server-side filter; keys: `tech` / `anime` / `life` / `notes` |
| `/posts/<slug>` | `src/app/posts/[slug]/page.tsx` | Detail; SSG via `generateStaticParams`, compiled Markdown |
| `/archive` | `src/app/archive/page.tsx` | Posts grouped by year (`getPostsByYear()`) |
| `/about` | `src/app/about/page.tsx` | Author bio + socials from `src/data/site-config.ts` |

Sidebar/category nav lives in `src/components/layout/{sidebar,nav-links}.tsx`; the theme toggle button (aria-label "切换亮色 / 暗色模式") is in `src/components/layout/header.tsx` / `src/components/ui/theme-toggle.tsx`.

## Golden-path E2E checks (UI)

1. **Home feed** — `/` shows N cards (N = number of files in `content/posts/`); hero "已存放 N 篇" must match the feed "共 N 篇". Each card has cover, date, reading time, category, title, excerpt, tags.
2. **Category filter** — clicking a sidebar category goes to `/?category=<key>` and shows only posts whose frontmatter `category` matches. IMPORTANT: derive the expected count from the actual frontmatter, not the title — e.g. a post titled "学习笔记…" may have `category: notes`, so it will NOT appear under `tech`.
3. **Post detail** — a card link opens `/posts/<slug>` with a semantic `<article>`; the Markdown body must be rendered HTML (`<h2>`, `<blockquote>`, `<ul>`/`<ol>`, inline `<code>`), not raw markdown text.
4. **Archive** — `/archive` groups all posts under their year with a category badge per row.
5. **About** — `/about` shows author name/handle/bio and social links with correct hrefs (GitHub, RSS, mailto).
6. **Theme toggle** — clicking the header toggle flips the whole site light↔dark (background, surfaces, glass panels, text all recolor) and is reversible; the icon swaps sun/moon. `next-themes` persists the choice in `localStorage`, so a fresh load may already be in the last-used theme — set it explicitly before asserting.
7. **Responsive (regression)** — at mobile width the desktop left sidebar collapses to a bottom nav (首页/归档/关于) and the brand moves into the header. Resize the OS window (`wmctrl -r :ACTIVE: -e 0,40,0,420,760`) rather than fiddling with devtools.

## Tips / gotchas

- The stripped DOM returned alongside screenshots is the fastest way to assert exact text/structure (counts, headings, tag lists, hrefs).
- To prove the filter/feed is real and not static, always check that a *broken* implementation would look different (e.g. count changes, only-matching posts shown).
- Adding a post = drop a `.md` file in `content/posts/` with frontmatter (`title`, `date` ISO, `excerpt`, `category`, `tags`, optional `cover`); reading time / formatted date / archive grouping are derived automatically.

## Devin Secrets Needed

None — this is a static, frontend-only blog with no external services.
