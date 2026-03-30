import type { AboutPageData } from '@/types/content'

/**
 * 关于页静态内容。
 * 这些数据来自 Stitch 导出稿的视觉结构整理，当前先作为本地数据源，后续可以改为接口返回。
 */
export const aboutPageContent: AboutPageData = {
  pageTitle: '关于我',
  pageTitleHighlight: 'PLAYER INFO',
  profileName: 'Kawaii Code',
  profileTagline: '在二进制的海洋中绘制星迹',
  profileLevel: 'LV. 99',
  profileImage: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIj1y2-B2PstT6_nLDySxBzARH1XK-glyzF02Yl-u_kaPNvc7-TIf21TwVBFDbIo0GLaX6TxRVZEVwkbhUUZXQLN5C9mPWXTK5UVxjAKLNCx6cy3ulAs5BHeQl1utTv9rpza-usWNeZ9JgFbZSlW1BynBATi57huiBVNAlUgE3KWFUh9Bzzm9IfIHrfFUDd5HuUqUpzXiVdSfRiT4942Zg-afZZ93b6SjmsbmWMEzk5vAjHwJqbHFMOz7xmtNUXZy5LZ-kOQIXrqeo',
    alt: '黑白漫画风格的人物档案头像',
  },
  quote:
    '比起修复 Bug，我更喜欢把它们变成 Feature。这就是我的忍道，也是我做产品和写代码的方式。',
  sectionLinks: [
    { id: 'identity', label: '玩家信息' },
    { id: 'stats', label: '能力面板' },
    { id: 'gear', label: '装备清单' },
    { id: 'frames', label: '漫画分镜' },
  ],
  statsTitle: '玩家属性 // STATS',
  stats: [
    {
      label: '咖啡摄入量',
      secondaryLabel: 'Coffee Intake',
      value: 92,
      valueText: '92%',
    },
    {
      label: '代码除虫',
      secondaryLabel: 'Bug Squashing',
      value: 75,
      valueText: '75%',
    },
    {
      label: '熬夜能力',
      secondaryLabel: 'Late Night Grind',
      value: 100,
      valueText: 'MAX',
    },
  ],
  skillsTitle: '技能树 // SKILL TREE',
  skills: [
    {
      title: '前端架构',
      description: '负责把复杂需求拆成稳定组件、清晰状态流和可维护的页面结构。',
      icon: 'terminal-square',
    },
    {
      title: '视觉设计',
      description: '负责把二次元气质、漫画排版和技术表达收敛成统一的界面语言。',
      icon: 'figma',
      emphasized: true,
    },
    {
      title: '后端逻辑',
      description: '负责把接口契约、缓存策略和业务约束整理成可靠的数据服务。',
      icon: 'database',
    },
  ],
  gearTitle: '装备清单 // EQUIPMENT GEAR',
  gearItems: [
    { name: 'HHKB Hybrid', rarity: 'LEGENDARY ITEM', icon: 'keyboard' },
    { name: 'MX Master 3S', rarity: 'RARE ITEM', icon: 'mouse' },
    { name: 'MacBook Pro M3', rarity: 'MYTHIC ITEM', icon: 'laptop' },
    { name: 'Sony WH-1000XM5', rarity: 'UNCOMMON ITEM', icon: 'headphones' },
    { name: 'Fujifilm X100V', rarity: 'LEGENDARY ITEM', icon: 'camera' },
    { name: 'V60 Dripper', rarity: 'CONSUMABLE', icon: 'coffee' },
  ],
  showcasePanels: [
    {
      type: 'image',
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFSLjAUuN2er_6shjLXMBVV3yJzWnlFyR1rCEI9gGHIfgeZ-r1lYet6Zo3cBLL8VePyOl1ufu6k9jseMgMLiFraNUmsMR24i7RmXP1PxF0nnR901xVJBOv9TB81TWw2pFNy5KA2L64Tig2kVoPa-B8kjt-blGEMDqOjnumVefKh_KqnkZRjPL0-FXm1FTQjApvK3rI8KvKWOxEzaPu7D8hlQBVTUR5dI-TGhIyB0uI6MogzXyLcjeAYsEg4N3YogtCp6Id8xtMeKA',
        alt: '黑白漫画风格的键盘特写',
      },
      accentLabel: 'Clack! Clack!',
    },
    {
      type: 'statement',
      statement: 'CODE!',
    },
    {
      type: 'image',
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhgO67liDDOP_EmXOz3dlCtaVJcCcjpxYXP7SkYtWNGvdoTye0-6yZIDHww6wlJLyi0Bf93JJRxk8QYn24EL6AOl_-FpSdMZwaTVFjzHFtnNB2SaB4zx3mxhnhPgqbPPxMCNGX64ax38NOLqh7ZI1I36_GsAvEI0ThhujjhFrOuWNpP8SGUgDAJRI1aXgtNkPpXM7bXKePFJfWacvqaOV-ULMtmoCo8dUU3jyS4xHmTCgm5JdxKyNQtjUIlKgGdPr-TUv3vkQV_5Cv',
        alt: '黑白漫画风格的咖啡与桌面分镜',
      },
      accentLabel: 'Sip...',
    },
  ],
}
