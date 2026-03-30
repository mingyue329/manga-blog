import type { ReactElement } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import type { AboutShowcasePanel } from '@/types/content'

interface AboutShowcaseSectionProps {
  panels: AboutShowcasePanel[]
}

/**
 * 渲染单个分镜面板。
 * 这里会根据面板类型决定显示图片还是纯文字情绪块。
 */
function renderShowcasePanel(panel: AboutShowcasePanel, index: number): ReactElement {
  if (panel.type === 'statement') {
    return (
      <Card
        key={`statement-${index}`}
        className="overflow-hidden border-4 border-black bg-black py-0"
      >
        <CardContent className="manga-halftone flex h-48 items-center justify-center p-0 text-white">
          <span className="-rotate-2 font-heading text-5xl font-black tracking-[0.9rem]">
            {panel.statement}
          </span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      key={panel.image?.src ?? index}
      className="overflow-hidden border-4 border-black bg-white py-0"
    >
      <CardContent className="relative h-48 p-0">
        <img
          src={panel.image?.src}
          alt={panel.image?.alt ?? ''}
          className="h-full w-full object-cover grayscale contrast-125"
          loading="lazy"
        />
        {panel.accentLabel ? (
          <span className="absolute bottom-3 left-4 border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase italic">
            {panel.accentLabel}
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}

/**
 * 渲染关于页底部的漫画分镜区。
 */
export function AboutShowcaseSection({
  panels,
}: AboutShowcaseSectionProps): ReactElement {
  return (
    <section id="frames" className="scroll-mt-32 space-y-6">
      <h3 className="manga-section-title">漫画分镜 // FRAMES</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {panels.map((panel, index) => renderShowcasePanel(panel, index))}
      </div>
    </section>
  )
}
