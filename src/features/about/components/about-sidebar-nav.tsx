import type { MouseEvent, ReactElement } from 'react'
import { BarChart3, PanelsTopLeft, PersonStanding, Package } from 'lucide-react'

import { scrollToAnchorTarget } from '@/shared/lib/anchor-scroll'
import { cn } from '@/shared/lib/utils'
import type { AboutSectionLink } from '@/shared/types/content'

interface AboutSidebarNavProps {
  sectionLinks: AboutSectionLink[]
}

/**
 * 鏍规嵁绔犺妭 id 杩斿洖瀵瑰簲鍥炬爣銆? * 杩欓噷涓嶆妸鍥炬爣鍐欒繘鏁版嵁灞傦紝鏄负浜嗚鏁版嵁閰嶇疆淇濇寔绾枃鏈粨鏋勶紝鏇撮€傚悎鏈潵浠庢帴鍙ｈ繑鍥炪€? */
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
 * 澶勭悊椤靛唴绔犺妭璺宠浆銆? * 杩欓噷鐩存帴璋冪敤鑷畾涔夋粴鍔ㄩ€昏緫锛岀‘淇濆浐瀹氬ご閮ㄥ満鏅笅涔熻兘鍑嗙‘婊氬埌鐩爣浣嶇疆銆? */
function handleSectionLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
): void {
  event.preventDefault()
  window.history.replaceState(null, '', `#${sectionId}`)
  scrollToAnchorTarget(sectionId)
}

/**
 * 娓叉煋鍏充簬椤靛乏渚х珷鑺傚鑸€? * 杩欎釜缁勪欢鍙湪妗岄潰绔樉绀猴紝鐢ㄦ潵妯℃嫙璁捐绋块噷鐨勭珷鑺傝彍鍗曪紝鍚屾椂鎻愪緵鏇存竻鏅扮殑椤甸潰缁撴瀯銆? */
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
            绔犺妭閫夋嫨
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

