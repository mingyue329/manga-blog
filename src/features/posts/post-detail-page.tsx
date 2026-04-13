import type { ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Clock3,
  Sparkles,
  Tags,
} from 'lucide-react'
import { Link, useLoaderData } from 'react-router-dom'

import { PostMarkdown } from '@/features/posts/components/post-markdown'
import { getPostCoverRatioClass } from '@/shared/lib/post-cover-ratio'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import type {
  ArchivePost,
  PostDetailPageData,
  PostReference,
} from '@/shared/types/content'

interface ArticleMetaItem {
  label: string
  value: string
  icon: LucideIcon
}

/**
 * 读取文章详情页的 loader 数据。
 */
function usePostDetailPageData(): PostDetailPageData {
  return useLoaderData() as PostDetailPageData
}

/**
 * 渲染标签徽章。
 */
function renderTagBadges(tags: string[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const tag of tags) {
    elements.push(
      <Badge key={tag} variant="outlineInk">
        #{tag}
      </Badge>,
    )
  }

  return elements
}

/**
 * 渲染文章元信息卡片。
 */
function renderArticleMetaItems(metaItems: ArticleMetaItem[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const metaItem of metaItems) {
    const Icon = metaItem.icon

    elements.push(
      <div
        key={`${metaItem.label}-${metaItem.value}`}
        className="flex items-center gap-3 border-2 border-black bg-white px-4 py-3"
      >
        <span className="flex size-10 items-center justify-center border-2 border-black bg-secondary">
          <Icon className="size-4" />
        </span>
        <div className="space-y-1">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-black/48">
            {metaItem.label}
          </p>
          <p className="font-heading text-sm font-black uppercase tracking-[0.14em]">
            {metaItem.value}
          </p>
        </div>
      </div>,
    )
  }

  return elements
}

/**
 * 渲染“本章线索”列表。
 */
function renderStorySeedItems(post: ArchivePost): ReactElement[] {
  const elements: ReactElement[] = []

  for (let index = 0; index < post.previewSections.length; index += 1) {
    const previewSection = post.previewSections[index]

    elements.push(
      <li
        key={`${post.slug}-${previewSection.heading}`}
        className="flex gap-3 border-b-2 border-black/12 pb-3 last:border-b-0 last:pb-0"
      >
        <span className="font-heading text-sm font-black uppercase tracking-[0.18em] text-black/45">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-medium leading-7 text-black/72">
          {previewSection.heading}
        </span>
      </li>,
    )
  }

  return elements
}

/**
 * 渲染标题下方的摘要信息。
 */
function renderArticleSummaryLine(post: ArchivePost): ReactElement {
  const summaryParts = [
    `By ${post.author}`,
    post.series ? `Series ${post.series}` : 'Series 单篇文章',
    `Cover ${post.coverRatio}`,
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-black uppercase tracking-[0.16em] text-black/48">
      {summaryParts.map((summaryPart) => (
        <span key={summaryPart}>{summaryPart}</span>
      ))}
      {post.featured ? <Badge variant="outlineInk">精选文章</Badge> : null}
    </div>
  )
}

/**
 * 渲染文章右侧事实卡片。
 */
function renderArticleFactItems(post: ArchivePost): ReactElement[] {
  const factItems = [
    { label: 'Author', value: post.author },
    { label: 'Series', value: post.series ?? '独立篇章' },
    { label: 'Cover Ratio', value: post.coverRatio },
    { label: 'Featured', value: post.featured ? 'Yes' : 'No' },
  ]

  return factItems.map((factItem) => (
    <div
      key={`${factItem.label}-${factItem.value}`}
      className="border-2 border-black bg-white px-4 py-3"
    >
      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-black/48">
        {factItem.label}
      </p>
      <p className="mt-2 font-heading text-sm font-black uppercase tracking-[0.14em]">
        {factItem.value}
      </p>
    </div>
  ))
}

/**
 * 渲染上一篇或下一篇导航卡片。
 */
function renderPostNavigationCard(
  label: string,
  postReference: PostReference | null,
  direction: 'previous' | 'next',
): ReactElement | null {
  if (!postReference) {
    return null
  }

  const DirectionIcon = direction === 'previous' ? ArrowLeft : ArrowRight

  return (
    <Link to={postReference.to} className="group block h-full">
      <Card className="h-full border-4 border-black bg-white py-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0_0_#111111]">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="outlineInk">{label}</Badge>
            <DirectionIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
          <h3 className="font-heading text-2xl font-black leading-tight tracking-tight">
            {postReference.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-7 text-black/68">
            {postReference.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

/**
 * 渲染相关文章卡片。
 */
function renderRelatedPostCards(relatedPosts: PostReference[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const relatedPost of relatedPosts) {
    elements.push(
      <Link key={relatedPost.slug} to={relatedPost.to} className="group block h-full">
        <Card className="h-full overflow-hidden border-4 border-black bg-white py-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0_0_#111111]">
          <CardContent className="p-0">
            <div
              className={cn(
                'relative overflow-hidden border-b-4 border-black',
                getPostCoverRatioClass(relatedPost.coverRatio),
              )}
            >
              <img
                src={relatedPost.image.src}
                alt={relatedPost.image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="manga-halftone absolute inset-0 opacity-12" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="ink">{relatedPost.categoryLabel}</Badge>
                {relatedPost.series ? (
                  <Badge variant="outlineInk">{relatedPost.series}</Badge>
                ) : null}
                <span className="text-xs font-black uppercase tracking-[0.18em] text-black/42">
                  {relatedPost.date}
                </span>
              </div>
              <h3 className="font-heading text-2xl font-black leading-tight tracking-tight">
                {relatedPost.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-7 text-black/68">
                {relatedPost.excerpt}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>,
    )
  }

  return elements
}

/**
 * 文章详情页主组件。
 */
export function PostDetailPage(): ReactElement {
  const pageData = usePostDetailPageData()
  const articleMetaItems: ArticleMetaItem[] = [
    {
      label: '发布日期',
      value: pageData.post.date,
      icon: CalendarDays,
    },
    {
      label: '阅读时长',
      value: pageData.readingTimeText,
      icon: Clock3,
    },
    {
      label: '栏目分类',
      value: pageData.post.categoryLabel,
      icon: Bookmark,
    },
  ]

  return (
    <div className="space-y-16 md:space-y-20">
      <header className="relative space-y-8">
        <div className="absolute -left-8 -top-8 hidden size-20 border-4 border-black/18 bg-black/4 xl:block" />
        <div className="space-y-4">
          <p className="manga-label text-black/52">Article Detail // Markdown</p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="ink">{pageData.post.categoryLabel}</Badge>
            <Badge variant="outlineInk">{pageData.readingTimeText}</Badge>
          </div>
        </div>
        <div className="max-w-5xl space-y-5">
          <h1 className="font-heading text-5xl font-black leading-none tracking-tight md:text-7xl">
            {pageData.post.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-black/72 md:text-xl">
            {pageData.post.excerpt}
          </p>
          {renderArticleSummaryLine(pageData.post)}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {renderArticleMetaItems(articleMetaItems)}
        </div>
      </header>

      <section className="space-y-8">
        <Card className="overflow-hidden border-4 border-black bg-white py-0 manga-panel">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1.4fr)_320px]">
            <div
              className={cn(
                'relative overflow-hidden border-b-4 border-black lg:aspect-auto lg:border-r-4 lg:border-b-0',
                getPostCoverRatioClass(pageData.post.coverRatio),
              )}
            >
              <img
                src={pageData.post.image.src}
                alt={pageData.post.image.alt}
                className="h-full w-full object-cover"
              />
              <div className="manga-halftone absolute inset-0 opacity-12" />
              <div className="absolute right-5 top-5 border-4 border-black bg-white px-4 py-2 font-heading text-sm font-black uppercase tracking-[0.18em]">
                Detail Panel
              </div>
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <div className="space-y-3">
                <p className="manga-label text-black/45">Story Seeds</p>
                <h2 className="font-heading text-3xl font-black tracking-tight">
                  本章线索
                </h2>
                <p className="text-sm leading-7 text-black/68">
                  这里延续归档页里的分节信息，让读者先知道文章会聊什么，再进入下面的 Markdown 正文。
                </p>
              </div>
              <ul className="space-y-4">{renderStorySeedItems(pageData.post)}</ul>
              <div className="grid gap-3 sm:grid-cols-2">
                {renderArticleFactItems(pageData.post)}
              </div>
              <div className="border-4 border-black bg-secondary px-5 py-4">
                <p className="text-sm font-bold leading-7 text-black/80">
                  “详情页延续全站的黑白漫画科技风，但把阅读节奏放在第一位，让图像、信息卡片和正文各自承担明确职责。”
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-10">
          <Card className="mx-auto w-full max-w-3xl border-4 border-black bg-white py-0 manga-panel">
            <CardContent className="space-y-8 p-8 md:p-12">
              <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                <Sparkles className="size-5" />
                <p className="font-heading text-xl font-black uppercase tracking-[0.12em]">
                  Markdown Manuscript
                </p>
              </div>
              <PostMarkdown markdownContent={pageData.markdownContent} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {renderPostNavigationCard('上一篇', pageData.previousPost, 'previous')}
            {renderPostNavigationCard('下一篇', pageData.nextPost, 'next')}
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-32 xl:self-start">
          <Card className="border-4 border-black bg-white py-0">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <Tags className="size-4" />
                <p className="font-heading text-xl font-black uppercase tracking-[0.14em]">
                  标签索引
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {renderTagBadges(pageData.post.tags)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-white py-0">
            <CardContent className="space-y-5 p-6">
              <p className="font-heading text-xl font-black uppercase tracking-[0.14em]">
                阅读动作
              </p>
              <div className="space-y-3">
                <Button asChild variant="ink" size="lg" className="w-full">
                  <Link to="/posts">
                    <ArrowLeft className="size-4" />
                    返回文章列表
                  </Link>
                </Button>
                {pageData.nextPost ? (
                  <Button asChild variant="outlineInk" size="lg" className="w-full">
                    <Link to={pageData.nextPost.to}>
                      继续阅读
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>

      <section className="space-y-8 border-t-8 border-black pt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="manga-label text-black/48">Next Panels</p>
            <h2 className="font-heading text-4xl font-black tracking-tight">
              相关文章
            </h2>
          </div>
          <Button asChild variant="outlineInk">
            <Link to="/posts">查看全部文章</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {renderRelatedPostCards(pageData.relatedPosts)}
        </div>
      </section>
    </div>
  )
}
