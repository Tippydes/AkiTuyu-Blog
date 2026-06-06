"use client";

import React from "react";
import { motion } from "framer-motion";
import type { PostSummary } from "@/types/blog";
import PostCard from "@/components/blog/post-card";
import { fadeUpItem, staggerContainer } from "@/lib/motion";

interface PostListProps {
  posts: readonly PostSummary[];
}

/**
 * 文章列表网格（客户端叶子）
 *
 * 为什么是客户端组件：这里承载 Framer Motion 的「交错入场」动效，需要运行时；
 * 但它依旧是纯展示——数据全部由 props 注入，不感知来源（§1.4 + §1.6）。
 */
export default function PostList({ posts }: PostListProps) {
  // 空态兜底：分类筛选后可能无结果，给出友好提示而非空白
  if (posts.length === 0) {
    return (
      <p className="rounded-3xl bg-surface-variant/40 px-6 py-10 text-center text-surface-onVariant">
        这里还没有文章，换个分类看看吧
      </p>
    );
  }

  return (
    <motion.ul
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.li key={post.slug} variants={fadeUpItem}>
          <PostCard post={post} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
