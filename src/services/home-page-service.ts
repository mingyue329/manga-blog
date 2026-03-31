import { homePageContent } from '@/data/home-page-content'
import { getLatestUpdateArticles } from '@/services/article-content-service'
import { requestJson } from '@/services/api-client'
import type { HomePageData } from '@/types/content'

const HOME_PAGE_ENDPOINT = '/home'

/**
 * 获取首页数据。
 * 当前默认读取本地配置，等后续后端接口准备好之后，只需要把环境变量切到 false 即可切换到真实请求。
 */
export async function getHomePageContent(): Promise<HomePageData> {
  if (import.meta.env.VITE_USE_LOCAL_HOME_CONTENT !== 'false') {
    return {
      ...structuredClone(homePageContent),
      updates: {
        ...structuredClone(homePageContent.updates),
        items: getLatestUpdateArticles(3),
      },
    }
  }

  return requestJson<HomePageData>(HOME_PAGE_ENDPOINT)
}
