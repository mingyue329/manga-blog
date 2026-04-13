import type { ChangeEvent, ReactElement } from 'react'
import { Award, Search, Tag } from 'lucide-react'

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
        <div className="flex size-10 items-center justify-center border-2 border-black bg-white font-black">
          {member.rank}
        </div>
        <div>
          <p className="font-bold leading-none">{member.name}</p>
          <p className="mt-1 text-xs font-heading uppercase tracking-[0.16em] text-black/50">
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
}: PostsSidebarProps): ReactElement {
  return (
    <aside className="space-y-8 lg:sticky lg:top-32">
      <Card className="border-4 border-black bg-white py-0 manga-panel">
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

      <Card className="relative overflow-hidden border-4 border-black bg-secondary py-0">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Award className="size-24" />
        </div>
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="border-b-4 border-black pb-2 font-heading text-xl font-black">
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
