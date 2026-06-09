import React from "react";
import type { ProjectItem } from "@/types/project";
import ProjectCard from "@/components/projects/project-card";

interface ProjectListProps {
  /** 待渲染的项目条目集合 */
  items: readonly ProjectItem[];
}

/**
 * 项目列表（纯展示）
 *
 * 把若干项目卡片编排为响应式网格；条目为空时给出占位文案，避免渲染空网格。
 */
export default function ProjectList({ items }: ProjectListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-surface-onVariant">
        这个分类暂时还没有内容，敬请期待。
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((project) => (
        <li key={project.name}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
