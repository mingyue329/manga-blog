import {
  buildArchivePost,
  collectArticleTags,
  getPostCategoryLabel,
  sortHomepageMarkdownPostDocuments,
  sortMarkdownPostDocuments,
} from '@/features/posts/article-derived-data'
import { validateMarkdownPostDocument } from '@/features/posts/article-frontmatter-schema'
import type {
  ArchivePost,
  MarkdownPostDocument,
  UpdateArticle,
} from '@/shared/types/content'

const articleMarkdownModules = import.meta.glob('./content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function buildMarkdownPostDocumentCache(): MarkdownPostDocument[] {
  const documents: MarkdownPostDocument[] = []
  const seenSlugs = new Set<string>()

  for (const [modulePath, rawMarkdownContent] of Object.entries(
    articleMarkdownModules,
  )) {
    const document = validateMarkdownPostDocument(modulePath, rawMarkdownContent)

    if (seenSlugs.has(document.slug)) {
      throw new Error(`检测到重复文章 slug：${document.slug}。请检查 Markdown 文件名。`)
    }

    seenSlugs.add(document.slug)

    if (import.meta.env.PROD && document.draft) {
      continue
    }

    documents.push(document)
  }

  return sortMarkdownPostDocuments(documents)
}

const markdownPostDocumentCache = buildMarkdownPostDocumentCache()

export { getPostCategoryLabel }

export function getAllMarkdownPostDocuments(): MarkdownPostDocument[] {
  return structuredClone(markdownPostDocumentCache)
}

export function getAllArchivePosts(): ArchivePost[] {
  return markdownPostDocumentCache.map((document) => buildArchivePost(document))
}

export function getAllArticleTags(): string[] {
  return collectArticleTags(markdownPostDocumentCache)
}

export function getMarkdownPostDocumentBySlug(
  slug: string,
): MarkdownPostDocument | null {
  const matchedDocument =
    markdownPostDocumentCache.find((document) => document.slug === slug) ?? null

  return matchedDocument ? structuredClone(matchedDocument) : null
}

export function getLatestUpdateArticles(limit: number): UpdateArticle[] {
  return sortHomepageMarkdownPostDocuments(markdownPostDocumentCache)
    .slice(0, limit)
    .map((document) => ({
      tag: getPostCategoryLabel(document.categoryKey),
      title: document.title,
      description: document.excerpt,
      date: document.publishedAt.replaceAll('-', '.'),
      to: `/posts/${document.slug}`,
      image: { ...document.image },
      featured: document.featured,
    }))
}
