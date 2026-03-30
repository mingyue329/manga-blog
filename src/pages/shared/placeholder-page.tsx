import type { ReactElement } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface PlaceholderPageProps {
  badgeLabel: string
  title: string
  description: string
}

/**
 * 预留页组件。
 * 这个页面专门给未来的博文页、关于页使用，既能保证路由现在可访问，也为后续真实接入留出位置。
 */
export function PlaceholderPage({
  badgeLabel,
  title,
  description,
}: PlaceholderPageProps): ReactElement {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-3xl border-4 border-black bg-white py-0 manga-panel">
        <CardContent className="space-y-8 p-8 md:p-10">
          <Badge variant="ink">{badgeLabel}</Badge>
          <div className="space-y-4">
            <h1 className="font-heading text-5xl font-black leading-tight">
              {title}
            </h1>
            <p className="max-w-2xl text-lg font-medium leading-8 text-black/72">
              {description}
            </p>
          </div>
          <Separator className="h-1 bg-black" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-black">已预留的扩展点</h2>
              <ul className="space-y-2 text-sm font-medium leading-7 text-black/72">
                <li>1. 路由已接入，可直接替换成真实页面模块。</li>
                <li>2. 站点 Header / Footer 已复用，不需要重复搭壳。</li>
                <li>3. 内容结构可继续按 loader + service 的方式接 API。</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 self-end">
              <Button asChild variant="ink" size="lg">
                <Link to="/">
                  <ArrowLeft className="size-5" />
                  返回首页
                </Link>
              </Button>
              <Button asChild variant="outlineInk" size="lg">
                <Link to="/about">
                  查看项目说明
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
