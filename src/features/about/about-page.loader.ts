import { getAboutPageContent } from '@/features/about/about-page-service'
import type { AboutPageData } from '@/shared/types/content'

/**
 * 关于页路由 loader。
 * 内容准备放在路由层，页面组件只负责组织 UI。
 */
export function aboutPageLoader(): AboutPageData {
  return getAboutPageContent()
}
