import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryItems,
  categoryLabelMap,
  CATEGORIES_BASE_PATH,
  CATEGORIES_LABEL,
} from "@/data/navigation";
import { getAllPosts } from "@/lib/mdx";
import type { PostCategory } from "@/types/blog";
import PostList from "@/components/blog/post-list";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/ui/reveal";

interface CategoryPageProps {
  // Next.js 16 中动态路由 params 为异步，需先 await
  params: Promise<{ category: string }>;
}

/** 合法分类集合：用于运行时校验 slug，非法则触发 notFound */
const validCategories = new Set<string>(categoryItems.map((c) => c.key));

/**
 * 预生成四个分类页（tech / anime / life / notes）的静态路由。
 *
 * 分类 key 即路由 slug，直接由数据层派生；新增分类会自动多出一张静态页。
 */
export function generateStaticParams(): { category: string }[] {
  return categoryItems.map((category) => ({ category: category.key }));
}

/**
 * 按分类动态生成 SEO 元数据（标题 / 描述）
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!validCategories.has(category)) return {};
  const label = categoryLabelMap[category as PostCategory];
  return {
    title: `${label} · ${CATEGORIES_LABEL}`,
    description: `AkiTuyu 中归属「${label}」分类的全部文章。`,
  };
}

/**
 * 文章分类详情页（服务端组件，纯控制器）
 *
 * 为什么这样拆：分类筛选从首页查询参数迁出后，这里按 slug 校验分类、
 * 从 lib/mdx 读取全部文章再按 category 过滤，最后把列表交给纯展示组件 PostList。
 * 非法 slug 触发 404；列表的入场动画仍由 PostList 客户端叶子承载（§1.6）。
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!validCategories.has(category)) notFound();

  const activeCategory = category as PostCategory;
  const label = categoryLabelMap[activeCategory];
  const posts = getAllPosts().filter((post) => post.category === activeCategory);

  return (
    <Reveal>
      <div className="flex flex-col gap-y-8">
        {/* 返回分类总览入口 */}
        <Link
          href={CATEGORIES_BASE_PATH}
          className="inline-flex items-center gap-x-1.5 text-sm font-medium text-surface-onVariant transition-colors hover:text-brand-primary"
        >
          <Icon name="arrow-left" className="h-4 w-4" aria-hidden="true" />
          返回全部分类
        </Link>

        <header className="flex items-baseline justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl">
            {label}
          </h1>
          <span className="text-sm text-surface-onVariant">共 {posts.length} 篇</span>
        </header>

        <section aria-label={`${label}文章列表`}>
          <PostList posts={posts} />
        </section>
      </div>
    </Reveal>
  );
}
