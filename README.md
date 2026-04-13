# Manga Site Template

这是一个基于 `Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui` 的漫画感内容站模板。

项目当前保留了一套演示内容，但结构已经按“可复刻模板”整理过了。以后如果要换成别的品牌、别的站点主题，优先替换内容层，而不是改页面骨架。

## 当前原则

- 不保留历史设计稿和部署脚本
- 不保留暂时不用的远程 API 预留逻辑
- 页面只负责渲染，内容组装放在 feature 内部的 `service`
- 代码内统一使用中文注释，解释职责和边界

## 目录结构

```text
src
├─ app
│  ├─ app.tsx
│  └─ router.tsx
├─ features
│  ├─ about
│  ├─ home
│  └─ posts
├─ pages
│  └─ shared
├─ shared
│  ├─ components
│  ├─ lib
│  ├─ site
│  ├─ types
│  └─ ui
├─ index.css
└─ main.tsx
```

## 结构约定

- `src/features/*`
  - 按业务域组织代码。
  - 每个 feature 自己维护页面、内容、组件、loader 和 service。
- `src/shared/*`
  - 放跨页面复用的能力。
  - 包括全站布局、基础 UI、通用工具和共享类型。
- `src/pages/shared/*`
  - 放路由级共享页面，例如 `404` 和错误边界。

## 如何复刻这个项目

如果你想保留现在这套黑白漫画科技风，只替换站点内容，优先改这些位置：

- 站点级信息：`src/shared/site/site-config.ts`
- 浏览器标题和 favicon：`src/shared/site/site-metadata.ts`
- 首页内容：`src/features/home/home-page-content.ts`
- 关于页内容：`src/features/about/about-page-content.ts`
- 文章归档固定文案：`src/features/posts/posts-page-content.ts`
- 文章正文与 frontmatter：`src/features/posts/content/posts/*.md`

也就是说，正常情况下你不应该先去改页面组件，而应该先改内容文件。

## 开发命令

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
```

## 维护建议

- 新增页面时，优先在 `features` 下创建独立目录，不要继续把组件、数据、页面、服务拆散到全局目录
- 新增可复用能力时，再考虑放到 `shared`
- 新增内容字段时，先改 `src/shared/types/content.ts`，再改对应 feature 的内容文件和 service
