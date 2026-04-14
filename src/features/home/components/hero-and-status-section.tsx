import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { useGsapHoverLift } from '@/shared/lib/use-gsap-hover-preview-card'
import { getSiteIcon } from '@/shared/lib/site-icons'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import type {
  HeroAction,
  HeroSectionData,
  StatusItem,
  StatusPanelData,
} from '@/shared/types/content'

interface HeroAndStatusSectionProps {
  hero: HeroSectionData
  statusPanel: StatusPanelData
}

function isVideoAvatarSource(source: string): boolean {
  return source.toLowerCase().endsWith('.mp4')
}

function renderHeroAvatarMedia(hero: HeroSectionData): ReactElement {
  if (isVideoAvatarSource(hero.avatar.src)) {
    return (
      <div className="theme-surface-panel theme-border-strong aspect-square w-full overflow-hidden border-4">
        <video
          src={hero.avatar.src}
          aria-label={hero.avatar.alt}
          className="size-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
    )
  }

  return (
    <div className="theme-surface-panel theme-border-strong aspect-square w-full overflow-hidden border-4">
      <img
        src={hero.avatar.src}
        alt={hero.avatar.alt}
        className="size-full object-cover"
        loading="eager"
      />
    </div>
  )
}

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

function renderStatusItems(items: StatusItem[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of items) {
    const Icon = getSiteIcon(item.icon)

    elements.push(
      <li key={`${item.label}-${item.value}`} className="flex items-center gap-4">
        <div className="theme-surface-panel-muted theme-border-strong flex size-12 items-center justify-center border-2">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="manga-label theme-text-faint">{item.label}</p>
          <p className="mt-1 text-lg font-extrabold">{item.value}</p>
        </div>
      </li>,
    )
  }

  return elements
}

function HeroMediaCluster({ hero }: { hero: HeroSectionData }): ReactElement {
  const { triggerRef, targetRef } = useGsapHoverLift(8)

  return (
    <div ref={triggerRef} className="relative mx-auto w-full max-w-72 flex-none lg:mx-0">
      <div ref={targetRef}>
        {renderHeroAvatarMedia(hero)}
        <div className="theme-surface-panel theme-border-strong absolute z-30 -right-6 -top-[59px] -rotate-3 border-4 px-4 py-2 manga-panel">
          <span className="font-heading text-xl font-black tracking-[0.2em]">
            {hero.speechBubble}
          </span>
          <span className="speech-bubble-tail theme-surface-panel theme-border-strong absolute -bottom-4 left-5 size-5 border-x-4 border-b-4" />
        </div>
      </div>
    </div>
  )
}

export function HeroAndStatusSection({
  hero,
  statusPanel,
}: HeroAndStatusSectionProps): ReactElement {
  return (
    <section className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
      <Card className="theme-surface-panel theme-border-strong relative overflow-visible border-4 py-0 manga-panel">
        <div className="manga-speed-lines absolute inset-0 opacity-70" />
        <CardContent className="relative z-10 flex flex-col gap-10 p-6 md:p-8 lg:flex-row lg:items-center">
          <HeroMediaCluster hero={hero} />

          <div className="space-y-6">
            <h1 className="font-heading text-4xl font-black leading-none tracking-tight md:text-6xl xl:text-7xl">
              {hero.titleLead}
              <span className="theme-surface-ink mt-3 inline-block px-4 py-2">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="theme-text-soft max-w-xl text-lg font-semibold leading-8">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {renderHeroActions(hero.actions)}
            </div>
          </div>
        </CardContent>
        <span className="absolute bottom-4 right-4 text-3xl font-black">※</span>
      </Card>

      <Card className="theme-surface-panel theme-border-strong relative overflow-hidden border-4 py-0 manga-panel-reverse">
        <div className="manga-halftone theme-text-faint absolute -right-10 top-0 size-32 rotate-45" />
        <CardContent className="relative flex h-full flex-col justify-between gap-8 p-6 md:p-8">
          <div>
            <h2 className="theme-border-strong inline-block border-b-4 pb-2 font-heading text-3xl font-black tracking-tight">
              {statusPanel.title}
            </h2>
            <ul className="mt-8 space-y-6">{renderStatusItems(statusPanel.items)}</ul>
          </div>
          <div className="theme-surface-ink theme-border-strong -rotate-1 border-4 p-4">
            <p className="text-sm font-bold tracking-tight">{statusPanel.quote}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
