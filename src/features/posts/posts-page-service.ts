import {
  getAllArchivePosts,
  getAllArticleTags,
} from '@/features/posts/article-content-service'
import { postsArchivePageContent } from '@/features/posts/posts-page-content'
import type { PostsArchivePageData } from '@/shared/types/content'

/**
 * 组装文章归档页数据。
 * 文章卡片和标签都由统一的 Markdown 内容源派生，页面层不再关心这些细节。
 */
export function getPostsArchivePageContent(): PostsArchivePageData {
  return {
    ...structuredClone(postsArchivePageContent),
    tags: getAllArticleTags(),
    posts: getAllArchivePosts(),
  }
}
