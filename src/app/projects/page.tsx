import type { Metadata } from "next";
import Link from "next/link";
import { projectCategories } from "@/data/projects";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "项目 / 作品",
  description: "AkiTuyu 的项目与作品总览：博客源码、个人项目与开源贡献。",
};

/**
 * 项目 / 作品总览页（服务端组件控制器）
 *
 * 从数据层取三个分类，编排为入口卡片，分别链接到对应子路由
 * （/projects/<key>）。页面只负责取数与编排，单卡展示交给语义化结构。
 */
export default function ProjectsPage() {
  return (
    <Reveal>
      <div className="flex flex-col gap-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl">
            项目 / 作品
          </h1>
          <p className="mt-2 text-sm text-surface-onVariant">
            这里收纳本站源码、个人项目与开源贡献，点选分类查看详情。
          </p>
        </header>

        <section aria-label="项目分类" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projectCategories.map((category) => (
            <article
              key={category.key}
              className="glass-panel group flex flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1"
            >
              <Link
                href={`/projects/${category.key}`}
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
                  共 {category.items.length} 项 →
                </p>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </Reveal>
  );
}
