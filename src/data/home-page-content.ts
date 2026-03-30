import type { HomePageData } from '@/types/content'

/**
 * 首页静态内容配置。
 * 当前版本先使用本地数据驱动页面，等后续接接口时只需要替换 service 层即可。
 */
export const homePageContent: HomePageData = {
  hero: {
    speechBubble: 'Hello_World',
    titleLead: '欢迎来到',
    titleHighlight: '星码绽放',
    description:
      '在这里，代码与二次元灵魂共鸣。探索极客技术与萌系文化的奇妙边界。',
    avatar: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBKa7nI5Rgrhq1RZ4Zkk-HedmseBgdo_LfWQHnv4p8jm5qQRQowRz2j43fpR-OUSfNeiIKawUfABc2mcVYy6LjOY1rBKKye0vl0PxGvkC114PYj3q5S5sHlTUSJeOZIeQda3h57CJrW4DaWfYSiKF2IgBFWCfprJXqUIh8mb54ienVjhQZHngh2tQF0BMioJgFALlk2RDQSvYyFaHHB2uhcthXheL-vMZpZqHH8nB2LoekFx33CQKjjx2j660u-DNJ9A6KiXdEpkiO',
      alt: '黑白漫画风格的技术博客头像插画',
    },
    actions: [
      { label: '开启探索', to: '/posts', variant: 'ink' },
      { label: '了解更多', to: '/about', variant: 'outlineInk' },
    ],
  },
  statusPanel: {
    title: '正在运行 // STATUS',
    items: [
      {
        label: 'Current Project',
        value: 'MangaEngine.v2',
        icon: 'terminal-square',
      },
      {
        label: 'Location',
        value: 'Neo-Cyberpunk-City',
        icon: 'map-pin',
      },
    ],
    quote: '“永不停止编程，直到世界变成 2D。”',
  },
  updates: {
    title: '最新动态 // UPDATES',
    viewAllLink: {
      label: '查看全部 +',
      to: '/posts',
    },
    items: [
      {
        tag: 'DevLog',
        title: '如何用 Rust 重构我的萌系引擎',
        description:
          '深入拆解我把性能优化、工具链整理和二次元视觉表达合并到同一套引擎里的全过程。',
        date: '2024.05.20',
        to: '/posts',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKfaGDfw41oumydScE06iAIurMFNh1ISrlX1Y9kRZjYhyEFBO1N1e1ZDz2PyaNHW5KjDSqdwIXevOPL4Z8Z5zeRWMYq6YUfWF-O01n-Nfancl4wiEfhfkIX5Dl8mAnk5BEY3O4_bzv22HWpq3TijcCV_qIIM8p8F6iqqERYtOU3HghLpWXA4ne2dydz3J-1ItjQbQQB-8l2TI20QaUXa8ufFGmV0-xyOeb8UCtboGSdX7z3-oST0pJTZif-yaQvRSWs9E1Oh-mOWER',
          alt: '黑白风格的技术文章封面图',
        },
      },
      {
        tag: 'Review',
        title: '2024 必玩的独立萌系游戏推荐',
        description:
          '从像素美术到手绘叙事，这些独立游戏不仅好玩，而且每一款都有强烈的作者表达。',
        date: '2024.05.15',
        to: '/posts',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC-GNnH8cCybPduR_0FMJa4KqOML-iYDH55SqfjV8k0K6gFqJNNOtbRUGF785YLSQst8Yc5x0n1eWTg9SlwwgmGsCKPVUZaXS6A6pi4eidnS2MvMbaV3hWSP4mEyfgm5bEYCK7vIkNqMgdFH2MUHDTcFh7HHPwqkimL55d9xxuPTV2sovAZIBDWYgeb9n7EyU1vSIiUUk587lMqifpDWYOEW8j0VWenQbLDTolIR0_U-8juWXAr1j_yVAZ9KAx38Kvs3XgIKDfKVcr',
          alt: '黑白风格的游戏评测封面图',
        },
      },
      {
        tag: 'Opinion',
        title: '为什么极客都爱黑白极简主义？',
        description:
          '聊聊当色彩被压缩到最少之后，为什么结构、节奏和信息密度反而会变得更有力量。',
        date: '2024.05.08',
        to: '/posts',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7jXtH_4KjVXJNEJodB22tcooK64cRK4BC-7GIsuGJbF85fmnXZfmLd5Eoz-SCK3_eZG9hD82k3mr9abKKibkOhQtnO2IgYxzO5bSBF1QfYhLv_6V3kPeRLj4AarnUJuVV7XQxFXnr0TO5XScOpf097LU4wgwymrl_0W5kl91GxbLefBBsuKN56dfH4ozhhm_eb-0QfXWBGGO0bYsb2UrRyNsQJt5dwVZAwnqbm7FWk0wjbB5MVXa-WKzkyrJzjSI92moU7iziwX50',
          alt: '黑白风格的观点文章封面图',
        },
      },
    ],
  },
  playing: {
    title: '正在游玩 // PLAYING',
    gameTitle: '最终幻想 VII: 重生',
    progressLabel: '进度：85% 完成',
    progressValue: 85,
    note: '“从战斗演出到角色塑造，这次重制把热血和心碎都拉满了。”',
  },
  stack: {
    title: '技术栈 // STACK',
    items: [
      { name: 'RUST', icon: 'terminal-square' },
      { name: 'TYPESCRIPT', icon: 'braces' },
      { name: 'POSTGRES', icon: 'database' },
      { name: 'DOCKER', icon: 'container' },
      { name: 'FIGMA', icon: 'figma' },
      { name: 'TAILWIND', icon: 'wind' },
    ],
  },
}
