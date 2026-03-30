import type { ReactElement } from 'react'
import { useLoaderData } from 'react-router-dom'

import { AboutGearSection } from '@/components/about/about-gear-section'
import { AboutIdentitySection } from '@/components/about/about-identity-section'
import { AboutShowcaseSection } from '@/components/about/about-showcase-section'
import { AboutSidebarNav } from '@/components/about/about-sidebar-nav'
import { AboutStatsSkillsSection } from '@/components/about/about-stats-skills-section'
import type { AboutPageData } from '@/types/content'

/**
 * 读取关于页预加载数据。
 */
function useAboutPageData(): AboutPageData {
  return useLoaderData() as AboutPageData
}

/**
 * 关于页页面组件。
 */
export function AboutPage(): ReactElement {
  const pageData = useAboutPageData()

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
      <AboutSidebarNav sectionLinks={pageData.sectionLinks} />
      <div className="space-y-16 md:space-y-20">
        <AboutIdentitySection pageData={pageData} />
        <AboutStatsSkillsSection
          statsTitle={pageData.statsTitle}
          stats={pageData.stats}
          skillsTitle={pageData.skillsTitle}
          skills={pageData.skills}
        />
        <AboutGearSection
          title={pageData.gearTitle}
          gearItems={pageData.gearItems}
        />
        <AboutShowcaseSection panels={pageData.showcasePanels} />
      </div>
    </div>
  )
}
