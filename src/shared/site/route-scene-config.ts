import { getPublicAssetUrl } from "@/shared/lib/public-asset";
import type { ImageAsset } from "@/shared/types/content";

interface RouteSceneConfig {
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  image: ImageAsset;
  imagePosition?: string;
}

interface ResolvedRouteScene {
  sceneKey: "home" | "posts" | "post-detail" | "about" | "fallback";
  scene: RouteSceneConfig;
  isFullBanner: boolean;
}

const sharedRouteSceneImage = {
  src: getPublicAssetUrl("/images/site/bac.png"),
  alt: "黑白风格的人物侧脸横幅",
} as const satisfies ImageAsset;

const routeScenes = {
  home: {
    eyebrow: "Landing Frame // Home",
    title: "黑白分镜与技术日记",
    emphasis: "HOME",
    description:
      "首页保留更大的场景图，让第一屏先建立气氛；后续会替换成带轻视差的动态分镜。",
    image: sharedRouteSceneImage,
    imagePosition: "84% top",
  },
  posts: {
    eyebrow: "Archive Flow // Posts",
    title: "文章索引与全文检索",
    emphasis: "POSTS",
    description:
      "文章列表页切成中等高度横幅，给筛选、搜索和归档信息留出更快的进入节奏。",
    image: sharedRouteSceneImage,
    imagePosition: "82% top",
  },
  "post-detail": {
    eyebrow: "Reading Panel // Detail",
    title: "封面、分镜与正文阅读",
    emphasis: "DETAIL",
    description:
      "详情页横幅收成三分之一屏，把真正的阅读空间让给正文和封面信息卡。",
    image: sharedRouteSceneImage,
    imagePosition: "82% top",
  },
  about: {
    eyebrow: "Profile Board // About",
    title: "关于创作方向与工具偏好",
    emphasis: "ABOUT",
    description:
      "关于页用独立横幅承接个人信息区，后续改成带浅层视差的展示面板会更自然。",
    image: sharedRouteSceneImage,
    imagePosition: "82% top",
  },
  fallback: {
    eyebrow: "System Route // Fallback",
    title: "站点分镜已切换",
    emphasis: "SYSTEM",
    description:
      "预留给后续新增页面的默认横幅配置，避免新增路由时先掉回空白首屏。",
    image: sharedRouteSceneImage,
    imagePosition: "82% top",
  },
} as const satisfies Record<string, RouteSceneConfig>;

export function resolveRouteScene(pathname: string): ResolvedRouteScene {
  if (pathname === "/") {
    return {
      sceneKey: "home",
      scene: routeScenes.home,
      isFullBanner: true,
    };
  }

  if (pathname === "/posts") {
    return {
      sceneKey: "posts",
      scene: routeScenes.posts,
      isFullBanner: false,
    };
  }

  if (pathname.startsWith("/posts/")) {
    return {
      sceneKey: "post-detail",
      scene: routeScenes["post-detail"],
      isFullBanner: false,
    };
  }

  if (pathname === "/about") {
    return {
      sceneKey: "about",
      scene: routeScenes.about,
      isFullBanner: false,
    };
  }

  return {
    sceneKey: "fallback",
    scene: routeScenes.fallback,
    isFullBanner: false,
  };
}
