import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ResolvedConfig } from "vite";

import {
  resolvePublicAssetPath,
  siteMetadata,
} from "./src/shared/site/site-metadata";
import {
  buildPagefindSearchFiles,
  getPagefindContentType,
} from "./src/shared/site/pagefind-search-assets";
import { getSteamProfile as getFallbackSteamProfile } from "./src/features/steam/steam-content";
import type {
  SteamApiConfig,
  SteamGameCard,
  SteamProfileSummary,
} from "./src/features/steam/steam-types";
import {
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
} from "./src/shared/site/static-site-assets";

/**
 * 把站点元数据注入到 `index.html`。
 * 这样浏览器标题和 favicon 仍然来自同一份共享配置，不会和运行时内容脱节。
 */
function siteMetadataPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null;

  return {
    name: "site-metadata-plugin",
    configResolved(config) {
      resolvedConfig = config;
    },
    transformIndexHtml(html) {
      const baseUrl = resolvedConfig?.base ?? "/";
      const faviconUrl = resolvePublicAssetPath(
        baseUrl,
        siteMetadata.faviconPath,
      );

      return html
        .replace(/%SITE_TITLE%/g, siteMetadata.title)
        .replace(/%SITE_FAVICON_URL%/g, faviconUrl);
    },
  };
}

function staticSiteAssetsPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null;

  function getSiteUrl(): string {
    return process.env.SITE_URL ?? siteMetadata.siteUrl;
  }

  function getStaticAssets(): Record<string, string> {
    const siteUrl = getSiteUrl();

    return {
      "rss.xml": buildRssXml(siteUrl),
      "sitemap.xml": buildSitemapXml(siteUrl),
      "robots.txt": buildRobotsTxt(siteUrl),
    };
  }

  function getRequestPath(baseUrl: string, assetFileName: string): string {
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

    return `${normalizedBaseUrl}${assetFileName}`.replace(/\/{2,}/g, "/");
  }

  return {
    name: "static-site-assets-plugin",
    configResolved(config) {
      resolvedConfig = config;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const requestPath = request.url?.split("?")[0] ?? "";
        const baseUrl = resolvedConfig?.base ?? "/";
        const staticAssets = getStaticAssets();

        for (const [assetFileName, content] of Object.entries(staticAssets)) {
          if (requestPath !== getRequestPath(baseUrl, assetFileName)) {
            continue;
          }

          response.setHeader(
            "Content-Type",
            assetFileName.endsWith(".txt")
              ? "text/plain; charset=utf-8"
              : "application/xml; charset=utf-8",
          );
          response.end(content);
          return;
        }

        next();
      });
    },
    generateBundle() {
      const staticAssets = getStaticAssets();

      for (const [fileName, source] of Object.entries(staticAssets)) {
        this.emitFile({
          type: "asset",
          fileName,
          source,
        });
      }
    },
  };
}

function pagefindSearchPlugin(): Plugin {
  let pagefindFilesPromise: Promise<Map<string, Uint8Array>> | null = null;

  async function getPagefindFiles(): Promise<Map<string, Uint8Array>> {
    if (!pagefindFilesPromise) {
      pagefindFilesPromise = buildPagefindSearchFiles().then((files) => {
        return new Map(files.map((file) => [file.path, file.content]));
      });
    }

    return pagefindFilesPromise;
  }

  function invalidatePagefindFiles(): void {
    pagefindFilesPromise = null;
  }

  return {
    name: "pagefind-search-plugin",
    configureServer(server) {
      server.watcher.on("change", (changedPath) => {
        if (
          !changedPath.includes(
            `${path.sep}src${path.sep}features${path.sep}posts${path.sep}content${path.sep}posts${path.sep}`,
          )
        ) {
          return;
        }

        invalidatePagefindFiles();
      });

      server.middlewares.use(async (request, response, next) => {
        const requestPath = request.url?.split("?")[0] ?? "";
        const normalizedBaseUrl = server.config.base.endsWith("/")
          ? server.config.base
          : `${server.config.base}/`;
        const pagefindPathPrefix = `${normalizedBaseUrl}pagefind/`.replace(
          /\/{2,}/g,
          "/",
        );

        if (!requestPath.startsWith(pagefindPathPrefix)) {
          next();
          return;
        }

        const relativePagefindPath = requestPath.slice(
          pagefindPathPrefix.length,
        );
        const pagefindFiles = await getPagefindFiles();
        const content = pagefindFiles.get(relativePagefindPath);

        if (!content) {
          next();
          return;
        }

        response.setHeader(
          "Content-Type",
          getPagefindContentType(relativePagefindPath),
        );
        response.end(Buffer.from(content));
      });
    },
    async generateBundle() {
      const pagefindFiles = await getPagefindFiles();

      for (const [filePath, content] of pagefindFiles.entries()) {
        this.emitFile({
          type: "asset",
          fileName: `pagefind/${filePath}`,
          source: content,
        });
      }
    },
  };
}

interface SteamPlayerSummaryResponse {
  response: {
    players: Array<{
      steamid: string;
      personaname: string;
      profileurl: string;
      avatarfull: string;
      gameid?: string;
      gameextrainfo?: string;
    }>;
  };
}

interface SteamRecentlyPlayedResponse {
  response: {
    total_count?: number;
    games?: Array<{
      appid: number;
      name: string;
      playtime_2weeks?: number;
      playtime_forever?: number;
    }>;
  };
}

interface SteamOwnedGamesResponse {
  response: {
    game_count?: number;
    games?: Array<{
      appid: number;
      name?: string;
      playtime_forever?: number;
    }>;
  };
}

function steamProfileApiPlugin(): Plugin {
  const apiPath = "/api/steam/profile-summary";

  function readSteamApiConfig(): SteamApiConfig | null {
    const apiKey = process.env.STEAM_API_KEY?.trim();
    const steamId = process.env.STEAM_STEAM_ID?.trim();

    if (!apiKey || !steamId) {
      return null;
    }

    return { apiKey, steamId };
  }

  function getSteamStoreUrl(appId: number): string {
    return `https://store.steampowered.com/app/${appId}/`;
  }

  function getSteamHeaderImageUrl(appId: number): string {
    return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
  }

  function getPlaytimeHours(minutes?: number): number | undefined {
    if (!minutes || minutes <= 0) {
      return undefined;
    }

    return Math.round((minutes / 60) * 10) / 10;
  }

  function mapGameCard(game: {
    appid: number;
    name?: string;
    playtime_forever?: number;
    playtime_2weeks?: number;
  }): SteamGameCard {
    const playtimeHours = getPlaytimeHours(game.playtime_forever);
    const recentHours = getPlaytimeHours(game.playtime_2weeks);

    return {
      appId: game.appid,
      title: game.name?.trim() || `App ${game.appid}`,
      steamUrl: getSteamStoreUrl(game.appid),
      coverImage: getSteamHeaderImageUrl(game.appid),
      playtimeHours,
      status: recentHours ? "playing" : playtimeHours ? "finished" : "backlog",
      note: recentHours ? `最近两周 ${recentHours} 小时` : undefined,
    };
  }

  async function fetchSteamJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Steam API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async function fetchSteamProfileSummary(
    config: SteamApiConfig,
  ): Promise<SteamProfileSummary> {
    const [playerSummaryResponse, recentlyPlayedResponse, ownedGamesResponse] =
      await Promise.all([
        fetchSteamJson<SteamPlayerSummaryResponse>(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${encodeURIComponent(config.apiKey)}&steamids=${encodeURIComponent(config.steamId)}`,
        ),
        fetchSteamJson<SteamRecentlyPlayedResponse>(
          `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${encodeURIComponent(config.apiKey)}&steamid=${encodeURIComponent(config.steamId)}&count=6`,
        ),
        fetchSteamJson<SteamOwnedGamesResponse>(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${encodeURIComponent(config.apiKey)}&steamid=${encodeURIComponent(config.steamId)}&include_appinfo=true&include_played_free_games=true&format=json`,
        ),
      ]);

    const player = playerSummaryResponse.response.players[0];

    if (!player) {
      throw new Error("Steam player summary is empty");
    }

    const fallbackProfile = getFallbackSteamProfile();
    const recentGames = recentlyPlayedResponse.response.games ?? [];
    const ownedGames = ownedGamesResponse.response.games ?? [];
    const recentById = new Map(recentGames.map((game) => [game.appid, game]));
    const currentGameAppId = player.gameid ? Number(player.gameid) : undefined;
    const currentRecentGame = currentGameAppId
      ? recentById.get(currentGameAppId)
      : undefined;

    const currentlyPlaying =
      currentGameAppId && player.gameextrainfo
        ? {
            appId: currentGameAppId,
            title: player.gameextrainfo,
            steamUrl: getSteamStoreUrl(currentGameAppId),
            coverImage: getSteamHeaderImageUrl(currentGameAppId),
            playtimeHours: getPlaytimeHours(
              currentRecentGame?.playtime_forever,
            ),
            status: "playing" as const,
            note: currentRecentGame?.playtime_2weeks
              ? `最近两周 ${getPlaytimeHours(currentRecentGame.playtime_2weeks)} 小时`
              : "Steam 当前在线游戏",
          }
        : undefined;

    const featuredGames = [
      ...recentGames.filter((game) => game.appid !== currentGameAppId),
      ...ownedGames
        .filter((game) => game.appid !== currentGameAppId)
        .sort(
          (left, right) =>
            (right.playtime_forever ?? 0) - (left.playtime_forever ?? 0),
        ),
    ]
      .filter((game, index, games) => {
        return games.findIndex((item) => item.appid === game.appid) === index;
      })
      .slice(0, 4)
      .map(mapGameCard);

    return {
      profileUrl: player.profileurl,
      vanityId: player.steamid,
      displayName: player.personaname,
      avatar: {
        src: player.avatarfull,
        alt: `${player.personaname} 的 Steam 头像`,
      },
      favoriteGenres: fallbackProfile.favoriteGenres,
      currentlyPlaying,
      featuredGames,
    };
  }

  return {
    name: "steam-profile-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestPath = request.url?.split("?")[0] ?? "";
        const baseUrl = server.config.base.endsWith("/")
          ? server.config.base
          : `${server.config.base}/`;
        const normalizedApiPath =
          `${baseUrl}${apiPath.replace(/^\//, "")}`.replace(/\/{2,}/g, "/");

        if (requestPath !== normalizedApiPath) {
          next();
          return;
        }

        const config = readSteamApiConfig();

        response.setHeader("Content-Type", "application/json; charset=utf-8");

        if (!config) {
          response.statusCode = 503;
          response.end(
            JSON.stringify({
              error: "Missing STEAM_API_KEY or STEAM_STEAM_ID",
            }),
          );
          return;
        }

        try {
          const profile = await fetchSteamProfileSummary(config);
          response.end(JSON.stringify(profile));
        } catch (error) {
          response.statusCode = 502;
          response.end(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "Steam API failed",
            }),
          );
        }
      });
    },
  };
}

/**
 * Vite 配置入口。
 * 这里集中管理别名、插件和 HTML 注入策略，让开发与构建共用同一套基础配置。
 */
export default defineConfig({
  base: "/manga-blog/",
  plugins: [
    react(),
    tailwindcss(),
    siteMetadataPlugin(),
    staticSiteAssetsPlugin(),
    pagefindSearchPlugin(),
    steamProfileApiPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
