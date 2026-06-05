import {
  Archive,
  Calendar,
  Clock,
  Code2,
  Coffee,
  Home,
  Mail,
  NotebookPen,
  Rss,
  Sparkles,
  Tag,
  User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * 图标名 → lucide 组件 的映射器
 *
 * 为什么需要它：数据层（navigation.ts / site-config.ts）只存储图标的「名字」字符串，
 * 以保持数据可序列化、与具体图标库解耦。展示层通过本组件按名取用对应图标，
 * 从而既贯彻「数据-UI 分离」，又避免把整个图标库一次性打进包里（仅显式登记用到的图标）。
 *
 * 注：lucide 图标本身是纯 SVG 组件，可在服务端组件中直接渲染，无需 "use client"。
 */
const ICON_REGISTRY: Readonly<Record<string, LucideIcon>> = {
  Home,
  Archive,
  User,
  Code2,
  Sparkles,
  Coffee,
  NotebookPen,
  Rss,
  Mail,
  Tag,
  Calendar,
  Clock,
};

interface IconProps extends LucideProps {
  /** 图标名，需与 ICON_REGISTRY 中登记的键一致 */
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  const LucideGlyph = ICON_REGISTRY[name];
  // 名字未登记时静默降级为不渲染，避免因数据笔误导致整页崩溃
  if (!LucideGlyph) return null;
  return <LucideGlyph {...props} />;
}
