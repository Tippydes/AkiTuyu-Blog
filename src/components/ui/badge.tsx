import React from "react";
import { cn } from "@/lib/utils";

/** 徽章视觉风格：tag 用樱花粉次要色，category 用薰衣草第三色，outline 为描边弱化态 */
type BadgeVariant = "tag" | "category" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * 原子级徽章组件（纯展示）
 * 用于文章标签、分类标识等小尺寸语义化标记。
 */
export default function Badge({
  children,
  variant = "tag",
  className,
}: BadgeProps) {
  // 不同语义对应不同 MD3 容器令牌；用映射表替代多层三元，便于扩展
  const variantStyles: Record<BadgeVariant, string> = {
    tag: "bg-secondary-container text-secondary-onContainer",
    category: "bg-tertiary-container text-tertiary-onContainer",
    outline: "border border-outline-variant/60 text-surface-onVariant",
  };

  const baseStyles =
    "inline-flex items-center gap-x-1 rounded-full px-3 py-1 text-xs font-medium";

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
}
