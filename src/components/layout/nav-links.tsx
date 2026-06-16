"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { NavItem } from "@/data/navigation";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  /** 由侧边栏从数据层透传进来的导航条目（组件本身不感知数据来源） */
  items: readonly NavItem[];
}

// 渐进式抽离：链接态类名在父级与子级间复用，且含多状态条件，按 §1.3 抽到 JSX 外
const baseLinkStyles =
  "flex items-center gap-x-3 rounded-3xl px-4 py-2.5 text-sm font-medium transition-colors";
const activeLinkStyles =
  "bg-brand-primaryContainer text-brand-onPrimaryContainer";
const idleLinkStyles =
  "text-surface-onVariant hover:bg-surface-variant/50 hover:text-surface-onSurface";
// 二级子项：略小字号 + 缩进，视觉上从属于父级
const childLinkStyles =
  "flex items-center gap-x-3 rounded-3xl px-4 py-2 text-sm transition-colors";

/**
 * 判断某导航地址是否为「当前所在区」
 *
 * 兼容三类地址：
 * - 首页 `/`：精确匹配 pathname；
 * - 分类筛选 `/?category=<key>`：仅在首页且当前选中分类一致时命中（依赖 activeCategory）；
 * - 其余子页：前缀匹配，兼容详情页 / 子路由（如处于 /projects/personal 时父级 /projects 同样激活）。
 */
function matchActive(
  pathname: string,
  activeCategory: string | null,
  href?: string,
): boolean {
  if (!href) return false;
  const [path, query] = href.split("?");
  if (query) {
    const category = new URLSearchParams(query).get("category");
    return pathname === (path || "/") && category !== null && activeCategory === category;
  }
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * 主导航链接组（客户端叶子）
 *
 * 为什么是客户端组件：高亮「当前所在页」需读取 usePathname / useSearchParams，且二级菜单
 * 的展开 / 收起属于浏览器侧交互，故仅把导航这一小块下沉为客户端（§1.6）。
 *
 * 为什么包一层 Suspense：分类子项的命中高亮依赖 useSearchParams，会让所在 Suspense 边界
 * 转为客户端渲染；用「不读 query、因此可被静态预渲染」的 NavListFallback 作 fallback，
 * 保证 /about、/archive 等静态页的 HTML 里仍包含完整导航（仅分类高亮在水合后补上）。
 */
export default function NavLinks({ items }: NavLinksProps) {
  return (
    <Suspense fallback={<NavListFallback items={items} />}>
      <NavList items={items} />
    </Suspense>
  );
}

/** 读取 pathname + ?category 后渲染（命中分类会高亮） */
function NavList({ items }: NavLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 仅在首页（文章流）时 ?category 才有意义，其余路由不参与分类高亮
  const activeCategory = pathname === "/" ? searchParams.get("category") : null;
  return <NavListView items={items} pathname={pathname} activeCategory={activeCategory} />;
}

/** Suspense 回退：只读 pathname、不读 query，可被静态预渲染（分类一律不高亮） */
function NavListFallback({ items }: NavLinksProps) {
  const pathname = usePathname();
  return <NavListView items={items} pathname={pathname} activeCategory={null} />;
}

interface NavListViewProps extends NavLinksProps {
  pathname: string;
  activeCategory: string | null;
}

/** 纯展示：依据传入的 pathname / activeCategory 渲染整列导航 */
function NavListView({ items, pathname, activeCategory }: NavListViewProps) {
  return (
    <ul className="flex w-full flex-row items-center justify-around gap-x-1 md:flex-col md:items-stretch md:gap-y-1">
      {items.map((item) => (
        <NavEntry
          key={item.label}
          item={item}
          pathname={pathname}
          activeCategory={activeCategory}
        />
      ))}
    </ul>
  );
}

interface NavEntryProps {
  item: NavItem;
  pathname: string;
  activeCategory: string | null;
}

/**
 * 单个主导航条目（含可选二级菜单）
 *
 * 三种形态：
 * 1. 无 children → 普通链接；
 * 2. 有 children + 有 href（如「项目 / 作品」）→ 父级链接跳转总览页，旁附展开按钮；
 * 3. 有 children + 无 href（纯分组型，如「文章分类」）→ 整行即展开/收起开关，自身不跳转。
 * 子菜单仅在桌面端展示（移动端底部栏空间有限）。
 */
function NavEntry({ item, pathname, activeCategory }: NavEntryProps) {
  const hasChildren = Boolean(item.children?.length);
  const selfActive = matchActive(pathname, activeCategory, item.href);
  // 纯分组型父级自身无路由，其命中态由「是否有子项命中」推导
  const childActive =
    item.children?.some((child) => matchActive(pathname, activeCategory, child.href)) ?? false;
  const active = selfActive || childActive;

  // 默认展开策略：纯分组型（无 href）始终展开以利发现；可跳转父级仅在处于该分区时自动展开
  const [open, setOpen] = useState(item.href ? selfActive : true);

  // li 包裹：纯分组型等可标记为仅桌面端展示，避免在移动端底部栏出现无落点的开关
  const liClass = item.desktopOnly ? "hidden md:block" : undefined;

  if (!hasChildren) {
    return (
      <li className={liClass}>
        <Link
          href={item.href ?? "/"}
          aria-current={selfActive ? "page" : undefined}
          className={cn(baseLinkStyles, selfActive ? activeLinkStyles : idleLinkStyles)}
        >
          <Icon name={item.icon} className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  }

  // id 取自图标名（同级父级图标互异），避免中文 label 生成的非法 / 不稳定 id
  const submenuId = `submenu-${item.icon}`;
  const chevron = (
    <Icon
      name="chevron-down"
      className={cn(
        "h-4 w-4 transition-transform duration-200",
        open ? "rotate-180" : "rotate-0",
      )}
      aria-hidden="true"
    />
  );

  return (
    <li className={liClass}>
      {item.href ? (
        // 形态 2：父级链接 + 旁置展开按钮（按钮仅桌面端）
        <div className="flex items-center">
          <Link
            href={item.href}
            aria-current={selfActive ? "page" : undefined}
            className={cn(
              baseLinkStyles,
              "flex-1",
              active ? activeLinkStyles : idleLinkStyles,
            )}
          >
            <Icon name={item.icon} className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls={submenuId}
            aria-label={`${open ? "收起" : "展开"}${item.label}子菜单`}
            className="ml-1 hidden shrink-0 rounded-full p-2 text-surface-onVariant transition-colors hover:bg-surface-variant/50 hover:text-surface-onSurface md:inline-flex"
          >
            {chevron}
          </button>
        </div>
      ) : (
        // 形态 3：纯分组型，整行即展开/收起开关，与一级链接同字号样式
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={submenuId}
          className={cn(
            baseLinkStyles,
            "w-full justify-between",
            active ? activeLinkStyles : idleLinkStyles,
          )}
        >
          <span className="flex items-center gap-x-3">
            <Icon name={item.icon} className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </span>
          {chevron}
        </button>
      )}

      {/* 二级子菜单：仅桌面端展示；收起时不渲染，避免占位与无障碍焦点陷阱 */}
      {open && (
        <ul
          id={submenuId}
          className="ml-4 mt-1 hidden flex-col gap-y-1 border-l border-outline-variant/30 pl-2 md:flex"
        >
          {item.children?.map((child) => {
            const childIsActive = matchActive(pathname, activeCategory, child.href);
            return (
              <li key={child.label}>
                <Link
                  href={child.href ?? "/"}
                  aria-current={childIsActive ? "page" : undefined}
                  className={cn(
                    childLinkStyles,
                    childIsActive ? activeLinkStyles : idleLinkStyles,
                  )}
                >
                  <Icon
                    name={child.icon}
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
