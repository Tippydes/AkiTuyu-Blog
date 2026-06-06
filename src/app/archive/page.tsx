import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByYear } from "@/lib/mdx";
import { categoryLabelMap } from "@/data/navigation";
import Badge from "@/components/ui/badge";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "归档",
  description: "AkiTuyu 全部文章的时间轴归档。",
};

/**
 * 归档页（服务端组件控制器）
 *
 * 从内容服务层取「按年份分组」的数据，编排成时间轴式列表。
 * 页面只负责取数与编排，单条目展示借助语义化 <time> 与徽章组件。
 */
export default function ArchivePage() {
  const groups = getPostsByYear();
  const total = groups.reduce((sum, group) => sum + group.posts.length, 0);

  return (
    <Reveal>
      <div className="flex flex-col gap-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl">
            归档
          </h1>
          <p className="mt-2 text-sm text-surface-onVariant">
            按时间倒序排列，共 {total} 篇
          </p>
        </header>

        {groups.map((group) => (
          <section
            key={group.year}
            aria-labelledby={`archive-year-${group.year}`}
            className="glass-panel rounded-4xl p-6 md:p-8"
          >
            <h2
              id={`archive-year-${group.year}`}
              className="mb-4 text-2xl font-bold text-brand-primary"
            >
              {group.year}
            </h2>
            <ul className="flex flex-col divide-y divide-outline-variant/20">
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 transition-colors"
                  >
                    <span className="flex min-w-0 items-center gap-x-4">
                      <time
                        dateTime={post.date}
                        className="shrink-0 text-sm tabular-nums text-surface-onVariant"
                      >
                        {post.formattedDate}
                      </time>
                      <span className="truncate font-medium text-surface-onSurface transition-colors group-hover:text-brand-primary">
                        {post.title}
                      </span>
                    </span>
                    <Badge variant="category">
                      {categoryLabelMap[post.category]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Reveal>
  );
}
