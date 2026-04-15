import type { SteamGameCard } from "../steam-types";
import { SteamGameCardComponent } from "./steam-game-card";

interface SteamGameListProps {
  games: SteamGameCard[];
  title?: string;
}

/**
 * Steam 游戏列表组件。
 * 以网格布局展示多个游戏卡片,可选显示标题。
 */
export function SteamGameListComponent({ games, title }: SteamGameListProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <SteamGameCardComponent key={game.appId} game={game} />
        ))}
      </div>
    </div>
  );
}
