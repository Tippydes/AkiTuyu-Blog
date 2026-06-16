import React from "react";
import Link from "next/link";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";
import NavLinks from "@/components/layout/nav-links";
import Avatar from "@/components/ui/avatar";

/**
 * 全站侧边栏（服务端组件）
 *
 * 语义化为 <aside> 辅助区：桌面端为高通透度的毛玻璃常驻栏，移动端塌缩为底部固定导航条。
 * 仅负责「从数据层取数 + 编排结构」，导航高亮等交互交给叶子客户端组件 NavLinks。
 */
export default function Sidebar() {
  const asideStyles =
    "glass-panel fixed bottom-0 left-0 z-40 h-16 w-full border-t md:sticky md:top-0 md:h-screen md:w-72 md:border-r md:border-t-0";
  const innerStyles =
    "flex h-full w-full flex-row items-center justify-around px-2 md:flex-col md:items-stretch md:justify-start md:gap-y-6 md:overflow-y-auto md:px-5 md:py-7";

  return (
    <aside className={asideStyles}>
      <div className={innerStyles}>
        {/* 品牌区：移动端隐藏，桌面端展示站点名与标语 */}
        <Link href="/" className="hidden items-center gap-x-3 px-2 md:flex">
          <Avatar
            src={siteConfig.author.avatar}
            alt={`${siteConfig.author.name} 的头像`}
            className="h-11 w-11 rounded-2xl"
            sizes="44px"
            priority
          />
          <span className="flex flex-col">
            <strong className="text-lg font-bold tracking-wide text-brand-primary">
              {siteConfig.name}
            </strong>
            <span className="text-xs text-surface-onVariant">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        {/* 主导航：移动端横向铺开，桌面端纵向排列。
            「文章分类」作为其中一个一级项以可展开二级菜单呈现，与其余导航同列（见 navItems）。 */}
        <nav className="w-full" aria-label="主导航">
          <NavLinks items={navItems} />
        </nav>

        {/* 作者卡片：钉在侧边栏底部，仅桌面端展示 */}
        <aside
          className="mt-auto hidden w-full items-center gap-x-3 rounded-3xl bg-surface-variant/40 px-4 py-3 md:flex"
          aria-label="站长信息"
        >
          <Avatar
            src={siteConfig.author.avatar}
            alt={`${siteConfig.author.name} 的头像`}
            className="h-10 w-10 rounded-full"
            sizes="40px"
          />
          <span className="flex flex-col">
            <strong className="text-sm font-semibold text-surface-onSurface">
              {siteConfig.author.name}
            </strong>
            <span className="text-xs text-surface-onVariant">
              {siteConfig.author.status}
            </span>
          </span>
        </aside>
      </div>
    </aside>
  );
}
