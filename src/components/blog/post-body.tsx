import React from "react";

interface PostBodyProps {
  /** 已由 Markdown 编译完成的安全 HTML（内容源为本地可信文件） */
  html: string;
}

/**
 * 文章正文渲染器（纯展示）
 *
 * 为什么使用 dangerouslySetInnerHTML：正文来自仓库内本地 Markdown，属可信内容，
 * 经 marked 编译为 HTML 后直接注入；外层套用自维护的 .prose-aki 排版令牌，
 * 保证正文风格与 MD3 主题（亮/暗）严格一致。
 */
export default function PostBody({ html }: PostBodyProps) {
  return (
    <div className="prose-aki max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
