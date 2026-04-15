import type { ReactElement } from 'react'
import { useLoaderData } from 'react-router-dom'

import { HeroAndStatusSection } from '@/features/home/components/hero-and-status-section'
import { PlayingAndStackSection } from '@/features/home/components/playing-and-stack-section'
import { UpdatesSection } from '@/features/home/components/updates-section'
import type { HomePageData } from '@/shared/types/content'

/**
 * 璇诲彇棣栭〉璺敱棰勫姞杞界殑鏁版嵁銆? * 鍗曠嫭鍖呬竴灞傚嚱鏁帮紝鍙互璁╅〉闈㈢粍浠朵唬鐮佹洿鎺ヨ繎鈥滃０鏄庡紡娓叉煋鈥濄€? */
function useHomePageData(): HomePageData {
  return useLoaderData() as HomePageData
}

/**
 * 棣栭〉椤甸潰缁勪欢銆? */
export function HomePage(): ReactElement {
  const pageData = useHomePageData()

  return (
    <div className="space-y-16 md:space-y-24">
      <div data-route-enter>
        <HeroAndStatusSection
          hero={pageData.hero}
          statusPanel={pageData.statusPanel}
        />
      </div>
      <div data-route-enter>
        <UpdatesSection updates={pageData.updates} />
      </div>
      <div data-route-enter>
        <PlayingAndStackSection
          playing={pageData.playing}
          stack={pageData.stack}
        />
      </div>
    </div>
  )
}

