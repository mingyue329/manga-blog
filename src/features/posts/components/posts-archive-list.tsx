import type { ReactElement } from 'react'
import { ArrowRight, Sparkles, Stars } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getPostCoverRatioClass } from '@/shared/lib/post-cover-ratio'
import { useGsapHoverPreviewCard } from '@/shared/lib/use-gsap-hover-preview-card'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import type { ArchivePost } from '@/shared/types/content'

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
      <h1 className="mb-4 font-heading text-5xl font-black uppercase italic leading-none tracking-tight md:text-7xl">
        文章归档
        <br />
        <span className="theme-surface-ink mt-2 inline-block px-4 py-1 text-2xl not-italic md:text-4xl">
          ARCHIVE.2024
        </span>
      </h1>
      <div className="theme-text-faint absolute right-0 top-0 hidden md:block">
        <div className="mb-2 flex gap-1">
          <Stars className="size-8" />
          <Sparkles className="size-8" />
        </div>
        <div className="theme-surface-ink h-1 w-48" />
      </div>
      <p className="theme-text-muted text-sm font-bold uppercase tracking-[0.18em]">
        {`当前结果：${resultCount} 篇`}
      </p>
    </header>
  )
}

/**
 * 渲染文章卡片下方的补充信息。
 */
function renderPostMetaLine(post: ArchivePost): ReactElement {
  return (
    <div className="theme-text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-black uppercase tracking-[0.16em]">
      <span>By {post.author}</span>
      <span>Cover {post.coverRatio}</span>
      <span>{post.series ? `Series ${post.series}` : 'Series 单篇文章'}</span>
    </div>
  )
}

function ArchivePostCard({
  post,
  onOpenPreview,
}: {
  post: ArchivePost
  onOpenPreview: (post: ArchivePost) => void
}): ReactElement {
  const { triggerRef, cardRef, shadowRef, imageRef, overlayRef } =
    useGsapHoverPreviewCard()

  return (
    <article className="group relative flex flex-col gap-8 md:flex-row md:items-start">
      <div
        ref={triggerRef}
        className={cn(
          'relative w-full shrink-0 md:w-80',
          post.imageSide === 'right' ? 'md:order-last' : '',
        )}
      >
        <div
          ref={shadowRef}
          className="pointer-events-none absolute inset-0 z-0 theme-surface-ink theme-border-strong border-4"
        />
        <Card
          ref={cardRef}
          className="manga-panel-hover theme-surface-panel theme-border-strong relative z-10 w-full overflow-hidden border-4 py-0"
        >
          <CardContent
            className={cn(
              'manga-preview-media p-0',
              getPostCoverRatioClass(post.coverRatio),
            )}
          >
            <div
              ref={overlayRef}
              className="pointer-events-none absolute inset-0 bg-[var(--preview-image-overlay)]"
            />
            <img
              ref={imageRef}
              src={post.image.src}
              alt={post.image.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 pt-2">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="ink">{post.date}</Badge>
          <Badge variant="outlineInk">{post.categoryLabel}</Badge>
          {post.featured ? <Badge variant="outlineInk">推荐</Badge> : null}
        </div>
        <h2 className="mb-4 font-heading text-3xl font-black tracking-tight md:text-4xl">
          {post.title}
        </h2>
        <p className="theme-text-soft mb-6 text-lg leading-8">{post.excerpt}</p>
        <div className="mb-5">{renderPostMetaLine(post)}</div>
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span
              key={`${post.slug}-${tag}`}
              className="theme-text-faint text-xs font-black uppercase tracking-[0.16em]"
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
    elements.push(
      <ArchivePostCard
        key={post.slug}
        post={post}
        onOpenPreview={onOpenPreview}
      />,
    )
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
    <Card className="theme-surface-panel theme-border-strong border-4 py-0 manga-panel">
      <CardContent className="space-y-4 p-8">
        <Badge variant="ink">EMPTY</Badge>
        <h2 className="font-heading text-3xl font-black">没有找到匹配的文章</h2>
        <p className="theme-text-soft max-w-2xl text-base leading-8">
          可以尝试清空搜索词，或者切换其他标签。这里保留了后续接入真实内容源和排序能力的空间。
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
          <div className="pointer-events-none absolute -left-20 top-28 hidden xl:block">
            <div className="mb-4 h-0.5 w-32 bg-[var(--line-soft)]" />
            <div className="mb-4 h-0.5 w-48 bg-[var(--line-soft)]" />
            <div className="mb-4 h-0.5 w-24 bg-[var(--line-soft)]" />
          </div>
          {renderArchivePostCards(posts, onOpenPreview)}
        </div>
      ) : null}
      {renderPagination(currentPage, totalPages, onPageChange)}
    </section>
  )
}
