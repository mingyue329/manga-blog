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
 * 把 Vite 暴露的 `BASE_URL` 转成 React Router 需要的 basename。
 * GitHub Pages 项目页不是部署在域名根路径，而是部署在 `/{repo}/` 这样的子路径下。
 * Vite 提供的 `BASE_URL` 往往带有结尾斜杠，例如 `/manga-blog/`，
 * 这里统一裁掉尾部斜杠，避免 React Router 在生产环境把首页误判成未命中的路由。
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
 * 这里集中维护所有前台页面的路径、loader、布局关系和部署基路径，
 * 这样本地开发与 GitHub Pages 子路径部署都可以复用同一套路由定义。
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
