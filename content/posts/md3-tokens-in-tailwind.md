---
title: "把 Material Design 3 色彩令牌接进 Tailwind v4"
date: "2026-05-20"
excerpt: "如何用 CSS 变量 + Tailwind 嵌套色彩令牌，让整站只靠一个 .dark 类就能平滑换肤，同时彻底告别硬编码 hex。"
category: "tech"
tags: ["Tailwind", "MD3", "暗黑模式", "前端"]
cover: "linear-gradient(135deg, #d1e4ff 0%, #c8f7e0 100%)"
---

## 核心思路：颜色是变量，不是常量

MD3 的精髓在于「角色化」的颜色——`primary`、`surface`、`outline` 等不是某个具体色值，而是一组**语义角色**。落到代码里，最佳实践是把它们声明成 CSS 变量：

```css
:root {
  --md-sys-color-primary: #0061a4;
  --md-sys-color-surface: #fdfcff;
}
.dark {
  --md-sys-color-primary: #9ecaff;
  --md-sys-color-surface: #121316;
}
```

## 让 Tailwind 认识这些令牌

在 `tailwind.config.ts` 里把变量映射成**嵌套色彩对象**，就能生成 `bg-surface`、`text-brand-onPrimary` 这种贴合设计语义的工具类：

```ts
colors: {
  brand: { primary: "var(--md-sys-color-primary)" },
  surface: { DEFAULT: "var(--md-sys-color-surface)" },
}
```

## 平滑换肤的关键

把过渡挂在 `body` 上，切换 `.dark` 时所有背景、文字、边框会一起渐变，消除闪烁：

```css
body { @apply transition-colors duration-300 ease-in-out; }
```

这样一来，**组件代码完全不需要写第二套深色样式**——颜色的事交给变量，组件只管语义。这正是「数据/样式与展示分离」在样式层的体现。
