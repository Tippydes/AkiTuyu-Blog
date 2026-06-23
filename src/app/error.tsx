"use client";

import { useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/ui/icon";

interface ErrorPageProps {
  /** 被错误边界捕获的异常（含可选 digest，对应服务端日志） */
  error: Error & { digest?: string };
  /** 重置错误边界、尝试重新渲染出错的路由段 */
  reset: () => void;
}

/**
 * 全局错误边界页（客户端组件——Next.js 规定 error 边界必须为 CC）
 *
 * 与 not-found 同因：自定义此页是为了让错误页渲染在根 layout 内、且不铺不透明底，
 * 使 z-index:-10 的立绘背景层正常透出（默认错误 UI 会盖住背景图）。
 * 提供「重试」按钮调用 reset() 重渲出错段，并给一条返回首页的兜底出口。
 */
export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 把错误打到控制台便于排查（保留 digest 以与服务端日志对应）
    console.error(error);
  }, [error]);

  return (
    <article className="glass-panel mx-auto flex max-w-xl flex-col items-center rounded-4xl p-10 text-center md:p-14">
      <p className="text-7xl font-bold tracking-tight text-brand-primary md:text-8xl">
        !
      </p>
      <h1 className="mt-4 text-xl font-semibold text-surface-onSurface">
        小屋出了点状况
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-surface-onVariant">
        页面渲染时遇到了一个错误。你可以先重试一次，若仍不行就回首页歇会儿。
      </p>
      <nav className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-x-2 rounded-full bg-brand-primaryContainer px-5 py-2.5 text-sm text-brand-onPrimaryContainer transition-colors hover:opacity-90"
        >
          <Icon name="sparkle" className="h-4 w-4" aria-hidden="true" />
          重试
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 rounded-full border border-outline-variant/40 bg-surface/50 px-5 py-2.5 text-sm text-surface-onVariant transition-colors hover:bg-brand-primaryContainer hover:text-brand-onPrimaryContainer"
        >
          <Icon name="arrow-left" className="h-4 w-4" aria-hidden="true" />
          返回首页
        </Link>
      </nav>
    </article>
  );
}
