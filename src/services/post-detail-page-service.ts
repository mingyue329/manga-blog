import { postsArchivePageContent } from '@/data/posts-page-content'
import { requestJson } from '@/services/api-client'
import type {
  ArchivePost,
  PostDetailPageData,
  PostReference,
} from '@/types/content'

const POST_DETAIL_ENDPOINT = '/posts'
const LOCAL_POST_DETAIL_CONTENT_FLAG = 'VITE_USE_LOCAL_POST_DETAIL_CONTENT'
const articleMarkdownDocuments = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * 从 Markdown 模块路径中提取文章 slug。
 * 这样内容文件只需要按“slug.md”命名，就能自动和路由、数据层建立映射关系。
 */
function getMarkdownSlugFromModulePath(modulePath: string): string {
  const pathSegments = modulePath.split('/')
  const fileName = pathSegments[pathSegments.length - 1] ?? ''

  return fileName.replace(/\.md$/u, '')
}

/**
 * 根据文章 slug 读取本地 Markdown 文档内容。
 * 如果未来把内容迁移到 CMS 或后端接口，这里就是最自然的替换点。
 */
function getMarkdownContentBySlug(slug: string): string | null {
  for (const [modulePath, markdownContent] of Object.entries(
    articleMarkdownDocuments,
  )) {
    if (getMarkdownSlugFromModulePath(modulePath) === slug) {
      return markdownContent
    }
  }

  return null
}

/**
 * 为还没有独立 Markdown 文件的文章生成兜底正文。
 * 这样即使内容团队暂时只维护了摘要和预览分节，详情页依然可以稳定渲染。
 */
function buildFallbackMarkdown(post: ArchivePost): string {
  const markdownLines: string[] = [
    `## 开场`,
    '',
    post.excerpt,
    '',
  ]

  for (const previewSection of post.previewSections) {
    markdownLines.push(`## ${previewSection.heading}`)
    markdownLines.push('')
    markdownLines.push(previewSection.content)
    markdownLines.push('')
  }

  markdownLines.push('## 延伸阅读')
  markdownLines.push('')
  markdownLines.push(
    '这篇文章当前还没有独立维护的 Markdown 文档，因此详情页正文由摘要和分节内容自动拼接生成。',
  )

  return markdownLines.join('\n')
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
    to: `/posts/${post.slug}`,
  }
}

/**
 * 在本地文章列表中查找目标文章。
 * 如果 slug 无效，这里直接抛出 404 响应，让路由错误边界按“未找到页面”的方式处理。
 */
function getArchivePostBySlug(slug: string): ArchivePost {
  for (const post of postsArchivePageContent.posts) {
    if (post.slug === slug) {
      return structuredClone(post)
    }
  }

  throw new Response('未找到对应文章。', {
    status: 404,
    statusText: '未找到对应文章。',
  })
}

/**
 * 按当前位置读取相邻文章。
 * 详情页底部的上一篇 / 下一篇导航只依赖列表顺序，因此用偏移量读取最直观。
 */
function buildAdjacentReference(
  posts: ArchivePost[],
  currentPostIndex: number,
  offset: number,
): PostReference | null {
  const targetPost = posts[currentPostIndex + offset]

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
 * 排序规则优先看标签重合度，其次保留原始列表顺序，保证结果既相关又稳定。
 */
function buildRelatedPosts(
  posts: ArchivePost[],
  currentPost: ArchivePost,
): PostReference[] {
  const scoredPosts: Array<{ post: ArchivePost; score: number; order: number }> = []

  for (let index = 0; index < posts.length; index += 1) {
    const post = posts[index]

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
 * 从本地静态内容中组装文章详情页数据。
 * 当前实现把“列表摘要”和“Markdown 正文”合并在 service 层，页面层就只负责渲染。
 */
function getLocalPostDetailPageContent(slug: string): PostDetailPageData {
  const currentPost = getArchivePostBySlug(slug)
  const markdownContent =
    getMarkdownContentBySlug(slug) ?? buildFallbackMarkdown(currentPost)
  const currentPostIndex = postsArchivePageContent.posts.findIndex(
    (post) => post.slug === slug,
  )

  return {
    post: currentPost,
    markdownContent,
    readingTimeText: getReadingTimeText(markdownContent),
    previousPost: buildAdjacentReference(
      postsArchivePageContent.posts,
      currentPostIndex,
      -1,
    ),
    nextPost: buildAdjacentReference(
      postsArchivePageContent.posts,
      currentPostIndex,
      1,
    ),
    relatedPosts: buildRelatedPosts(postsArchivePageContent.posts, currentPost),
  }
}

/**
 * 获取文章详情页数据。
 * 默认优先走本地 Markdown 和静态摘要；当环境变量关闭时，再切换到真实接口。
 */
export async function getPostDetailPageContent(
  slug: string,
): Promise<PostDetailPageData> {
  if (import.meta.env[LOCAL_POST_DETAIL_CONTENT_FLAG] !== 'false') {
    return getLocalPostDetailPageContent(slug)
  }

  return requestJson<PostDetailPageData>(`${POST_DETAIL_ENDPOINT}/${slug}`)
}
