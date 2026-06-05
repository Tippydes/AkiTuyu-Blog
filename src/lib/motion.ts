import type { Variants } from "framer-motion";

/**
 * 全站共享的 Framer Motion 动效变体
 *
 * 为什么独立成文件：依据 §1.7，超过 3 行的 variants 必须抽离到 JSX 之外；
 * 这些「交错淡入」「上浮淡入」在文章列表、Hero、关于页等多处复用，
 * 故集中声明，既保持渲染节点纯净，也让动效节奏全站统一。
 */

/** 容器变体：让其直接子项以微小时间差「交错」入场，营造 Mizuki 般的顺滑层次感 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      // 每个子项延迟 0.08s 依次出现
      staggerChildren: 0.08,
    },
  },
};

/** 子项变体：从下方轻微上浮并淡入 */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};
