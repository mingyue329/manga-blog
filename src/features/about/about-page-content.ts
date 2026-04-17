import type { AboutPageData } from "@/shared/types/content";

/**
 * 关于页静态内容。
 * 这里保留一套演示数据，用来说明这套风格如何承载“个人档案式”内容。
 */
export const aboutPageContent: AboutPageData = {
  pageTitle: "关于我",
  pageTitleHighlight: "PLAYER INFO",
  profileName: "明月几时有",
  profileTagline: "但愿人长久，千里共婵娟",
  profileLevel: "LV. 99",
  profileImage: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIj1y2-B2PstT6_nLDySxBzARH1XK-glyzF02Yl-u_kaPNvc7-TIf21TwVBFDbIo0GLaX6TxRVZEVwkbhUUZXQLN5C9mPWXTK5UVxjAKLNCx6cy3ulAs5BHeQl1utTv9rpza-usWNeZ9JgFbZSlW1BynBATi57huiBVNAlUgE3KWFUh9Bzzm9IfIHrfFUDd5HuUqUpzXiVdSfRiT4942Zg-afZZ93b6SjmsbmWMEzk5vAjHwJqbHFMOz7xmtNUXZy5LZ-kOQIXrqeo",
    alt: "黑白漫画风格的人物头像",
  },
  quote:
    "比起修复 Bug，我更喜欢把它们重构成真正可持续的方案。这既是写代码的方式，也是做产品的方式。",
  sectionLinks: [
    { id: "identity", label: "玩家信息" },
    { id: "stats", label: "能力面板" },
    { id: "gear", label: "装备清单" },
    { id: "frames", label: "漫画分镜" },
  ],
  statsTitle: "玩家属性 // STATS",
  stats: [
    {
      label: "咖啡摄入量",
      secondaryLabel: "Coffee Intake",
      value: 92,
      valueText: "92%",
    },
    {
      label: "代码除虫",
      secondaryLabel: "Bug Squashing",
      value: 75,
      valueText: "75%",
    },
    {
      label: "熬夜能力",
      secondaryLabel: "Late Night Grind",
      value: 100,
      valueText: "MAX",
    },
  ],
  skillsTitle: "技能树 // SKILL TREE",
  skills: [
    {
      title: "前端架构",
      description: "擅长把复杂需求拆成稳定组件、清晰状态流和可维护的页面结构。",
      icon: "terminal-square",
    },
    {
      title: "视觉设计",
      description: "擅长把二次元气质、漫画排版和技术感元素收束成统一界面语言。",
      icon: "figma",
      emphasized: true,
    },
    {
      title: "内容系统",
      description:
        "擅长把内容模型、展示层和模板边界梳理清楚，便于后续持续迭代。",
      icon: "database",
    },
  ],
  gearTitle: "装备清单 // EQUIPMENT GEAR",
  gearItems: [
    { name: "HHKB Hybrid", rarity: "LEGENDARY ITEM", icon: "keyboard" },
    { name: "MX Master 3S", rarity: "RARE ITEM", icon: "mouse" },
    { name: "MacBook Pro M3", rarity: "MYTHIC ITEM", icon: "laptop" },
    { name: "Sony WH-1000XM5", rarity: "UNCOMMON ITEM", icon: "headphones" },
    { name: "Fujifilm X100V", rarity: "LEGENDARY ITEM", icon: "camera" },
    { name: "V60 Dripper", rarity: "CONSUMABLE", icon: "coffee" },
  ],
  showcasePanels: [
    {
      type: "image",
      image: {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpFSLjAUuN2er_6shjLXMBVV3yJzWnlFyR1rCEI9gGHIfgeZ-r1lYet6Zo3cBLL8VePyOl1ufu6k9jseMgMLiFraNUmsMR24i7RmXP1PxF0nnR901xVJBOv9TB81TWw2pFNy5KA2L64Tig2kVoPa-B8kjt-blGEMDqOjnumVefKh_KqnkZRjPL0-FXm1FTQjApvK3rI8KvKWOxEzaPu7D8hlQBVTUR5dI-TGhIyB0uI6MogzXyLcjeAYsEg4N3YogtCp6Id8xtMeKA",
        alt: "黑白漫画风格的键盘特写",
      },
      accentLabel: "Clack! Clack!",
    },
    {
      type: "statement",
      statement: "CODE!",
    },
    {
      type: "image",
      image: {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhgO67liDDOP_EmXOz3dlCtaVJcCcjpxYXP7SkYtWNGvdoTye0-6yZIDHww6wlJLyi0Bf93JJRxk8QYn24EL6AOl_-FpSdMZwaTVFjzHFtnNB2SaB4zx3mxhnhPgqbPPxMCNGX64ax38NOLqh7ZI1I36_GsAvEI0ThhujjhFrOuWNpP8SGUgDAJRI1aXgtNkPpXM7bXKePFJfWacvqaOV-ULMtmoCo8dUU3jyS4xHmTCgm5JdxKyNQtjUIlKgGdPr-TUv3vkQV_5Cv",
        alt: "黑白漫画风格的咖啡与桌面分镜",
      },
      accentLabel: "Sip...",
    },
  ],
};
