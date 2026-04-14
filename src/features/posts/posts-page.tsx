import { useEffect, useState, type ReactElement } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'

import { PostPreviewSheet } from '@/features/posts/components/post-preview-sheet'
import { PostsArchiveList } from '@/features/posts/components/posts-archive-list'
import { PostsSidebar } from '@/features/posts/components/posts-sidebar'
import { usePagefindPostSearch } from '@/features/posts/hooks/use-pagefind-post-search'
import { usePostsArchiveController } from '@/features/posts/hooks/use-posts-archive-controller'
import type { ArchivePost, PostsArchivePageData } from '@/shared/types/content'

function usePostsArchivePageData(): PostsArchivePageData {
  return useLoaderData() as PostsArchivePageData
}

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

export function PostsPage(): ReactElement {
  const pageData = usePostsArchivePageData()
  const [searchParams] = useSearchParams()
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const searchKeyword = searchParams.get('q')?.trim() ?? ''
  const pagefindSearch = usePagefindPostSearch(searchKeyword)
  const controller = usePostsArchiveController({
    posts: pageData.posts,
    tags: pageData.tags,
    pageSize: pageData.pageSize,
    rankedSearchSlugs: pagefindSearch.isUsingPagefind
      ? pagefindSearch.matchedPostSlugs
      : null,
  })
  const selectedPost = getSelectedPost(pageData.posts, selectedPostSlug)

  function openPostPreview(post: ArchivePost): void {
    setSelectedPostSlug(post.slug)
    setPreviewOpen(true)
  }

  function handlePreviewSheetOpenChange(nextOpen: boolean): void {
    setPreviewOpen(nextOpen)
  }

  useEffect(() => {
    if (previewOpen || !selectedPostSlug) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSelectedPostSlug(null)
    }, 260)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [previewOpen, selectedPostSlug])

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
          pagefindSearchResults={pagefindSearch.results}
          pagefindSearchMode={pagefindSearch.mode}
          pagefindSearchErrorMessage={pagefindSearch.errorMessage}
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
        open={previewOpen}
        onOpenChange={handlePreviewSheetOpenChange}
      />
    </>
  )
}
