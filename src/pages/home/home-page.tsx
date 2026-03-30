import type { ReactElement } from 'react'
import { useLoaderData } from 'react-router-dom'

import { HeroAndStatusSection } from '@/components/home/hero-and-status-section'
import { PlayingAndStackSection } from '@/components/home/playing-and-stack-section'
import { UpdatesSection } from '@/components/home/updates-section'
import type { HomePageData } from '@/types/content'

/**
 * 读取首页路由预加载的数据。
 * 单独包一层函数，可以让页面组件代码更接近“声明式渲染”。
 */
function useHomePageData(): HomePageData {
  return useLoaderData() as HomePageData
}

/**
 * 首页页面组件。
 */
export function HomePage(): ReactElement {
  const pageData = useHomePageData()

  return (
    <div className="space-y-16 md:space-y-24">
      <HeroAndStatusSection
        hero={pageData.hero}
        statusPanel={pageData.statusPanel}
      />
      <UpdatesSection updates={pageData.updates} />
      <PlayingAndStackSection
        playing={pageData.playing}
        stack={pageData.stack}
      />
    </div>
  )
}
