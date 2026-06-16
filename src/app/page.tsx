import { getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/data/site-config";
import SiteHero from "@/components/blog/site-hero";
import PostList from "@/components/blog/post-list";

/**
 * 首页文章流（服务端组件控制器）
 *
 * 仅做两件事：从内容服务层取全部文章 → 编排展示组件。
 * 分类筛选已迁出为独立路由（/categories 及其子页），首页只负责呈现「最新文章」全量流，
 * 因此不再读取 ?category 查询参数。严格遵守「页面即控制器」（§1.4）。
 */
export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-y-10">
      <SiteHero
        name={siteConfig.name}
        tagline={siteConfig.tagline}
        description={siteConfig.description}
        postCount={posts.length}
      />

      <section aria-labelledby="post-feed-title">
        <header className="mb-6 flex items-baseline justify-between">
          <h2
            id="post-feed-title"
            className="text-2xl font-bold tracking-tight text-surface-onSurface"
          >
            最新文章
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
