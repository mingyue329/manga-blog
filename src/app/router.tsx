import { createBrowserRouter } from 'react-router-dom'

import { aboutPageLoader } from '@/features/about/about-page.loader'
import { AboutPage } from '@/features/about/about-page'
import { homePageLoader } from '@/features/home/home-page.loader'
import { HomePage } from '@/features/home/home-page'
import { postDetailPageLoader } from '@/features/posts/post-detail-page.loader'
import { PostDetailPage } from '@/features/posts/post-detail-page'
import { postsPageLoader } from '@/features/posts/posts-page.loader'
import { PostsPage } from '@/features/posts/posts-page'
import { NotFoundPage } from '@/pages/shared/not-found-page'
import { RouteErrorBoundary } from '@/pages/shared/route-error-boundary'
import { SiteLayout } from '@/shared/site/site-layout'

/**
 * 把 Vite 提供的 `BASE_URL` 转成 React Router 需要的 basename。
 * 统一在这里处理部署基路径，页面层就不需要关心项目最终挂载在什么路径下。
 */
function getRouterBasename(): string {
  const viteBaseUrl = import.meta.env.BASE_URL

  if (viteBaseUrl === '/') {
    return '/'
  }

  return viteBaseUrl.replace(/\/$/, '')
}

/**
 * 创建应用路由实例。
 * 所有页面入口都集中在这里，后续如果复刻成别的主题站点，只需要保留这层骨架即可。
 */
function createAppRouter() {
  return createBrowserRouter(
    [
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
    ],
    {
      basename: getRouterBasename(),
    },
  )
}

export const appRouter = createAppRouter()
