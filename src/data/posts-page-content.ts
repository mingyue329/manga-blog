import type { PostsArchivePageData } from '@/types/content'

/**
 * 文章归档页静态内容。
 * 当前页面使用本地数据驱动，同时为后续接文章接口保留了 slug、tags 和 previewSections 等扩展字段。
 */
export const postsArchivePageContent: PostsArchivePageData = {
  pageTitle: '博文归档',
  pageTitleHighlight: 'ARCHIVE.2024',
  searchPlaceholder: '搜索存档...',
  tagsTitle: '话题标签',
  tags: ['开发日志', '硬件DIY', '漫展日常', '极客美学', '教程拆解'],
  hallOfFameTitle: '荣誉殿堂',
  hallOfFameMembers: [
    { rank: '01', name: '林克 Link', role: 'MVP Contributor' },
    { rank: '02', name: '黑客猫酱', role: 'Top Commenter' },
    { rank: '03', name: '字节跃动', role: 'Tech Explorer' },
  ],
  pageSize: 3,
  posts: [
    {
      slug: 'quantum-computing-manga-explainer',
      title: '深度解析：从物理底层理解量子计算的未来',
      excerpt:
        '在这篇文章里，我尝试跳过复杂公式，用更直观的漫画式分镜去解释量子叠加、纠缠和容错为什么会改写未来的计算边界。',
      date: '2024.03.15',
      categoryKey: 'technical',
      categoryLabel: 'TECHNICAL',
      imageSide: 'left',
      tags: ['开发日志', '极客美学'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYhxXCG4DCU-LhBkMGIj6q5qlS8xsnYkWg_VRBOQ0JXRwg1MLknNDUXxaeyKrRxyBQrIKZH5-311louNtG3zx-jdMvQbCaKoqVC_rkQL8zmGNskng79u4g6JfCQhNSg-WSrkQF1tCr34nwPwLQvuLR_5G-xc-_ulpe6KDMqbyak6KauK337eI4W_Sf9TPZuj6hHNZ8vfLglbsp12gjXpkHFQ0dYiXFvDKHxRC0AU0n_QEa-pfbonRrYgZQsoS7Zn7MxC1jDfGOXvj5',
        alt: '黑白漫画风格的代码与终端屏幕',
      },
      previewSections: [
        {
          heading: '为什么要用故事讲量子计算',
          content:
            '如果一开始就用线性代数和态向量轰炸读者，大部分人会在第一页就失去兴趣。我的做法是先建立直觉：把量子位看成一个会同时站在多个时间线上的角色，让读者先理解“为什么它和普通比特不同”。',
        },
        {
          heading: '真正值得关注的不是神秘感，而是误差控制',
          content:
            '量子计算的浪漫之处在于它像魔法，量子计算的现实之处在于它极度脆弱。真正决定产业化速度的，不是宣传里那些震撼词，而是纠错码、退相干时间和工程可靠性。',
        },
      ],
    },
    {
      slug: 'akihabara-geek-pilgrimage',
      title: 'Akihabara：极客灵魂的朝圣之旅',
      excerpt:
        '在秋叶原，硬件和文化从来不是两条线。二手元件店、老游戏机、同人刊和地下工作室构成了一种独有的技术生活方式。',
      date: '2024.03.02',
      categoryKey: 'geek-life',
      categoryLabel: 'GEEK LIFE',
      imageSide: 'right',
      tags: ['漫展日常', '极客美学'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5AtSV-FS3eil16NmQljlvNuXB4zsE9_KDp3nPySSe6PgiCeELQWEOl91FCdiESGHzrW8nkogjmId-Q4c1wNeGd7DxBTE16xLQGFx0OzPBnh0Wq6qE5TuTraH1nToMArJr-Zm4RnOUxpEh-sd3J1GcsZy0BfVGOpi8CslCVD3uCwEEBIL8rr44EYrARiKE7iea7P4IjT-6FlRL5BdWW1PRoBS5Ly94E_vSWkXV1ZR8TXDYSMMYW6rmrwZkU1z3IMMlUkl40jtucuQx',
        alt: '黑白漫画风格的爆炸式视觉特效',
      },
      previewSections: [
        {
          heading: '为什么秋叶原不是简单的购物地标',
          content:
            '真正吸引我的不是“买到什么”，而是“在那里会被怎样的创造欲包围”。你会在同一条街上看到元件、模型、漫画、游戏和独立开发者留下的痕迹，这种密度本身就很罕见。',
        },
        {
          heading: '硬件考古和文化朝圣是同一件事',
          content:
            '当你拿起一块老式声卡或者翻到一本九十年代的技术杂志时，那不是简单的怀旧，而是重新理解一代创作者如何在当时的约束条件下做出今天仍有生命力的作品。',
        },
      ],
    },
    {
      slug: 'build-your-insomniac-server',
      title: '如何构建属于你的“不眠”服务器？',
      excerpt:
        '从树莓派到机架式设备，这篇文章把家庭实验室的搭建过程拆成清晰步骤，帮助你构建长期稳定运行的个人服务节点。',
      date: '2024.02.20',
      categoryKey: 'tutorial',
      categoryLabel: 'TUTORIAL',
      imageSide: 'left',
      tags: ['教程拆解', '硬件DIY'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkqwtJplAOghcw7VtIX_uyUif-cr6wKrSA2W-tEgix3dd0_9M4xdlYXHupVdA93o_uIwQnArW_pL9VDBH3brnBKF52JvxvuVBv8ADVbCHImEZA65VcTzzhVLsW29_XoLHZQH_XNYhsQqe0lajAL9p7v8A1MfPP7xzLY9MkStBISZwpt50T8JkB1UzQMiYjHQw6tq1hu0-WsJQZcAT5plk7_RogumKJwAAaFaerNVHznBZTFUOInzruxvE8QuoF743L4qSNop6QcKPW',
        alt: '黑白漫画风格的桌面与键盘布局',
      },
      previewSections: [
        {
          heading: '先明确服务目标，再选硬件',
          content:
            '很多人上来就堆配置，最后机器很强，但用途很散。正确顺序应该是先问清楚要跑什么：是媒体库、自动化脚本、个人博客，还是研发测试环境。用途决定硬件，不是反过来。',
        },
        {
          heading: '稳定运行比峰值性能更重要',
          content:
            '家庭服务器最怕的不是跑不快，而是半夜掉线没人知道。所以我的建议永远是优先关注散热、磁盘策略、备份方案和监控，而不是先纠结 CPU 多几个核。',
        },
      ],
    },
    {
      slug: 'designing-with-screentones',
      title: '用网点和速度线重建技术博客的视觉节奏',
      excerpt:
        '当你把传统 UI 里的轻边框换成漫画网点、偏移阴影和不对称标题后，页面会立刻摆脱模板感，这篇文章专门聊我是怎么做的。',
      date: '2024.02.06',
      categoryKey: 'devlog',
      categoryLabel: 'DEVLOG',
      imageSide: 'right',
      tags: ['开发日志', '极客美学'],
      image: {
        src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
        alt: '黑白风格的设计与代码工作台',
      },
      previewSections: [
        {
          heading: '先拆语气，再拆视觉',
          content:
            '设计风格不是“加点装饰”就成立的，它首先是语气。这个博客的语气是张扬、锋利、热血，但不能吵，所以我先定义标题、边框、阴影和留白各自承担什么情绪，再决定具体元素。',
        },
        {
          heading: '真正有用的是一套可重复的视觉语法',
          content:
            '如果每一块都靠灵感做，最终只会很乱。可维护的做法是抽象出稳定规则：哪些地方允许黑底白字，哪些地方用网点，哪些按钮必须留实边框，剩下的变化才有边界。',
        },
      ],
    },
    {
      slug: 'retro-hardware-diary',
      title: '复古硬件手记：我为什么还在收老键盘和老相机',
      excerpt:
        '有些设备并不高效，却能提醒我技术不是只追求新和快，它也可以关于触感、声音、重量，以及人与工具之间的关系。',
      date: '2024.01.18',
      categoryKey: 'culture',
      categoryLabel: 'CULTURE',
      imageSide: 'left',
      tags: ['硬件DIY', '漫展日常'],
      image: {
        src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
        alt: '黑白风格的复古相机与桌面设备',
      },
      previewSections: [
        {
          heading: '老设备的价值不是怀旧滤镜',
          content:
            '我喜欢老设备，不是因为它们“有年代感”，而是因为它们的交互逻辑往往更直接，制造方式更坦诚。你能很明显感受到设计者在当时做过怎样的取舍。',
        },
        {
          heading: '收藏最终会反过来影响写代码的方式',
          content:
            '当你长期接触这些被打磨过的工具，就会更在意产品里的物理感和节奏感。哪怕是写一个网页按钮，也会开始在意反馈是否清脆、布局是否有力度。',
        },
      ],
    },
  ],
}
