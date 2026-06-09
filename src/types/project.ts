/**
 * 项目 / 作品数据字典（类型定义层）
 *
 * 为什么独立成文件：与 types/blog.ts 同级，承载「项目展示」这一新业务域的严格类型契约。
 * 数据层 data/projects.ts 与展示层 components/projects/* 共享这里的类型，确保字段一致。
 */

/**
 * 项目分类标识
 *
 * 与 `/projects/<key>` 子路由一一对应（博客源码 / 个人项目 / 开源贡献），
 * 故同时充当路由 slug，避免再维护一份 key→slug 映射。
 */
export type ProjectCategoryKey = "blog-source" | "personal" | "oss";

/** 单个项目 / 作品条目（纯数据，展示组件只读取不感知来源） */
export interface ProjectItem {
  /** 项目名称 */
  name: string;
  /** 一句话简介 */
  description: string;
  /** 跳转链接（外链如 GitHub 仓库，或站内地址） */
  href: string;
  /** 技术栈 / 关键词标签，渲染为徽章 */
  tags?: readonly string[];
}

/** 项目分类（每个分类对应一个 `/projects/<key>` 子页面） */
export interface ProjectCategory {
  /** 分类标识，同时作为子路由 slug */
  key: ProjectCategoryKey;
  /** 分类中文名 */
  label: string;
  /** Game-Icon-Pack 语义图标名，由 <Icon> 按名取用 */
  icon: string;
  /** 分类一句话说明，用于侧边栏总览与子页头部 */
  summary: string;
  /** 该分类下的项目条目 */
  items: readonly ProjectItem[];
}
