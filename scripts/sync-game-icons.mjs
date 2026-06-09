// scripts/sync-game-icons.mjs
//
// Game-Icon-Pack 图标同步脚本（零依赖，纯 Node 原生 fs + 正则）
//
// 为什么需要它：Game-Icon-Pack（https://github.com/Nieobie/Game-Icon-Pack）以原始 SVG 形式
// 分发 570+ 全圆角图标。按 AGENTS.md「零冗余依赖」原则，我们不引入任何 npm 图标包，
// 而是「按需」把用到的少量 SVG 清洗成纯净的内联 React 组件。本脚本把这一同步过程固化为
// 可复现的一条命令：人工只需在下方 ICON_MAP 登记「语义名 → 源 SVG 路径」，再执行
//   GAME_ICON_SRC=/path/to/Game-Icon-Pack/svg-v1.0.3 node scripts/sync-game-icons.mjs
// 即可自动生成 src/components/ui/icons/game/*.tsx 与注册表 index.ts。
//
// 清洗规则：源 SVG 均为「单色路径 + fill=white + 内阴影滤镜」结构。我们只保留路径几何
// （全圆角特性即源于路径本身），剥离写死的 width/height、内阴影 <defs>/<filter>/<g> 包裹层
// 以及 fill=white，并把根 <svg> 的 fill 设为 currentColor —— 从而让图标能被 text-* 等
// MD3 颜色令牌无缝染色。

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const OUT_DIR = join(REPO_ROOT, "src/components/ui/icons/game");
const INDEX_FILE = join(REPO_ROOT, "src/components/ui/icons/index.ts");

// 源图标仓库（svg-v1.0.3）目录，可用环境变量覆盖
const SRC_DIR =
  process.env.GAME_ICON_SRC || "/tmp/game-icon-pack/svg-v1.0.3";

/**
 * 语义图标名 → Game-Icon-Pack 内的源 SVG 相对路径
 *
 * 仅登记 AkiTuyu 当前真正用到的图标（零冗余）。新增图标时：在此追加一行 →
 * 重新执行本脚本 → 在数据层 / 组件里以该语义名引用 <Icon name="..." />。
 */
const ICON_MAP = {
  // 主导航
  home: "5.Game/house.svg",
  archive: "6.Items/chest.svg",
  user: "1.UI/user.svg",
  // 文章分类
  code: "2.Media & Technology/code.svg",
  sparkle: "4.Shapes & Symbol/four-pointed-star.svg",
  daily: "2.Media & Technology/message.svg",
  notes: "6.Items/book.svg",
  // 项目 / 作品（一级入口 + 二级子菜单）
  folder: "2.Media & Technology/folder.svg",
  laptop: "2.Media & Technology/laptop.svg",
  heart: "5.Game/heart.svg",
  // 社交外链
  rss: "2.Media & Technology/audio-waves.svg",
  mail: "2.Media & Technology/mail.svg",
  // 文章元信息
  calendar: "2.Media & Technology/calendar.svg",
  clock: "2.Media & Technology/clock.svg",
  tag: "2.Media & Technology/tag.svg",
  // 交互
  "arrow-left": "4.Shapes & Symbol/arrow-left.svg",
  "chevron-down": "4.Shapes & Symbol/arrow-down.svg",
  "dark-mode": "1.UI/dark-mode.svg",
  "light-mode": "1.UI/light-mode.svg",
};

/** kebab/小写语义名 → PascalCase 组件名（如 arrow-left → ArrowLeft） */
function toPascalCase(name) {
  return name
    .split(/[-_]/)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join("");
}

/** 从源 SVG 文本中读取 viewBox（兜底为 0 0 10 10） */
function extractViewBox(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  return m ? m[1] : "0 0 10 10";
}

/**
 * 提取所有 <path> 的 d 属性
 * 源图标为单色路径结构，剥离 fill 后由父级 currentColor 统一着色
 */
function extractPaths(svg) {
  const paths = [];
  const re = /<path\b[^>]*\bd="([^"]+)"[^>]*\/>/g;
  let m;
  while ((m = re.exec(svg)) !== null) {
    paths.push(m[1]);
  }
  return paths;
}

/** 生成单个图标组件源码 */
function buildComponent(name, viewBox, paths) {
  const comp = toPascalCase(name);
  const body = paths.map((d) => `      <path d="${d}" />`).join("\n");
  return `import type { SVGProps } from "react";

/**
 * ${comp} 图标（源自 Game-Icon-Pack · 全圆角风格，语义名 "${name}"）
 *
 * 单色路径，fill 继承 currentColor，故可被 text-primary / text-onSurface 等
 * MD3 颜色令牌直接染色；尺寸由调用方经 className（如 h-5 w-5）控制。
 * 本文件由 scripts/sync-game-icons.mjs 自动生成，请勿手改。
 */
export default function ${comp}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="${viewBox}"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
${body}
    </svg>
  );
}
`;
}

/** 生成注册表 index.ts */
function buildIndex(names) {
  const imports = names
    .map((n) => `import ${toPascalCase(n)} from "./game/${n}";`)
    .join("\n");
  const entries = names
    .map((n) => `  "${n}": ${toPascalCase(n)},`)
    .join("\n");
  return `import type { ReactElement, SVGProps } from "react";

${imports}

/**
 * Game-Icon-Pack 图标注册表（语义名 → 内联 SVG 组件）
 *
 * 数据层（navigation.ts / site-config.ts）只存储图标的「语义名」字符串，
 * 展示层 <Icon> 据此按名取用，既贯彻「数据-UI 分离」，又只把用到的图标打进包里。
 * 本文件由 scripts/sync-game-icons.mjs 自动生成，请勿手改。
 */
export const gameIconRegistry = {
${entries}
} satisfies Record<string, (props: SVGProps<SVGSVGElement>) => ReactElement>;

/** 已登记的合法图标名联合类型 */
export type GameIconName = keyof typeof gameIconRegistry;
`;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const names = Object.keys(ICON_MAP);

  for (const name of names) {
    const srcPath = join(SRC_DIR, ICON_MAP[name]);
    const svg = readFileSync(srcPath, "utf8");
    const viewBox = extractViewBox(svg);
    const paths = extractPaths(svg);
    if (paths.length === 0) {
      throw new Error(`未能从 ${srcPath} 提取到任何 <path>`);
    }
    const out = buildComponent(name, viewBox, paths);
    writeFileSync(join(OUT_DIR, `${name}.tsx`), out, "utf8");
    console.log(`生成 ${name}.tsx  ← ${ICON_MAP[name]}  (${paths.length} path)`);
  }

  writeFileSync(INDEX_FILE, buildIndex(names), "utf8");
  console.log(`\n生成注册表 index.ts，共 ${names.length} 个图标。`);
}

main();
