import { getPostsArchivePageContent } from '@/features/posts/posts-page-service'
import type { PostsArchivePageData } from '@/shared/types/content'

/**
 * 文章归档页路由 loader。
 */
export function postsPageLoader(): PostsArchivePageData {
  return getPostsArchivePageContent()
}
