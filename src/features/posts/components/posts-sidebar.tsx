import type { ChangeEvent, ReactElement } from 'react'
import { Award, Search, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { PagefindPostSearchResult } from '@/features/posts/hooks/use-pagefind-post-search'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import type { HallOfFameMember } from '@/shared/types/content'

interface PostsSidebarProps {
  searchPlaceholder: string
  searchKeyword: string
  activeTag: string
  tagsTitle: string
  tags: string[]
  allTagFilter: string
  hallOfFameTitle: string
  hallOfFameMembers: HallOfFameMember[]
  onSearchKeywordChange: (nextKeyword: string) => void
  onTagChange: (nextTag: string) => void
  pagefindSearchResults: PagefindPostSearchResult[]
  pagefindSearchMode: 'idle' | 'loading' | 'ready' | 'error'
  pagefindSearchErrorMessage: string | null
}

/**
 * 渲染荣誉榜成员。
 */
function renderHallOfFameMembers(
  hallOfFameMembers: HallOfFameMember[],
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const member of hallOfFameMembers) {
    elements.push(
      <li key={member.rank} className="flex items-center gap-4">
        <div className="theme-surface-panel theme-border-strong flex size-10 items-center justify-center border-2 font-black">
          {member.rank}
        </div>
        <div>
          <p className="font-bold leading-none">{member.name}</p>
          <p className="theme-text-muted mt-1 text-xs font-heading uppercase tracking-[0.16em]">
            {member.role}
          </p>
        </div>
      </li>,
    )
  }

  return elements
}

/**
 * 处理搜索框输入变化。
 */
function handleSearchInputChange(
  event: ChangeEvent<HTMLInputElement>,
  onSearchKeywordChange: (nextKeyword: string) => void,
): void {
  onSearchKeywordChange(event.target.value)
}

/**
 * 渲染文章归档页侧边栏。
 */
export function PostsSidebar({
  searchPlaceholder,
  searchKeyword,
  activeTag,
  tagsTitle,
  tags,
  allTagFilter,
  hallOfFameTitle,
  hallOfFameMembers,
  onSearchKeywordChange,
  onTagChange,
  pagefindSearchResults,
  pagefindSearchMode,
  pagefindSearchErrorMessage,
}: PostsSidebarProps): ReactElement {
  return (
    <aside className="space-y-8 lg:sticky lg:top-32">
      <Card className="theme-surface-panel theme-border-strong border-4 py-0 manga-panel">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2" />
            <Input
              value={searchKeyword}
              onChange={(event) =>
                handleSearchInputChange(event, onSearchKeywordChange)
              }
              placeholder={searchPlaceholder}
              className="pl-12"
            />
          </div>
        </CardContent>
      </Card>

      {searchKeyword ? (
        <Card className="theme-surface-panel theme-border-strong border-4 py-0">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-black uppercase tracking-[0.12em]">
                  Search Radar
                </h3>
                <p className="theme-text-soft text-xs leading-5">
                  {pagefindSearchMode === 'ready'
                    ? '当前使用 Pagefind 全文索引。'
                    : pagefindSearchMode === 'loading'
                      ? '正在载入全文搜索结果。'
                      : '当前回退到本地标题与摘要筛选。'}
                </p>
              </div>
              <Badge variant={pagefindSearchMode === 'ready' ? 'ink' : 'outlineInk'}>
                {pagefindSearchMode === 'ready' ? '全文' : '本地'}
              </Badge>
            </div>

            {pagefindSearchMode === 'loading' ? (
              <p className="theme-text-muted text-sm leading-6">正在检索文章正文…</p>
            ) : null}

            {pagefindSearchMode === 'error' ? (
              <p className="theme-text-muted text-sm leading-6">
                {pagefindSearchErrorMessage ?? 'Pagefind 未就绪，当前展示本地筛选结果。'}
              </p>
            ) : null}

            {pagefindSearchMode === 'ready' && pagefindSearchResults.length === 0 ? (
              <p className="theme-text-muted text-sm leading-6">
                全文索引中没有找到相关内容。
              </p>
            ) : null}

            {pagefindSearchResults.length > 0 ? (
              <div className="space-y-3">
                {pagefindSearchResults.map((result) => (
                  <Link
                    key={`${result.slug}-${result.url}`}
                    to={result.url}
                    className="theme-border-faint block border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-heading text-sm font-black tracking-[0.04em]">
                        {result.title}
                      </span>
                      {result.category ? (
                        <span className="theme-text-faint text-[0.68rem] font-black uppercase tracking-[0.16em]">
                          {result.category}
                        </span>
                      ) : null}
                    </div>
                    {result.excerptHtml ? (
                      <p
                        className="theme-text-soft text-sm leading-6 [&_mark]:bg-[var(--surface-ink)] [&_mark]:px-1 [&_mark]:text-[var(--copy-inverse)]"
                        dangerouslySetInnerHTML={{ __html: result.excerptHtml }}
                      />
                    ) : null}
                    {result.date ? (
                      <p className="theme-text-faint mt-2 text-[0.68rem] font-black uppercase tracking-[0.16em]">
                        {result.date.replaceAll('-', '.')}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 font-heading text-xl font-black tracking-tight">
          <Tag className="size-5" />
          {tagsTitle}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant={activeTag === allTagFilter ? 'ink' : 'outlineInk'}
            size="sm"
            onClick={() => onTagChange(allTagFilter)}
          >
            {allTagFilter}
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant={activeTag === tag ? 'ink' : 'outlineInk'}
              size="sm"
              onClick={() => onTagChange(tag)}
            >
              #{tag}
            </Button>
          ))}
        </div>
      </section>

      <Card className="theme-surface-panel-muted theme-border-strong relative overflow-hidden border-4 py-0">
        <div className="theme-text-faint absolute -right-4 -top-4 opacity-40">
          <Award className="size-24" />
        </div>
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="theme-border-strong border-b-4 pb-2 font-heading text-xl font-black">
              {hallOfFameTitle}
            </h3>
          </div>
          <ul className="space-y-5">{renderHallOfFameMembers(hallOfFameMembers)}</ul>
          <Badge variant="outlineInk">社区活跃记录</Badge>
        </CardContent>
      </Card>
    </aside>
  )
}
