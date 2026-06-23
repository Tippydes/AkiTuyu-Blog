import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "页面走丢了",
  description: "404 —— 这间秋日小屋里没有这个房间。",
};

/**
 * 全局 404 页（服务端组件，RSC §1.6）
 *
 * 为什么要自定义：Next.js 内置的 not-found 会注入一层铺满视口的白色实底，
 * 把根 layout 里 z-index:-10 的立绘背景层（.aki-side-art / .aki-immersive-bg）整个盖住，
 * 导致错误页看不到背景图。自定义后本页渲染在根 layout 内、且自身不铺任何不透明底，
 * 背景立绘便能正常透出（与全站亮/暗换肤一致）。
 *
 * 仅用 <Link> 做返回导航、无需交互态，故保持 RSC，动效下沉到 Reveal 叶子组件。
 */
export default function NotFound() {
  return (
    <Reveal>
      <article className="glass-panel mx-auto flex max-w-xl flex-col items-center rounded-4xl p-10 text-center md:p-14">
        <p className="text-7xl font-bold tracking-tight text-brand-primary md:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold text-surface-onSurface">
          这个房间不存在
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-onVariant">
          你要找的页面也许搬走了，或者从来就没出现过。回到首页继续逛逛吧。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-x-2 rounded-full border border-outline-variant/40 bg-surface/50 px-5 py-2.5 text-sm text-surface-onVariant transition-colors hover:bg-brand-primaryContainer hover:text-brand-onPrimaryContainer"
        >
          <Icon name="arrow-left" className="h-4 w-4" aria-hidden="true" />
          返回首页
        </Link>
      </article>
    </Reveal>
  );
}
