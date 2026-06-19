"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { TocHeading } from "@/types/blog";
import TableOfContents from "@/components/blog/table-of-contents";

interface PostArticleLayoutProps {
  /** 文章正文内容（由 RSC page.tsx 透传） */
  children: React.ReactNode;
  /** 从文章 HTML 提取的目录标题 */
  headings: readonly TocHeading[];
}

/**
 * 文章详情页布局编排器（客户端叶子）
 *
 * 核心职责：管理「目录可见状态」并驱动文章内容区的水平位移动画。
 * - 目录展开时：文章向左偏移，为右侧浮动目录留出空间；
 * - 目录收起时：文章丝滑回到视口居中位置。
 *
 * 为什么不在 page.tsx 中直接处理：状态切换与动画属于浏览器交互（§1.6），
 * 必须下沉到最小客户端叶子；page.tsx 保持 RSC 仅做数据编排。
 */
export default function PostArticleLayout({
  children,
  headings,
}: PostArticleLayoutProps) {
  // 仅有标题时才启用目录功能，否则无需偏移
  const hasToc = headings.length > 0;
  const [tocVisible, setTocVisible] = useState(hasToc);

  const handleToggle = () => setTocVisible((prev) => !prev);

  // Framer Motion 变体：文章容器水平位移（§1.7 外提）
  const articlePositionVariants = {
    centered: {
      x: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    shifted: {
      x: "-7%",
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      {/* 文章内容区：根据目录状态水平偏移 / 居中 */}
      <motion.div
        className="w-full"
        initial={false}
        animate={hasToc && tocVisible ? "shifted" : "centered"}
        variants={articlePositionVariants}
      >
        {children}
      </motion.div>

      {/* 浮动目录（仅有标题时渲染） */}
      {hasToc && (
        <TableOfContents
          headings={headings}
          visible={tocVisible}
          onToggle={handleToggle}
        />
      )}
    </>
  );
}
