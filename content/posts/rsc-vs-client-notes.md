---
title: "学习笔记：什么时候才该写 use client（占位）"
date: "2026-05-05"
excerpt: "整理一下 React Server Components 与 Client Components 的边界判断，附上我自己常用的一条决策路径。"
category: "notes"
tags: ["React", "RSC", "Next.js", "笔记"]
cover: "linear-gradient(135deg, #c8f7e0 0%, #ffd1e8 100%)"
---

## 默认服务端，按需客户端

在 App Router 里，**一切默认都是服务端组件（RSC）**。只有当组件真的需要浏览器能力时，才把它下沉成最小的客户端叶子组件。

## 一条简单的决策路径

遇到一个组件，我会顺着问下去：

1. 它要用 `useState` / `useEffect` 等 Hook 吗？
2. 它要监听点击、输入等浏览器事件吗？
3. 它要访问 `window` / `localStorage` 等浏览器 API 吗？
4. 它要用只在客户端跑的库（如动画、主题切换）吗？

只要**有一个「是」**，这个具体的交互点就该是 `"use client"`；否则保持 RSC。

## 关键：别让 use client 往上蔓延

```tsx
// ❌ 整个页面变客户端，只为了一个按钮
"use client";
export default function Page() { /* ... */ }

// ✅ 页面保持 RSC，只有按钮是叶子客户端组件
import ThemeToggle from "@/components/ui/theme-toggle";
export default function Page() {
  return <ThemeToggle />;
}
```

> 边界划得越靠近叶子，能在服务端渲染的部分就越多，首屏与 SEO 也越好。

这条笔记我自己也常翻回来看，免得手一抖把半个页面变成客户端。
