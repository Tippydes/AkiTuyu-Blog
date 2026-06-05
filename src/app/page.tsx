import { getAllPosts } from "@/lib/mdx";
import { categoryItems, categoryLabelMap } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";
import type { PostCategory } from "@/types/blog";
import SiteHero from "@/components/blog/site-hero";
import PostList from "@/components/blog/post-list";

interface HomePageProps {
  // Next.js 16 中 searchParams 为异步，需 await 后读取
  searchParams: Promise<{ category?: string }>;
}

/**
 * 首页文章流（服务端组件控制器）
 *
 * 仅做三件事：读取查询参数 → 从内容服务层取数并按分类筛选 → 编排展示组件。
 * 不书写任何复杂 HTML / 样式，严格遵守「页面即控制器」（§1.4）。
 */
export default async function Home({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();

  // 校验 URL 分类参数合法性，非法则视为「全部文章」
  const validCategories = new Set<string>(categoryItems.map((c) => c.key));
  const activeCategory =
    category && validCategories.has(category)
      ? (category as PostCategory)
      : null;

  const posts = activeCategory
    ? allPosts.filter((post) => post.category === activeCategory)
    : allPosts;

  const feedTitle = activeCategory ? categoryLabelMap[activeCategory] : "最新文章";

  return (
    <div className="flex flex-col gap-y-10">
      <SiteHero
        name={siteConfig.name}
        tagline={siteConfig.tagline}
        description={siteConfig.description}
        postCount={allPosts.length}
      />

      <section aria-labelledby="post-feed-title">
        <header className="mb-6 flex items-baseline justify-between">
          <h2
            id="post-feed-title"
            className="text-2xl font-bold tracking-tight text-surface-onSurface"
          >
            {feedTitle}
          </h2>
          <span className="text-sm text-surface-onVariant">
            共 {posts.length} 篇
          </span>
        </header>

        <PostList posts={posts} />
      </section>
    </div>
  );
}
