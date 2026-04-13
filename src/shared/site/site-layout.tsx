import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'

import { HashScrollHandler } from '@/shared/components/site/hash-scroll-handler'
import { InteractiveDotBackground } from '@/shared/components/site/interactive-dot-background'
import { SiteFooter } from '@/shared/components/site/site-footer'
import { SiteHeader } from '@/shared/components/site/site-header'
import { siteConfig } from '@/shared/site/site-config'

/**
 * 绔欑偣涓诲竷灞€銆? * 杩欎釜缁勪欢璐熻矗鎶婃墍鏈夐〉闈㈡斁杩涚粺涓€鐨?Header/Footer 澹冲瓙閲岋紝骞朵繚鐣欐粴鍔ㄦ仮澶嶈兘鍔涖€? */
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

