"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

/** 单个涟漪的不可变描述：唯一 id、屏幕坐标、类型（移动 / 点击决定尺寸与配色） */
export interface PointerRipple {
  id: number;
  x: number;
  y: number;
  kind: "move" | "click";
}

/** usePointerFx 暴露给表现层叶子的全部状态与回调 */
export interface PointerFxState {
  /** 是否启用自定义指针层（仅「精细指针」设备，如鼠标 / 触控板） */
  enabled: boolean;
  /** 指针是否在视口内（移出时让指针淡出，避免卡在边缘） */
  visible: boolean;
  /** 经弹簧平滑后的指针 X（已减去箭头热点偏移，可直接喂给 transform） */
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  /** 当前存活的涟漪列表 */
  ripples: PointerRipple[];
  /** 涟漪动画播放完毕后的出队回调 */
  onRippleDone: (id: number) => void;
}

/*
 * 指针箭头热点（hotspot）换算
 *
 * 为什么需要：cursor-default.svg 的箭尖位于 10×10 viewBox 的约 (3.18, 1.76) 处，
 * 而我们把图标整体按 CURSOR_SIZE 渲染。若直接把图标左上角对齐到指针坐标，视觉箭尖会
 * 偏离真实点击点。故先把目标坐标减去「箭尖在图标内的像素位置」，让箭尖与系统点击点重合。
 */
const CURSOR_SIZE = 28; // 自定义指针渲染尺寸（px，对应 h-7 w-7）
const HOTSPOT_X = (3.18 / 10) * CURSOR_SIZE; // ≈ 8.9px
const HOTSPOT_Y = (1.76 / 10) * CURSOR_SIZE; // ≈ 4.9px

/*
 * 移动涟漪节流阈值
 *
 * pointermove 触发极其频繁，若每帧都生成涟漪会瞬间堆出大量 DOM 节点拖垮性能。
 * 故采用「距离 + 时间」双闸：只有当指针移动足够远且距上次足够久才补一枚涟漪，
 * 形成稀疏而顺滑的拖尾，兼顾观感与开销（§1.5 性能至上）。
 */
const MOVE_MIN_DISTANCE = 26; // 两枚移动涟漪间至少移动的像素
const MOVE_MIN_INTERVAL = 90; // 两枚移动涟漪间至少间隔的毫秒
const MAX_RIPPLES = 16; // 同时存活的涟漪上限（兜底，正常会经 animationend 自行出队）

/**
 * 自定义指针 + 涟漪交互逻辑 Hook（状态 / 逻辑层）
 *
 * 把「设备能力探测、指针坐标平滑、涟漪生成与节流、原生指针隐藏」等浏览器副作用全部收口于此，
 * 让表现层叶子（components/ui/cursor-fx.tsx）只负责按返回值渲染，贯彻数据 / 逻辑 / UI 分层。
 */
export function usePointerFx(): PointerFxState {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ripples, setRipples] = useState<PointerRipple[]>([]);

  // 原始指针坐标 → 弹簧平滑：营造 Mizuki 般「轻微拖尾」但依旧跟手的手感
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cursorX = useSpring(rawX, { stiffness: 600, damping: 35, mass: 0.35 });
  const cursorY = useSpring(rawY, { stiffness: 600, damping: 35, mass: 0.35 });

  // 用 ref 持有「不需要触发渲染」的瞬时游标：涟漪自增 id、上次移动采样、是否减少动效、可见性
  const rippleId = useRef(0);
  const lastMove = useRef({ x: 0, y: 0, t: 0 });
  const reduceMotion = useRef(false);
  const visibleRef = useRef(false);

  const onRippleDone = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

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

  // 2) 启用后挂载指针事件并隐藏原生指针；禁用 / 卸载时彻底还原，避免泄漏与残留 cursor:none
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // 给 <html> 打标记，由 globals.css 在精细指针下统一 cursor:none，隐藏系统箭头
    const root = document.documentElement;
    root.classList.add("cursor-fx-active");

    // 可见性切换收口为带 ref 去抖的小工具：仅在真正变化时 setState，避免移动中反复渲染
    const showCursor = () => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };
    const hideCursor = () => {
      if (visibleRef.current) {
        visibleRef.current = false;
        setVisible(false);
      }
    };

    // 生成一枚涟漪并入队（超出上限则丢弃最早一枚作兜底）
    const spawnRipple = (x: number, y: number, kind: PointerRipple["kind"]) => {
      if (reduceMotion.current) return; // 尊重「减少动态效果」偏好：跳过涟漪
      const id = (rippleId.current += 1);
      setRipples((prev) => {
        const base = prev.length >= MAX_RIPPLES ? prev.slice(1) : prev;
        return [...base, { id, x, y, kind }];
      });
    };

    const handleMove = (e: PointerEvent) => {
      // 更新（已减去热点偏移的）目标坐标，弹簧会平滑逼近真实位置
      rawX.set(e.clientX - HOTSPOT_X);
      rawY.set(e.clientY - HOTSPOT_Y);
      showCursor();

      // 移动涟漪：距离 + 时间双重节流
      const now = performance.now();
      const dx = e.clientX - lastMove.current.x;
      const dy = e.clientY - lastMove.current.y;
      if (
        now - lastMove.current.t >= MOVE_MIN_INTERVAL &&
        dx * dx + dy * dy >= MOVE_MIN_DISTANCE * MOVE_MIN_DISTANCE
      ) {
        lastMove.current = { x: e.clientX, y: e.clientY, t: now };
        spawnRipple(e.clientX, e.clientY, "move");
      }
    };
    const handleDown = (e: PointerEvent) => spawnRipple(e.clientX, e.clientY, "click");

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    document.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      root.classList.remove("cursor-fx-active");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      document.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      visibleRef.current = false;
      setVisible(false);
    };
  }, [enabled, rawX, rawY]);

  return { enabled, visible, cursorX, cursorY, ripples, onRippleDone };
}
