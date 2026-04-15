# 漫画感博客模板

一个基于 Vite + React + TypeScript + Tailwind CSS v4 的静态博客模板，采用漫画风格设计，适合游戏爱好者、技术博主和内容创作者。

## 特性

- **现代化技术栈**: Vite 6 + React 19 + TypeScript 5 + Tailwind CSS v4
- **组件化架构**: Feature-Sliced Design，模块化组织代码
- **Markdown 支持**: 原生 Markdown 写作，Frontmatter 元数据管理
- **SEO 友好**: 自动生成 RSS、Sitemap、Robots.txt
- **站内搜索**: Pagefind 全文搜索
- **响应式设计**: 移动端优先，完美适配各种设备
- **深色模式**: 自动/手动主题切换
- **Steam 集成**: 内置 Steam 档案展示模块（可选）
- **零配置部署**: 支持 GitHub Pages、Cloudflare、Vercel、Netlify

## 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+

### 安装与运行

```bash
# 克隆仓库
git clone <repository-url>
cd manga-site-template

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173 查看效果。

### 构建

```bash
# 类型检查
pnpm typecheck

# Lint 检查
pnpm lint

# 生产构建
pnpm build

# 预览构建产物
pnpm preview
```

## 目录结构

```
src/
├─ app/                    # 应用入口
│  ├─ app.tsx             # 主应用组件
│  └─ router.tsx          # 路由配置
├─ features/              # 业务功能模块
│  ├─ about/             # 关于页
│  ├─ home/              # 首页
│  ├─ posts/             # 文章系统
│  └─ steam/             # Steam 档案模块
├─ pages/shared/          # 共享页面（404、错误边界）
├─ shared/               # 共享能力层
│  ├─ components/site/   # 站点级组件
│  ├─ lib/               # 工具函数
│  ├─ site/              # 站点配置与主题
│  ├─ types/             # TypeScript 类型
│  └─ ui/                # UI 组件库
└─ index.css             # 全局样式

public/                   # 静态资源
doc/                      # 文档
```

## 如何新增文章

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

### 3. 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `excerpt` | 是 | 文章摘要 |
| `publishedAt` | 是 | 发布日期 (YYYY-MM-DD) |
| `author` | 是 | 作者名称 |
| `categoryKey` | 是 | 分类：technical/geek-life/tutorial/devlog/culture |
| `image.src` | 是 | 封面图路径 |
| `image.alt` | 是 | 封面图描述 |
| `coverRatio` | 是 | 封面比例：portrait/square/landscape/wide |
| `imageSide` | 是 | 列表页位置：left/right |
| `tags` | 是 | 标签数组 |
| `featured` | 否 | 是否精选（默认 false） |
| `draft` | 否 | 是否草稿（默认 false） |
| `series` | 否 | 系列文章名称 |
| `relatedGames` | 否 | 关联的 Steam 游戏 |

详细内容模型请参考 [doc/content-model.md](doc/content-model.md)。

## 如何替换站点信息

### 1. 修改品牌配置

编辑 `src/shared/site/site-config.ts`：

```typescript
export const siteConfig: SiteConfig = {
  brand: {
    primaryLabel: "你的博客名称",
    secondaryLabel: "YOUR BRAND",
  },
  navigation: [
    { label: "首页", to: "/" },
    { label: "文章", to: "/posts" },
    { label: "关于", to: "/about" },
  ],
  seo: {
    description: "你的博客描述",
    keywords: ["关键词1", "关键词2"],
  },
  // ...
}
```

### 2. 修改首页内容

编辑 `src/features/home/home-page-content.ts`，替换 Hero 区域文案、头像等。

### 3. 修改关于页内容

编辑 `src/features/about/about-page-content.ts`，替换个人信息、技能树、装备清单等。

### 4. 配置 Steam 档案（可选）

编辑 `src/features/steam/steam-content.ts`，设置你的 Steam 信息和游戏库。

详细定制指南请参考 [doc/customization-guide.md](doc/customization-guide.md)。

## Steam 模块配置

本模板内置了 Steam 档案展示功能，可以在关于页显示你的 Steam 游戏库。

### 启用 Steam 模块

Steam 模块默认已集成在关于页中。如需自定义或禁用：

1. 编辑 `src/features/about/about-page.tsx`
2. 注释或删除 Steam 相关组件

### 配置 Steam 数据

编辑 `src/features/steam/steam-content.ts`：

```typescript
export const steamProfileData: SteamProfileSummary = {
  profileUrl: 'https://steamcommunity.com/profiles/你的ID/',
  displayName: '你的Steam昵称',
  avatar: {
    src: '/images/steam-avatar.png',
    alt: 'Steam头像',
  },
  favoriteGenres: ['动作', 'RPG'],
  featuredGames: [
    {
      appId: 游戏ID,
      title: "游戏名称",
      steamUrl: "Steam商店链接",
      coverImage: "/images/games/游戏封面.jpg",
      playtimeHours: 游玩时长,
      status: 'finished',  // playing/finished/wishlist/backlog
    },
  ],
}
```

### 在文章中关联游戏

在文章 frontmatter 中添加 `relatedGames`：

```yaml
relatedGames:
  - appId: 2358720
    title: "黑神话：悟空"
    steamUrl: "https://store.steampowered.com/app/2358720/_/"
    note: "本文评测的游戏"
```

## 部署

支持多种静态托管平台：

- **GitHub Pages**: 使用 GitHub Actions 自动部署
- **Cloudflare Pages**: Git 集成或 Wrangler CLI
- **Vercel**: Git 集成或 Vercel CLI
- **Netlify**: Git 集成或 Netlify CLI

详细部署步骤请参考 [doc/deployment.md](doc/deployment.md)。

### 快速部署到 GitHub Pages

1. 在 `.github/workflows/` 创建 `deploy.yml`（参考 deployment.md）
2. 推送代码到 main 分支
3. GitHub Actions 会自动构建和部署

## 技术栈

- **框架**: React 19 + React Router 7
- **构建工具**: Vite 6
- **语言**: TypeScript 5
- **样式**: Tailwind CSS v4
- **UI 组件**: shadcn/ui + Radix UI
- **图标**: Lucide React
- **Markdown**: react-markdown + remark-gfm
- **搜索**: Pagefind
- **动画**: GSAP

## 维护建议

- **新增页面**: 在 `features/` 下创建独立目录
- **新增可复用能力**: 放到 `shared/`
- **新增内容字段**: 先改 `src/shared/types/content.ts`
- **代码规范**: 运行 `pnpm lint` 和 `pnpm typecheck` 确保质量

## 文档

- [内容模型规范](doc/content-model.md) - Frontmatter 字段说明
- [部署指南](doc/deployment.md) - 各平台部署步骤
- [自定义指南](doc/customization-guide.md) - 品牌替换和定制
- [架构评估](doc/01-current-architecture-assessment.md) - 当前架构分析
- [Steam 技术方案](doc/02-steam-integration-options.md) - Steam 集成方案
- [开源路线图](doc/03-open-source-blog-roadmap.md) - 发展规划

## License

MIT
