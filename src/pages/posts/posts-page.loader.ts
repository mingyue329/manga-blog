import { getPostsArchivePageContent } from '@/services/posts-page-service'
import type { PostsArchivePageData } from '@/types/content'

/**
 * 文章归档页路由 loader。
 */
export async function postsPageLoader(): Promise<PostsArchivePageData> {
  return getPostsArchivePageContent()
}
