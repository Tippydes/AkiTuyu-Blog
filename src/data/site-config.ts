/**
 * 站点全局元数据与 SEO 配置（静态配置层）
 *
 * 为什么集中存放：根布局的 metadata 及未来各处页眉/页脚均从此处取值，
 * 站点改名、换描述时只需改这一份，杜绝在组件里散落硬编码文案。
 */
export const siteConfig = {
  /** 站点名称（用于标题与侧边栏 Logo） */
  name: "AkiPrompt",
  /** 标题后缀 / 标语 */
  tagline: "Next-Gen MD3 Prompt Workspace",
  /** 站点描述（SEO） */
  description: "高度美学化、可交互的提示词工程工作台 —— Mizuki 风格 Material Design 3。",
  /** 默认语言 */
  locale: "zh-CN",
} as const;

/** 站点配置类型，供需要消费元数据的组件做严格约束 */
export type SiteConfig = typeof siteConfig;
