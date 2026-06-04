import React from "react";
import Link from "next/link";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";

/**
 * 全局导航侧边栏（服务端组件 RSC）
 *
 * 设计意图：移动端折叠为底部固定栏，桌面端演变为高通透度的 MD3 毛玻璃侧边栏，
 * 完整契合 Mizuki 风格的响应式布局。组件保持「纯展示」，菜单数据全部来自 data/navigation。
 * 这里没有任何客户端交互（仅 <Link> 跳转），因此无需降级为 Client Component。
 */
export default function Sidebar() {
  // 复杂的多端骨架类名按 1.3 规范抽离，保持 JSX 节点纯净
  const asideStyles =
    "glass-panel fixed bottom-0 left-0 z-40 h-16 w-full border-t md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-t-0";
  const navStyles =
    "flex h-full w-full flex-row items-center justify-around px-2 md:flex-col md:items-stretch md:justify-start md:gap-y-1 md:px-4 md:py-8";
  const linkStyles =
    "rounded-3xl px-4 py-2 text-sm font-medium text-surface-onVariant transition-colors hover:bg-brand-primaryContainer hover:text-brand-onPrimaryContainer";

  return (
    <aside className={asideStyles}>
      <nav className={navStyles} aria-label="主导航">
        {/* 桌面端展示的站点 Logo，移动端隐藏以节省底栏空间 */}
        <strong className="mb-4 hidden px-4 text-xl font-bold tracking-wider text-brand-primary md:block">
          {siteConfig.name} 🌸
        </strong>

        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={linkStyles}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
