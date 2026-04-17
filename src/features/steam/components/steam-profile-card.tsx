import { ExternalLink, Gamepad2 } from "lucide-react";
import type { SteamProfileSummary } from "../steam-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface SteamProfileCardProps {
  profile: SteamProfileSummary;
}

/**
 * Steam 玩家档案卡片组件。
 * 展示玩家头像、昵称、个人主页链接和常玩类型标签。
 */
export function SteamProfileCardComponent({ profile }: SteamProfileCardProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border p-6 space-y-4">
      {/* 头像和基本信息 */}
      <div className="flex items-start gap-4">
        {/* 头像 */}
        <Avatar className="relative h-20 w-20 flex-shrink-0 rounded-full border border-border bg-muted">
          <AvatarImage
            src={profile.avatar.src}
            alt={profile.avatar.alt}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="text-lg font-bold">
            {profile.displayName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        {/* 昵称和链接 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold truncate">
              {profile.displayName}
            </h3>
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="打开 Steam 个人主页"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* 正在游玩 */}
          {profile.currentlyPlaying && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gamepad2 className="w-4 h-4 text-green-500" />
              <span className="truncate">
                正在游玩:{" "}
                <span className="text-foreground">
                  {profile.currentlyPlaying.title}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 常玩类型标签 */}
      {profile.favoriteGenres.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            常玩类型
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.favoriteGenres.map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
