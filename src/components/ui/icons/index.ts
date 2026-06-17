import type { ReactElement, SVGProps } from "react";

import Home from "./game/home";
import Archive from "./game/archive";
import User from "./game/user";
import Code from "./game/code";
import Sparkle from "./game/sparkle";
import Daily from "./game/daily";
import Notes from "./game/notes";
import Folder from "./game/folder";
import Laptop from "./game/laptop";
import Heart from "./game/heart";
import Rss from "./game/rss";
import Mail from "./game/mail";
import Calendar from "./game/calendar";
import Clock from "./game/clock";
import Tag from "./game/tag";
import ArrowLeft from "./game/arrow-left";
import ChevronDown from "./game/chevron-down";
import DarkMode from "./game/dark-mode";
import LightMode from "./game/light-mode";

/**
 * Game-Icon-Pack 图标注册表（语义名 → 内联 SVG 组件）
 *
 * 数据层（navigation.ts / site-config.ts）只存储图标的「语义名」字符串，
 * 展示层 <Icon> 据此按名取用，既贯彻「数据-UI 分离」，又只把用到的图标打进包里。
 * 本文件由 scripts/sync-game-icons.mjs 自动生成，请勿手改。
 */
export const gameIconRegistry = {
  "home": Home,
  "archive": Archive,
  "user": User,
  "code": Code,
  "sparkle": Sparkle,
  "daily": Daily,
  "notes": Notes,
  "folder": Folder,
  "laptop": Laptop,
  "heart": Heart,
  "rss": Rss,
  "mail": Mail,
  "calendar": Calendar,
  "clock": Clock,
  "tag": Tag,
  "arrow-left": ArrowLeft,
  "chevron-down": ChevronDown,
  "dark-mode": DarkMode,
  "light-mode": LightMode,
} satisfies Record<string, (props: SVGProps<SVGSVGElement>) => ReactElement>;

/** 已登记的合法图标名联合类型 */
export type GameIconName = keyof typeof gameIconRegistry;
