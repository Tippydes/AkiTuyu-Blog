import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/types/blog";
import PostMeta from "@/components/blog/post-meta";
import Badge from "@/components/ui/badge";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostSummary;
  /** 允许外层布局微调样式（如栅格跨列） */
  className?: string;
}

/**
 * 判断封面值是「图片资源路径」还是「CSS 渐变字符串」
 *
 * 为什么这样区分：cover 字段按数据层契约可二选一（§1.4）——图片资源以
 * "/"（public 下资源）或 "http" 开头，其余一律视为 CSS 渐变值。据此决定
 * 用 next/image 渲染图片，还是走内联 backgroundImage（§1.3 动态值例外）。
 */
function isImageCover(cover: string): boolean {
  return cover.startsWith("/") || cover.startsWith("http");
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

  // 封面回退：文章未配专属封面时，统一落到站点占位图（site-config 单一真源，§1.4）
  const cover = post.cover ?? siteConfig.placeholderCover;
  // 是否使用的是占位图：占位 Logo 用 contain 完整居中展示，真实封面图用 cover 满铺裁切
  const usingPlaceholder = !post.cover;

  return (
    <article className={cn(cardStyles, className)}>
      {/* 封面区：图片资源用 next/image 渲染；CSS 渐变走内联 backgroundImage（§1.3 动态值例外） */}
      {isImageCover(cover) ? (
        <div className="relative h-32 w-full bg-surface-variant">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn(usingPlaceholder ? "object-contain p-6" : "object-cover")}
            aria-hidden="true"
          />
        </div>
      ) : (
        <div
          className="h-32 w-full bg-surface-variant"
          style={{ backgroundImage: cover }}
          aria-hidden="true"
        />
      )}

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
