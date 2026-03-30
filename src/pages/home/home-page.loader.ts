import { getHomePageContent } from '@/services/home-page-service'
import type { HomePageData } from '@/types/content'

/**
 * 首页路由 loader。
 * 通过把数据请求前置到路由层，可以让页面组件专注渲染，同时也为未来 SSR 或预取保留扩展空间。
 */
export async function homePageLoader(): Promise<HomePageData> {
  return getHomePageContent()
}
