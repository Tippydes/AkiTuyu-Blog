"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
  /** 侧边栏节点（RSC，由 layout.tsx 传入） */
  sidebar: React.ReactNode;
  /** 主内容区节点（包含 Header + main + footer） */
  children: React.ReactNode;
}

/**
 * 全站布局外壳（客户端叶子）
 *
 * 为什么需要此组件：文章详情页要求侧边栏向左丝滑隐藏并让内容区占满全宽。
 * 侧边栏本身是 RSC，无法自行感知路由变化；本组件作为最小客户端包裹层，
 * 仅读 usePathname 驱动 Framer Motion 做布局过渡，不渲染任何业务 UI（§1.6）。
 *
 * 桌面端：检测到 /posts/ 路由时，侧边栏向左平移隐藏，主内容占满视口宽度。
 * 移动端：底部导航栏同样隐藏（文章页给予沉浸阅读体验）。
 */
export default function LayoutShell({ sidebar, children }: LayoutShellProps) {
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/posts/");

  // Framer Motion 变体：侧边栏桌面端向左滑出 / 滑入（§1.7 外提）
  const sidebarVariants = {
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  };

  // 主内容区域：文章页时不需要为侧边栏留出空间
  const mainWrapperStyles = "flex flex-1 flex-col pb-16 md:pb-0";

  return (
    <>
      {/* 桌面端侧边栏包裹：动画控制器，文章页时向左滑出视口 */}
      <motion.div
        className={cn(
          "hidden md:block",
          isPostPage ? "fixed left-0 top-0 z-40 h-screen w-72" : "relative",
        )}
        initial={false}
        animate={isPostPage ? "hidden" : "visible"}
        variants={sidebarVariants}
      >
        {sidebar}
      </motion.div>

      {/* 移动端底部导航：文章页时隐藏以提供沉浸体验 */}
      <AnimatePresence>
        {!isPostPage && (
          <motion.div
            className="md:hidden"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
          >
            {sidebar}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区：文章页时全宽展示 */}
      <motion.div
        className={mainWrapperStyles}
        layout
        transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </>
  );
}
