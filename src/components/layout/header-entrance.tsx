"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeaderEntranceProps {
  children: React.ReactNode;
  /** 透传给 motion.header 的 className */
  className?: string;
}

// Framer Motion 变体：页眉从顶部滑入（§1.7 外提）
const headerVariants = {
  hidden: {
    y: "-100%",
    opacity: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

/**
 * 页眉入场动画包裹器（客户端叶子）
 *
 * 为什么独立为客户端组件：Header 本身是 RSC（需读文件系统生成面包屑数据），
 * 不能直接添加 Framer Motion；按 §1.6 将动画下沉到最小叶子组件，
 * 只负责 motion.header 的入场过渡，不涉及任何业务逻辑。
 */
export default function HeaderEntrance({ children, className }: HeaderEntranceProps) {
  return (
    <motion.header
      className={className}
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      {children}
    </motion.header>
  );
}
