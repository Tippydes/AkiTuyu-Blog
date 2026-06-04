import type { PromptCategory } from "@/types/prompt";

/**
 * 导航 / 分类菜单矩阵（静态配置层）
 *
 * 为什么放在 data/：遵循「数据-UI 分离」，侧边栏组件只负责渲染，
 * 菜单条目的增删改全部在此维护，组件对数据来源无感知。
 * icon 字段存为 Lucide 图标名字符串，避免数据层强依赖具体图标库实现，
 * 待后续接入 lucide-react 时再在叶子组件内按名映射。
 */
export interface NavItem {
  /** 菜单展示文案 */
  label: string;
  /** 路由地址 */
  href: string;
  /** Lucide 图标名（延迟到展示层映射，保持数据层纯净） */
  icon: string;
  /** 关联的提示词分类（首页为聚合视图，故可选） */
  category?: PromptCategory;
}

/** 主导航条目矩阵：首页工作台 + 各提示词分类入口 */
export const navItems: readonly NavItem[] = [
  { label: "工作台", href: "/", icon: "LayoutDashboard" },
  { label: "编程开发", href: "/?category=coding", icon: "Code2", category: "coding" },
  {
    label: "创意写作",
    href: "/?category=creative-writing",
    icon: "PenLine",
    category: "creative-writing",
  },
  { label: "角色扮演", href: "/?category=roleplay", icon: "Drama", category: "roleplay" },
  {
    label: "效率工具",
    href: "/?category=productivity",
    icon: "Rocket",
    category: "productivity",
  },
] as const;
