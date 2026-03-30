import type { ReactElement } from 'react'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import { PostPreviewSheet } from '@/components/posts/post-preview-sheet'
import { PostsArchiveList } from '@/components/posts/posts-archive-list'
import { PostsSidebar } from '@/components/posts/posts-sidebar'
import { usePostsArchiveController } from '@/hooks/use-posts-archive-controller'
import type { ArchivePost, PostsArchivePageData } from '@/types/content'

/**
 * 读取文章归档页预加载数据。
 */
function usePostsArchivePageData(): PostsArchivePageData {
  return useLoaderData() as PostsArchivePageData
}

/**
 * 根据当前选中的 slug 查找文章。
 * 保持这层查找逻辑单独存在，可以让页面状态和内容数据解耦。
 */
function getSelectedPost(
  posts: ArchivePost[],
  selectedPostSlug: string | null,
): ArchivePost | null {
  if (!selectedPostSlug) {
    return null
  }

  for (const post of posts) {
    if (post.slug === selectedPostSlug) {
      return post
    }
  }

  return null
}

/**
 * 文章归档页页面组件。
 */
export function PostsPage(): ReactElement {
  const pageData = usePostsArchivePageData()
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null)
  const controller = usePostsArchiveController({
    posts: pageData.posts,
    tags: pageData.tags,
    pageSize: pageData.pageSize,
  })
  const selectedPost = getSelectedPost(pageData.posts, selectedPostSlug)

  /**
   * 打开文章预览抽屉。
   */
  function openPostPreview(post: ArchivePost): void {
    setSelectedPostSlug(post.slug)
  }

  /**
   * 处理预览抽屉开关。
   * 当抽屉关闭时，顺手清空当前选中的文章，避免下次打开时状态混乱。
   */
  function handlePreviewSheetOpenChange(nextOpen: boolean): void {
    if (!nextOpen) {
      setSelectedPostSlug(null)
    }
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
        <PostsSidebar
          searchPlaceholder={pageData.searchPlaceholder}
          searchKeyword={controller.searchKeyword}
          activeTag={controller.activeTag}
          tagsTitle={pageData.tagsTitle}
          tags={pageData.tags}
          allTagFilter={controller.allTagFilter}
          hallOfFameTitle={pageData.hallOfFameTitle}
          hallOfFameMembers={pageData.hallOfFameMembers}
          onSearchKeywordChange={controller.updateSearchKeyword}
          onTagChange={controller.updateActiveTag}
        />
        <PostsArchiveList
          posts={controller.visiblePosts}
          resultCount={controller.resultCount}
          currentPage={controller.currentPage}
          totalPages={controller.totalPages}
          onOpenPreview={openPostPreview}
          onPageChange={controller.updatePage}
        />
      </div>
      <PostPreviewSheet
        post={selectedPost}
        open={selectedPost !== null}
        onOpenChange={handlePreviewSheetOpenChange}
      />
    </>
  )
}
