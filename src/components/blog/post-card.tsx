import React from "react";
import Link from "next/link";
import type { PostSummary } from "@/types/blog";
import PostMeta from "@/components/blog/post-meta";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostSummary;
  /** 允许外层布局微调样式（如栅格跨列） */
  className?: string;
}

/**
 * 博客文章卡片（纯展示）
 *
 * 严格语义化为 <article> 独立实体；整卡可点击（标题链接铺一层透明覆盖层），
 * 悬停时轻微上浮并强化阴影，呼应 Mizuki 风格的细腻微交互。
 */
export default function PostCard({ post, className }: PostCardProps) {
  // 卡片容器含 group 悬停态与多重视觉细节，按 §1.3 抽离为常量保持 JSX 纯净
  const cardStyles =
    "group glass-panel relative flex flex-col overflow-hidden rounded-4xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-dark";
  const titleStyles =
    "mt-3 text-xl font-bold tracking-tight text-surface-onSurface transition-colors group-hover:text-brand-primary";

  return (
    <article className={cn(cardStyles, className)}>
      {/* 封面：渐变色值来自数据层 Frontmatter，属「JS 动态计算值」内联样式例外（§1.3） */}
      <div
        className="h-32 w-full bg-surface-variant"
        style={post.cover ? { backgroundImage: post.cover } : undefined}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col p-6">
        <PostMeta
          date={post.date}
          formattedDate={post.formattedDate}
          readingMinutes={post.readingMinutes}
          category={post.category}
        />

        <h2 className={titleStyles}>
          <Link href={`/posts/${post.slug}`}>
            {/* 透明覆盖层：让整张卡片都成为可点击热区，同时保持语义在标题链接上 */}
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {post.title}
          </Link>
        </h2>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-surface-onVariant">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="tag">#{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
