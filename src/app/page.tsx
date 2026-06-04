import WorkspaceIntro from "@/components/prompt/workspace-intro";
import { siteConfig } from "@/data/site-config";

/**
 * 提示词工作台主页（服务端组件 RSC）
 *
 * 仅作核心控制器：从静态配置层读取站点元数据，再编排展示组件，
 * 本身不堆砌任何 HTML 结构或复杂 Tailwind 布局（严守「数据-UI 分离」）。
 */
export default function Home() {
  return (
    <WorkspaceIntro
      name={siteConfig.name}
      tagline={siteConfig.tagline}
      description={siteConfig.description}
    />
  );
}
