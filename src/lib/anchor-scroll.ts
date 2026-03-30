const FIXED_HEADER_OFFSET = 112
const PENDING_ANCHOR_STORAGE_KEY = 'kawaiitech.pending-anchor'

/**
 * 从路由字符串中提取 hash 目标。
 * 例如 "/#playing" 会被解析成 "playing"。
 */
export function extractAnchorTarget(routeTarget: string): string | null {
  const hashIndex = routeTarget.indexOf('#')

  if (hashIndex === -1) {
    return null
  }

  const anchorTarget = routeTarget.slice(hashIndex + 1)

  return anchorTarget || null
}

/**
 * 立即滚动到指定锚点元素。
 * 成功返回 true，失败返回 false，方便调用方做重试控制。
 */
export function scrollToAnchorTarget(anchorTarget: string): boolean {
  if (!anchorTarget) {
    return false
  }

  const targetElement = document.getElementById(anchorTarget)

  if (!(targetElement instanceof HTMLElement)) {
    return false
  }

  const targetTop =
    targetElement.getBoundingClientRect().top + window.scrollY - FIXED_HEADER_OFFSET

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth',
  })

  return true
}

/**
 * 把待滚动的锚点暂存到 sessionStorage。
 * 当用户跨路由返回首页时，首页挂载后会再读取这个值执行滚动。
 */
export function savePendingAnchorTarget(anchorTarget: string): void {
  sessionStorage.setItem(PENDING_ANCHOR_STORAGE_KEY, anchorTarget)
}

/**
 * 读取并消费暂存的锚点目标。
 * 读取后立即删除，避免后续无关页面重复触发滚动。
 */
export function consumePendingAnchorTarget(): string | null {
  const anchorTarget = sessionStorage.getItem(PENDING_ANCHOR_STORAGE_KEY)

  if (!anchorTarget) {
    return null
  }

  sessionStorage.removeItem(PENDING_ANCHOR_STORAGE_KEY)

  return anchorTarget
}
