/**
 * Steam 游戏卡片数据。
 * 表示单个游戏的展示信息,用于在关于页或其他页面中展示游戏库。
 */
export interface SteamGameCard {
  appId: number;
  title: string;
  steamUrl: string;
  coverImage: string;
  playtimeHours?: number;
  status?: "playing" | "finished" | "wishlist" | "backlog";
  note?: string;
}

/**
 * Steam 玩家档案摘要。
 * 包含玩家的基本信息、头像、常玩类型和精选游戏列表。
 */
export interface SteamProfileSummary {
  profileUrl: string;
  vanityId?: string;
  displayName: string;
  avatar: {
    src: string;
    alt: string;
  };
  favoriteGenres: string[];
  currentlyPlaying?: SteamGameCard;
  featuredGames: SteamGameCard[];
}

/**
 * Steam 数据源接口。
 * 为未来切换为 API 数据源预留抽象层,当前先实现本地静态数据源。
 */
export interface SteamSource {
  getProfileSummary(): Promise<SteamProfileSummary>;
}
