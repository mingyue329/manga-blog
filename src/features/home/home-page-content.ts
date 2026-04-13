import { getPublicAssetUrl } from '@/shared/lib/public-asset'
import type { HomePageStaticContent } from '@/shared/types/content'

/**
 * 首页静态内容配置。
 * 首页本身是模板骨架，这里只放可替换内容，不把展示逻辑写进数据层。
 */
export const homePageContent: HomePageStaticContent = {
  hero: {
    speechBubble: 'Hello_World',
    titleLead: '欢迎来到',
    titleHighlight: '星码绽放',
    description:
      '这里是代码、漫画感视觉和极客生活方式交汇的地方。页面保留强风格表达，同时把内容层独立出来，便于后续复刻成别的站点。',
    avatar: {
      src: getPublicAssetUrl('mp4/头像.mp4'),
      alt: '黑白漫画风格的站点头像视频',
    },
    actions: [
      { label: '开始浏览', to: '/posts', variant: 'ink' },
      { label: '了解更多', to: '/about', variant: 'outlineInk' },
    ],
  },
  statusPanel: {
    title: '正在运行 // STATUS',
    items: [
      {
        label: 'Current Project',
        value: 'MangaSite.Template',
        icon: 'terminal-square',
      },
      {
        label: 'Location',
        value: 'Content + Design System',
        icon: 'map-pin',
      },
    ],
    quote: '“保持风格，但不要把项目写成一次性作品。”',
  },
  updates: {
    title: '最新更新 // UPDATES',
    viewAllLink: {
      label: '查看全部 +',
      to: '/posts',
    },
  },
  playing: {
    title: '正在体验 // PLAYING',
    gameTitle: 'Final Fantasy VII Rebirth',
    progressLabel: '进度：85% 完成',
    progressValue: 85,
    note: '“好的内容站和好的 RPG 一样，节奏、氛围和细节缺一不可。”',
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
