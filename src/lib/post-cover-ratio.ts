import type { PostCoverRatio } from '@/types/content'

/**
 * 把文章封面比例映射成页面里真正使用的 Tailwind aspect 类名。
 * 统一放在工具函数里之后，归档页、详情页和首页卡片都可以共用同一套比例语义，避免各自维护一份条件判断。
 */
export function getPostCoverRatioClass(coverRatio: PostCoverRatio): string {
  switch (coverRatio) {
    case 'portrait':
      return 'aspect-[4/5]'
    case 'square':
      return 'aspect-square'
    case 'wide':
      return 'aspect-[16/9]'
    case 'landscape':
    default:
      return 'aspect-[4/3]'
  }
}
