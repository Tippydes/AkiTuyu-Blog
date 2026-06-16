import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type {
  Post,
  PostArchiveGroup,
  PostCategory,
  PostFrontmatter,
  PostSummary,
} from "@/types/blog";

/**
 * 文章内容服务层
 *
 * 职责：把 content/posts 下的 Markdown 文件读取、解析为严格类型化的数据对象，
 * 供 RSC 页面在服务端直接消费。所有文件 IO 与 Markdown 编译都收口在此，
 * 让页面层（page.tsx）只需调用纯函数取数，彻底贯彻「数据-UI 分离」。
 */

/** 文章 Markdown 源文件所在目录（相对项目根） */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** 合法分类集合，用于运行时校验 Frontmatter，避免脏数据流入类型系统 */
const VALID_CATEGORIES: ReadonlySet<PostCategory> = new Set([
  "tech",
  "anime",
  "life",
  "notes",
]);

/**
 * 估算阅读时长（分钟）
 *
 * 为什么自己实现：阅读时长只是简单的字数除以速率，属于 §1.5「原生优先」范畴，
 * 无需引入 reading-time 等第三方库。中文按字符计，英文单词亦折算为字符量级，
 * 统一用 ~350 字/分钟 的保守速率，并保证至少 1 分钟。
 */
function estimateReadingMinutes(content: string): number {
  const charCount = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(charCount / 350));
}

/**
 * 将 ISO 日期格式化为中文可读形式（如「2026年5月20日」）
 * 在数据层完成本地化，展示层只负责把字符串塞进 <time> 标签。
 */
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

/**
 * 读取并解析单个 Markdown 文件的 Frontmatter 与正文
 * 返回原始数据，HTML 编译延迟到 getPostBySlug 按需进行。
 */
function readPostFile(fileName: string): {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
} {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf-8");
  const { data, content } = matter(raw);

  // 运行时兜底校验：分类非法时回退到 notes，避免渲染期类型崩塌
  const category = (data.category as PostCategory) ?? "notes";
  const safeCategory = VALID_CATEGORIES.has(category) ? category : "notes";

  const frontmatter: PostFrontmatter = {
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    category: safeCategory,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
  };

  return { slug, frontmatter, content };
}

/** 把内部解析结果投影为列表项（附加派生展示字段） */
function toSummary(file: ReturnType<typeof readPostFile>): PostSummary {
  return {
    ...file.frontmatter,
    slug: file.slug,
    formattedDate: formatDate(file.frontmatter.date),
    readingMinutes: estimateReadingMinutes(file.content),
  };
}

/** 列出所有 Markdown 文件名（容错：目录不存在时返回空数组） */
function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((name) => /\.mdx?$/.test(name));
}

/**
 * 获取全部文章摘要，按发布日期倒序（最新在前）
 * 首页文章流、归档页均以此为数据源。
 */
export function getAllPosts(): PostSummary[] {
  return listPostFiles()
    .map((name) => toSummary(readPostFile(name)))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/** 获取全部文章的 slug，供 generateStaticParams 预生成静态详情页 */
export function getPostSlugs(): string[] {
  return listPostFiles().map((name) => name.replace(/\.mdx?$/, ""));
}

/**
 * 构建「slug → 文章标题」映射表
 *
 * 为什么需要它：面包屑（顶部页眉）是客户端叶子，无法在浏览器侧读取文件系统，
 * 故由服务端在 layout 取数后透传。详情页路由 /posts/<slug> 据此把 slug
 * 还原成可读的中文标题，避免面包屑末级显示成英文 slug。
 */
export function getPostTitleMap(): Record<string, string> {
  return Object.fromEntries(
    listPostFiles().map((name) => {
      const { slug, frontmatter } = readPostFile(name);
      return [slug, frontmatter.title];
    }),
  );
}

/**
 * 构建 slug → 所属分类 的映射
 *
 * 为什么需要它：文章详情页面包屑要对齐「项目」格式，穿过文章所属分类
 * （首页 › 文章分类 › 分类名 › 标题）。分类信息不在路由 /posts/<slug> 中，
 * 故同样由服务端在 Header 取数后透传给客户端面包屑叶子（§1.6 边界）。
 */
export function getPostCategoryMap(): Record<string, PostCategory> {
  return Object.fromEntries(
    listPostFiles().map((name) => {
      const { slug, frontmatter } = readPostFile(name);
      return [slug, frontmatter.category];
    }),
  );
}

/**
 * 按 slug 获取单篇完整文章（含编译后的正文 HTML）
 * 仅文章详情页调用，找不到时返回 null 交由页面触发 notFound()。
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fileName = listPostFiles().find(
    (name) => name.replace(/\.mdx?$/, "") === slug,
  );
  if (!fileName) return null;

  const file = readPostFile(fileName);
  // marked 在无异步扩展时同步返回，这里显式 await 兼容其联合返回类型
  const contentHtml = await marked.parse(file.content, { async: false });

  return {
    ...toSummary(file),
    contentHtml,
  };
}

/**
 * 把文章按「发布年份」分组，组内按时间倒序
 * 归档页据此渲染时间轴式的年度列表。
 */
export function getPostsByYear(): PostArchiveGroup[] {
  const groups = new Map<string, PostSummary[]>();

  for (const post of getAllPosts()) {
    const year = post.date.slice(0, 4);
    const bucket = groups.get(year) ?? [];
    bucket.push(post);
    groups.set(year, bucket);
  }

  // 年份从新到旧排列，保证归档页顶部是最近一年
  return [...groups.entries()]
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, posts]) => ({ year, posts }));
}
