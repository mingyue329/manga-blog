import type { ReactElement } from 'react'
import { useLoaderData } from 'react-router-dom'

import { AboutGearSection } from '@/features/about/components/about-gear-section'
import { AboutIdentitySection } from '@/features/about/components/about-identity-section'
import { AboutShowcaseSection } from '@/features/about/components/about-showcase-section'
import { AboutSidebarNav } from '@/features/about/components/about-sidebar-nav'
import { AboutStatsSkillsSection } from '@/features/about/components/about-stats-skills-section'
import type { AboutPageData } from '@/shared/types/content'

/**
 * 璇诲彇鍏充簬椤甸鍔犺浇鏁版嵁銆? */
function useAboutPageData(): AboutPageData {
  return useLoaderData() as AboutPageData
}

/**
 * 鍏充簬椤甸〉闈㈢粍浠躲€? */
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

