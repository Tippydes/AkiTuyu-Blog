import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ThemeProvider from "@/components/providers/theme-provider";
import CursorFx from "@/components/ui/cursor-fx";
import { siteConfig } from "@/data/site-config";

// 现代化无衬线变量字体，挂载到 --font-sans 供 Tailwind 排版消费
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// SEO 元数据统一从站点配置层读取，避免文案散落
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} · ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * 全局根布局（服务端组件 RSC）
 *
 * 核心职责：注入语言环境与全局字体、编排多端语义化骨架，本身不堆砌任何业务样式。
 * 结构由 <aside>（侧边栏）+ <header>（页眉）+ <main>（核心视图）+ <footer> 拼装，
 * 具体 UI 全部下沉到 components/ 内的独立组件，符合「数据-UI 分离」与组件边界流。
 * ThemeProvider 是唯一的客户端包裹层，负责 next-themes 的 .dark 类注入；
 * suppressHydrationWarning 规避 SSR / CSR 主题类名不一致的告警。
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // 多端自适应骨架类名按 §1.3 规范抽离至 JSX 外
  const bodyStyles =
    "flex min-h-screen w-full flex-col bg-background font-sans text-surface-onSurface md:flex-row";
  const mainWrapperStyles = "flex flex-1 flex-col pb-16 md:pb-0";
  const contentStyles = "mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-10";

  return (
    <html
      lang={siteConfig.locale}
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className={bodyStyles}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* 自定义鼠标指针 + 移动 / 点击涟漪交互层（仅桌面精细指针启用，触屏自动回退） */}
          <CursorFx />

          {/* 沉浸式背景光晕：固定铺满视口、置于内容之下，随主题自适应换色 */}
          <div
            className="aki-immersive-bg pointer-events-none fixed inset-0 -z-10"
            aria-hidden="true"
          />

          {/* 右侧立绘背景：固定铺满视口右半区，置于内容之下；仅桌面端显示，移动端不渲染 */}
          <div
            className="aki-side-art pointer-events-none fixed inset-y-0 right-0 -z-10 hidden w-5/6 select-none opacity-80 md:block dark:opacity-50"
            aria-hidden="true"
          />

          {/* 语义化导航侧边栏 */}
          <Sidebar />

          {/* 主内容容器：页眉 + 核心视图演算区 + 页脚 */}
          <div className={mainWrapperStyles}>
            <Header />
            <main className={contentStyles}>{children}</main>
            <footer className="px-4 py-6 text-center text-xs text-surface-onVariant/70 md:px-8">
              © {new Date().getFullYear()} {siteConfig.name} · 用 Next.js 与 Material Design 3 搭建
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
