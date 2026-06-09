import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  /** 头像图片地址（位于 public/，如 /images/avatar.png） */
  src: string;
  /** 无障碍替代文本 */
  alt: string;
  /** 容器类名：尺寸与圆角（如 h-10 w-10 rounded-full）由调用方决定 */
  className?: string;
  /** next/image 响应式尺寸提示，默认按常见展示尺寸给值 */
  sizes?: string;
  /** 是否优先加载（首屏可见的头像建议开启，避免布局抖动） */
  priority?: boolean;
}

/**
 * 站长头像（原子级展示组件）
 *
 * 为什么单独抽：头像在侧边栏品牌区 / 作者卡片 / 关于页等多处出现，统一用 next/image
 * 填充父容器并裁剪（object-cover），避免在每处重复书写 fill + 裁剪配置（§1.3）。
 * 保持纯展示：图片地址与替代文本均由 props 传入，组件本身不感知数据来源（§1.4）。
 */
export default function Avatar({
  src,
  alt,
  className,
  sizes = "64px",
  priority = false,
}: AvatarProps) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </span>
  );
}
