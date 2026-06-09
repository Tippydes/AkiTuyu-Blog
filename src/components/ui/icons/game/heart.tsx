import type { SVGProps } from "react";

/**
 * Heart 图标（源自 Game-Icon-Pack · 全圆角风格，语义名 "heart"）
 *
 * 单色路径，fill 继承 currentColor，故可被 text-primary / text-onSurface 等
 * MD3 颜色令牌直接染色；尺寸由调用方经 className（如 h-5 w-5）控制。
 * 本文件由 scripts/sync-game-icons.mjs 自动生成，请勿手改。
 */
export default function Heart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2.23594 3.23807C1.31801 4.91711 3.96703 7.49999 4.99252 7.50001C6.02941 7.50004 8.68725 4.91386 7.76178 3.23489C7.42304 2.62035 6.6076 2.42109 5.93938 2.6353C5.08723 2.90846 5.18961 3.50003 4.99253 3.50001C4.80522 3.49999 4.90947 2.90951 4.0603 2.63604C3.39103 2.4205 2.57323 2.62113 2.23594 3.23807Z" />
    </svg>
  );
}
