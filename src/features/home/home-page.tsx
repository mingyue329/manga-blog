import { useCallback, useLayoutEffect, useRef, useState, type ReactElement } from 'react'
import { useLoaderData } from 'react-router-dom'

import { HeroAndStatusSection } from '@/features/home/components/hero-and-status-section'
import { PlayingAndStackSection } from '@/features/home/components/playing-and-stack-section'
import { UpdatesSection } from '@/features/home/components/updates-section'
import type { HomePageData } from '@/shared/types/content'

/**
 * 读取首页路由预加载的数据。
 * 单独包一层函数，可以让页面组件代码更接近“声明式渲染”。
 */
function useHomePageData(): HomePageData {
  return useLoaderData() as HomePageData
}

function getElementTranslateY(element: HTMLElement): number {
  const transform = window.getComputedStyle(element).transform

  if (transform === 'none') {
    return 0
  }

  return new DOMMatrixReadOnly(transform).m42
}

/**
 * 首页页面组件。
 */
export function HomePage(): ReactElement {
  const pageData = useHomePageData()
  const heroSectionRef = useRef<HTMLDivElement | null>(null)
  const [heroSectionOffset, setHeroSectionOffset] = useState(0)

  const syncHeroSectionOffset = useCallback(() => {
    const heroSectionElement = heroSectionRef.current

    if (!heroSectionElement) {
      return
    }

    const viewportHeight =
      window.visualViewport?.height ?? window.innerHeight
    const heroSectionBottom =
      heroSectionElement.getBoundingClientRect().bottom -
      getElementTranslateY(heroSectionElement)

    setHeroSectionOffset((currentOffset) => {
      const nextOffset = Math.round(
        currentOffset + viewportHeight - heroSectionBottom,
      )

      if (Math.abs(nextOffset - currentOffset) <= 1) {
        return currentOffset
      }

      return nextOffset
    })
  }, [])

  useLayoutEffect(() => {
    const heroSectionElement = heroSectionRef.current

    if (!heroSectionElement) {
      return
    }

    let frameId = 0
    let timeoutId: ReturnType<typeof window.setTimeout> | null = null
    let shouldKeepSyncing = true
    const stopSyncing = () => {
      shouldKeepSyncing = false
      cancelAnimationFrame(frameId)
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }
    }
    const scheduleSync = () => {
      cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(syncHeroSectionOffset)
    }
    const keepSyncingDuringRouteSettle = () => {
      const settleDeadline = window.performance.now() + 1600

      const run = () => {
        if (!shouldKeepSyncing) {
          return
        }

        syncHeroSectionOffset()

        if (window.performance.now() < settleDeadline) {
          frameId = window.requestAnimationFrame(run)
        }
      }

      cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(run)
    }
    const handleScroll = () => {
      if (window.scrollY > 0) {
        stopSyncing()
      }
    }

    syncHeroSectionOffset()
    timeoutId = window.setTimeout(() => {
      keepSyncingDuringRouteSettle()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      scheduleSync()
    })

    resizeObserver.observe(heroSectionElement)
    window.addEventListener('resize', scheduleSync)
    window.visualViewport?.addEventListener('resize', scheduleSync)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      stopSyncing()
      resizeObserver.disconnect()
      window.removeEventListener('resize', scheduleSync)
      window.visualViewport?.removeEventListener('resize', scheduleSync)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [syncHeroSectionOffset])

  return (
    <div
      className="space-y-16 md:space-y-24"
      style={{ marginTop: heroSectionOffset }}
    >
      <div ref={heroSectionRef} data-route-enter>
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
