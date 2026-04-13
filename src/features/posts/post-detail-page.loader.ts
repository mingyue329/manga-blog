import type { LoaderFunctionArgs } from 'react-router-dom'

import { getPostDetailPageContent } from '@/features/posts/post-detail-page-service'
import type { PostDetailPageData } from '@/shared/types/content'

/**
 * 文章详情页路由 loader。
 * 它只负责从路由参数里取出 slug，再把正文和导航信息交给 service 层组装。
 */
export function postDetailPageLoader({
  params,
}: LoaderFunctionArgs): PostDetailPageData {
  const postSlug = params.slug

  if (!postSlug) {
    throw new Response('缺少文章标识。', {
      status: 400,
      statusText: '缺少文章标识。',
    })
  }

  return getPostDetailPageContent(postSlug)
}
