# 自定义指南

本文档介绍如何定制博客模板以适应你的个人品牌和风格。

## 快速开始

```bash
# 克隆仓库
git clone <repository-url>
cd <project-name>

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:5173` 查看效果。

## 替换品牌信息

### 1. 修改站点配置

编辑 `src/shared/site/site-config.ts`：

```typescript
export const siteConfig: SiteConfig = {
  brand: {
    primaryLabel: "你的博客名称",      // 主品牌名
    secondaryLabel: "YOUR BRAND",     // 副品牌名/英文标识
  },
  // ...
}
```

### 2. 修改 SEO 信息

在同一文件中更新 `seo` 配置：

```typescript
seo: {
  description: "你的博客描述，用于搜索引擎",
  keywords: ["关键词1", "关键词2"],
},
```

### 3. 修改导航菜单

```typescript
navigation: [
  { label: "首页", to: "/" },
  { label: "文章", to: "/posts" },
  { label: "关于", to: "/about" },
  // 添加或删除导航项
],
```

### 4. 修改页脚链接

```typescript
footer: {
  links: [
    { label: "RSS Feed", to: "/rss.xml" },
    { label: "GitHub", to: "https://github.com/你的用户名" },
    // 添加社交媒体链接
  ],
  copyright: "© 2024 你的名字. ALL RIGHTS RESERVED.",
},
```

### 5. 修改社交链接

```typescript
socialLinks: [
  { platform: "github", url: "https://github.com/你的用户名", label: "GitHub" },
  { platform: "twitter", url: "https://twitter.com/你的用户名", label: "Twitter" },
  // 支持: github, twitter, linkedin, email
],
```

## 替换首页内容

编辑 `src/features/home/home-page-content.ts`：

```typescript
export const homePageContent: HomePageStaticContent = {
  hero: {
    speechBubble: "你好，我是...",        // 对话气泡文案
    titleLead: "探索",                    // 标题前缀
    titleHighlight: "游戏世界",           // 标题高亮部分
    description: "博客描述文字",          // 副标题
    avatar: {
      src: "/images/avatar.jpg",         // 头像路径
      alt: "头像描述",
    },
    actions: [                           // Hero 按钮
      { label: "阅读文章", to: "/posts", variant: "ink" },
      { label: "了解更多", to: "/about", variant: "outlineInk" },
    ],
  },
  // ...其他配置
}
```

## 替换关于页内容

编辑 `src/features/about/about-page-content.ts`：

```typescript
export const aboutPageContent: AboutPageData = {
  pageTitle: '关于我',
  profileName: '你的名字',
  profileTagline: '个人标语',
  profileLevel: 'LV. 99',              // 趣味等级显示
  profileImage: {
    src: '/images/about-avatar.jpg',
    alt: '关于页头像',
  },
  quote: '个人引言或座右铭',
  // ...其他配置
}
```

### 修改技能树

```typescript
skills: [
  {
    title: '前端开发',
    description: '技能描述',
    icon: 'terminal-square',            // 图标类型
    emphasized: true,                   // 是否强调
  },
  // 添加更多技能
],
```

### 修改装备清单

```typescript
gearItems: [
  {
    name: 'MacBook Pro',
    rarity: '传说',                      // 稀有度标签
    icon: 'laptop',                     // 图标类型
  },
  // 添加更多装备
],
```

## 替换 Steam 档案

编辑 `src/features/steam/steam-content.ts`：

```typescript
export const steamProfileData: SteamProfileSummary = {
  profileUrl: 'https://steamcommunity.com/profiles/你的ID/',
  displayName: '你的Steam昵称',
  avatar: {
    src: '/images/steam-avatar.png',
    alt: 'Steam头像',
  },
  favoriteGenres: ['动作', 'RPG'],      // 常玩类型
  featuredGames: [                       // 精选游戏
    {
      appId: 游戏ID,
      title: "游戏名称",
      steamUrl: "Steam商店链接",
      coverImage: "/images/games/游戏封面.jpg",
      playtimeHours: 游玩时长,
      status: 'finished',               // playing/finished/wishlist/backlog
      note: "备注",
    },
  ],
}
```

### 游戏状态说明

- `playing` - 正在游玩（绿色徽章）
- `finished` - 已通关（蓝色徽章）
- `wishlist` - 愿望单（黄色徽章）
- `backlog` - 待游玩（灰色徽章）

## 新增文章

### 1. 创建 Markdown 文件

在 `src/features/posts/content/posts/` 目录下创建新文件：

```markdown
---
title: "文章标题"
excerpt: "文章摘要，会在列表页显示"
publishedAt: "2024-01-15"
author: "作者名"
categoryKey: "geek-life"
image:
  src: "/images/posts/cover.jpg"
  alt: "封面图描述"
coverRatio: "landscape"
imageSide: "left"
tags: ["标签1", "标签2"]
featured: false
---

# 文章正文

这里是 Markdown 格式的文章内容...
```

### 2. 添加封面图

将封面图放入 `public/images/posts/` 目录。

### 3. 分类选择

可用的 `categoryKey`：
- `technical` - 技术文章
- `geek-life` - 极客生活
- `tutorial` - 教程指南
- `devlog` - 开发日志
- `culture` - 文化评论

## 修改主题样式

### 颜色主题

编辑 `src/shared/site/theme-options.ts` 可以调整主题色相：

```typescript
export const themeOptions = {
  defaultHue: 220,  // 0-360，调整主色调
  // ...
}
```

### 自定义 CSS

编辑 `src/index.css` 添加自定义样式：

```css
/* 覆盖默认变量 */
:root {
  --primary: oklch(0.70 0.14 220);  /* 主色 */
  --card-bg: oklch(0.98 0.01 220);  /* 卡片背景 */
}
```

## 修改布局

### 添加新页面

1. 在 `src/features/` 下创建新目录
2. 创建页面组件和 loader
3. 在 `src/app/router.tsx` 中添加路由

示例：

```typescript
// src/features/contact/contact-page.tsx
export function ContactPage() {
  return <div>联系页面内容</div>
}

// src/app/router.tsx
{
  path: 'contact',
  element: <ContactPage />,
}
```

### 修改导航结构

编辑 `site-config.ts` 中的 `navigation` 数组即可。

## 高级定制

### 添加新的内容模块

参考 Steam 模块的实现方式：

1. 创建 `src/features/模块名/` 目录
2. 定义类型 (`types.ts`)
3. 创建数据源 (`content.ts`)
4. 实现服务层 (`service.ts`)
5. 开发 UI 组件 (`components/`)
6. 在页面中集成

### 扩展 Frontmatter 字段

1. 在 `src/shared/types/content.ts` 中添加类型定义
2. 在 `article-frontmatter-schema.ts` 中添加校验逻辑
3. 在 `article-derived-data.ts` 中处理数据转换

## 部署配置

详见 [deployment.md](./deployment.md)

## 故障排查

### 构建失败

```bash
# 清除缓存重新安装
rm -rf node_modules .vite
pnpm install
pnpm build
```

### 类型错误

```bash
pnpm typecheck
```

查看详细错误信息并修复。

### 样式问题

检查 Tailwind CSS 类名是否正确，确保使用了项目中定义的 utility classes。

## 获取帮助

- 查看项目 README.md
- 参考 doc/ 目录下的其他文档
- 查阅代码注释了解各模块职责
