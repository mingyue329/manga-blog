import { ExternalLink, Clock } from "lucide-react";
import type { SteamGameCard } from "../steam-types";

interface SteamGameCardProps {
  game: SteamGameCard;
}

/**
 * 获取游戏状态对应的中文标签和颜色样式。
 */
function getStatusInfo(status?: SteamGameCard["status"]) {
  switch (status) {
    case "playing":
      return { label: "正在游玩", className: "bg-green-500/20 text-green-400" };
    case "finished":
      return { label: "已通关", className: "bg-blue-500/20 text-blue-400" };
    case "wishlist":
      return { label: "愿望单", className: "bg-yellow-500/20 text-yellow-400" };
    case "backlog":
      return { label: "待游玩", className: "bg-gray-500/20 text-gray-400" };
    default:
      return { label: "", className: "" };
  }
}

/**
 * Steam 游戏卡片组件。
 * 展示单个游戏的封面、标题、游玩时长和状态,点击可跳转到 Steam 商店页。
 */
export function SteamGameCardComponent({ game }: SteamGameCardProps) {
  const statusInfo = getStatusInfo(game.status);

  return (
    <a
      href={game.steamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors"
    >
      {/* 游戏封面图 */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* 状态徽章 */}
        {statusInfo.label && (
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${statusInfo.className}`}
          >
            {statusInfo.label}
          </span>
        )}
      </div>

      {/* 游戏信息 */}
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {game.title}
        </h3>

        {/* 游玩时长 */}
        {game.playtimeHours !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{game.playtimeHours} 小时</span>
          </div>
        )}

        {/* 备注 */}
        {game.note && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {game.note}
          </p>
        )}

        {/* 外部链接图标 */}
        <div className="flex items-center justify-end text-xs text-muted-foreground group-hover:text-primary transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </a>
  );
}
