import type { HomePageStaticContent } from '@/types/content'

/**
 * 首页静态内容配置。
 * 这里保留页面固定文案和视觉信息；“最新动态”里的文章卡片会由统一文章内容源动态生成。
 */
export const homePageContent: HomePageStaticContent = {
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
