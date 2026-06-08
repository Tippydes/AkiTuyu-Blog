import type { SVGProps } from "react";
import { gameIconRegistry, type GameIconName } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * 图标名 → Game-Icon-Pack 内联组件 的映射器
 *
 * 为什么需要它：数据层（navigation.ts / site-config.ts）只存储图标的「语义名」字符串，
 * 以保持数据可序列化、与具体图标实现解耦。展示层通过本组件按名取用对应的内联 SVG 组件，
 * 从而既贯彻「数据-UI 分离」，又只把真正用到的图标（按需登记）打进包里，符合零冗余依赖原则。
 *
 * 为什么改用 Game-Icon-Pack：其图标全圆角、无尖锐边缘，更贴合本站 MD3 + 玻璃拟态的二次元美学。
 * 这些图标均为单色路径并继承 currentColor，故能被 text-primary / text-onSurface 等 MD3
 * 颜色令牌无缝染色；本身是纯 SVG，可在服务端组件中直接渲染，无需 "use client"。
 */
interface IconProps extends SVGProps<SVGSVGElement> {
  /** 图标语义名，需与 gameIconRegistry 中登记的键一致 */
  name: string;
}

export default function Icon({ name, className, ...props }: IconProps) {
  const Glyph = gameIconRegistry[name as GameIconName];
  // 名字未登记时静默降级为不渲染，避免因数据笔误导致整页崩溃
  if (!Glyph) return null;
  // 默认 h-5 w-5；调用方传入的尺寸/颜色类名经 cn() 合并后优先生效
  return <Glyph className={cn("h-5 w-5", className)} {...props} />;
}
