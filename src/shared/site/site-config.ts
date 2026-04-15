import type { SiteConfig } from "@/shared/types/content";

/**
 * 站点级配置。
 * 这里收口品牌、导航和页脚信息，复刻模板时优先改这里，而不是直接改布局组件。
 */
export const siteConfig: SiteConfig = {
  brand: {
    primaryLabel: "明月几时有",
    secondaryLabel: "",
  },
  navigation: [
    { label: "首页", to: "/" },
    { label: "文章", to: "/posts" },
    { label: "关于", to: "/about" },
  ],
  quickActions: [
    {
      label: "正在体验",
      to: "/#playing",
      icon: "gamepad-2",
      ariaLabel: "跳转到首页中的正在体验板块",
    },
    {
      label: "Steam",
      to: "https://steamcommunity.com/profiles/76561198811570805/",
      icon: "steam",
      ariaLabel: "打开 Steam 社区主页",
      external: true,
    },
    {
      label: "技术栈",
      to: "/#stack",
      icon: "code-2",
      ariaLabel: "跳转到首页中的技术栈板块",
    },
  ],
  footer: {
    links: [
      { label: "RSS Feed", to: "/rss.xml" },
      { label: "GitHub", to: "/about" },
      { label: "Privacy", to: "/about" },
    ],
    copyright: "© 2026 明月几时有. ALL RIGHTS RESERVED.",
  },
  seo: {
    description: "一个专注于游戏评测与技术分享的静态博客模板",
    keywords: ["游戏评测", "技术分享", "博客模板", "React", "TypeScript"],
  },
  socialLinks: [
    { platform: "github", url: "https://github.com", label: "GitHub" },
    { platform: "twitter", url: "https://twitter.com", label: "Twitter" },
  ],
  hero: {
    titleLead: "探索",
    titleHighlight: "游戏世界",
    description: "记录游戏体验、技术心得与创作思考的漫画感内容站",
  },
};
