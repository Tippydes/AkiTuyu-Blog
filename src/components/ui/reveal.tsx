"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUpItem } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 入场揭示包裹器（客户端叶子）
 *
 * 复用统一的「上浮淡入」变体，为 Hero、区块标题等静态内容补一层顺滑入场动效。
 * 服务端组件可把内容作为 children 透传进来，自身仍保持 RSC（§1.6）。
 */
export default function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUpItem}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
