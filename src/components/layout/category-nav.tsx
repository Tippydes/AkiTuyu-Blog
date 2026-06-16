"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  categoryHref,
  CATEGORIES_BASE_PATH,
  CATEGORIES_LABEL,
  type CategoryItem,
} from "@/data/navigation";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  /** 由侧边栏从数据层透传进来的分类条目（组件本身不感知数据来源） */
  items: readonly CategoryItem[];
}

// 渐进式抽离：链接态类名含多状态条件，与主导航子项保持一致观感，按 §1.3 抽到 JSX 外
const childLinkStyles =
  "flex items-center gap-x-3 rounded-3xl px-4 py-2 text-sm transition-colors";
const activeLinkStyles =
  "bg-brand-primaryContainer text-brand-onPrimaryContainer";
const idleLinkStyles =
  "text-surface-onVariant hover:bg-surface-variant/50 hover:text-surface-onSurface";

const SUBMENU_ID = "submenu-categories";

/**
 * 文章分类二级菜单（客户端叶子）
 *
 * 为什么是客户端组件：分组父级需作展开/收起开关（浏览器侧交互），且「当前命中的分类」
 * 高亮依赖当前路由——分类已升级为独立路由 /categories/<key>，故改用 usePathname 判定，
 * 不再依赖 ?category 查询参数（也因此侧边栏不再需要 <Suspense> 包裹）。
 * 与「项目 / 作品」一致：父级是可跳转到总览 /categories 的链接，旁边附带展开/收起按钮。
 */
export default function CategoryNav({ items }: CategoryNavProps) {
  const pathname = usePathname();
  // 父级（总览或任一分类子页）命中即高亮；子项要求精确匹配各自的 /categories/<key>
  const sectionActive = pathname.startsWith(CATEGORIES_BASE_PATH);

  // 默认展开：处在分类区时自动展开便于定位，其余情况也默认展开以利发现；用户可手动收起
  const [open, setOpen] = useState(true);

  return (
    <nav className="hidden w-full flex-col gap-y-1 md:flex" aria-label="文章分类">
      {/* 父行：链接负责跳转到分类总览，按钮负责展开/收起子菜单（仅桌面端） */}
      <div className="flex items-center">
        <Link
          href={CATEGORIES_BASE_PATH}
          aria-current={pathname === CATEGORIES_BASE_PATH ? "page" : undefined}
          className={cn(
            "flex flex-1 items-center gap-x-2 rounded-3xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
            sectionActive
              ? "text-brand-primary"
              : "text-surface-onVariant/70 hover:bg-surface-variant/40 hover:text-surface-onSurface",
          )}
        >
          <Icon name="tag" className="h-4 w-4 shrink-0" aria-hidden="true" />
          {CATEGORIES_LABEL}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={SUBMENU_ID}
          aria-label={`${open ? "收起" : "展开"}${CATEGORIES_LABEL}子菜单`}
          className="ml-1 shrink-0 rounded-full p-2 text-surface-onVariant transition-colors hover:bg-surface-variant/50 hover:text-surface-onSurface"
        >
          <Icon
            name="chevron-down"
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 二级子菜单：收起时不渲染，避免占位与无障碍焦点陷阱 */}
      {open && (
        <ul
          id={SUBMENU_ID}
          className="ml-4 mt-1 flex flex-col gap-y-1 border-l border-outline-variant/30 pl-2"
        >
          {items.map((category) => {
            const href = categoryHref(category.key);
            const active = pathname === href;
            return (
              <li key={category.key}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    childLinkStyles,
                    active ? activeLinkStyles : idleLinkStyles,
                  )}
                >
                  <Icon
                    name={category.icon}
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{category.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
