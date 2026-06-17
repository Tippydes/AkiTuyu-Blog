"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** usePointerFx 暴露给表现层叶子的状态与 DOM 引用 */
export interface PointerFxState {
  /** 是否启用自定义指针层（仅「精细指针」设备，如鼠标 / 触控板） */
  enabled: boolean;
  /** 涟漪挂载容器：涟漪以原生 DOM 节点 appendChild 进来（避开 React 重渲染） */
  layerRef: RefObject<HTMLDivElement | null>;
}

/*
 * 移动涟漪节流阈值
 *
 * pointermove 触发极频繁，每帧生成涟漪会瞬间堆出大量节点拖垮性能。故采用「距离 + 时间」双闸，
 * 只有移动足够远且距上次足够久才补一枚，形成稀疏顺滑的拖尾（§1.5 性能至上）。
 */
const MOVE_MIN_DISTANCE = 28; // 两枚移动涟漪间至少移动的像素
const MOVE_MIN_INTERVAL = 70; // 两枚移动涟漪间至少间隔的毫秒

/**
 * 自定义指针 + 涟漪交互逻辑 Hook（状态 / 逻辑层）
 *
 * 把「设备探测、原生指针切换、涟漪生成与节流」等浏览器副作用收口于此，
 * 表现层叶子（components/ui/cursor-fx.tsx）只提供涟漪容器引用并渲染静态骨架。
 *
 * 为什么指针本身改用原生 cursor:url() 而非 DOM 元素跟随：
 * 任何用 DOM 节点模拟的指针都要走「指针事件 → JS → 浏览器合成」这条管线，至少滞后真实指针约一帧，
 * 鼠标越快越明显（即用户感知的「跟不上」）；而原生 cursor 由操作系统 / GPU 直接绘制，**零延迟、绝对跟手**。
 * 因此这里不再用 JS 定位指针——指针交给 globals.css 的 cursor:url()（亮 / 暗各一套箭头，随主题切换），
 * 本 Hook 只负责：探测设备、给 <html> 打 .cursor-fx-active 启用原生箭头、并以命令式 appendChild
 * 生成移动 / 点击涟漪（animationend 自移除），全程零 React 重渲染（§1.5 性能至上）。
 */
export function usePointerFx(): PointerFxState {
  const [enabled, setEnabled] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useRef(false);

  // 1) 设备能力探测：仅「精细指针」启用，并监听变化以兼容混合 / 可插拔设备
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => setEnabled(finePointer.matches);
    const syncReduced = () => {
      reduceMotion.current = reduced.matches;
    };
    syncReduced();
    syncEnabled();

    finePointer.addEventListener("change", syncEnabled);
    reduced.addEventListener("change", syncReduced);
    return () => {
      finePointer.removeEventListener("change", syncEnabled);
      reduced.removeEventListener("change", syncReduced);
    };
  }, []);

  // 2) 启用后：切换原生箭头 + 命令式涟漪；禁用 / 卸载时彻底还原
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const layerEl = layerRef.current;
    if (!layerEl) return;

    // 给 <html> 打标记，由 globals.css 在精细指针下把系统箭头换成 Game-Icon 原生 cursor:url()
    const root = document.documentElement;
    root.classList.add("cursor-fx-active");

    // 移动涟漪节流游标——用闭包变量持有，零重渲染
    const lastMove = { x: 0, y: 0, t: 0 };

    // 生成一枚涟漪：原生节点 appendChild，播放完毕经 animationend 自移除，避免 DOM 堆积
    const spawnRipple = (x: number, y: number, kind: "move" | "click") => {
      if (reduceMotion.current) return; // 尊重「减少动态效果」偏好：跳过涟漪
      const ripple = document.createElement("span");
      ripple.className =
        kind === "click"
          ? "cursor-ripple cursor-ripple--click"
          : "cursor-ripple cursor-ripple--move";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.addEventListener("animationend", () => ripple.remove(), {
        once: true,
      });
      layerEl.appendChild(ripple);
    };

    const handleMove = (e: PointerEvent) => {
      // 移动涟漪：距离 + 时间双重节流（指针本身由原生 cursor 绘制，这里只补涟漪）
      const now = e.timeStamp;
      const dx = e.clientX - lastMove.x;
      const dy = e.clientY - lastMove.y;
      if (
        now - lastMove.t >= MOVE_MIN_INTERVAL &&
        dx * dx + dy * dy >= MOVE_MIN_DISTANCE * MOVE_MIN_DISTANCE
      ) {
        lastMove.x = e.clientX;
        lastMove.y = e.clientY;
        lastMove.t = now;
        spawnRipple(e.clientX, e.clientY, "move");
      }
    };
    const handleDown = (e: PointerEvent) =>
      spawnRipple(e.clientX, e.clientY, "click");

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });

    return () => {
      root.classList.remove("cursor-fx-active");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      // 清掉可能残留的涟漪节点，避免禁用后仍挂在 DOM 上
      layerEl.replaceChildren();
    };
  }, [enabled]);

  return { enabled, layerRef };
}
