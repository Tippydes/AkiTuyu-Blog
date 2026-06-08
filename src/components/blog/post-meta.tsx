import React from "react";
import type { PostCategory } from "@/types/blog";
import { categoryLabelMap } from "@/data/navigation";
import Badge from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface PostMetaProps {
  /** ISO 日期，用于 <time dateTime> */
  date: string;
  /** 本地化后的可读日期 */
  formattedDate: string;
  /** 预计阅读分钟数 */
  readingMinutes: number;
  /** 文章分类 */
  category: PostCategory;
  className?: string;
}

/**
 * 文章元信息行（纯展示）
 * 语义化使用 <time> 承载日期；分类回显为薰衣草徽章。
 */
export default function PostMeta({
  date,
  formattedDate,
  readingMinutes,
  category,
  className,
}: PostMetaProps) {
  const wrapperStyles =
    "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-onVariant";

  return (
    <div className={cn(wrapperStyles, className)}>
      <time dateTime={date} className="inline-flex items-center gap-x-1.5">
        <Icon name="calendar" className="h-4 w-4" aria-hidden="true" />
        {formattedDate}
      </time>
      <span className="inline-flex items-center gap-x-1.5">
        <Icon name="clock" className="h-4 w-4" aria-hidden="true" />
        约 {readingMinutes} 分钟
      </span>
      <Badge variant="category">{categoryLabelMap[category]}</Badge>
    </div>
  );
}
