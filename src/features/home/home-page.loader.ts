import { getHomePageContent } from '@/features/home/home-page-service'
import type { HomePageData } from '@/shared/types/content'

/**
 * 首页路由 loader。
 * 保留 loader 的目的不是为了远程请求，而是让页面组件只负责渲染。
 */
export function homePageLoader(): HomePageData {
  return getHomePageContent()
}
