import type { PostCategory } from "@/types/blog";
import { projectCategories } from "@/data/projects";

/**
 * 导航与分类矩阵（静态配置层）
 *
 * 为什么放数据层：侧边栏 / 页脚等组件只负责「渲染导航」，不应内嵌任何菜单文案；
 * 路由结构一旦调整，只改这里即可全站同步，符合「数据-UI 分离」。
 */

/** 主导航条目（支持一层二级菜单：children 非空即为可展开的父级） */
export interface NavItem {
  /** 菜单文案 */
  label: string;
  /**
   * 路由地址；纯分组型父级（本身无独立页面、仅用于展开子菜单，如「文章分类」）
   * 可省略，此时菜单整行退化为展开/收起开关而非链接。
   */
  href?: string;
  /** Game-Icon-Pack 语义图标名（由 <Icon> 按名映射为内联图标组件） */
  icon: string;
  /** 可选的二级子菜单；仅渲染一层，避免无限嵌套带来的导航复杂度 */
  children?: readonly NavItem[];
  /**
   * 仅桌面端展示：移动端底部导航条空间有限，对纯分组型入口（如「文章分类」）
   * 隐藏，避免在底部栏出现点击无落点的开关项。
   */
  desktopOnly?: boolean;
}

/** 分类条目：用于文章分类入口与首页 ?category 筛选 */
export interface CategoryItem {
  /** 分类标识，与 types/blog.ts 的 PostCategory 对齐 */
  key: PostCategory;
  /** 分类中文名 */
  label: string;
  /** Game-Icon-Pack 语义图标名 */
  icon: string;
}

/**
 * 文章分类矩阵：既作为主导航「文章分类」二级菜单的数据源，也用于首页分类筛选。
 * 定义在 navItems 之前，使后者可直接派生出分类子菜单，保持单一数据源。
 */
export const categoryItems: readonly CategoryItem[] = [
  { key: "tech", label: "技术随笔", icon: "code" },
  { key: "anime", label: "番剧杂感", icon: "sparkle" },
  { key: "life", label: "日常碎语", icon: "daily" },
  { key: "notes", label: "学习笔记", icon: "notes" },
] as const;

/**
 * 顶层主导航：首页文章流 / 归档 / 文章分类（带二级菜单）/ 项目作品（带二级菜单）/ 关于
 *
 * 「文章分类」「项目 / 作品」的二级菜单分别由 categoryItems、data/projects.ts 派生，
 * 保证菜单项与实际筛选 / 页面始终单一数据源、不会两处脱节。其中「文章分类」是纯分组型
 * 父级（无独立页面，省略 href），仅在桌面端展示（desktopOnly）。
 */
export const navItems: readonly NavItem[] = [
  { label: "首页", href: "/", icon: "home" },
  { label: "归档", href: "/archive", icon: "archive" },
  {
    label: "文章分类",
    icon: "tag",
    desktopOnly: true,
    children: categoryItems.map((category) => ({
      label: category.label,
      href: `/?category=${category.key}`,
      icon: category.icon,
    })),
  },
  {
    label: "项目 / 作品",
    href: "/projects",
    icon: "folder",
    children: projectCategories.map((category) => ({
      label: category.label,
      href: `/projects/${category.key}`,
      icon: category.icon,
    })),
  },
  { label: "关于", href: "/about", icon: "user" },
] as const;

/**
 * 分类标识 → 中文名 的快速查找表
 * 文章卡片 / 详情页只拿到 PostCategory，需要据此回显可读分类名
 */
export const categoryLabelMap: Readonly<Record<PostCategory, string>> =
  Object.fromEntries(
    categoryItems.map((item) => [item.key, item.label]),
  ) as Record<PostCategory, string>;
