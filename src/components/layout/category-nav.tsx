"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { CategoryItem } from "@/data/navigation";
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
// 一级标题（展开开关）与主导航顶级项 baseLinkStyles 完全对齐：同字号/字重/内边距
const topLevelStyles =
  "flex items-center justify-between rounded-3xl px-4 py-2.5 text-sm font-medium transition-colors";

const SUBMENU_ID = "submenu-categories";

/**
 * 文章分类二级菜单（客户端叶子）
 *
 * 为什么是客户端组件：分组标题需作展开/收起开关（浏览器侧交互），且「当前命中的分类」
 * 高亮依赖首页的 ?category 查询参数（useSearchParams），故仅把这一小块下沉为客户端，
 * 侧边栏外壳仍为服务端组件（§1.6）。与「项目 / 作品」一致地呈现为可折叠二级菜单。
 */
export default function CategoryNav({ items }: CategoryNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 仅在首页（文章流）时才依据 ?category 判定命中；其余路由不参与分类高亮
  const activeKey = pathname === "/" ? searchParams.get("category") : null;

  // 默认展开：分类是首页筛选的主入口，保持可见利于发现；用户也可手动收起
  const [open, setOpen] = useState(true);

  return (
    <nav className="hidden w-full flex-col gap-y-1 md:flex" aria-label="文章分类">
      {/* 分组标题兼作展开/收起开关：把原本平铺的分类升级为可折叠的二级菜单父级 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={SUBMENU_ID}
        className={cn(topLevelStyles, idleLinkStyles)}
      >
        <span className="flex items-center gap-x-3">
          <Icon name="tag" className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>文章分类</span>
        </span>
        <Icon
          name="chevron-down"
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
          aria-hidden="true"
        />
      </button>

      {/* 二级子菜单：收起时不渲染，避免占位与无障碍焦点陷阱 */}
      {open && (
        <ul
          id={SUBMENU_ID}
          className="ml-4 mt-1 flex flex-col gap-y-1 border-l border-outline-variant/30 pl-2"
        >
          {items.map((category) => {
            const active = activeKey === category.key;
            return (
              <li key={category.key}>
                <Link
                  href={`/?category=${category.key}`}
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
