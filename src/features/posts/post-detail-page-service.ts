import {
  buildAdjacentReference,
  buildReadingTimeText,
  buildRelatedPosts,
} from '@/features/posts/article-derived-data'
import {
  getAllArchivePosts,
  getMarkdownPostDocumentBySlug,
} from '@/features/posts/article-content-service'
import type { ArchivePost, PostDetailPageData } from '@/shared/types/content'

function getArchivePostBySlug(
  archivePosts: ArchivePost[],
  slug: string,
): ArchivePost {
  for (const archivePost of archivePosts) {
    if (archivePost.slug === slug) {
      return archivePost
    }
  }

  throw new Response('未找到对应文章。', {
    status: 404,
    statusText: '未找到对应文章。',
  })
}

export function getPostDetailPageContent(slug: string): PostDetailPageData {
  const archivePosts = getAllArchivePosts()
  const markdownPostDocument = getMarkdownPostDocumentBySlug(slug)

  if (!markdownPostDocument) {
    throw new Response('未找到对应文章。', {
      status: 404,
      statusText: '未找到对应文章。',
    })
  }

  const currentPost = getArchivePostBySlug(archivePosts, slug)
  const currentPostIndex = archivePosts.findIndex(
    (archivePost) => archivePost.slug === slug,
  )

  return {
    post: currentPost,
    markdownContent: markdownPostDocument.markdownContent,
    readingTimeText: buildReadingTimeText(markdownPostDocument.markdownContent),
    previousPost: buildAdjacentReference(archivePosts, currentPostIndex, -1),
    nextPost: buildAdjacentReference(archivePosts, currentPostIndex, 1),
    relatedPosts: buildRelatedPosts(archivePosts, currentPost),
  }
}
