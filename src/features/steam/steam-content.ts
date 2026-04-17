import type { SteamProfileSummary } from "./steam-types";

function createSvgPlaceholder(
  label: string,
  width: number,
  height: number,
): string {
  const safeLabel = label.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const fontSize = Math.round(Math.min(width, height) * 0.18);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10141f" />
          <stop offset="100%" stop-color="#1f2937" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="24" fill="url(#bg)" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#f8fafc"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
      >
        ${safeLabel}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Steam 静态兜底数据源。
 * 当本地未配置 Steam 授权或请求失败时，页面退回到这份稳定数据，避免头像和游戏封面断裂。
 */
export const steamProfileData: SteamProfileSummary = {
  profileUrl: "https://steamcommunity.com/profiles/76561198811570805/",
  vanityId: "76561198811570805",
  displayName: "明月几时有",
  avatar: {
    src: createSvgPlaceholder("Steam", 240, 240),
    alt: "Steam 头像占位图",
  },
  favoriteGenres: ["动作冒险", "角色扮演", "独立游戏"],
  currentlyPlaying: {
    appId: 2358720,
    title: "黑神话：悟空",
    steamUrl: "https://store.steampowered.com/app/2358720/_/",
    coverImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    playtimeHours: 45.5,
    status: "playing",
    note: "正在挑战隐藏Boss",
  },
  featuredGames: [
    {
      appId: 1245620,
      title: "ELDEN RING",
      steamUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      coverImage:
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
      playtimeHours: 120,
      status: "finished",
      note: "全成就通关",
    },
    {
      appId: 1174180,
      title: "Red Dead Redemption 2",
      steamUrl:
        "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      coverImage:
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      playtimeHours: 85,
      status: "finished",
      note: "剧情 masterpiece",
    },
    {
      appId: 1091500,
      title: "Cyberpunk 2077",
      steamUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      coverImage:
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
      playtimeHours: 60,
      status: "finished",
      note: "2.0版本后体验大幅提升",
    },
    {
      appId: 1938090,
      title: "Call of Duty®: Modern Warfare® III",
      steamUrl:
        "https://store.steampowered.com/app/1938090/Call_of_Duty_Modern_Warfare_III/",
      coverImage:
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/header.jpg",
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
