import type { LoaderFunctionArgs } from 'react-router-dom'

import { getPostDetailPageContent } from '@/services/post-detail-page-service'
import type { PostDetailPageData } from '@/types/content'

/**
 * 文章详情页的路由 loader。
 * 它负责从路由参数中拿到 slug，并把真正的数据获取工作转交给 service 层。
 */
export async function postDetailPageLoader({
  params,
}: LoaderFunctionArgs): Promise<PostDetailPageData> {
  const postSlug = params.slug

  if (!postSlug) {
    throw new Response('缺少文章标识。', {
      status: 400,
      statusText: '缺少文章标识。',
    })
  }

  return getPostDetailPageContent(postSlug)
}
