import type { SiteConfig } from '@/types/content'

/**
 * 站点级静态配置。
 * 这部分数据由布局层共享，后续扩成多页后也不需要重复定义导航和页脚内容。
 */
export const siteConfig: SiteConfig = {
  brand: {
    primaryLabel: '萌极客',
    secondaryLabel: 'KAWAIITECH',
  },
  navigation: [
    { label: '首页', to: '/' },
    { label: '博文', to: '/posts' },
    { label: '关于', to: '/about' },
  ],
  quickActions: [
    {
      label: '游戏雷达',
      to: '/#playing',
      icon: 'gamepad-2',
      ariaLabel: '跳转到首页中的游戏版块',
    },
    {
      label: '技术栈',
      to: '/#stack',
      icon: 'code-2',
      ariaLabel: '跳转到首页中的技术栈版块',
    },
  ],
  footer: {
    links: [
      { label: 'RSS Feed', to: '/posts' },
      { label: 'GitHub', to: '/about' },
      { label: 'Privacy', to: '/about' },
    ],
    copyright: '© 2026 萌极客 // KAWAIITECH. ALL RIGHTS RESERVED.',
  },
}
