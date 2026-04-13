import {
  getAllArchivePosts,
  getMarkdownPostDocumentBySlug,
} from '@/features/posts/article-content-service'
import type {
  ArchivePost,
  PostDetailPageData,
  PostReference,
} from '@/shared/types/content'

/**
 * 在归档文章列表中查找当前文章。
 * 详情页既需要摘要信息，也需要正文内容，所以这里先把摘要模型定位出来。
 */
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

/**
 * 估算文章的可读字数。
 * 中文和英文的计数方式不同，所以这里统一换算成一个近似的阅读单位数。
 */
function getReadableUnitCount(markdownContent: string): number {
  const markdownWithoutCodeFence = markdownContent
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`[^`]+`/gu, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[[^\]]+\]\([^)]*\)/gu, ' ')
    .replace(/[>#*_~|-]/gu, ' ')

  const latinWords = markdownWithoutCodeFence.match(/[A-Za-z0-9_]+/gu) ?? []
  const chineseCharacters =
    markdownWithoutCodeFence.match(/[\p{Script=Han}]/gu) ?? []

  return latinWords.length + chineseCharacters.length
}

/**
 * 根据正文内容生成阅读时长文案。
 */
function getReadingTimeText(markdownContent: string): string {
  const readableUnitCount = getReadableUnitCount(markdownContent)
  const minutes = Math.max(1, Math.ceil(readableUnitCount / 280))

  return `${minutes} 分钟阅读`
}

/**
 * 把归档文章转换成详情页可复用的跳转摘要。
 * 上一篇、下一篇和相关文章都复用这一个结构，避免页面层维护多套近似类型。
 */
function buildPostReference(post: ArchivePost): PostReference {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    categoryLabel: post.categoryLabel,
    tags: [...post.tags],
    image: { ...post.image },
    coverRatio: post.coverRatio,
    series: post.series,
    to: `/posts/${post.slug}`,
  }
}

/**
 * 按当前位置读取相邻文章。
 */
function buildAdjacentReference(
  archivePosts: ArchivePost[],
  currentPostIndex: number,
  offset: number,
): PostReference | null {
  const targetPost = archivePosts[currentPostIndex + offset]

  if (!targetPost) {
    return null
  }

  return buildPostReference(targetPost)
}

/**
 * 统计两篇文章的标签重合度。
 * 相关文章优先按内容相似度推荐，而不是简单取列表里的下一篇。
 */
function countSharedTags(currentPost: ArchivePost, nextPost: ArchivePost): number {
  let sharedTagCount = 0

  for (const currentTag of currentPost.tags) {
    for (const nextTag of nextPost.tags) {
      if (currentTag === nextTag) {
        sharedTagCount += 1
      }
    }
  }

  return sharedTagCount
}

/**
 * 生成详情页使用的相关文章列表。
 * 排序时优先看标签重合度，分数相同时保留原始发布时间顺序。
 */
function buildRelatedPosts(
  archivePosts: ArchivePost[],
  currentPost: ArchivePost,
): PostReference[] {
  const scoredPosts: Array<{ post: ArchivePost; score: number; order: number }> = []

  for (let index = 0; index < archivePosts.length; index += 1) {
    const post = archivePosts[index]

    if (post.slug === currentPost.slug) {
      continue
    }

    scoredPosts.push({
      post,
      score: countSharedTags(currentPost, post),
      order: index,
    })
  }

  scoredPosts.sort((leftPost, rightPost) => {
    if (rightPost.score !== leftPost.score) {
      return rightPost.score - leftPost.score
    }

    return leftPost.order - rightPost.order
  })

  const relatedPosts: PostReference[] = []

  for (let index = 0; index < scoredPosts.length && index < 3; index += 1) {
    relatedPosts.push(buildPostReference(scoredPosts[index].post))
  }

  return relatedPosts
}

/**
 * 从统一的 Markdown 内容源中组装详情页数据。
 * 列表页和详情页共享同一套文章内容，因此这里专门负责把正文、相邻文章和相关文章拼起来。
 */
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
    readingTimeText: getReadingTimeText(markdownPostDocument.markdownContent),
    previousPost: buildAdjacentReference(archivePosts, currentPostIndex, -1),
    nextPost: buildAdjacentReference(archivePosts, currentPostIndex, 1),
    relatedPosts: buildRelatedPosts(archivePosts, currentPost),
  }
}
