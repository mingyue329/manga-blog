import { getAboutPageContent } from '@/services/about-page-service'
import type { AboutPageData } from '@/types/content'

/**
 * 关于页路由 loader。
 * 通过 loader 预取页面数据，可以让页面组件只负责组织 UI。
 */
export async function aboutPageLoader(): Promise<AboutPageData> {
  return getAboutPageContent()
}
