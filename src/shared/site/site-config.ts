import type { SiteConfig } from '@/shared/types/content'

/**
 * 站点级配置。
 * 这里收口品牌、导航和页脚信息，复刻模板时优先改这里，而不是直接改布局组件。
 */
export const siteConfig: SiteConfig = {
  brand: {
    primaryLabel: '望月屋',
    secondaryLabel: 'KAWAIITECH',
  },
  navigation: [
    { label: '首页', to: '/' },
    { label: '文章', to: '/posts' },
    { label: '关于', to: '/about' },
  ],
  quickActions: [
    {
      label: '正在体验',
      to: '/#playing',
      icon: 'gamepad-2',
      ariaLabel: '跳转到首页中的正在体验板块',
    },
    {
      label: '技术栈',
      to: '/#stack',
      icon: 'code-2',
      ariaLabel: '跳转到首页中的技术栈板块',
    },
  ],
  footer: {
    links: [
      { label: 'RSS Feed', to: '/posts' },
      { label: 'GitHub', to: '/about' },
      { label: 'Privacy', to: '/about' },
    ],
    copyright: '© 2026 KAWAIITECH. ALL RIGHTS RESERVED.',
  },
}
