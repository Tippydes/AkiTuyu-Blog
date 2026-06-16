"use client";

import Icon from "@/components/ui/icon";
import { usePointerFx } from "@/hooks/use-pointer-fx";

/**
 * 自定义指针 + 涟漪交互层（客户端叶子）
 *
 * 为什么是叶子组件：指针跟随与涟漪都依赖浏览器事件，必须运行在客户端；按 §1.6 把这层交互下沉为
 * 最小叶子，根布局（layout.tsx）仍保持纯编排 RSC。
 *
 * 本组件只渲染「静态骨架」并把 DOM 引用交给 usePointerFx：指针位置由 rAF 每帧直接改写 transform，
 * 涟漪由 Hook 以原生节点 appendChild，全程零 React 重渲染以消除高频移动时的卡顿（§1.5）。
 * 指针图标复用 Game-Icon-Pack 注册表里的 `cursor`，用 MD3 令牌 text-brand-primary 上色，
 * 故能随亮 / 暗主题自动换色（§1.8）；涟漪配色同样取自 MD3 令牌（实现见 globals.css）。
 */
export default function CursorFx() {
  const { enabled, layerRef, cursorRef } = usePointerFx();

  // 非精细指针设备（触屏）直接不渲染，回退系统原生交互
  if (!enabled) return null;

  return (
    // 涟漪挂载容器：纯装饰、置顶、铺满视口且不拦截点击；aria-hidden 不参与无障碍树
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    >
      {/*
        自定义指针：初始透明，首个移动事件后由 Hook 淡入；transform 由 rAF 改写（§1.3 允许的 JS 动态定位例外）。
        will-change-transform 提示浏览器为其单独提升合成层，使每帧位移更顺滑。
      */}
      <div
        ref={cursorRef}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-200 will-change-transform"
      >
        <Icon
          name="cursor"
          className="h-7 w-7 text-brand-primary drop-shadow-sm"
        />
      </div>
    </div>
  );
}
