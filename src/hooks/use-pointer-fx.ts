"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** usePointerFx 暴露给表现层叶子的状态与 DOM 引用 */
export interface PointerFxState {
  /** 是否启用自定义指针层（仅「精细指针」设备，如鼠标 / 触控板） */
  enabled: boolean;
  /** 涟漪挂载容器：涟漪以原生 DOM 节点 appendChild 进来（避开 React 重渲染） */
  layerRef: RefObject<HTMLDivElement | null>;
  /** 自定义指针元素：每次 pointermove 直接改写 transform（避开 React 重渲染） */
  cursorRef: RefObject<HTMLDivElement | null>;
}

/*
 * 指针箭头热点（hotspot）换算
 *
 * cursor-default.svg 的箭尖位于 10×10 viewBox 的约 (3.18, 1.76) 处，而图标整体按 CURSOR_SIZE
 * 渲染。直接把图标左上角对齐指针会让视觉箭尖偏离真实点击点，故把目标坐标减去「箭尖在图标内的
 * 像素位置」，令箭尖与系统点击点重合。
 */
const CURSOR_SIZE = 28; // 自定义指针渲染尺寸（px，对应 h-7 w-7）
const HOTSPOT_X = (3.18 / 10) * CURSOR_SIZE; // ≈ 8.9px
const HOTSPOT_Y = (1.76 / 10) * CURSOR_SIZE; // ≈ 4.9px

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
 * 把「设备探测、指针坐标跟随、涟漪生成与节流、原生指针隐藏」等浏览器副作用收口于此，
 * 表现层叶子（components/ui/cursor-fx.tsx）只提供 DOM 引用并渲染静态骨架。
 *
 * 为什么用「命令式直接改写 DOM」而非 React state / Framer Motion / 缓动跟随：
 * 指针移动是高频事件，若每次移动或每枚涟漪都走 setState 会触发海量重渲染；而任何「平滑缓动」都意味着
 * 指针每帧只追目标一部分，鼠标越快越拖在后面（即用户感知的「卡 / 跟不上」）。这里指针在每次 pointermove
 * 里**直接贴到真实坐标**（只写 transform、合成层、无重排，零延迟完全跟手），涟漪以原生节点 appendChild
 * 并在 animationend 自移除，全程零 React 重渲染（§1.5 性能至上）。
 */
export function usePointerFx(): PointerFxState {
  const [enabled, setEnabled] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
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

  // 2) 启用后：指针直接跟随 + 命令式涟漪 + 隐藏原生指针；禁用 / 卸载时彻底还原
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const cursorEl = cursorRef.current;
    const layerEl = layerRef.current;
    if (!cursorEl || !layerEl) return;

    // 给 <html> 打标记，由 globals.css 在精细指针下统一 cursor:none，隐藏系统箭头
    const root = document.documentElement;
    root.classList.add("cursor-fx-active");

    // 移动涟漪节流游标——用闭包变量持有，零重渲染
    const lastMove = { x: 0, y: 0, t: 0 };
    let primed = false; // 是否已收到首个移动事件（用于首次淡入）

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
      // 直接贴到真实指针位置：仅写 transform（合成层、无重排），零延迟完全跟手
      cursorEl.style.transform = `translate3d(${e.clientX - HOTSPOT_X}px, ${e.clientY - HOTSPOT_Y}px, 0)`;
      // 首个移动事件：淡入指针
      if (!primed) {
        primed = true;
        cursorEl.style.opacity = "1";
      }

      // 移动涟漪：距离 + 时间双重节流
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
    const hideCursor = () => {
      cursorEl.style.opacity = "0";
    };
    const showCursor = () => {
      if (primed) cursorEl.style.opacity = "1";
    };

    /*
     * 优先用 pointerrawupdate 而非 pointermove 定位：
     * pointermove 会被浏览器按帧合并（每帧最多一枚），而 pointerrawupdate 以设备轮询率（可达 1000Hz）
     * 触发，能在每次合成（vsync）前拿到「最新鲜」的指针坐标，把「事件→JS→合成」管线里那段固有延迟压到最小，
     * 最大程度缓解自定义指针相对系统硬件指针的滞后。Firefox 暂不支持该事件，回退到 pointermove。
     */
    const moveEvent =
      "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";
    window.addEventListener(moveEvent, handleMove as EventListener, {
      passive: true,
    });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    document.addEventListener("pointerleave", hideCursor);
    document.addEventListener("pointerenter", showCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      root.classList.remove("cursor-fx-active");
      window.removeEventListener(moveEvent, handleMove as EventListener);
      window.removeEventListener("pointerdown", handleDown);
      document.removeEventListener("pointerleave", hideCursor);
      document.removeEventListener("pointerenter", showCursor);
      window.removeEventListener("blur", hideCursor);
      // 清掉可能残留的涟漪节点，避免禁用后仍挂在 DOM 上
      layerEl.replaceChildren();
    };
  }, [enabled]);

  return { enabled, layerRef, cursorRef };
}
