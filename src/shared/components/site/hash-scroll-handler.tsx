import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  consumePendingAnchorTarget,
  scrollToAnchorTarget,
} from '@/shared/lib/anchor-scroll'

/**
 * 鐩戝惉璺敱 hash 鍙樺寲骞舵墽琛屾粴鍔ㄣ€? * 杩欎釜缁勪欢涓嶆覆鏌撲换浣?UI锛屽彧璐熻矗淇 SPA 鍦烘櫙涓嬬殑閿氱偣璺宠浆浣撻獙銆? */
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
     * 鍦ㄨ矾鐢卞垏鎹㈠悗鐨勫涓椂闂寸偣閲嶅灏濊瘯婊氬姩銆?     * 杩欐牱鍙互閬垮紑寮傛娓叉煋銆佸浘鐗囧姞杞芥垨 ScrollRestoration 甯︽潵鐨勬椂搴忚鐩栭棶棰樸€?     */
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

