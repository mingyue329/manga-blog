import type { MouseEvent, ReactElement } from 'react'
import { BarChart3, PanelsTopLeft, PersonStanding, Package } from 'lucide-react'

import { scrollToAnchorTarget } from '@/lib/anchor-scroll'
import { cn } from '@/lib/utils'
import type { AboutSectionLink } from '@/types/content'

interface AboutSidebarNavProps {
  sectionLinks: AboutSectionLink[]
}

/**
 * 根据章节 id 返回对应图标。
 * 这里不把图标写进数据层，是为了让数据配置保持纯文本结构，更适合未来从接口返回。
 */
function getAboutSectionIcon(sectionId: string) {
  if (sectionId === 'identity') {
    return PersonStanding
  }

  if (sectionId === 'stats') {
    return BarChart3
  }

  if (sectionId === 'gear') {
    return Package
  }

  return PanelsTopLeft
}

/**
 * 处理页内章节跳转。
 * 这里直接调用自定义滚动逻辑，确保固定头部场景下也能准确滚到目标位置。
 */
function handleSectionLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
): void {
  event.preventDefault()
  window.history.replaceState(null, '', `#${sectionId}`)
  scrollToAnchorTarget(sectionId)
}

/**
 * 渲染关于页左侧章节导航。
 * 这个组件只在桌面端显示，用来模拟设计稿里的章节菜单，同时提供更清晰的页面结构。
 */
export function AboutSidebarNav({
  sectionLinks,
}: AboutSidebarNavProps): ReactElement {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-32 space-y-4 border-4 border-black bg-white p-4 manga-panel">
        <div>
          <div className="inline-block border-2 border-black bg-secondary px-2 py-1 font-heading text-sm font-black uppercase">
            MENU
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-black/55">
            章节选择
          </p>
        </div>
        <nav className="flex flex-col border-t-2 border-black/10">
          {sectionLinks.map((sectionLink) => {
            const Icon = getAboutSectionIcon(sectionLink.id)

            return (
              <a
                key={sectionLink.id}
                href={`#${sectionLink.id}`}
                onClick={(event) => handleSectionLinkClick(event, sectionLink.id)}
                className={cn(
                  'flex items-center gap-3 border-b-2 border-black/10 px-3 py-4 font-heading text-sm font-black transition-all',
                  'hover:bg-black hover:text-white hover:translate-x-1',
                )}
              >
                <Icon className="size-4" />
                <span>{sectionLink.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
