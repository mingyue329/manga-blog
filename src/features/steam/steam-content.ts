import type { SteamProfileSummary } from "./steam-types";

/**
 * Steam 静态数据源。
 * 这里提供示例数据,复刻模板时可根据实际情况修改游戏列表和个人信息。
 */
export const steamProfileData: SteamProfileSummary = {
  profileUrl: "https://steamcommunity.com/profiles/76561198811570805/",
  vanityId: "example-user",
  displayName: "望月屋玩家",
  avatar: {
    src: "/images/steam-avatar-placeholder.png",
    alt: "望月屋玩家的 Steam 头像",
  },
  favoriteGenres: ["动作冒险", "角色扮演", "独立游戏"],
  currentlyPlaying: {
    appId: 2358720,
    title: "黑神话：悟空",
    steamUrl: "https://store.steampowered.com/app/2358720/_/",
    coverImage: "/images/games/black-myth-wukong.jpg",
    playtimeHours: 45.5,
    status: "playing",
    note: "正在挑战隐藏Boss",
  },
  featuredGames: [
    {
      appId: 1245620,
      title: "ELDEN RING",
      steamUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      coverImage: "/images/games/elden-ring.jpg",
      playtimeHours: 120,
      status: "finished",
      note: "全成就通关",
    },
    {
      appId: 1174180,
      title: "Red Dead Redemption 2",
      steamUrl:
        "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      coverImage: "/images/games/rdr2.jpg",
      playtimeHours: 85,
      status: "finished",
      note: "剧情 masterpiece",
    },
    {
      appId: 1091500,
      title: "Cyberpunk 2077",
      steamUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      coverImage: "/images/games/cyberpunk-2077.jpg",
      playtimeHours: 60,
      status: "finished",
      note: "2.0版本后体验大幅提升",
    },
    {
      appId: 1938090,
      title: "Call of Duty®: Modern Warfare® III",
      steamUrl:
        "https://store.steampowered.com/app/1938090/Call_of_Duty_Modern_Warfare_III/",
      coverImage: "/images/games/mw3.jpg",
      status: "backlog",
      note: "待体验战役模式",
    },
  ],
};

/**
 * 获取 Steam 玩家档案摘要。
 * 当前返回静态数据,未来可替换为 API 调用。
 */
export function getSteamProfile(): SteamProfileSummary {
  return steamProfileData;
}
