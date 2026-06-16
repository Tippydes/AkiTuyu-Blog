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

// 渐进式抽离：链接态类名父级与子级复用、含多状态条件，按 §1.3 抽到 JSX 外
const baseLinkStyles =
  "flex items-center gap-x-3 rounded-3xl px-4 py-2.5 text-sm font-medium transition-colors";
const activeLinkStyles =
  "bg-brand-primaryContainer text-brand-onPrimaryContainer";
const idleLinkStyles =
  "text-surface-onVariant hover:bg-surface-variant/50 hover:text-surface-onSurface";
// 二级子项：略小字号 + 缩进，视觉从属于父级
const childLinkStyles =
  "flex items-center gap-x-3 rounded-3xl px-4 py-2 text-sm transition-colors";

/**
 * 判断某导航地址是否「当前所在」
 *
 * 分类已升级为独立路由（/categories/<key>），与项目子页一样是纯路径，
 * 故统一按路径前缀匹配：首页 `/` 要求精确匹配，其余前缀匹配以兼容详情页 / 子路由
 * （例如处在 /projects/personal 时父级 /projects 同样视为激活）。
 */
function matchActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * 主导航链接（客户端叶子）
 *
 * 为什么是客户端组件：高亮「当前所在」要读 usePathname，二级菜单的展开 / 收起属浏览器
 * 交互，仅把导航这一小块下沉为客户端，侧边栏外壳仍是服务端组件（§1.6）。
 */
export default function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname();
  return (
    <ul className="flex w-full flex-row items-center justify-around gap-x-1 md:flex-col md:items-stretch md:gap-y-1">
      {items.map((item) => (
        <NavEntry key={item.label} item={item} pathname={pathname} />
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
 * 三种形态：
 * 1. 无 children → 普通链接；
 * 2. 有 children + 有 href（「文章分类」「项目 / 作品」）→ 父级链接跳转总览页，旁附展开按钮；
 * 3. 有 children + 无 href（纯分组型）→ 整行即展开/收起开关，本身不跳转。
 * 子菜单仅桌面端展示（移动端底栏空间有限）。
 */
function NavEntry({ item, pathname }: NavEntryProps) {
  const hasChildren = Boolean(item.children?.length);
  const selfActive = matchActive(pathname, item.href);
  // 纯分组父级自身无路由时，其激活态由是否有子项命中推导
  const childActive =
    item.children?.some((child) => matchActive(pathname, child.href)) ?? false;
  const active = selfActive || childActive;

  // 默认展开策略：纯分组型（无 href）始终展开利于发现；可跳转父级在处于该区时自动展开
  const [open, setOpen] = useState(item.href ? active : true);

  // li 包装：分组型可标记仅桌面端展示，避免移动端底部出现无处可点的开关
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

  // id 取图标名（同父级图标互斥），避免中文 label 生成非法 / 不稳定的 id
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
        // 形态 2：父级链接 + 旁附展开按钮（仅桌面端）
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
        // 形态 3：纯分组型整行即展开/收起开关，与一级链接同号样式
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

      {/* 二级子菜单仅桌面端展示；收起时不渲染，避免占位与无障碍焦点陷阱 */}
      {open && (
        <ul
          id={submenuId}
          className="ml-4 mt-1 hidden flex-col gap-y-1 border-l border-outline-variant/30 pl-2 md:flex"
        >
          {item.children?.map((child) => {
            const childIsActive = matchActive(pathname, child.href);
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
