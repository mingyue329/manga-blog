import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/**
 * 404 页面。
 * 当用户访问不存在的路由时，这个页面负责兜底并引导用户回到首页。
 */
export function NotFoundPage(): ReactElement {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-2xl border-4 border-black bg-white py-0 manga-panel">
        <CardContent className="space-y-6 p-8 text-center md:p-10">
          <Badge variant="ink">404</Badge>
          <h1 className="font-heading text-5xl font-black">页面走丢了</h1>
          <p className="text-lg font-medium leading-8 text-black/72">
            你访问的地址暂时不存在。可以返回首页，或者从导航栏进入已经预留好的页面槽位。
          </p>
          <div className="flex justify-center">
            <Button asChild variant="ink" size="lg">
              <Link to="/">返回首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
