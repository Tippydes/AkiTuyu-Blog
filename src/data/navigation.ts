import type { PostCategory } from "@/types/blog";

/**
 * 导航与分类矩阵（静态配置层）
 *
 * 为什么放数据层：侧边栏 / 页脚等组件只负责「渲染导航」，不应内嵌任何菜单文案；
 * 路由结构一旦调整，只改这里即可全站同步，符合「数据-UI 分离」。
 */

/** 主导航条目 */
export interface NavItem {
  /** 菜单文案 */
  label: string;
  /** 路由地址 */
  href: string;
  /** lucide-react 图标名（由叶子组件按名映射为图标组件） */
  icon: string;
}

/** 分类条目：在主导航之外，单独成区展示文章分类入口 */
export interface CategoryItem {
  /** 分类标识，与 types/blog.ts 的 PostCategory 对齐 */
  key: PostCategory;
  /** 分类中文名 */
  label: string;
  /** lucide-react 图标名 */
  icon: string;
}

/** 顶层主导航：首页文章流 / 归档 / 关于 */
export const navItems: readonly NavItem[] = [
  { label: "首页", href: "/", icon: "Home" },
  { label: "归档", href: "/archive", icon: "Archive" },
  { label: "关于", href: "/about", icon: "User" },
] as const;

/** 文章分类矩阵：用于侧边栏分类区与分类筛选 */
export const categoryItems: readonly CategoryItem[] = [
  { key: "tech", label: "技术随笔", icon: "Code2" },
  { key: "anime", label: "番剧杂感", icon: "Sparkles" },
  { key: "life", label: "日常碎语", icon: "Coffee" },
  { key: "notes", label: "学习笔记", icon: "NotebookPen" },
] as const;

/**
 * 分类标识 → 中文名 的快速查找表
 * 文章卡片 / 详情页只拿到 PostCategory，需要据此回显可读分类名
 */
export const categoryLabelMap: Readonly<Record<PostCategory, string>> =
  Object.fromEntries(
    categoryItems.map((item) => [item.key, item.label]),
  ) as Record<PostCategory, string>;
