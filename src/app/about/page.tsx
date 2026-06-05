import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import Icon from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "关于",
  description: `关于 ${siteConfig.name} 与站长 ${siteConfig.author.name}。`,
};

/**
 * 关于页（服务端组件控制器）
 *
 * 内容全部取自数据层 site-config（作者简介与社交外链），页面只做编排。
 * 语义化为 <article>，自我介绍套用 .prose-aki 排版令牌与全站正文保持一致。
 */
export default function AboutPage() {
  const { author, socials } = siteConfig;

  return (
    <article className="glass-panel mx-auto max-w-2xl rounded-4xl p-8 md:p-10">
      <header className="flex items-center gap-x-4">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary-container text-3xl"
          aria-hidden="true"
        >
          {author.avatarEmoji}
        </span>
        <span className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-surface-onSurface">
            {author.name}
          </h1>
          <p className="text-sm text-surface-onVariant">{author.handle}</p>
        </span>
      </header>

      <section className="prose-aki mt-8" aria-label="自我介绍">
        {author.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="mt-8" aria-labelledby="about-socials-title">
        <h2
          id="about-socials-title"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-onVariant/70"
        >
          找到我
        </h2>
        <ul className="flex flex-wrap gap-3">
          {socials.map((social) => {
            // 外部链接需新开标签页并加 noopener；站内 / mailto 链接保持默认
            const isExternal = social.href.startsWith("http");
            return (
              <li key={social.label}>
                <Link
                  href={social.href}
                  className="inline-flex items-center gap-x-2 rounded-full border border-outline-variant/40 bg-surface/50 px-4 py-2 text-sm text-surface-onVariant transition-colors hover:bg-brand-primaryContainer hover:text-brand-onPrimaryContainer"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <Icon
                    name={social.icon}
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  {social.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
