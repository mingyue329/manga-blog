import type { ReactElement } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'

/**
 * 生成更可读的错误标题。
 */
function getRouteErrorTitle(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `路由错误 ${error.status}`
  }

  return '页面加载失败'
}

/**
 * 生成更可读的错误描述。
 */
function getRouteErrorDescription(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return error.statusText || '路由请求没有成功完成。'
  }

  if (error instanceof Error) {
    return error.message
  }

  return '发生了未知错误，请稍后再试。'
}

/**
 * 路由级错误边界。
 * 当 loader 或页面渲染抛错时，这里统一负责展示错误信息。
 */
export function RouteErrorBoundary(): ReactElement {
  const routeError = useRouteError()

  return (
    <section className="site-shell flex min-h-screen items-center justify-center py-24">
      <Card className="w-full max-w-2xl border-4 border-black bg-white py-0 manga-panel">
        <CardContent className="space-y-6 p-8 md:p-10">
          <Badge variant="ink">ERROR</Badge>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-black">
              {getRouteErrorTitle(routeError)}
            </h1>
            <p className="text-base font-medium leading-8 text-black/72">
              {getRouteErrorDescription(routeError)}
            </p>
          </div>
          <Button asChild variant="ink" size="lg">
            <Link to="/">返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
