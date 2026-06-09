"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/icon";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  /** slug → 文章标题 映射，由服务端 Header 透传，供详情页末级回显中文标题 */
  postTitles?: Readonly<Record<string, string>>;
  /** 首页等无层级可展示时的回退文案（如站点标语），避免页眉左侧空荡 */
  fallback?: string;
}

// 当前页（末级）与可点击节点的文案态有差异，且复用多次，按 §1.3 抽到 JSX 外
const currentCrumbStyles = "truncate font-medium text-surface-onSurface";
const linkCrumbStyles =
  "truncate text-surface-onVariant transition-colors hover:text-brand-primary";

/**
 * 顶部页眉面包屑（客户端叶子）
 *
 * 为什么是客户端组件：层级由当前路由推导，需读取 usePathname；外层 Header 仍为
 * 服务端组件，仅把 postTitles 这类数据透传进来（§1.6 交互/路由下沉到叶子）。
 * 渲染严格语义化：<nav aria-label> 包 <ol>，每级 <li>，末级标注 aria-current。
 */
export default function Breadcrumbs({ postTitles, fallback }: BreadcrumbsProps) {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname, postTitles);

  // 仅「首页」一级时不展示面包屑，改用回退文案（站点标语）保持页眉视觉平衡
  if (crumbs.length <= 1) {
    return fallback ? (
      <p className="truncate text-sm font-medium text-surface-onVariant">{fallback}</p>
    ) : null;
  }

  return (
    <nav aria-label="面包屑" className="min-w-0">
      <ol className="flex items-center gap-x-1.5 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href ?? `${crumb.label}-${index}`} className="flex min-w-0 items-center gap-x-1.5">
              {/* 非首节点前置分隔符：chevron 旋转为右向箭头，纯装饰故 aria-hidden */}
              {index > 0 && (
                <Icon
                  name="chevron-down"
                  className="h-3.5 w-3.5 shrink-0 -rotate-90 text-surface-onVariant/50"
                  aria-hidden="true"
                />
              )}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className={linkCrumbStyles}>
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast ? currentCrumbStyles : "truncate text-surface-onVariant")}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
