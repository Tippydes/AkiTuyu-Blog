import {
  navItems,
  categoryLabelMap,
  categoryHref,
  CATEGORIES_BASE_PATH,
  CATEGORIES_LABEL,
  type NavItem,
} from "@/data/navigation";
import { projectCategoryMap } from "@/data/projects";
import type { ProjectCategoryKey } from "@/types/project";
import type { PostCategory } from "@/types/blog";

/**
 * 面包屑数据构建（核心服务层 · 纯函数）
 *
 * 职责：把当前路由 pathname 解析为「首页 / 上级 / 当前页」的层级数组，
 * 文案与可点击层级全部从数据层（navigation.ts / projects.ts）派生，
 * 而非在组件里硬编码。这样导航结构或分类一旦调整，面包屑自动跟随，
 * 贯彻「数据-UI 分离」与单一数据源原则。
 */

/** 面包屑单节点：末级（当前页）与不可导航的中间段省略 href */
export interface Crumb {
  label: string;
  href?: string;
}

/**
 * 顶层路径 → 文案 映射，直接由主导航派生，避免「项目 / 作品」「归档」「文章分类」等
 * 文案在导航与面包屑两处各维护一份而脱节。
 */
const topLevelLabelMap: Readonly<Record<string, string>> = Object.fromEntries(
  navItems
    // 排除首页与无 href 的纯分组型项，它们不构成可点击的层级路径
    .filter((item): item is NavItem & { href: string } =>
      Boolean(item.href) && item.href !== "/",
    )
    .map((item) => [item.href, item.label]),
);

/**
 * 由 pathname 构建面包屑层级
 *
 * @param pathname 当前路由（来自 usePathname）
 * @param postTitles slug → 文章标题 映射（由服务端透传，用于详情页末级回显中文标题）
 * @param postCategories slug → 所属分类 映射（由服务端透传，用于详情页穿过分类层级）
 */
export function buildBreadcrumbs(
  pathname: string,
  postTitles: Readonly<Record<string, string>> = {},
  postCategories: Readonly<Record<string, PostCategory>> = {},
): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  // 首页永远作为面包屑根节点
  const crumbs: Crumb[] = [{ label: "首页", href: "/" }];

  // 文章详情页特殊处理：对齐「项目」面包屑格式（区块 › 分类 › 当前页），
  // 穿过文章所属分类（首页 › 文章分类 › 分类名 › 标题），而非显示无意义的「文章」占位。
  if (segments[0] === "posts" && segments.length === 2) {
    const slug = segments[1];
    const category = postCategories[slug];
    if (category) {
      crumbs.push({ label: CATEGORIES_LABEL, href: CATEGORIES_BASE_PATH });
      crumbs.push({ label: categoryLabelMap[category], href: categoryHref(category) });
    }
    // 末级标题（当前页）不可点击；分类未知时回退为「首页 › 标题」
    crumbs.push({ label: postTitles[slug] ?? slug });
    return crumbs;
  }

  let accumulatedPath = "";
  segments.forEach((segment, index) => {
    const parentSegment = segments[index - 1];
    accumulatedPath += `/${segment}`;

    let label = segment;

    if (accumulatedPath in topLevelLabelMap) {
      // 顶层路由（/archive、/categories、/projects、/about）直接复用主导航文案
      label = topLevelLabelMap[accumulatedPath];
    } else if (parentSegment === "categories") {
      // 文章分类子页：由 navigation 数据层回查中文分类名（tech/anime/life/notes）
      label = categoryLabelMap[segment as PostCategory] ?? segment;
    } else if (parentSegment === "projects") {
      // 项目子分类：由 projects 数据层回查中文分类名（blog-source/personal/oss）
      label = projectCategoryMap[segment as ProjectCategoryKey]?.label ?? segment;
    }

    // 末级（当前页）不可点击；其余中间段链到其累积路径
    const isLast = index === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : accumulatedPath });
  });

  return crumbs;
}
