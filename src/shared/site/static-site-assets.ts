import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { sortMarkdownPostDocuments } from "../../features/posts/article-derived-data";
import { validateMarkdownPostDocument } from "../../features/posts/article-frontmatter-schema";
import { siteConfig } from "./site-config";
import { siteMetadata } from "./site-metadata";
import type { MarkdownPostDocument } from "../types/content";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const postsContentDirectory = path.resolve(
  currentDirectory,
  "../../features/posts/content/posts",
);

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
}

/**
 * 对 XML 内容做最小转义。
 * 静态站点资产会直接拼 XML 字符串，这里需要先兜住保留字符，避免生成非法文档。
 */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * 把 Markdown 压平成纯文本摘要。
 * RSS 与搜索索引都不需要保留原始标记，只保留可读文本即可。
 */
function stripMarkdown(markdownContent: string): string {
  return markdownContent
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/^#{1,6}\s+/gmu, "")
    .replace(/[>*_~-]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

/**
 * 从文章目录直接读取对外发布的 Markdown 文档。
 * 这段逻辑运行在 Node 环境，用于生成 RSS、Sitemap 与搜索索引，不走前端 import 流程。
 */
export function loadPublicMarkdownPostDocumentsFromFileSystem(): MarkdownPostDocument[] {
  const markdownFileNames = readdirSync(postsContentDirectory).filter(
    (fileName) => fileName.endsWith(".md"),
  );

  const documents = markdownFileNames.map((fileName) => {
    const modulePath = `./content/posts/${fileName}`;
    const rawMarkdownContent = readFileSync(
      path.join(postsContentDirectory, fileName),
      "utf-8",
    );

    return validateMarkdownPostDocument(modulePath, rawMarkdownContent);
  });

  return sortMarkdownPostDocuments(
    documents.filter((document) => document.draft !== true),
  );
}

/**
 * 基于站点根地址和路径片段生成规范 URL。
 * 这样在不同部署前缀下生成的静态链接仍然保持一致。
 */
function buildCanonicalUrl(siteUrl: string, pathname: string): string {
  return new URL(
    pathname.replace(/^\//u, ""),
    normalizeSiteUrl(siteUrl),
  ).toString();
}

/**
 * 生成 RSS XML。
 * 文章来源与前端页面共用同一批 Markdown 数据，避免内容与订阅源不一致。
 */
export function buildRssXml(siteUrl: string = siteMetadata.siteUrl): string {
  const documents = loadPublicMarkdownPostDocumentsFromFileSystem();
  const lastBuildDate =
    documents[0]?.updatedAt ??
    documents[0]?.publishedAt ??
    new Date().toISOString();

  const rssItems = documents
    .map((document) => {
      const description = escapeXml(
        document.excerpt || stripMarkdown(document.markdownContent),
      );

      return `
    <item>
      <title>${escapeXml(document.title)}</title>
      <link>${buildCanonicalUrl(siteUrl, `/posts/${document.slug}`)}</link>
      <guid>${buildCanonicalUrl(siteUrl, `/posts/${document.slug}`)}</guid>
      <pubDate>${new Date(document.publishedAt).toUTCString()}</pubDate>
      <description>${description}</description>
      <content:encoded><![CDATA[${document.markdownContent}]]></content:encoded>
    </item>`.trim();
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${escapeXml(normalizeSiteUrl(siteUrl))}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>${escapeXml(siteMetadata.language)}</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;
}

/**
 * 生成站点地图 XML。
 * 静态栏目页和文章详情页都会收进同一个清单，方便搜索引擎抓取。
 */
export function buildSitemapXml(
  siteUrl: string = siteMetadata.siteUrl,
): string {
  const documents = loadPublicMarkdownPostDocumentsFromFileSystem();
  const buildDate = new Date().toISOString();

  const staticRoutes = siteConfig.navigation.map(
    (navigationItem: { to: string }) => ({
      url: buildCanonicalUrl(siteUrl, navigationItem.to),
      lastmod: buildDate,
    }),
  );
  const postRoutes = documents.map((document) => ({
    url: buildCanonicalUrl(siteUrl, `/posts/${document.slug}`),
    lastmod: document.updatedAt ?? document.publishedAt,
  }));

  const urlEntries = [...staticRoutes, ...postRoutes]
    .map(({ url, lastmod }) => {
      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`.trim();
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
}

/**
 * 生成 robots.txt。
 * 当前策略保持开放抓取，并显式声明 Sitemap 地址。
 */
export function buildRobotsTxt(siteUrl: string = siteMetadata.siteUrl): string {
  return `User-agent: *
Allow: /

Sitemap: ${buildCanonicalUrl(siteUrl, "/sitemap.xml")}`;
}
