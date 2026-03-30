import type { ReactElement } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import type { UpdateArticle, UpdatesSectionData } from '@/types/content'

interface UpdatesSectionProps {
  updates: UpdatesSectionData
}

/**
 * 渲染单篇动态卡片。
 * 卡片本身现在跳到占位页，后面只需要改链接即可接入真实详情页。
 */
function renderUpdateCard(item: UpdateArticle): ReactElement {
  return (
    <Link key={item.title} to={item.to} className="group block h-full">
      <Card className="h-full overflow-hidden border-4 border-black bg-white py-0 transition-transform duration-300 manga-panel group-hover:-translate-y-2">
        <div className="relative h-56 overflow-hidden border-b-4 border-black">
          <div className="manga-halftone absolute inset-0 z-10 text-black/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <img
            src={item.image.src}
            alt={item.image.alt}
            className="h-full w-full object-cover grayscale contrast-125"
            loading="lazy"
          />
        </div>
        <CardContent className="space-y-4 p-6">
          <Badge variant="ink">{item.tag}</Badge>
          <CardTitle className="font-heading text-2xl font-black leading-tight transition-transform group-hover:translate-x-1">
            {item.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm font-medium leading-7 text-black/70">
            {item.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 pb-6">
          <span className="manga-halftone px-3 py-1 text-xs font-black tracking-[0.18em]">
            {item.date}
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Card>
    </Link>
  )
}

/**
 * 渲染动态区卡片列表。
 */
function renderUpdateCards(items: UpdateArticle[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of items) {
    elements.push(renderUpdateCard(item))
  }

  return elements
}

/**
 * 渲染首页动态区。
 */
export function UpdatesSection({ updates }: UpdatesSectionProps): ReactElement {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 border-b-8 border-black pb-3 md:flex-row md:items-end md:justify-between">
        <h2 className="manga-section-title italic">{updates.title}</h2>
        <Link
          to={updates.viewAllLink.to}
          className="text-sm font-black tracking-[0.18em] transition-transform hover:translate-x-1"
        >
          {updates.viewAllLink.label}
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {renderUpdateCards(updates.items)}
      </div>
    </section>
  )
}
