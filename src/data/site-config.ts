/**
 * 站点全局元数据与作者信息（静态配置层）
 *
 * 为什么集中在此：站点名、标语、SEO 描述、作者卡片等内容会被根布局、侧边栏、关于页
 * 等多处消费；统一收口到数据层后，组件只通过 props 接收，杜绝把品牌文案散落在 UI 里。
 */

/** 作者 / 站长信息，渲染于侧边栏底部卡片与「关于」页 */
export interface SiteAuthor {
  /** 昵称 */
  name: string;
  /** 一句话签名 */
  handle: string;
  /** 头像图片地址（位于 public/，由 next/image 渲染） */
  avatar: string;
  /** 在线状态文案 */
  status: string;
  /** 关于页的多段自我介绍 */
  bio: readonly string[];
}

/** 外链入口（侧边栏 / 关于页社交区） */
export interface SocialLink {
  label: string;
  href: string;
  /** Game-Icon-Pack 语义图标名，由 <Icon> 按名取用 */
  icon: string;
}

/**
 * 右侧立绘背景配置
 *
 * 为什么抽到数据层：后续换图只需改此配置的焦点 / 宽度 / 遮罩模式，
 * 无需动 CSS 或组件代码，完全符合「数据-UI 分离」原则。
 */
export interface HeroBackground {
  /** 图片路径（位于 public/） */
  src: string;
  /** CSS background-position，控制人物焦点区域 */
  position: string;
  /** CSS background-size */
  size: string;
  /** Tailwind 宽度类（如 "w-full" / "w-5/6"） */
  width: string;
  /**
   * 暗色模式遮罩模式
   * - "none"：亮/暗均无遮罩
   * - "vignette"：暗色模式四周暗角
   * - "gradient-left"：暗色模式左侧渐隐
   * - "bottom-fade"：暗色模式底部渐隐
   */
  darkMask: "none" | "vignette" | "gradient-left" | "bottom-fade";
}

export const siteConfig = {
  name: "AkiTuyu",
  /** 站点标语 */
  tagline: "秋冬的个人博客",
  /** SEO 描述 */
  description:
    "AkiTuyu —— 一个高度美学化的个人二次元博客：记录技术随笔、番剧杂感与日常碎碎念，落地 Material Design 3 与毛玻璃质感，支持亮 / 暗双模式平滑切换。",
  /** 语言环境 */
  locale: "zh-CN",
  /**
   * 文章卡片默认占位图（位于 public/）
   *
   * 为什么收口到此：占位图是全站文章共享的「无专属封面时」兜底资源，
   * 与 avatar / heroBackground 一样统一落在数据层——换图只需改此处，
   * 无需逐篇 Frontmatter 重复书写，也无需动组件代码（§1.4 数据-UI 分离）。
   */
  placeholderCover: "/images/Node.js_logo.svg.png",
  /** 作者信息 */
  author: {
    name: "Tippydes",
    handle: "@akituyu",
    avatar: "/images/avatar.png",
    status: "在线 · 摸鱼中",
    bio: [
      "你好，我是 Tippydes，一个被番剧和代码同时绑架的人。",
      "这里是我的秋冬小屋，存放写代码时的灵光一现、追番后的胡言乱语，以及一些舍不得删的日常。",
      "技术上喜欢折腾前端与设计系统，审美上偏爱通透的毛玻璃和柔和的樱花色。",
    ],
  } satisfies SiteAuthor,
  /** 社交外链 */
  socials: [
    { label: "GitHub", href: "https://github.com/Tippydes", icon: "code" },
    { label: "RSS", href: "/rss.xml", icon: "rss" },
    { label: "邮箱", href: "kafuchino142857@gmail.com", icon: "mail" },
  ] satisfies readonly SocialLink[],
  /**
   * 右侧立绘背景——换图时只需修改此处配置
   * position 控制人物焦点，避免关键部位被裁切
   */
  heroBackground: {
    src: "/images/Alona_bg.jpg",
    position: "center center",
    size: "cover",
    width: "w-full",
    darkMask: "gradient-left",
  } satisfies HeroBackground,
} as const;

export type SiteConfig = typeof siteConfig;
