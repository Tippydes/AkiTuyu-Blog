import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 类名合并工具（项目唯一指定的动态类名处理器）
 *
 * 为什么需要它：
 * 1. clsx 负责处理「条件类名 / 数组 / 对象」等多形态入参，让动态拼接更直观；
 * 2. twMerge 负责解决 Tailwind 工具类的「后者覆盖前者」冲突（例如 px-2 与 px-4 同时存在时，
 *    保留后传入的 px-4），避免出现两条互相打架的原子类导致样式不可预测。
 * 任何涉及条件 / 状态驱动的类名拼接都必须经过此函数，禁止手写字符串模板拼接。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
