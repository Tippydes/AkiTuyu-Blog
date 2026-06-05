import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import ThemeToggle from "@/components/ui/theme-toggle";

/**
 * 全站页眉（服务端组件）
 *
 * 语义化 <header>：移动端补足侧边栏隐藏的品牌信息，桌面端展示标语；
 * 右侧承载主题切换叶子组件（CC）。本身不含交互逻辑，保持 RSC。
 */
export default function Header() {
  const headerStyles =
    "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant/20 bg-background/60 px-4 backdrop-blur-md md:px-8";

  return (
    <header className={headerStyles}>
      {/* 移动端展示品牌，桌面端展示标语，避免与侧边栏品牌区重复 */}
      <Link href="/" className="flex items-center gap-x-2 md:hidden">
        <span className="text-xl" aria-hidden="true">
          {siteConfig.author.avatarEmoji}
        </span>
        <strong className="text-base font-bold tracking-wide text-brand-primary">
          {siteConfig.name}
        </strong>
      </Link>
      <p className="hidden text-sm font-medium text-surface-onVariant md:block">
        {siteConfig.tagline}
      </p>

      {/* 全局操作区：主题切换（后续可扩展搜索 / 用户入口） */}
      <section className="flex items-center gap-x-3" aria-label="全局操作">
        <ThemeToggle />
      </section>
    </header>
  );
}
