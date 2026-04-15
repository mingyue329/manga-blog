import { siteMetadata } from "./site-metadata";
import type { ArchivePost } from "@/shared/types/content";

/**
 * SEO 元数据接口。
 * 包含页面级 SEO 所需的所有字段，用于动态生成 meta 标签。
 */
export interface SeoMetadata {
  title: string;
  description: string;
  url?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: "article" | "website";
  tags?: string[];
}

/**
 * 生成完整的 SEO meta 标签字符串。
 * 包含基础 meta、Open Graph、Twitter Card 等。
 *
 * @param seo - 页面级 SEO 数据
 * @param isArticle - 是否为文章页（影响 og:type）
 * @returns HTML meta 标签字符串
 */
export function generateSeoTags(seo: SeoMetadata, isArticle = false): string {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, "");
  const fullUrl = seo.url ? `${siteUrl}${seo.url}` : siteUrl;
  const imageUrl = seo.image
    ? seo.image.startsWith("http")
      ? seo.image
      : `${siteUrl}${seo.image}`
    : siteMetadata.defaultOgImage
      ? `${siteUrl}${siteMetadata.defaultOgImage}`
      : undefined;

  const tags: string[] = [];

  // 基础 meta
  tags.push(`<title>${escapeHtml(seo.title)}</title>`);
  tags.push(
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  tags.push(`<link rel="canonical" href="${fullUrl}" />`);

  // Open Graph
  tags.push(`<meta property="og:title" content="${escapeHtml(seo.title)}" />`);
  tags.push(
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );
  tags.push(`<meta property="og:url" content="${fullUrl}" />`);
  tags.push(
    `<meta property="og:type" content="${isArticle ? "article" : "website"}" />`,
  );
  tags.push(
    `<meta property="og:site_name" content="${escapeHtml(siteMetadata.title)}" />`,
  );
  tags.push(
    `<meta property="og:locale" content="${siteMetadata.language}_${getRegionCode()}" />`,
  );

  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${imageUrl}" />`);
    tags.push(`<meta property="og:image:width" content="1200" />`);
    tags.push(`<meta property="og:image:height" content="630" />`);
  }

  if (isArticle && seo.publishedTime) {
    tags.push(
      `<meta property="article:published_time" content="${seo.publishedTime}" />`,
    );
  }

  if (isArticle && seo.modifiedTime) {
    tags.push(
      `<meta property="article:modified_time" content="${seo.modifiedTime}" />`,
    );
  }

  if (isArticle && seo.tags && seo.tags.length > 0) {
    seo.tags.forEach((tag) => {
      tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
    });
  }

  // Twitter Card
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`);
  tags.push(
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );

  if (imageUrl) {
    tags.push(`<meta name="twitter:image" content="${imageUrl}" />`);
  }

  return tags.join("\n  ");
}

/**
 * 从文章数据生成 SEO 元数据。
 *
 * @param post - 文章数据
 * @returns SEO 元数据对象
 */
export function buildPostSeoMetadata(post: ArchivePost): SeoMetadata {
  return {
    title: `${post.title} | ${siteMetadata.title}`,
    description: post.excerpt,
    url: `/posts/${post.slug}`,
    image: post.image.src,
    publishedTime: post.date.replace(/\./g, "-"),
    type: "article",
    tags: post.tags,
  };
}

/**
 * 生成默认页面（首页、关于页等）的 SEO 元数据。
 *
 * @param pageTitle - 页面标题（可选，不传则使用站点标题）
 * @param pageDescription - 页面描述（可选，不传则使用站点描述）
 * @returns SEO 元数据对象
 */
export function buildDefaultSeoMetadata(
  pageTitle?: string,
  pageDescription?: string,
): SeoMetadata {
  return {
    title: pageTitle
      ? `${pageTitle} | ${siteMetadata.title}`
      : siteMetadata.title,
    description: pageDescription || siteMetadata.description,
    type: "website",
  };
}

/**
 * HTML 转义，防止 XSS。
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 获取地区代码，默认为 CN。
 */
function getRegionCode(): string {
  return "CN";
}
