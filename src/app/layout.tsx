import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { siteConfig } from "@/data/site-config";

// 现代化无衬线变量字体，挂载到 --font-sans 供 Tailwind 排版消费
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// SEO 元数据统一从站点配置层读取，避免文案散落
export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * 全局根布局（服务端组件 RSC）
 *
 * 核心职责：注入语言环境与全局字体、编排多端语义化骨架，本身不堆砌任何业务样式。
 * 结构由 <aside>（侧边栏）+ <header>（页眉）+ <main>（核心视图）三块语义化区域拼装，
 * 具体 UI 全部下沉到 components/ 内的独立组件，符合「数据-UI 分离」与组件边界流。
 * suppressHydrationWarning：为后续 next-themes 在客户端注入 .dark 类做准备，规避 SSR 类名不一致告警。
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // 多端自适应骨架类名按 1.3 规范抽离至 JSX 外
  const bodyStyles =
    "flex min-h-screen w-full flex-col bg-background font-sans text-surface-onSurface md:flex-row";
  const mainWrapperStyles = "flex flex-1 flex-col pb-16 md:pb-0";
  const contentStyles = "flex-1 px-4 py-6 md:px-8 md:py-8";

  return (
    <html lang={siteConfig.locale} className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className={bodyStyles}>
        {/* 语义化导航侧边栏 */}
        <Sidebar />

        {/* 主内容容器：页眉 + 核心视图演算区 */}
        <div className={mainWrapperStyles}>
          <Header />
          <main className={contentStyles}>{children}</main>
        </div>
      </body>
    </html>
  );
}
