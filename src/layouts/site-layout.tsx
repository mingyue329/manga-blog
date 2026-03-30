import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'

import { HashScrollHandler } from '@/components/site/hash-scroll-handler'
import { InteractiveDotBackground } from '@/components/site/interactive-dot-background'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { siteConfig } from '@/data/site-config'

/**
 * 站点主布局。
 * 这个组件负责把所有页面放进统一的 Header/Footer 壳子里，并保留滚动恢复能力。
 */
export function SiteLayout(): ReactElement {
  return (
    <div className="relative isolate min-h-screen bg-background">
      <InteractiveDotBackground />
      <SiteHeader config={siteConfig} />
      <HashScrollHandler />
      <main className="site-shell relative z-10 flex-1 pt-28 pb-20">
        <Outlet />
      </main>
      <div className="relative z-10">
        <SiteFooter config={siteConfig} />
      </div>
    </div>
  )
}
