import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  consumePendingAnchorTarget,
  scrollToAnchorTarget,
} from '@/lib/anchor-scroll'

/**
 * 监听路由 hash 变化并执行滚动。
 * 这个组件不渲染任何 UI，只负责修正 SPA 场景下的锚点跳转体验。
 */
export function HashScrollHandler(): null {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    const preferredAnchorTarget = hash ? hash.replace('#', '') : null
    const fallbackAnchorTarget = preferredAnchorTarget
      ? null
      : consumePendingAnchorTarget()
    const anchorTarget = preferredAnchorTarget ?? fallbackAnchorTarget

    if (!anchorTarget) {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
      return
    }

    const resolvedAnchorTarget = anchorTarget
    let retryCount = 0
    let timerId = 0

    /**
     * 在路由切换后的多个时间点重复尝试滚动。
     * 这样可以避开异步渲染、图片加载或 ScrollRestoration 带来的时序覆盖问题。
     */
    function attemptScroll(): void {
      const hasScrolled = scrollToAnchorTarget(resolvedAnchorTarget)

      if (hasScrolled || retryCount >= 8) {
        return
      }

      retryCount += 1
      timerId = window.setTimeout(attemptScroll, 80)
    }

    timerId = window.setTimeout(attemptScroll, 80)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [hash, pathname])

  return null
}
