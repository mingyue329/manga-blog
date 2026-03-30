import { createBrowserRouter } from 'react-router-dom'

import { SiteLayout } from '@/layouts/site-layout'
import { aboutPageLoader } from '@/pages/about/about-page.loader'
import { AboutPage } from '@/pages/about/about-page'
import { homePageLoader } from '@/pages/home/home-page.loader'
import { HomePage } from '@/pages/home/home-page'
import { postDetailPageLoader } from '@/pages/post-detail/post-detail-page.loader'
import { PostDetailPage } from '@/pages/post-detail/post-detail-page'
import { postsPageLoader } from '@/pages/posts/posts-page.loader'
import { PostsPage } from '@/pages/posts/posts-page'
import { NotFoundPage } from '@/pages/shared/not-found-page'
import { RouteErrorBoundary } from '@/pages/shared/route-error-boundary'

/**
 * 创建应用路由实例。
 * 这里统一维护页面路径、loader 和布局关系，后续如果继续新增详情页或后台页，可以在这里扩展。
 */
function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <SiteLayout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          index: true,
          loader: homePageLoader,
          element: <HomePage />,
        },
        {
          path: 'posts',
          loader: postsPageLoader,
          element: <PostsPage />,
        },
        {
          path: 'posts/:slug',
          loader: postDetailPageLoader,
          element: <PostDetailPage />,
        },
        {
          path: 'about',
          loader: aboutPageLoader,
          element: <AboutPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ])
}

export const appRouter = createAppRouter()
