import React from "react";

/**
 * 全局页眉（服务端组件 RSC）
 *
 * 设计意图：承载面包屑式当前位置标识与右侧操作区。
 * 主题切换属于客户端交互，按 1.6「组件边界流」规范应作为独立叶子组件（ThemeToggle）后续挂载，
 * 此处先预留容器占位，避免因一个按钮把整个布局降级为 Client Component。
 */
export default function Header() {
  const headerStyles =
    "flex h-16 w-full items-center justify-between border-b border-outline-variant/20 px-6";

  return (
    <header className={headerStyles}>
      <p className="text-sm font-medium text-surface-onVariant">工作台 / Workspace</p>

      <section className="flex items-center gap-x-4" aria-label="全局操作">
        {/* 占位：后续在此挂载 ThemeToggle 等客户端叶子组件 */}
        <span className="block h-8 w-8 rounded-full bg-brand-primaryContainer" aria-hidden="true" />
      </section>
    </header>
  );
}
