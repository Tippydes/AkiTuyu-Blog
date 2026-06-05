"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * 亮 / 暗模式切换按钮（客户端叶子）
 *
 * 交互逻辑只此一处需要浏览器能力，故下沉为最小叶子组件，不污染上层 RSC。
 *
 * 为什么用 CSS 而非 mounted state 控制图标：服务端无法预知主题，若用 useEffect+setState
 * 标记挂载会触发 React 编译器的「effect 内同步 setState」告警。改为始终渲染双图标、
 * 借 Tailwind 的 `dark:` 变体按 <html> 上的 .dark 类切换显隐，既零脚本又无水合不一致。
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const buttonStyles =
    "flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/40 bg-surface/60 text-surface-onVariant transition-colors hover:bg-brand-primaryContainer hover:text-brand-onPrimaryContainer";

  return (
    <button
      type="button"
      // 点击时按当前已解析主题取反；该回调仅在水合后触发，resolvedTheme 必定有值
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={buttonStyles}
      aria-label="切换亮色 / 暗色模式"
    >
      {/* 亮色态显示月亮（点击转暗），暗色态显示太阳（点击转亮） */}
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
