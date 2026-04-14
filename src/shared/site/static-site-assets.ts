import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sortMarkdownPostDocuments } from '@/features/posts/article-derived-data'
import { validateMarkdownPostDocument } from '@/features/posts/article-frontmatter-schema'
import { siteConfig } from '@/shared/site/site-config'
import { siteMetadata } from '@/shared/site/site-metadata'
import type { MarkdownPostDocument } from '@/shared/types/content'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const postsContentDirectory = path.resolve(
  currentDirectory,
  '../../features/posts/content/posts',
)

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function stripMarkdown(markdownContent: string): string {
  return markdownContent
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`([^`]+)`/gu, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/^#{1,6}\s+/gmu, '')
    .replace(/[>*_~-]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

export function loadPublicMarkdownPostDocumentsFromFileSystem(): MarkdownPostDocument[] {
  const markdownFileNames = readdirSync(postsContentDirectory).filter((fileName) =>
    fileName.endsWith('.md'),
  )

  const documents = markdownFileNames.map((fileName) => {
    const modulePath = `./content/posts/${fileName}`
    const rawMarkdownContent = readFileSync(
      path.join(postsContentDirectory, fileName),
      'utf-8',
    )

    return validateMarkdownPostDocument(modulePath, rawMarkdownContent)
  })

  return sortMarkdownPostDocuments(
    documents.filter((document) => document.draft !== true),
  )
}

function buildCanonicalUrl(siteUrl: string, pathname: string): string {
  return new URL(pathname.replace(/^\//u, ''), normalizeSiteUrl(siteUrl)).toString()
}

export function buildRssXml(siteUrl = siteMetadata.siteUrl): string {
  const documents = loadPublicMarkdownPostDocumentsFromFileSystem()
  const lastBuildDate =
    documents[0]?.updatedAt ?? documents[0]?.publishedAt ?? new Date().toISOString()

  const rssItems = documents
    .map((document) => {
      const description = escapeXml(document.excerpt || stripMarkdown(document.markdownContent))

      return `
    <item>
      <title>${escapeXml(document.title)}</title>
      <link>${buildCanonicalUrl(siteUrl, `/posts/${document.slug}`)}</link>
      <guid>${buildCanonicalUrl(siteUrl, `/posts/${document.slug}`)}</guid>
      <pubDate>${new Date(document.publishedAt).toUTCString()}</pubDate>
      <description>${description}</description>
    </item>`.trim()
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${escapeXml(normalizeSiteUrl(siteUrl))}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>${escapeXml(siteMetadata.language)}</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`
}

export function buildSitemapXml(siteUrl = siteMetadata.siteUrl): string {
  const staticRoutes = siteConfig.navigation.map((navigationItem) => ({
    url: buildCanonicalUrl(siteUrl, navigationItem.to),
    lastmod: null as string | null,
  }))
  const postRoutes = loadPublicMarkdownPostDocumentsFromFileSystem().map(
    (document) => ({
      url: buildCanonicalUrl(siteUrl, `/posts/${document.slug}`),
      lastmod: document.updatedAt ?? document.publishedAt,
    }),
  )

  const urlEntries = [...staticRoutes, ...postRoutes]
    .map(({ url, lastmod }) => {
      const lastmodEntry = lastmod ? `<lastmod>${lastmod}</lastmod>` : ''

      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    ${lastmodEntry}
  </url>`.trim()
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`
}

export function buildRobotsTxt(siteUrl = siteMetadata.siteUrl): string {
  return `User-agent: *
Allow: /

Sitemap: ${buildCanonicalUrl(siteUrl, '/sitemap.xml')}`
}
