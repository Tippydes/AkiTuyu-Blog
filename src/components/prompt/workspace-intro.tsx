import React from "react";

interface WorkspaceIntroProps {
  /** 站点名称 */
  name: string;
  /** 标语 */
  tagline: string;
  /** 描述文案 */
  description: string;
}

/**
 * 工作台首屏引导区（纯展示组件）
 *
 * 遵循「数据-UI 分离」：自身不读取任何数据源，全部文案通过 props 注入，
 * 因而对数据来自本地配置还是远端接口完全无感知，可被任意页面复用。
 */
export default function WorkspaceIntro({ name, tagline, description }: WorkspaceIntroProps) {
  const cardStyles = "glass-panel rounded-4xl p-8 md:p-12";

  return (
    <section aria-labelledby="workspace-intro-title" className={cardStyles}>
      <h1
        id="workspace-intro-title"
        className="text-3xl font-bold tracking-tight text-surface-onSurface md:text-4xl"
      >
        {name}
        <span className="ml-3 align-middle text-base font-medium text-brand-primary">
          {tagline}
        </span>
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-surface-onVariant">{description}</p>
    </section>
  );
}
