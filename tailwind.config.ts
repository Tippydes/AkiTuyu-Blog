import type { Config } from "tailwindcss";

/**
 * Tailwind CSS 核心配置（Tailwind v4 + 传统 JS 配置混合模式）
 *
 * 为什么仍保留 JS 配置：
 * - 本项目运行在 Tailwind v4，全局样式通过 `globals.css` 内的 `@config` 指令挂载本文件；
 * - MD3 令牌采用「嵌套对象」声明，可生成 `bg-surface`、`text-surface-onSurface` 等贴合
 *   Material Design 3 命名直觉的工具类，便于团队按设计稿语义书写类名；
 * - 所有色值一律映射到 CSS 变量（见 globals.css），从而彻底抽象硬编码 hex，实现亮/暗双模式
 *   仅靠切换 `.dark` 类即可平滑过渡。
 */
const config: Config = {
  // 启用「类名驱动」暗黑模式，以契合 Mizuki 风格的平滑色彩过渡（由 next-themes 等在客户端注入 .dark）
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 映射 Material Design 3 核心动态色彩令牌（真实色值见 globals.css 的 CSS 变量）
      colors: {
        brand: {
          primary: "var(--md-sys-color-primary)",
          onPrimary: "var(--md-sys-color-on-primary)",
          primaryContainer: "var(--md-sys-color-primary-container)",
          onPrimaryContainer: "var(--md-sys-color-on-primary-container)",
        },
        // 樱花粉次要令牌：用于标签、强调点缀，带来二次元柔和气质
        secondary: {
          DEFAULT: "var(--md-sys-color-secondary)",
          onSecondary: "var(--md-sys-color-on-secondary)",
          container: "var(--md-sys-color-secondary-container)",
          onContainer: "var(--md-sys-color-on-secondary-container)",
        },
        // 薰衣草第三令牌：用于分类徽章与次级高亮，丰富色彩层次
        tertiary: {
          DEFAULT: "var(--md-sys-color-tertiary)",
          onTertiary: "var(--md-sys-color-on-tertiary)",
          container: "var(--md-sys-color-tertiary-container)",
          onContainer: "var(--md-sys-color-on-tertiary-container)",
        },
        surface: {
          DEFAULT: "var(--md-sys-color-surface)",
          onSurface: "var(--md-sys-color-on-surface)",
          variant: "var(--md-sys-color-surface-variant)",
          onVariant: "var(--md-sys-color-on-surface-variant)",
          inverse: "var(--md-sys-color-inverse-surface)",
        },
        background: {
          DEFAULT: "var(--md-sys-color-background)",
          onBackground: "var(--md-sys-color-on-background)",
        },
        outline: {
          DEFAULT: "var(--md-sys-color-outline)",
          variant: "var(--md-sys-color-outline-variant)",
        },
      },
      // 字体族：映射根布局注入的 Inter 变量字体，保证全站排版统一
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // 严格符合 MD3 规范的大圆角令牌，用于卡片与浮动面板
      borderRadius: {
        "3xl": "1.5rem", // 24px：大型容器与工作区面板
        "4xl": "2rem", // 32px：全面屏弹窗或特定主视图
      },
      // 为 Mizuki 风格毛玻璃（Glassmorphic）面板定制的微光阴影
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
