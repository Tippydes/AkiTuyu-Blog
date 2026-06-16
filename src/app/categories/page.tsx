import type { Metadata } from "next";
import Link from "next/link";
import { categoryItems, categoryHref, CATEGORIES_LABEL } from "@/data/navigation";
import { getAllPosts } from "@/lib/mdx";
import type { PostCategory } from "@/types/blog";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: CATEGORIES_LABEL,
  description: "AkiTuyu 的文章分类总览：技术随笔、番剧杂感、日常碎语与学习笔记。",
};

/**
 * 文章分类总览页（服务端组件，纯控制器）
 *
 * 为什么独立成页：分类已从「首页 ?category 查询参数」升级为与首页分离的独立路由。
 * 本页只做两件事——读取全部文章统计各分类篇数、把分类矩阵编排为卡片入口，
 * 每张卡片链接到对应的 /categories/<key> 详情页（§1.4 页面即控制器）。
 */
export default function CategoriesPage() {
  // 一次性读出全部文章，按分类聚合篇数，供卡片展示「共 N 篇」
  const postCountByCategory = getAllPosts().reduce<Record<string, number>>(
    (acc, post) => {
      acc[post.category] = (acc[post.category] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <Reveal>
      <div className="flex flex-col gap-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl">
            {CATEGORIES_LABEL}
          </h1>
          <p className="mt-2 text-sm text-surface-onVariant">
            按主题浏览全部文章，选一个分类看看吧。
          </p>
        </header>

        <section
          aria-label="文章分类列表"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {categoryItems.map((category) => (
            <article
              key={category.key}
              className="glass-panel group flex flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1"
            >
              <Link
                href={categoryHref(category.key)}
                className="flex h-full flex-col"
              >
                <header className="flex items-center gap-x-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-container text-secondary-onContainer"
                    aria-hidden="true"
                  >
                    <Icon name={category.icon} className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-bold text-surface-onSurface transition-colors group-hover:text-brand-primary">
                    {category.label}
                  </h2>
                </header>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-surface-onVariant">
                  {category.summary}
                </p>
                <p className="mt-4 text-sm font-medium text-brand-primary">
                  共 {postCountByCategory[category.key as PostCategory] ?? 0} 篇 →
                </p>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </Reveal>
  );
}
