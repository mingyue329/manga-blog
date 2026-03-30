import type { ReactElement } from 'react'
import { BarChart3, GitBranchPlus } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getSiteIcon } from '@/lib/site-icons'
import { cn } from '@/lib/utils'
import type { AboutSkillNode, AboutStatItem } from '@/types/content'

interface AboutStatsSkillsSectionProps {
  statsTitle: string
  stats: AboutStatItem[]
  skillsTitle: string
  skills: AboutSkillNode[]
}

/**
 * 渲染能力条列表。
 * 通过独立函数把数值条样式统一起来，后续如果接入实时数据，只需要替换数据源即可。
 */
function renderAboutStats(stats: AboutStatItem[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const stat of stats) {
    elements.push(
      <div key={stat.label} className="space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm font-black uppercase tracking-[0.18em]">
          <span>
            {stat.label} / {stat.secondaryLabel}
          </span>
          <span>{stat.valueText}</span>
        </div>
        <Progress
          value={stat.value}
          className="h-6 border-2 border-black bg-white p-0.5 [&>[data-slot=progress-indicator]]:manga-halftone"
        />
      </div>,
    )
  }

  return elements
}

/**
 * 渲染技能树叶子节点。
 */
function renderSkillNodes(skills: AboutSkillNode[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (const skill of skills) {
    const Icon = getSiteIcon(skill.icon)

    elements.push(
      <div key={skill.title} className="flex flex-col items-center">
        <div className="mb-4 h-1 w-full bg-black" />
        <div
          className={cn(
            'flex aspect-square w-full flex-col items-center justify-center border-4 border-black p-3 text-center transition-all',
            skill.emphasized
              ? 'manga-halftone bg-black text-white'
              : 'bg-secondary hover:bg-black hover:text-white',
          )}
        >
          <Icon className="mb-3 size-8" />
          <span className="text-sm font-black">{skill.title}</span>
          <span className="mt-2 text-xs font-medium leading-5 opacity-75">
            {skill.description}
          </span>
        </div>
      </div>,
    )
  }

  return elements
}

/**
 * 渲染关于页中的能力面板和技能树。
 */
export function AboutStatsSkillsSection({
  statsTitle,
  stats,
  skillsTitle,
  skills,
}: AboutStatsSkillsSectionProps): ReactElement {
  return (
    <section id="stats" className="scroll-mt-32 grid gap-8 xl:grid-cols-2">
      <Card className="relative overflow-hidden border-4 border-black bg-white py-0 manga-panel">
        <div className="manga-halftone absolute right-0 top-0 size-24 text-black/10" />
        <CardContent className="space-y-8 p-8">
          <h3 className="flex items-center gap-3 font-heading text-3xl font-black tracking-tight">
            <BarChart3 className="size-7" />
            {statsTitle}
          </h3>
          <div className="space-y-8">{renderAboutStats(stats)}</div>
        </CardContent>
      </Card>

      <Card className="border-4 border-black bg-white py-0 manga-panel-reverse">
        <CardContent className="space-y-8 p-8">
          <h3 className="flex items-center gap-3 font-heading text-3xl font-black tracking-tight">
            <GitBranchPlus className="size-7" />
            {skillsTitle}
          </h3>
          <div className="flex flex-col items-center py-4">
            <div className="z-10 border-4 border-black bg-black px-6 py-4 text-center font-heading text-sm font-black text-white">
              核心开发
            </div>
            <div className="h-12 w-1 bg-black" />
            <div className="grid w-full gap-4 md:grid-cols-3">
              {renderSkillNodes(skills)}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
