import { getAboutPageContent } from "@/features/about/about-page-service";
import { steamService } from "@/features/steam/steam-service";
import type { AboutPageData } from "@/shared/types/content";
import type { SteamProfileSummary } from "@/features/steam/steam-types";

/**
 * 关于页扩展数据。
 * 包含关于页内容和 Steam 档案数据。
 */
export interface AboutPageLoaderData {
  aboutData: AboutPageData;
  steamProfile: SteamProfileSummary;
}

/**
 * 关于页路由 loader。
 * 同时加载关于页内容和 Steam 档案数据。
 */
export async function aboutPageLoader(): Promise<AboutPageLoaderData> {
  const [aboutData, steamProfile] = await Promise.all([
    Promise.resolve(getAboutPageContent()),
    steamService.getProfileSummary(),
  ]);

  return {
    aboutData,
    steamProfile,
  };
}
