"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * 主题上下文提供者（客户端叶子）
 *
 * 为什么独立封装：next-themes 依赖 Context 与浏览器存储，必须运行在客户端；
 * 把它收口成一个最小的 "use client" 组件后，根布局（RSC）只需在 <body> 内包裹一层，
 * 即可保持页面整体仍是服务端组件（§1.6 边界流）。
 */
export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
