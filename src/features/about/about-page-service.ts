import { aboutPageContent } from '@/features/about/about-page-content'
import type { AboutPageData } from '@/shared/types/content'

/**
 * 返回关于页的完整内容。
 * 这里保留独立 service，是为了把页面本身和内容来源解耦，
 * 后续做成别的主题站点时，可以直接替换内容文件或重写这一层。
 */
export function getAboutPageContent(): AboutPageData {
  return structuredClone(aboutPageContent)
}
