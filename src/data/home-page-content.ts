import { getPublicAssetUrl } from '@/lib/public-asset'
import type { HomePageStaticContent } from '@/types/content'

/**
 * 首页静态内容配置。
 * 这里保留页面固定文案和视觉信息；“最新动态”里的文章卡片会由统一文章内容源动态生成。
 * 头像这类 public 静态资源必须通过 `getPublicAssetUrl` 处理，避免 GitHub Pages 子路径部署时
 * 因为缺失仓库名前缀而出现资源 404。
 */
export const homePageContent: HomePageStaticContent = {
  hero: {
    speechBubble: 'Hello_World',
    titleLead: '欢迎来到',
    titleHighlight: '星码绽放',
    description:
      '在这里，代码与二次元灵魂共鸣。探索极客技术与萌系文化的奇妙边界。',
    avatar: {
      src: getPublicAssetUrl('mp4/头像.mp4'),
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
    quote: '“永不停歇编程，直到世界变成 2D。”',
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
