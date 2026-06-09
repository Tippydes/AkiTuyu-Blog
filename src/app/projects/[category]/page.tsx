import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectCategories, projectCategoryMap } from "@/data/projects";
import type { ProjectCategoryKey } from "@/types/project";
import ProjectList from "@/components/projects/project-list";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/ui/reveal";

interface ProjectCategoryPageProps {
  // Next.js 16 中动态路由 params 为异步
  params: Promise<{ category: string }>;
}

/**
 * 预生成三个项目分类子页（博客源码 / 个人项目 / 开源贡献）的静态路径。
 *
 * 分类 key 即子路由 slug，故直接由数据层派生，新增分类时自动多出对应静态页。
 */
export function generateStaticParams(): { category: string }[] {
  return projectCategories.map((category) => ({ category: category.key }));
}

/**
 * 按分类动态生成 SEO 元数据（标题 / 描述）。
 */
export async function generateMetadata({
  params,
}: ProjectCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const data = projectCategoryMap[category as ProjectCategoryKey];
  if (!data) return {};
  return { title: `${data.label} · 项目`, description: data.summary };
}

/**
 * 项目分类子页（服务端组件控制器）
 *
 * 从数据层按 slug 取对应分类；非法 slug 触发 404。页面只负责编排
 * 「返回总览 + 分类头部 + 项目列表」，列表渲染交给纯展示组件 ProjectList。
 */
export default async function ProjectCategoryPage({
  params,
}: ProjectCategoryPageProps) {
  const { category } = await params;
  const data = projectCategoryMap[category as ProjectCategoryKey];
  if (!data) notFound();

  return (
    <Reveal>
      <div className="flex flex-col gap-y-8">
        {/* 返回项目总览入口 */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-x-1.5 text-sm font-medium text-surface-onVariant transition-colors hover:text-brand-primary"
        >
          <Icon name="arrow-left" className="h-4 w-4" aria-hidden="true" />
          返回项目总览
        </Link>

        <header className="flex items-center gap-x-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-3xl bg-secondary-container text-secondary-onContainer"
            aria-hidden="true"
          >
            <Icon name={data.icon} className="h-6 w-6" />
          </span>
          <span className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl">
              {data.label}
            </h1>
            <p className="mt-1 text-sm text-surface-onVariant">{data.summary}</p>
          </span>
        </header>

        <section aria-label={`${data.label}列表`}>
          <ProjectList items={data.items} />
        </section>
      </div>
    </Reveal>
  );
}
