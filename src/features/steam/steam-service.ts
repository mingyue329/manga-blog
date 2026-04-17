import type { SteamProfileSummary, SteamSource } from "./steam-types";
import { getSteamProfile as getLocalSteamProfile } from "./steam-content";
import { resolvePublicAssetPath } from "@/shared/site/site-metadata";

const steamProfileApiPath = resolvePublicAssetPath(
  import.meta.env.BASE_URL,
  "api/steam/profile-summary",
);

/**
 * 本地 Steam 数据源实现。
 * 优先读取本地开发态 API，失败时回退到静态内容文件。
 */
class LocalSteamSource implements SteamSource {
  async getProfileSummary(): Promise<SteamProfileSummary> {
    try {
      const response = await fetch(steamProfileApiPath, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Steam profile request failed: ${response.status}`);
      }

      return (await response.json()) as SteamProfileSummary;
    } catch {
      return getLocalSteamProfile();
    }
  }
}

/**
 * Steam 数据源单例。
 * 页面层通过此实例获取 Steam 数据,无需关心底层数据来源。
 */
export const steamService: SteamSource = new LocalSteamSource();
