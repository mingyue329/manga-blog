import type { ReactElement } from 'react'
import { ArrowRight, Sparkles, Stars } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ArchivePost } from '@/types/content'

interface PostsArchiveListProps {
  posts: ArchivePost[]
  resultCount: number
  currentPage: number
  totalPages: number
  onOpenPreview: (post: ArchivePost) => void
  onPageChange: (nextPage: number) => void
}

/**
 * 渲染归档页头部。
 */
function renderArchiveHeader(resultCount: number): ReactElement {
  return (
    <header className="relative mb-12">
      <h1 className="mb-4 font-heading text-6xl font-black uppercase italic leading-none tracking-tight md:text-8xl">
        博文归档
        <br />
        <span className="mt-2 inline-block bg-black px-4 py-1 text-2xl not-italic text-white md:text-4xl">
          ARCHIVE.2024
        </span>
      </h1>
      <div className="absolute right-0 top-0 hidden md:block text-black/18">
        <div className="mb-2 flex gap-1">
          <Stars className="size-8" />
          <Sparkles className="size-8" />
        </div>
        <div className="h-1 w-48 bg-black" />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-black/55">
        当前结果：{resultCount} 篇
      </p>
    </header>
  )
}

/**
 * 渲染单篇文章卡片。
 * 卡片现在同时支持“阅读全文”和“快速预览”两种路径，这样既补上真实详情页，又保留原来的轻量浏览方式。
 */
function renderArchivePostCard(
  post: ArchivePost,
  onOpenPreview: (post: ArchivePost) => void,
): ReactElement {
  return (
    <article
      key={post.slug}
      className="group relative flex flex-col gap-8 md:flex-row md:items-start"
    >
      <Card
        className={cn(
          'w-full shrink-0 overflow-hidden border-4 border-black bg-white py-0 transition-all duration-300 group-hover:shadow-[12px_12px_0_0_#111111] md:w-80',
          post.imageSide === 'right' ? 'md:order-last' : '',
        )}
      >
        <CardContent className="relative aspect-[4/3] p-0">
          <img
            src={post.image.src}
            alt={post.image.alt}
            className="h-full w-full object-cover grayscale contrast-125"
            loading="lazy"
          />
          <div className="manga-halftone absolute inset-0 opacity-15 transition-opacity group-hover:opacity-5" />
        </CardContent>
      </Card>

      <div className="flex-1 pt-2">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="ink">{post.date}</Badge>
          <Badge variant="outlineInk">{post.categoryLabel}</Badge>
        </div>
        <h2 className="mb-4 font-heading text-3xl font-black tracking-tight transition-transform group-hover:translate-x-1 md:text-4xl">
          {post.title}
        </h2>
        <p className="mb-6 text-lg leading-8 text-black/70">{post.excerpt}</p>
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span
              key={`${post.slug}-${tag}`}
              className="text-xs font-black uppercase tracking-[0.16em] text-black/40"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button asChild variant="ink" size="sm">
            <Link to={`/posts/${post.slug}`}>
              阅读全文
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0"
            onClick={() => onOpenPreview(post)}
          >
            快速预览
          </Button>
        </div>
      </div>
    </article>
  )
}

/**
 * 渲染文章卡片列表。
 */
function renderArchivePostCards(
  posts: ArchivePost[],
  onOpenPreview: (post: ArchivePost) => void,
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const post of posts) {
    elements.push(renderArchivePostCard(post, onOpenPreview))
  }

  return elements
}

/**
 * 渲染分页器。
 */
function renderPagination(
  currentPage: number,
  totalPages: number,
  onPageChange: (nextPage: number) => void,
): ReactElement | null {
  if (totalPages <= 1) {
    return null
  }

  const pageButtons: ReactElement[] = []

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    pageButtons.push(
      <Button
        key={pageNumber}
        type="button"
        variant={pageNumber === currentPage ? 'ink' : 'outlineInk'}
        size="icon"
        className="size-12"
        onClick={() => onPageChange(pageNumber)}
      >
        {pageNumber}
      </Button>,
    )
  }

  return (
    <div className="mt-16 flex flex-wrap justify-center gap-3">
      {pageButtons}
      {currentPage < totalPages ? (
        <Button
          type="button"
          variant="outlineInk"
          size="default"
          onClick={() => onPageChange(currentPage + 1)}
        >
          NEXT
        </Button>
      ) : null}
    </div>
  )
}

/**
 * 渲染归档为空时的兜底界面。
 */
function renderEmptyState(): ReactElement {
  return (
    <Card className="border-4 border-black bg-white py-0 manga-panel">
      <CardContent className="space-y-4 p-8">
        <Badge variant="ink">EMPTY</Badge>
        <h2 className="font-heading text-3xl font-black">没有找到匹配的文章</h2>
        <p className="max-w-2xl text-base leading-8 text-black/70">
          可以尝试清空搜索词，或者切换其他标签。这里保留了后续接真实文章接口和排序能力的空间。
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * 渲染文章归档主列表。
 */
export function PostsArchiveList({
  posts,
  resultCount,
  currentPage,
  totalPages,
  onOpenPreview,
  onPageChange,
}: PostsArchiveListProps): ReactElement {
  return (
    <section>
      {renderArchiveHeader(resultCount)}
      {posts.length === 0 ? renderEmptyState() : null}
      {posts.length > 0 ? (
        <div className="relative space-y-16">
          <div className="absolute -left-20 top-28 hidden xl:block pointer-events-none">
            <div className="mb-4 h-0.5 w-32 bg-black/30" />
            <div className="mb-4 h-0.5 w-48 bg-black/30" />
            <div className="mb-4 h-0.5 w-24 bg-black/30" />
          </div>
          {renderArchivePostCards(posts, onOpenPreview)}
        </div>
      ) : null}
      {renderPagination(currentPage, totalPages, onPageChange)}
    </section>
  )
}
