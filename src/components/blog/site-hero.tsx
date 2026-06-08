import React from "react";
import Reveal from "@/components/ui/reveal";
import Icon from "@/components/ui/icon";

interface SiteHeroProps {
  name: string;
  tagline: string;
  description: string;
  /** 已发布文章数，用于点缀展示 */
  postCount: number;
}

/**
 * 首页主视觉横幅（纯展示）
 *
 * 语义化为带标题的 <section>；毛玻璃面板 + 沉浸式光晕营造二次元小屋的第一印象。
 * 入场动效交给 Reveal 叶子组件，本组件保持服务端渲染。
 */
export default function SiteHero({
  name,
  tagline,
  description,
  postCount,
}: SiteHeroProps) {
  const cardStyles =
    "glass-panel relative overflow-hidden rounded-4xl p-8 md:p-12";

  return (
    <Reveal>
      <section aria-labelledby="site-hero-title" className={cardStyles}>
        <p className="inline-flex items-center gap-x-2 rounded-full bg-secondary-container px-3 py-1 text-sm font-medium text-secondary-onContainer">
          <Icon name="sparkle" className="h-4 w-4" aria-hidden="true" />
          {tagline}
        </p>

        <h1
          id="site-hero-title"
          className="mt-5 text-3xl font-bold tracking-tight text-surface-onSurface md:text-5xl"
        >
          你好，这里是 {name} 
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-surface-onVariant">
          {description}
        </p>

        <p className="mt-6 text-sm text-surface-onVariant/80">
          目前已存放 <strong className="text-brand-primary">{postCount}</strong> 篇碎碎念
        </p>
      </section>
    </Reveal>
  );
}
