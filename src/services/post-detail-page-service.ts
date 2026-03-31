import {
  getAllArchivePosts,
  getMarkdownPostDocumentBySlug,
} from '@/services/article-content-service'
import { requestJson } from '@/services/api-client'
import type {
  ArchivePost,
  PostDetailPageData,
  PostReference,
} from '@/types/content'

const POST_DETAIL_ENDPOINT = '/posts'
const LOCAL_POST_DETAIL_CONTENT_FLAG = 'VITE_USE_LOCAL_POST_DETAIL_CONTENT'

/**
 * 在归档文章列表中查找当前文章。
 * 详情页需要卡片摘要信息和正文内容两套数据，因此这里从统一文章集合中取出对应的归档模型。
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
 * 估算文章的可读字符量。
 * 中文文章不能只按空格拆词，因此这里把英文单词数量和中文字符数量合并计算，让阅读时长更接近真实体验。
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
 * 这里不追求学术级精确，而是给用户一个稳定、可预期的阅读预估。
 */
function getReadingTimeText(markdownContent: string): string {
  const readableUnitCount = getReadableUnitCount(markdownContent)
  const minutes = Math.max(1, Math.ceil(readableUnitCount / 280))

  return `${minutes} 分钟阅读`
}

/**
 * 把归档文章转换成详情页导航区域可复用的摘要对象。
 * 统一的摘要类型可以让上一篇、下一篇和相关文章卡片共用同一套渲染逻辑。
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
 * 详情页底部的上一篇 / 下一篇导航只依赖统一文章排序，因此用偏移量读取最直观。
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
 * 相关文章推荐优先参考标签交集，这比单纯按列表顺序更符合读者继续阅读的直觉。
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
 * 生成详情页右侧和底部使用的相关文章列表。
 * 排序规则优先看标签重合度，其次保留统一文章源中的原始顺序，保证结果既相关又稳定。
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
 * 从统一 Markdown 内容源中组装文章详情页数据。
 * 列表页与详情页现在共用同一批文章文档，service 层只负责把正文和导航关系拼装成页面需要的结构。
 */
function getLocalPostDetailPageContent(slug: string): PostDetailPageData {
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

/**
 * 获取文章详情页数据。
 * 默认优先走统一 Markdown 内容源；当环境变量关闭时，再切换到真实接口。
 */
export async function getPostDetailPageContent(
  slug: string,
): Promise<PostDetailPageData> {
  if (import.meta.env[LOCAL_POST_DETAIL_CONTENT_FLAG] !== 'false') {
    return getLocalPostDetailPageContent(slug)
  }

  return requestJson<PostDetailPageData>(`${POST_DETAIL_ENDPOINT}/${slug}`)
}
