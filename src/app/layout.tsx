import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import LayoutShell from "@/components/layout/layout-shell";
import ThemeProvider from "@/components/providers/theme-provider";
import { siteConfig } from "@/data/site-config";

/**
 * 全站字体：まるこゴシック CJK SC（Maruko Gothic 简体中文版）
 * 圆体风格贴合 MD3 大圆角美学，自托管 woff2 杜绝外部网络请求（§1.5 零膨胀）。
 * 三档字重覆盖正文(300)、标准(400)、标题(500)，通过 --font-sans 变量注入 Tailwind。
 */
const marukoGothic = localFont({
  src: [
    {
      path: "../../public/fonts/MarukoGothicCJKsc-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/MarukoGothicCJKsc-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/MarukoGothicCJKsc-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

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
 * 结构由 LayoutShell（客户端布局动画壳）包裹 <aside>（侧边栏）+ 主内容区拼装，
 * 具体 UI 全部下沉到 components/ 内的独立组件，符合「数据-UI 分离」与组件边界流。
 *
 * LayoutShell 是唯一涉及路由感知动画的客户端叶子：文章详情页时将侧边栏向左丝滑隐藏，
 * 让主内容区占满全宽，营造沉浸阅读体验。ThemeProvider 负责 next-themes 的 .dark 类注入；
 * suppressHydrationWarning 规避 SSR / CSR 主题类名不一致的告警。
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // 多端自适应骨架类名按 §1.3 规范抽离至 JSX 外
  // 为什么 body 不设 bg-background：html 已承担画布背景色（防过度滚动灰色），
  // 若 body 也设不透明背景则会覆盖 -z-10 的固定背景元素（沉浸光晕 + 立绘）。
  const bodyStyles =
    "flex min-h-screen w-full flex-col font-sans text-surface-onSurface md:flex-row";
  const contentStyles = "mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-10";

  return (
    <html
      lang={siteConfig.locale}
      className={`${marukoGothic.variable} scroll-smooth bg-background`}
      suppressHydrationWarning
    >
      <body className={bodyStyles}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* 沉浸式背景光晕：固定铺满视口、置于内容之下，随主题自适应换色 */}
          <div
            className="aki-immersive-bg pointer-events-none fixed inset-0 -z-10"
            aria-hidden="true"
          />

          {/* 右侧立绘背景——焦点配置系统：图片/焦点/尺寸/遮罩均从数据层驱动，换图仅改配置 */}
          <div
            className={`aki-side-art aki-side-art--${siteConfig.heroBackground.darkMask} pointer-events-none fixed inset-y-0 right-0 -z-10 hidden ${siteConfig.heroBackground.width} select-none opacity-80 md:block dark:opacity-50`}
            style={{
              "--aki-side-art-src": `url("${siteConfig.heroBackground.src}")`,
              "--aki-side-art-position": siteConfig.heroBackground.position,
              "--aki-side-art-size": siteConfig.heroBackground.size,
            } as React.CSSProperties}
            aria-hidden="true"
          />

          {/* LayoutShell：文章页时侧边栏向左丝滑隐藏，主内容占满全宽 */}
          <LayoutShell sidebar={<Sidebar />}>
            <Header />
            <main className={contentStyles}>{children}</main>
            <footer className="px-4 py-6 text-center text-xs text-surface-onVariant/70 md:px-8">
              © {new Date().getFullYear()} {siteConfig.name} · 用 Next.js 与 Material Design 3 搭建
            </footer>
          </LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
