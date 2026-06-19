"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TocHeading } from "@/types/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  /** 从文章正文提取的标题层级数据 */
  headings: readonly TocHeading[];
  /** 目录是否可见（由父级 PostArticleLayout 控制） */
  visible: boolean;
  /** 切换目录可见性的回调 */
  onToggle: () => void;
}

// Framer Motion 变体：目录卡片从左侧滑入/滑出（§1.7 外提）
const tocPanelVariants = {
  hidden: {
    x: "-110%",
    opacity: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

// FAB 按钮入场/退场变体
const fabVariants = {
  hidden: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  visible: { scale: 1, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 25 } },
};

/**
 * 文章浮动目录卡片（客户端叶子）
 *
 * 为什么独立为客户端组件：目录展开/收起、滚动高亮均为浏览器交互，
 * 需要 Framer Motion 动画与 DOM 事件监听，按 §1.6 下沉为最小叶子组件。
 *
 * 两种形态：
 * 1. 展开态：左侧浮动毛玻璃卡片，渲染标题列表，顶部含「收起」按钮；
 * 2. 收起态：左下角圆形 FAB，点击唤回目录。
 */
export default function TableOfContents({
  headings,
  visible,
  onToggle,
}: TableOfContentsProps) {
  // 无标题时不渲染任何 UI
  if (headings.length === 0) return null;

  const tocItemStyles =
    "block rounded-xl px-3 py-1.5 text-sm transition-colors hover:bg-surface-variant/50 hover:text-surface-onSurface";

  return (
    <>
      {/* 展开态：浮动目录卡片 */}
      <AnimatePresence>
        {visible && (
          <motion.aside
            className="glass-panel fixed left-6 top-24 z-30 hidden w-64 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl p-5 md:block"
            aria-label="文章目录"
            variants={tocPanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* 标题区 + 收起按钮 */}
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-surface-onSurface">
                目录
              </h2>
              <button
                type="button"
                onClick={onToggle}
                aria-label="收起目录"
                className="rounded-full p-1.5 text-surface-onVariant transition-colors hover:bg-surface-variant/50 hover:text-surface-onSurface"
              >
                {/* 关闭图标：简洁的 X 符号（内联 SVG，避免为单一用途注册图标） */}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* 目录列表 */}
            <nav aria-label="文章标题导航">
              <ul className="space-y-0.5">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={cn(
                        tocItemStyles,
                        "text-surface-onVariant",
                        heading.level === 3 && "pl-6 text-xs",
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 收起态：左下角 FAB 唤回按钮 */}
      <AnimatePresence>
        {!visible && (
          <motion.button
            type="button"
            onClick={onToggle}
            aria-label="展开目录"
            className="glass-panel fixed bottom-8 left-8 z-30 hidden h-12 w-12 items-center justify-center rounded-full text-surface-onVariant shadow-glass transition-colors hover:text-brand-primary md:flex"
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* 目录列表图标（内联 SVG） */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
