"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 媒体查询匹配 Hook（原生 matchMedia，零依赖）
 *
 * 为什么自写而非引库：仅需监听断点匹配状态，标准 Web API `matchMedia` 即可胜任，
 * 引第三方（如 react-responsive）违背 §1.5「依赖控制与零膨胀」原则。
 *
 * 为什么用 useSyncExternalStore：matchMedia 本质是一个「浏览器外部状态源」，
 * 用官方订阅原语对接，既避免在 effect 里直接 setState 触发级联渲染，又能让
 * SSR 经 getServerSnapshot 统一返回 false，规避 hydration 不一致告警。
 *
 * @param query 标准 CSS 媒体查询串，如 "(min-width: 768px)"
 * @returns 当前视口是否匹配该查询
 */
export function useMediaQuery(query: string): boolean {
  // 订阅断点变化（旋转屏幕 / 缩放窗口时回调，驱动重渲染）
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  // 客户端快照：读取真实匹配值
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // 服务端快照：无 window，统一按「未匹配」渲染
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
