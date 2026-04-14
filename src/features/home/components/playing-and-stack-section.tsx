import type { ReactElement } from 'react'
import { Gamepad2 } from 'lucide-react'

import { useGsapHoverLift } from '@/shared/lib/use-gsap-hover-preview-card'
import { getSiteIcon } from '@/shared/lib/site-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Progress } from '@/shared/ui/progress'
import type {
  PlayingSectionData,
  StackSectionData,
  TechStackItem,
} from '@/shared/types/content'

interface PlayingAndStackSectionProps {
  playing: PlayingSectionData
  stack: StackSectionData
}

/**
 * 娓叉煋鎶€鏈爤涓殑鍗曚釜鑳藉姏椤广€? * 鏁版嵁鍜屽浘鏍囦箣闂撮€氳繃缁熶竴鏄犲皠瑙ｈ€︼紝鏈潵鎹㈡垚鎺ュ彛椹卞姩鏃朵笉闇€瑕佹敼娓叉煋閫昏緫銆? */
function StackItem({ item }: { item: TechStackItem }): ReactElement {
  const Icon = getSiteIcon(item.icon)
  const { triggerRef, targetRef } = useGsapHoverLift()

  return (
    <div ref={triggerRef} className="flex flex-col items-center gap-3 text-center">
      <div
        ref={targetRef}
        className="theme-surface-panel theme-border-strong flex size-18 items-center justify-center border-4"
      >
        <Icon className="size-8" />
      </div>
      <span className="text-xs font-black tracking-[0.2em]">{item.name}</span>
    </div>
  )
}

/**
 * 娓叉煋鎶€鏈爤缃戞牸銆? */
function renderStackItems(items: TechStackItem[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of items) {
    elements.push(<StackItem key={item.name} item={item} />)
  }

  return elements
}

/**
 * 娓叉煋棣栭〉搴曢儴鐨勬父鎴忓拰鎶€鏈爤娣峰悎鍖恒€? */
export function PlayingAndStackSection({
  playing,
  stack,
}: PlayingAndStackSectionProps): ReactElement {
  return (
    <section className="grid gap-10 lg:grid-cols-2">
      <Card
        id="playing"
        className="theme-surface-panel theme-border-strong relative overflow-visible border-4 py-0 manga-panel"
      >
        <span className="theme-surface-ink theme-border-strong absolute left-6 top-0 -translate-y-1/2 border-4 px-5 py-2 font-heading text-xl font-black">
          {playing.title}
        </span>
        <CardContent className="mt-8 flex flex-col gap-8 p-6 md:flex-row md:items-center md:p-8">
          <div className="manga-halftone theme-border-strong theme-text-strong flex size-52 flex-none items-center justify-center border-4">
            <Gamepad2 className="size-20" />
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-4xl font-black leading-tight">
              {playing.gameTitle}
            </h3>
            <p className="text-lg font-bold">{playing.progressLabel}</p>
            <Progress
              value={playing.progressValue}
              className="theme-border-strong h-4 border-2 bg-secondary"
            />
            <p className="theme-text-soft text-sm italic">{playing.note}</p>
          </div>
        </CardContent>
        <span className="theme-text-faint absolute bottom-4 right-4 text-6xl font-black">
          GAMER
        </span>
      </Card>

      <Card
        id="stack"
        className="theme-surface-panel theme-border-strong relative overflow-visible border-4 py-0 manga-panel-reverse"
      >
        <span className="theme-surface-ink theme-border-strong absolute right-6 top-0 -translate-y-1/2 border-4 px-5 py-2 font-heading text-xl font-black">
          {stack.title}
        </span>
        <CardContent className="relative mt-8 p-6 md:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {renderStackItems(stack.items)}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="theme-text-faint opacity-40"
              aria-hidden="true"
            >
              <circle
                cx="110"
                cy="110"
                r="82"
                fill="none"
                stroke="var(--line-soft)"
                strokeWidth="2"
                strokeDasharray="10 6"
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

