import type { ReactElement } from 'react'
import {
  Camera,
  Coffee,
  Headphones,
  Keyboard,
  Laptop,
  Mouse,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import type { GearIconKey, GearItem } from '@/types/content'

interface AboutGearSectionProps {
  title: string
  gearItems: GearItem[]
}

/**
 * 根据装备图标键返回对应图标组件。
 */
function getGearIcon(iconKey: GearIconKey) {
  if (iconKey === 'keyboard') {
    return Keyboard
  }

  if (iconKey === 'mouse') {
    return Mouse
  }

  if (iconKey === 'laptop') {
    return Laptop
  }

  if (iconKey === 'headphones') {
    return Headphones
  }

  if (iconKey === 'camera') {
    return Camera
  }

  return Coffee
}

/**
 * 渲染装备卡片网格。
 */
function renderGearCards(gearItems: GearItem[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const gearItem of gearItems) {
    const Icon = getGearIcon(gearItem.icon)

    elements.push(
      <Card
        key={gearItem.name}
        className="border-4 border-black bg-white py-0 transition-transform duration-200 hover:-translate-y-2 hover:translate-x-2"
      >
        <CardContent className="space-y-4 p-4">
          <div className="flex aspect-square items-center justify-center border-2 border-black bg-secondary transition-colors hover:bg-black hover:text-white">
            <Icon className="size-12" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black uppercase">{gearItem.name}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/45">
              {gearItem.rarity}
            </p>
          </div>
        </CardContent>
      </Card>,
    )
  }

  return elements
}

/**
 * 渲染关于页装备区。
 */
export function AboutGearSection({
  title,
  gearItems,
}: AboutGearSectionProps): ReactElement {
  return (
    <section id="gear" className="scroll-mt-32 space-y-8">
      <h3 className="inline-block -skew-x-6 bg-black px-6 py-3 font-heading text-3xl font-black text-white md:text-4xl">
        {title}
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {renderGearCards(gearItems)}
      </div>
    </section>
  )
}
