import { navItems, type NavItem } from "@/data/navigation";
import { projectCategoryMap } from "@/data/projects";
import type { ProjectCategoryKey } from "@/types/project";

/**
 * 面包屑数据构建（核心服务层 · 纯函数）
 *
 * 职责：把当前路由 pathname 解析为「首页 / 上级 / 当前页」的层级数组，
 * 文案与可点击层级全部从数据层（navigation.ts / projects.ts）派生，
 * 而非在组件里硬编码。这样导航结构或项目分类一旦调整，面包屑自动跟随，
 * 贯彻「数据-UI 分离」与单一数据源原则。
 */

/** 面包屑单节点：末级（当前页）与不可导航的中间段省略 href */
export interface Crumb {
  label: string;
  href?: string;
}

/**
 * 顶层路径 → 文案 映射，直接由主导航派生，避免「项目 / 作品」「归档」等
 * 文案在导航与面包屑两处各维护一份而脱节。
 */
const topLevelLabelMap: Readonly<Record<string, string>> = Object.fromEntries(
  navItems
    // 排除首页与纯分组型（无 href，如「文章分类」）父级：它们不构成可点击的顶层路径
    .filter((item): item is NavItem & { href: string } =>
      Boolean(item.href) && item.href !== "/",
    )
    .map((item) => [item.href, item.label]),
);

/**
 * 无独立列表页、不可点击的中间段文案。
 * 例如 /posts/<slug>：站内没有 /posts 列表路由，故「文章」一节只作层级提示、不可跳转。
 */
const nonNavigableLabelMap: Readonly<Record<string, string>> = {
  "/posts": "文章",
};

/**
 * 由 pathname 构建面包屑层级
 *
 * @param pathname 当前路由（来自 usePathname）
 * @param postTitles slug → 文章标题 映射（由服务端透传，用于详情页末级回显中文标题）
 */
export function buildBreadcrumbs(
  pathname: string,
  postTitles: Readonly<Record<string, string>> = {},
): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  // 首页永远作为面包屑根节点
  const crumbs: Crumb[] = [{ label: "首页", href: "/" }];

  let accumulatedPath = "";
  segments.forEach((segment, index) => {
    const parentSegment = segments[index - 1];
    accumulatedPath += `/${segment}`;

    let label = segment;
    let navigable = true;

    if (accumulatedPath in topLevelLabelMap) {
      // 顶层路由（/archive、/projects、/about）直接复用主导航文案
      label = topLevelLabelMap[accumulatedPath];
    } else if (parentSegment === "projects") {
      // 项目子分类：由 projects 数据层回查中文分类名（blog-source/personal/oss）
      label = projectCategoryMap[segment as ProjectCategoryKey]?.label ?? segment;
    } else if (accumulatedPath in nonNavigableLabelMap) {
      label = nonNavigableLabelMap[accumulatedPath];
      navigable = false;
    } else if (parentSegment === "posts") {
      // 文章详情末级：把 slug 还原成可读标题，回退到 slug 本身
      label = postTitles[segment] ?? segment;
    }

    // 末级（当前页）不可点击；不可导航的中间段亦省略 href
    const isLast = index === segments.length - 1;
    crumbs.push({ label, href: isLast || !navigable ? undefined : accumulatedPath });
  });

  return crumbs;
}
