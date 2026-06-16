import type { PostCategory } from "@/types/blog";
import { projectCategories } from "@/data/projects";

/**
 * 导航与分类矩阵（静态配置层）
 *
 * 为什么收敛到数据层：侧边栏 / 页面等组件只负责「渲染导航」，不应内嵌任何菜单文案与
 * 路由结构。一旦调整，改这里即可全站同步，符合「数据-UI 分离」。
 */

/** 主导航条目：支持一层二级菜单（children 非空即为可展开父级） */
export interface NavItem {
  /** 菜单文案 */
  label: string;
  /**
   * 路由地址；纯分组型一级项本身无独立页面（如「文章分类」总览缺省时）可省略，
   * 省略 href 则该菜单整体退化为展开/收起开关而非链接。
   */
  href?: string;
  /** Game-Icon-Pack 语义图标名，由 <Icon> 按映射取联组件 */
  icon: string;
  /** 可选的二级子菜单；仅渲染一层，避免无限嵌套带来的导航复杂度 */
  children?: readonly NavItem[];
  /**
   * 仅桌面端展示：移动端底部导航条空间有限，对分组型入口（如「文章分类」）
   * 隐藏，以免底栏出现点了会落空的开关。
   */
  desktopOnly?: boolean;
}

/** 分类条目：在主导航之外亦作为文章分类的单一数据源 */
export interface CategoryItem {
  /** 分类标识，与 types/blog.ts 的 PostCategory 对齐 */
  key: PostCategory;
  /** 分类中文名 */
  label: string;
  /** Game-Icon-Pack 语义图标名 */
  icon: string;
  /** 分类一句话说明：用于分类总览页 /categories 的卡片副标题 */
  summary: string;
}

/**
 * 文章分类矩阵：作为主导航「文章分类」二级菜单与独立分类路由（/categories 及其子页）的单一数据源。
 * 定义在 navItems 之前，便于后者直接派生分类子菜单，保持单一数据源。
 */
export const categoryItems: readonly CategoryItem[] = [
  {
    key: "tech",
    label: "技术随笔",
    icon: "code",
    summary: "前端、工程化与折腾过程中的踩坑与心得。",
  },
  {
    key: "anime",
    label: "番剧杂感",
    icon: "sparkle",
    summary: "追番观后感、二次元安利与角色碎碎念。",
  },
  {
    key: "life",
    label: "日常碎语",
    icon: "daily",
    summary: "生活流水账与一些随手记下的小情绪。",
  },
  {
    key: "notes",
    label: "学习笔记",
    icon: "notes",
    summary: "读书、课程与新技术的系统化学习笔记。",
  },
] as const;

/**
 * 文章分类独立路由的根路径（单一数据源）
 *
 * 为什么集中声明：分类已从「首页 ?category 查询参数」升级为独立路由，
 * 主导航子菜单、总览/详情页、面包屑都要拼这个前缀。统一在数据层导出，
 * 避免各处硬编码 "/categories" 字面量而日后漂移（贯彻「数据-UI 分离」）。
 */
export const CATEGORIES_BASE_PATH = "/categories";

/** 文章分类区块的中文标签：主导航父级入口与面包屑顶层标签共用，确保措辞一致 */
export const CATEGORIES_LABEL = "文章分类";

/** 由分类 key 派生其独立详情路由（/categories/<key>），供导航与卡片复用 */
export function categoryHref(key: PostCategory): string {
  return `${CATEGORIES_BASE_PATH}/${key}`;
}

/**
 * 顶层主导航：首页文章流 / 归档 / 文章分类（二级菜单）/ 项目作品（二级菜单）/ 关于
 *
 * 「文章分类」与「项目 / 作品」两个二级菜单分别由 categoryItems、data/projects.ts 派生，
 * 保证菜单项与实际页面始终同源、不会两处脱节。两者父级都链接到各自的总览页
 * （/categories、/projects），旁附展开/收起按钮；「文章分类」入口仅桌面端展示（desktopOnly）。
 */
export const navItems: readonly NavItem[] = [
  { label: "首页", href: "/", icon: "home" },
  { label: "归档", href: "/archive", icon: "archive" },
  {
    label: CATEGORIES_LABEL,
    href: CATEGORIES_BASE_PATH,
    icon: "tag",
    desktopOnly: true,
    children: categoryItems.map((category) => ({
      label: category.label,
      href: categoryHref(category.key),
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
