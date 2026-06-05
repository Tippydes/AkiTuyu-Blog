/**
 * 博客领域类型字典
 *
 * 为什么集中声明：全站「文章」数据从 Markdown 文件流入，经 lib/mdx 解析后
 * 以这些严格类型在数据层与展示层之间传递；任何 UI 组件只允许消费这里定义的契约，
 * 从而保证「数据-UI 分离」时两端的形状始终一致。
 */

/** 文章分类标识（与 data/navigation.ts 的分类矩阵一一对应） */
export type PostCategory = "tech" | "anime" | "life" | "notes";

/**
 * Markdown 文件头部 Frontmatter 的原始字段
 * 对应每篇 content/posts/*.md 顶部 `--- ... ---` 区块
 */
export interface PostFrontmatter {
  /** 文章标题 */
  title: string;
  /** 发布日期，ISO 字符串（YYYY-MM-DD），用于排序与 <time dateTime> */
  date: string;
  /** 列表 / 卡片中展示的摘要 */
  excerpt: string;
  /** 所属分类 */
  category: PostCategory;
  /** 标签集合（只读，避免组件意外篡改数据层） */
  tags: readonly string[];
  /** 可选封面图（CSS 渐变占位或 public/ 下资源路径） */
  cover?: string;
}

/**
 * 文章列表项：用于首页文章流、归档页等「不需要正文」的场景
 * 在 Frontmatter 基础上补充由解析器派生的展示字段
 */
export interface PostSummary extends PostFrontmatter {
  /** 由文件名推导的唯一路由标识 */
  slug: string;
  /** 本地化后的可读日期（如「2026年5月20日」），交给展示层直接渲染 */
  formattedDate: string;
  /** 预计阅读分钟数（按中英文字数估算） */
  readingMinutes: number;
}

/**
 * 完整文章：在列表项基础上附带已渲染的正文 HTML
 * 仅文章详情页按需加载，避免列表场景把所有正文一次性读入内存
 */
export interface Post extends PostSummary {
  /** 由 Markdown 编译而来的安全 HTML 字符串（内容源为本地可信文件） */
  contentHtml: string;
}

/** 归档页使用的「按年份分组」结构 */
export interface PostArchiveGroup {
  /** 年份（如 "2026"） */
  year: string;
  /** 该年份下按时间倒序排列的文章 */
  posts: readonly PostSummary[];
}
