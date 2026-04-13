import { useSearchParams } from 'react-router-dom'

import type { ArchivePost } from '@/shared/types/content'

const DEFAULT_PAGE_NUMBER = 1
const ALL_TAG_FILTER = '全部'

interface UsePostsArchiveControllerOptions {
  posts: ArchivePost[]
  tags: string[]
  pageSize: number
}

/**
 * 规范化搜索关键词。
 * 把 null、undefined 或多余空格统一收敛成可比较的字符串，避免过滤逻辑分散处理边界值。
 */
function normalizeSearchKeyword(keyword: string | null): string {
  return keyword?.trim() ?? ''
}

/**
 * 规范化标签筛选值。
 * 如果 URL 里的 tag 不是可用标签，就自动回退到“全部”。
 */
function normalizeTagFilter(tag: string | null, tags: string[]): string {
  if (!tag) {
    return ALL_TAG_FILTER
  }

  return tags.includes(tag) ? tag : ALL_TAG_FILTER
}

/**
 * 解析当前页码。
 * 只允许大于等于 1 的整数页码，非法值会回退到默认页。
 */
function parsePageNumber(pageValue: string | null): number {
  const parsedPageNumber = Number(pageValue)

  if (!Number.isInteger(parsedPageNumber) || parsedPageNumber < 1) {
    return DEFAULT_PAGE_NUMBER
  }

  return parsedPageNumber
}

/**
 * 判断文章是否命中关键词搜索。
 * 搜索范围包括标题、摘要、作者、系列、标签和分类，便于用自然语言快速缩小结果。
 */
function matchesSearchKeyword(post: ArchivePost, keyword: string): boolean {
  if (!keyword) {
    return true
  }

  const normalizedKeyword = keyword.toLowerCase()
  const searchableText = [
    post.title,
    post.excerpt,
    post.author,
    post.series ?? '',
    post.categoryLabel,
    ...post.tags,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalizedKeyword)
}

/**
 * 判断文章是否命中标签筛选。
 */
function matchesTagFilter(post: ArchivePost, activeTag: string): boolean {
  if (activeTag === ALL_TAG_FILTER) {
    return true
  }

  return post.tags.includes(activeTag)
}

/**
 * 根据搜索词和标签筛选文章。
 */
function filterArchivePosts(
  posts: ArchivePost[],
  keyword: string,
  activeTag: string,
): ArchivePost[] {
  const filteredPosts: ArchivePost[] = []

  for (const post of posts) {
    if (!matchesSearchKeyword(post, keyword)) {
      continue
    }

    if (!matchesTagFilter(post, activeTag)) {
      continue
    }

    filteredPosts.push(post)
  }

  return filteredPosts
}

/**
 * 计算合法页码。
 * 当筛选结果变少时，URL 里的旧页码可能越界，这里负责把它夹回有效范围。
 */
function clampPageNumber(pageNumber: number, totalPages: number): number {
  if (pageNumber > totalPages) {
    return totalPages
  }

  return pageNumber
}

/**
 * 对文章列表进行分页切片。
 */
function slicePostsByPage(
  posts: ArchivePost[],
  currentPage: number,
  pageSize: number,
): ArchivePost[] {
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  return posts.slice(startIndex, endIndex)
}

/**
 * 生成下一次要写回 URL 的查询参数。
 * 把查询参数逻辑集中到一个函数里，方便后续继续追加排序或视图模式。
 */
function buildNextSearchParams(
  currentSearchParams: URLSearchParams,
  patch: {
    keyword?: string | null
    tag?: string | null
    page?: number | null
  },
): URLSearchParams {
  const nextSearchParams = new URLSearchParams(currentSearchParams)

  if (patch.keyword !== undefined) {
    if (patch.keyword) {
      nextSearchParams.set('q', patch.keyword)
    } else {
      nextSearchParams.delete('q')
    }
  }

  if (patch.tag !== undefined) {
    if (patch.tag && patch.tag !== ALL_TAG_FILTER) {
      nextSearchParams.set('tag', patch.tag)
    } else {
      nextSearchParams.delete('tag')
    }
  }

  if (patch.page !== undefined) {
    if (patch.page && patch.page > 1) {
      nextSearchParams.set('page', String(patch.page))
    } else {
      nextSearchParams.delete('page')
    }
  }

  return nextSearchParams
}

/**
 * 归档页控制器。
 * 负责把 URL 查询参数转成搜索、筛选和分页状态，并把用户操作重新写回 URL。
 */
export function usePostsArchiveController({
  posts,
  tags,
  pageSize,
}: UsePostsArchiveControllerOptions) {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchKeyword = normalizeSearchKeyword(searchParams.get('q'))
  const activeTag = normalizeTagFilter(searchParams.get('tag'), tags)
  const requestedPage = parsePageNumber(searchParams.get('page'))
  const filteredPosts = filterArchivePosts(posts, searchKeyword, activeTag)
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize))
  const currentPage = clampPageNumber(requestedPage, totalPages)
  const visiblePosts = slicePostsByPage(filteredPosts, currentPage, pageSize)

  /**
   * 更新搜索关键词。
   * 关键词变化时会自动回到第一页，防止旧页码导致结果空白。
   */
  function updateSearchKeyword(nextKeyword: string): void {
    const nextSearchParams = buildNextSearchParams(searchParams, {
      keyword: normalizeSearchKeyword(nextKeyword),
      page: DEFAULT_PAGE_NUMBER,
    })

    setSearchParams(nextSearchParams)
  }

  /**
   * 更新当前标签筛选。
   */
  function updateActiveTag(nextTag: string): void {
    const nextSearchParams = buildNextSearchParams(searchParams, {
      tag: nextTag,
      page: DEFAULT_PAGE_NUMBER,
    })

    setSearchParams(nextSearchParams)
  }

  /**
   * 更新当前页码。
   */
  function updatePage(nextPage: number): void {
    const nextSearchParams = buildNextSearchParams(searchParams, {
      page: nextPage,
    })

    setSearchParams(nextSearchParams)
  }

  return {
    searchKeyword,
    activeTag,
    currentPage,
    totalPages,
    visiblePosts,
    resultCount: filteredPosts.length,
    updateSearchKeyword,
    updateActiveTag,
    updatePage,
    allTagFilter: ALL_TAG_FILTER,
  }
}
