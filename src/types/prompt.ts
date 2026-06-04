/**
 * 提示词与工作流类型字典（全局严格数据流约定）
 *
 * 为什么集中声明：UI 组件遵循「数据-UI 分离」原则，只通过 props 消费这些类型，
 * 而数据来源（本地 data/ 配置或未来远端 API）对组件完全透明。统一在此定义可避免
 * 各处自行拼装结构导致的类型漂移。
 */

/** 提示词分类标识（用于左侧导航过滤与卡片归类） */
export type PromptCategory =
  | "coding"
  | "creative-writing"
  | "roleplay"
  | "productivity";

/**
 * 提示词占位符定义
 * 交互式构建器会据此动态渲染输入框 / 下拉框，让用户填充 {{key}} 模板变量。
 */
export interface PromptPlaceholder {
  /** 模板中的变量键名，对应正文里的 {{key}} */
  key: string;
  /** 展示给用户的字段标签 */
  label: string;
  /** 输入控件类型：文本框或可选项下拉 */
  type: "text" | "select";
  /** 当 type 为 select 时的候选项 */
  options?: readonly string[];
  /** 输入提示占位文案 */
  placeholder?: string;
}

/**
 * 单条提示词的完整数据结构
 * 作为提示词库 / 工作台卡片渲染与实时预览生成的唯一数据契约。
 */
export interface Prompt {
  /** 唯一标识，同时用作路由与列表 key */
  id: string;
  /** 标题 */
  title: string;
  /** 简短描述，用于卡片摘要 */
  description: string;
  /** 所属分类 */
  category: PromptCategory;
  /** 标签集合，用于客户端快速筛选 */
  tags: readonly string[];
  /** 含 {{placeholder}} 占位符的提示词正文模板 */
  template: string;
  /** 模板内出现的占位符声明集合（无占位符则为空数组） */
  placeholders: readonly PromptPlaceholder[];
}
