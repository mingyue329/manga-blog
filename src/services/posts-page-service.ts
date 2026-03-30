import { postsArchivePageContent } from '@/data/posts-page-content'
import { requestJson } from '@/services/api-client'
import type { PostsArchivePageData } from '@/types/content'

const POSTS_ARCHIVE_ENDPOINT = '/posts'

/**
 * 获取文章归档页数据。
 * 当前先走本地静态内容，后续可切换为接口数据。
 */
export async function getPostsArchivePageContent(): Promise<PostsArchivePageData> {
  if (import.meta.env.VITE_USE_LOCAL_POSTS_CONTENT !== 'false') {
    return structuredClone(postsArchivePageContent)
  }

  return requestJson<PostsArchivePageData>(POSTS_ARCHIVE_ENDPOINT)
}
