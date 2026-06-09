import type { ProjectCategory, ProjectCategoryKey } from "@/types/project";

/**
 * 项目 / 作品配置（静态配置层）
 *
 * 为什么放数据层：项目展示页（/projects 及三个子路由）与侧边栏二级菜单都从这里取数，
 * 组件只负责渲染。新增 / 调整作品只改本文件，UI 自动同步，贯彻「数据-UI 分离」。
 *
 * 三个分类的 key 同时作为子路由 slug：
 *   blog-source → /projects/blog-source（博客源码）
 *   personal    → /projects/personal（个人项目）
 *   oss         → /projects/oss（开源贡献）
 */
export const projectCategories: readonly ProjectCategory[] = [
  {
    key: "blog-source",
    label: "博客源码",
    icon: "code",
    summary: "本站 AkiTuyu 的开源代码与技术栈，欢迎参考或自部署。",
    items: [
      {
        name: "AkiTuyu-Blog",
        description:
          "你正在浏览的这间秋冬小屋：Next.js App Router + Material Design 3 + 毛玻璃，Markdown 驱动内容。",
        href: "https://github.com/Tippydes/AkiTuyu-Blog",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "MD3"],
      },
    ],
  },
  {
    key: "personal",
    label: "个人项目",
    icon: "laptop",
    summary: "工作之余折腾的小工具与练手作品，记录灵光一现。",
    items: [
      {
        name: "占位项目 · 待补充",
        description:
          "这里之后会陈列我的个人项目。先放一个占位条目，等真正的作品上线再替换。",
        href: "https://github.com/Tippydes",
        tags: ["占位"],
      },
    ],
  },
  {
    key: "oss",
    label: "开源贡献",
    icon: "heart",
    summary: "向喜欢的开源项目提交的 PR、Issue 与文档改进。",
    items: [
      {
        name: "占位贡献 · 待补充",
        description:
          "这里之后会记录我参与的开源协作（PR / Issue / 文档）。先放一个占位条目。",
        href: "https://github.com/Tippydes",
        tags: ["占位"],
      },
    ],
  },
] as const;

/**
 * 分类 key → 分类对象 的快速查找表
 *
 * 子路由页面（/projects/[key]）只拿到 slug 字符串，需据此回查完整分类数据。
 */
export const projectCategoryMap: Readonly<
  Record<ProjectCategoryKey, ProjectCategory>
> = Object.fromEntries(
  projectCategories.map((category) => [category.key, category]),
) as Record<ProjectCategoryKey, ProjectCategory>;
