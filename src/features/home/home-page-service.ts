import { homePageContent } from '@/features/home/home-page-content'
import { getLatestUpdateArticles } from '@/features/posts/article-content-service'
import type { HomePageData } from '@/shared/types/content'

/**
 * 组装首页数据。
 * 这个模板当前只保留本地内容源，把页面文案和文章派生数据收口到同一个 service，
 * 以后要复刻站点时，只需要替换内容文件，不需要改页面组件。
 */
export function getHomePageContent(): HomePageData {
  return {
    ...structuredClone(homePageContent),
    updates: {
      ...structuredClone(homePageContent.updates),
      items: getLatestUpdateArticles(3),
    },
  }
}
