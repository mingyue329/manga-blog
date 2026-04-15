import type { ReactElement } from "react";
import { useLoaderData } from "react-router-dom";

import { AboutGearSection } from "@/features/about/components/about-gear-section";
import { AboutIdentitySection } from "@/features/about/components/about-identity-section";
import { AboutShowcaseSection } from "@/features/about/components/about-showcase-section";
import { AboutSidebarNav } from "@/features/about/components/about-sidebar-nav";
import { AboutStatsSkillsSection } from "@/features/about/components/about-stats-skills-section";
import {
  SteamProfileCardComponent,
  SteamGameListComponent,
} from "@/features/steam/components";
import type { AboutPageLoaderData } from "./about-page.loader";

/**
 * 读取关于页预加载数据。
 */
function useAboutPageData(): AboutPageLoaderData {
  return useLoaderData() as AboutPageLoaderData;
}

/**
 * 关于页页面组件。
 */
export function AboutPage(): ReactElement {
  const { aboutData, steamProfile } = useAboutPageData();

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
      <div data-route-enter>
        <AboutSidebarNav sectionLinks={aboutData.sectionLinks} />
      </div>
      <div className="space-y-16 md:space-y-20">
        <div data-route-enter>
          <AboutIdentitySection pageData={aboutData} />
        </div>
        <div data-route-enter>
          <AboutStatsSkillsSection
            statsTitle={aboutData.statsTitle}
            stats={aboutData.stats}
            skillsTitle={aboutData.skillsTitle}
            skills={aboutData.skills}
          />
        </div>
        <div data-route-enter>
          <AboutGearSection
            title={aboutData.gearTitle}
            gearItems={aboutData.gearItems}
          />
        </div>

        {/* Steam 档案模块 */}
        <section
          id="steam"
          data-route-enter
          className="space-y-6 scroll-mt-24"
        >
          <h2 className="text-xl font-bold tracking-tight">
            Steam 档案 // STEAM PROFILE
          </h2>
          <div className="space-y-8">
            <SteamProfileCardComponent profile={steamProfile} />
            {steamProfile.featuredGames.length > 0 && (
              <SteamGameListComponent
                games={steamProfile.featuredGames}
                title="精选游戏库"
              />
            )}
          </div>
        </section>

        <div data-route-enter>
          <AboutShowcaseSection panels={aboutData.showcasePanels} />
        </div>
      </div>
    </div>
  );
}
