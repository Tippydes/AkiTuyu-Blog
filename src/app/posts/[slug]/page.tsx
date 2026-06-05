import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import PostMeta from "@/components/blog/post-meta";
import PostBody from "@/components/blog/post-body";
import Badge from "@/components/ui/badge";

interface PostPageProps {
  // Next.js 16 中动态路由 params 为异步
  params: Promise<{ slug: string }>;
}

/**
 * 预生成所有文章详情页的静态路径，提升首屏与 SEO 表现。
 */
export function generateStaticParams(): { slug: string }[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

/**
 * 按文章内容动态生成 SEO 元数据（标题 / 描述）。
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

/**
 * 文章详情页（服务端组件控制器）
 *
 * 从内容服务层按 slug 取数；找不到即触发 404。页面只负责编排
 * 「返回入口 + 文章头部 + 正文」三块，正文渲染交给纯展示组件 PostBody。
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="glass-panel mx-auto max-w-3xl rounded-4xl p-6 md:p-10">
      {/* 返回首页入口 */}
      <Link
        href="/"
        className="inline-flex items-center gap-x-1.5 text-sm font-medium text-surface-onVariant transition-colors hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回首页
      </Link>

      {/* 文章头部：元信息 + 标题 + 摘要 + 标签 */}
      <header className="mt-6 border-b border-outline-variant/30 pb-6">
        <PostMeta
          date={post.date}
          formattedDate={post.formattedDate}
          readingMinutes={post.readingMinutes}
          category={post.category}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-surface-onVariant">
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
      </header>

      {/* 正文 */}
      <div className="mt-8">
        <PostBody html={post.contentHtml} />
      </div>
    </article>
  );
}
