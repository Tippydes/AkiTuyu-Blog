"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { usePointerFx, type PointerRipple } from "@/hooks/use-pointer-fx";

/**
 * 自定义指针 + 涟漪交互层（客户端叶子）
 *
 * 为什么是叶子组件：指针跟随、点击 / 移动涟漪都依赖浏览器事件与 Framer Motion，必须运行在客户端；
 * 按 §1.6 把这层交互下沉为最小叶子，根布局（layout.tsx）仍保持纯编排 RSC。
 * 指针图标复用 Game-Icon-Pack 注册表里的 `cursor`，用 MD3 令牌（text-brand-primary）上色，
 * 故能随亮 / 暗主题自动换色（§1.8）；涟漪配色同样取自 MD3 令牌（实现见 globals.css）。
 */
export default function CursorFx() {
  const { enabled, visible, cursorX, cursorY, ripples, onRippleDone } = usePointerFx();

  // 非精细指针设备（触屏）直接不渲染，回退系统原生交互
  if (!enabled) return null;

  // 涟漪类名按类型条件合并：移动 = 薰衣草细环，点击 = 樱花粉实心晕开（关键帧见 globals.css）
  const rippleClass = (kind: PointerRipple["kind"]) =>
    cn(
      "cursor-ripple",
      kind === "click" ? "cursor-ripple--click" : "cursor-ripple--move",
    );

  return (
    // 整层为纯装饰：置顶、铺满视口且不拦截点击；aria-hidden 不参与无障碍树
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* 自定义指针：x/y 由 JS 动态定位（§1.3 内联 style 的唯一例外），opacity 随是否在视口内淡入淡出 */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className={cn(
          "absolute left-0 top-0 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <Icon
          name="cursor"
          className="h-7 w-7 text-brand-primary drop-shadow-sm"
        />
      </motion.div>

      {/* 涟漪层：圆心坐标由 JS 计算（§1.3 例外），动画播放完毕经 onAnimationEnd 自移除，避免 DOM 堆积 */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={rippleClass(ripple.kind)}
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() => onRippleDone(ripple.id)}
        />
      ))}
    </div>
  );
}
