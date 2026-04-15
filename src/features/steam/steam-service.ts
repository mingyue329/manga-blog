import type { SteamProfileSummary, SteamSource } from "./steam-types";
import { getSteamProfile as getLocalSteamProfile } from "./steam-content";

/**
 * 本地 Steam 数据源实现。
 * 从静态内容文件读取数据,适用于不需要动态同步的场景。
 */
class LocalSteamSource implements SteamSource {
  async getProfileSummary(): Promise<SteamProfileSummary> {
    // 当前直接返回静态数据,未来可在此处添加缓存逻辑或切换为 API 调用
    return getLocalSteamProfile();
  }
}

/**
 * Steam 数据源单例。
 * 页面层通过此实例获取 Steam 数据,无需关心底层数据来源。
 */
export const steamService: SteamSource = new LocalSteamSource();
