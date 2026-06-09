import React from "react";
import Link from "next/link";
import type { ProjectItem } from "@/types/project";
import Badge from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface ProjectCardProps {
  /** 由页面从数据层透传的单个项目条目（组件不感知数据来源） */
  project: ProjectItem;
}

/**
 * 项目卡片（纯展示）
 *
 * 语义化为 <article>：每个项目是独立可复用实体。整卡为一个跳转链接，
 * 外链自动新开标签页并加 noopener，沿用全站毛玻璃 + 圆角 + MD3 令牌风格。
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  // 外链需新开标签页，站内链接保持默认行为
  const isExternal = project.href.startsWith("http");

  return (
    <article className="glass-panel group flex h-full flex-col rounded-3xl p-5 transition-transform hover:-translate-y-1">
      <Link
        href={project.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex h-full flex-col"
      >
        <header className="flex items-center justify-between gap-x-3">
          <h3 className="font-semibold text-surface-onSurface transition-colors group-hover:text-brand-primary">
            {project.name}
          </h3>
          <Icon
            name="arrow-left"
            className="h-4 w-4 shrink-0 rotate-180 text-surface-onVariant transition-transform group-hover:translate-x-1 group-hover:text-brand-primary"
            aria-hidden="true"
          />
        </header>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-onVariant">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="tag">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
}
