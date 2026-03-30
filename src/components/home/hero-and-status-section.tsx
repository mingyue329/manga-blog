import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getSiteIcon } from '@/lib/site-icons'
import type {
  HeroAction,
  HeroSectionData,
  StatusItem,
  StatusPanelData,
} from '@/types/content'

interface HeroAndStatusSectionProps {
  hero: HeroSectionData
  statusPanel: StatusPanelData
}

/**
 * 渲染 Hero 区域中的操作按钮。
 * 每个按钮都来自配置层，便于后续把跳转地址换成真实业务路由。
 */
function renderHeroActions(actions: HeroAction[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const action of actions) {
    elements.push(
      <Button
        key={action.to}
        asChild
        variant={action.variant}
        size="lg"
        className="min-w-36"
      >
        <Link to={action.to}>{action.label}</Link>
      </Button>,
    )
  }

  return elements
}

/**
 * 渲染右侧状态面板中的每一行状态。
 * 把每一行抽成函数，有助于未来在这里插入实时数据刷新或状态颜色。
 */
function renderStatusItems(items: StatusItem[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of items) {
    const Icon = getSiteIcon(item.icon)

    elements.push(
      <li key={`${item.label}-${item.value}`} className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center border-2 border-black bg-secondary">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="manga-label text-black/45">{item.label}</p>
          <p className="mt-1 text-lg font-extrabold">{item.value}</p>
        </div>
      </li>,
    )
  }

  return elements
}

/**
 * 渲染首页首屏和状态卡片。
 * 这一块负责承接最强视觉冲击，因此保留了速度线、手绘气泡和重墨线阴影这些核心风格。
 */
export function HeroAndStatusSection({
  hero,
  statusPanel,
}: HeroAndStatusSectionProps): ReactElement {
  return (
    <section className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
      <Card className="relative overflow-hidden border-4 border-black bg-white py-0 manga-panel">
        <div className="manga-speed-lines absolute inset-0 opacity-70" />
        <CardContent className="relative z-10 flex flex-col gap-10 p-6 md:p-8 lg:flex-row lg:items-center">
          <div className="relative mx-auto w-full max-w-72 flex-none lg:mx-0">
            <div className="manga-halftone absolute -inset-3 text-black/15" />
            <Avatar className="size-full border-4 border-black bg-white">
              <AvatarImage
                src={hero.avatar.src}
                alt={hero.avatar.alt}
                className="object-cover grayscale contrast-125"
              />
              <AvatarFallback className="font-heading text-2xl font-black">
                KT
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-6 top-4 border-4 border-black bg-white px-4 py-2 -rotate-3 manga-panel">
              <span className="font-heading text-xl font-black tracking-[0.2em]">
                {hero.speechBubble}
              </span>
              <span className="speech-bubble-tail absolute -bottom-4 left-5 size-5 border-b-4 border-x-4 border-black bg-white" />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="font-heading text-5xl font-black leading-none tracking-tight md:text-7xl">
              {hero.titleLead}
              <span className="mt-3 inline-block bg-black px-4 py-2 text-white">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="max-w-xl text-lg font-semibold leading-8 text-black/78">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-4">{renderHeroActions(hero.actions)}</div>
          </div>
        </CardContent>
        <span className="absolute bottom-4 right-4 text-3xl font-black">✦</span>
      </Card>

      <Card className="relative overflow-hidden border-4 border-black bg-white py-0 manga-panel-reverse">
        <div className="manga-halftone absolute -right-10 top-0 size-32 rotate-45 text-black/10" />
        <CardContent className="relative flex h-full flex-col justify-between gap-8 p-6 md:p-8">
          <div>
            <h2 className="inline-block border-b-4 border-black pb-2 font-heading text-3xl font-black tracking-tight">
              {statusPanel.title}
            </h2>
            <ul className="mt-8 space-y-6">{renderStatusItems(statusPanel.items)}</ul>
          </div>
          <div className="-rotate-1 border-4 border-black bg-black p-4 text-white">
            <p className="text-sm font-bold tracking-tight">{statusPanel.quote}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
