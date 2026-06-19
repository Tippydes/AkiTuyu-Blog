import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { getPostTitleMap, getPostCategoryMap } from "@/lib/mdx";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import HeaderEntrance from "@/components/layout/header-entrance";
import ThemeToggle from "@/components/ui/theme-toggle";
import Avatar from "@/components/ui/avatar";

/**
 * 全站页眉（服务端组件）
 *
 * 语义化 <header>：移动端补足侧边栏隐藏的品牌信息，桌面端展示面包屑导航；
 * 右侧承载主题切换叶子组件（CC）。本身不含交互逻辑，保持 RSC。
 *
 * 为什么在服务端取 postTitles / postCategories：面包屑是客户端叶子，无法读文件系统，故由本组件
 * 在服务端构建 slug→标题 / slug→分类 映射后透传，让详情页面包屑末级回显中文标题、
 * 并对齐「项目」格式穿过文章所属分类（§1.6 边界）。
 */
export default function Header() {
  const headerStyles =
    "sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-x-4 border-b border-outline-variant/20 bg-background/60 px-4 backdrop-blur-md md:px-8";

  const postTitles = getPostTitleMap();
  const postCategories = getPostCategoryMap();

  return (
    <HeaderEntrance className={headerStyles}>
      {/* 移动端展示品牌入口，避免与侧边栏品牌区重复 */}
      <Link href="/" className="flex shrink-0 items-center gap-x-2 md:hidden">
        <Avatar
          src={siteConfig.author.avatar}
          alt={`${siteConfig.author.name} 的头像`}
          className="h-8 w-8 rounded-full"
          sizes="32px"
          priority
        />
        <strong className="text-base font-bold tracking-wide text-brand-primary">
          {siteConfig.name}
        </strong>
      </Link>

      {/* 桌面端展示面包屑；首页无层级时回退为站点标语，保持页眉视觉平衡 */}
      <div className="hidden min-w-0 flex-1 md:block">
        <Breadcrumbs
          postTitles={postTitles}
          postCategories={postCategories}
          fallback={siteConfig.tagline}
        />
      </div>

      {/* 全局操作区：主题切换（后续可扩展搜索 / 用户入口） */}
      <section className="flex shrink-0 items-center gap-x-3" aria-label="全局操作">
        <ThemeToggle />
      </section>
    </HeaderEntrance>
  );
}
