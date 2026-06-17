"use client";

import { usePointerFx } from "@/hooks/use-pointer-fx";

/**
 * 自定义指针 + 涟漪交互层（客户端叶子）
 *
 * 为什么是叶子组件：启用原生箭头与生成涟漪都依赖浏览器事件 / DOM，必须运行在客户端；按 §1.6
 * 把这层交互下沉为最小叶子，根布局（layout.tsx）仍保持纯编排 RSC。
 *
 * 指针本身不再用 DOM 元素跟随，而是交给 globals.css 的原生 `cursor:url()`（亮 / 暗各一套
 * Game-Icon 箭头，随主题切换）——由操作系统 / GPU 直接绘制，零延迟、绝对跟手。本组件只渲染一个
 * 「涟漪挂载容器」骨架，把引用交给 usePointerFx；涟漪由 Hook 以原生节点 appendChild 注入，
 * 全程零 React 重渲染（§1.5）。
 */
export default function CursorFx() {
  const { enabled, layerRef } = usePointerFx();

  // 非精细指针设备（触屏）直接不渲染，回退系统原生交互
  if (!enabled) return null;

  // 涟漪挂载容器：纯装饰、置顶、铺满视口且不拦截点击；aria-hidden 不参与无障碍树
  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
