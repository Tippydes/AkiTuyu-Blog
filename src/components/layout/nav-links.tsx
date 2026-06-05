"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/navigation";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  /** 由侧边栏从数据层透传进来的导航条目（组件本身不感知数据来源） */
  items: readonly NavItem[];
}

/**
 * 主导航链接组（客户端叶子）
 *
 * 为什么是客户端组件：高亮「当前所在页」需要读取路由 usePathname，属浏览器侧能力；
 * 故仅把导航这一小块下沉为客户端，侧边栏外壳仍保持服务端组件（§1.6）。
 */
export default function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname();

  const baseLinkStyles =
    "flex items-center gap-x-3 rounded-3xl px-4 py-2.5 text-sm font-medium transition-colors";
  const activeLinkStyles =
    "bg-brand-primaryContainer text-brand-onPrimaryContainer";
  const idleLinkStyles =
    "text-surface-onVariant hover:bg-surface-variant/50 hover:text-surface-onSurface";

  return (
    <ul className="flex w-full flex-row items-center justify-around gap-x-1 md:flex-col md:items-stretch md:gap-y-1">
      {items.map((item) => {
        // 首页要求精确匹配，其余子页用前缀匹配以兼容详情页等多级路由
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                baseLinkStyles,
                isActive ? activeLinkStyles : idleLinkStyles,
              )}
            >
              <Icon name={item.icon} className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
