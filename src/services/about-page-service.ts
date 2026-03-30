import { aboutPageContent } from '@/data/about-page-content'
import { requestJson } from '@/services/api-client'
import type { AboutPageData } from '@/types/content'

const ABOUT_PAGE_ENDPOINT = '/about'

/**
 * 获取关于页数据。
 * 默认读取本地配置，等后续 API 就绪后，只需要把环境变量切到 false 即可改为远程请求。
 */
export async function getAboutPageContent(): Promise<AboutPageData> {
  if (import.meta.env.VITE_USE_LOCAL_ABOUT_CONTENT !== 'false') {
    return structuredClone(aboutPageContent)
  }

  return requestJson<AboutPageData>(ABOUT_PAGE_ENDPOINT)
}
