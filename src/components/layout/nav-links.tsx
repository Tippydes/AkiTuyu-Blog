"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * 首页要求精确匹配，其余子页用前缀匹配以兼容详情页 / 子路由等多级路由
 * （如处于 /projects/personal 时，父级 /projects 同样视为激活）。
 */
function matchActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * 主导航链接组（客户端叶子）
 *
 * 为什么是客户端组件：高亮「当前所在页」需读取路由 usePathname，且二级菜单的
 * 展开 / 收起属于浏览器侧交互，故仅把导航这一小块下沉为客户端，侧边栏外壳仍为
 * 服务端组件（§1.6）。
 */
export default function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="flex w-full flex-row items-center justify-around gap-x-1 md:flex-col md:items-stretch md:gap-y-1">
      {items.map((item) => (
        <NavEntry key={item.href} item={item} pathname={pathname} />
      ))}
    </ul>
  );
}

interface NavEntryProps {
  item: NavItem;
  pathname: string;
}

/**
 * 单个主导航条目（含可选二级菜单）
 *
 * 无 children 时退化为普通链接；有 children 时父级链接旁附带展开按钮，
 * 子菜单仅在桌面端展示（移动端底部栏空间有限，点击父级直达 /projects 总览）。
 */
function NavEntry({ item, pathname }: NavEntryProps) {
  const active = matchActive(pathname, item.href);
  const hasChildren = Boolean(item.children?.length);

  // 默认展开策略：当前正处于该分区时自动展开，方便用户立刻看到同级子页；
  // 用户也可手动开合，故用 state 而非纯派生值。
  const [open, setOpen] = useState(active);

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(baseLinkStyles, active ? activeLinkStyles : idleLinkStyles)}
        >
          <Icon name={item.icon} className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  }

  const submenuId = `submenu-${item.href.replace(/\//g, "-")}`;

  return (
    <li>
      {/* 父级行：链接负责跳转总览页，展开按钮负责开合子菜单（仅桌面端） */}
      <div className="flex items-center">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
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

      {/* 二级子菜单：仅桌面端展示；收起时不渲染，避免占位与无障碍焦点陷阱 */}
      {open && (
        <ul
          id={submenuId}
          className="ml-4 mt-1 hidden flex-col gap-y-1 border-l border-outline-variant/30 pl-2 md:flex"
        >
          {item.children?.map((child) => {
            const childActive = matchActive(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  className={cn(
                    childLinkStyles,
                    childActive ? activeLinkStyles : idleLinkStyles,
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
