import type { ReactElement } from 'react'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import { PostPreviewSheet } from '@/features/posts/components/post-preview-sheet'
import { PostsArchiveList } from '@/features/posts/components/posts-archive-list'
import { PostsSidebar } from '@/features/posts/components/posts-sidebar'
import { usePostsArchiveController } from '@/features/posts/hooks/use-posts-archive-controller'
import type { ArchivePost, PostsArchivePageData } from '@/shared/types/content'

/**
 * 璇诲彇鏂囩珷褰掓。椤甸鍔犺浇鏁版嵁銆? */
function usePostsArchivePageData(): PostsArchivePageData {
  return useLoaderData() as PostsArchivePageData
}

/**
 * 鏍规嵁褰撳墠閫変腑鐨?slug 鏌ユ壘鏂囩珷銆? * 淇濇寔杩欏眰鏌ユ壘閫昏緫鍗曠嫭瀛樺湪锛屽彲浠ヨ椤甸潰鐘舵€佸拰鍐呭鏁版嵁瑙ｈ€︺€? */
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
 * 鏂囩珷褰掓。椤甸〉闈㈢粍浠躲€? */
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
   * 鎵撳紑鏂囩珷棰勮鎶藉眽銆?   */
  function openPostPreview(post: ArchivePost): void {
    setSelectedPostSlug(post.slug)
  }

  /**
   * 澶勭悊棰勮鎶藉眽寮€鍏炽€?   * 褰撴娊灞夊叧闂椂锛岄『鎵嬫竻绌哄綋鍓嶉€変腑鐨勬枃绔狅紝閬垮厤涓嬫鎵撳紑鏃剁姸鎬佹贩涔便€?   */
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

