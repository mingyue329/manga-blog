# 项目结构说明

## 1. 技术栈

- `Vite`: 提供开发服务器和构建能力。
- `React 19`: 页面渲染核心。
- `TypeScript`: 提供静态类型约束。
- `react-router-dom`: 管理路由和 loader。
- `shadcn/ui`: 作为基础 UI 组件来源。
- `Tailwind CSS v4`: 负责原子化样式和主题变量。

## 2. 当前分层

### 2.1 路由层

- 文件：`src/app/router.tsx`
- 职责：
  - 声明应用路由结构。
  - 绑定首页、关于页、归档页 loader。
  - 提供 `*` 兜底页。

### 2.2 布局层

- 文件：`src/layouts/site-layout.tsx`
- 职责：
  - 统一挂载 Header、Footer。
  - 提供页面主体容器。
  - 托管自定义滚动逻辑。

### 2.3 数据层

- 文件：
  - `src/data/site-config.ts`
  - `src/data/home-page-content.ts`
  - `src/data/about-page-content.ts`
  - `src/data/posts-page-content.ts`
  - `src/content/posts/*.md`
  - `src/services/article-content-service.ts`
  - `src/services/api-client.ts`
  - `src/services/home-page-service.ts`
  - `src/services/about-page-service.ts`
  - `src/services/posts-page-service.ts`
- 职责：
  - 把页面静态配置、统一文章内容源与接口请求逻辑分开。
  - 保证未来改成真实 API 时，页面组件不用大改。

### 2.4 组件层

- `src/components/site`: 站点级公共组件，例如 Header、Footer。
- `src/components/home`: 首页业务区块组件。
- `src/components/about`: 关于页业务区块组件。
- `src/components/posts`: 文章归档页业务组件。
- `src/components/ui`: shadcn/ui 基础组件，已按当前设计系统做样式改造。

## 3. 为什么这样拆

### 3.1 先把静态设计转成“可维护的数据驱动页面”

首页虽然来自 Stitch 导出，但最终不是直接把 HTML 平移进 React，而是拆成：

- 内容配置
- 路由与数据服务
- 业务区块组件
- 基础 UI 组件

这样后面接接口、改文案、扩页面都不会回到“整页大改 JSX”的状态。

### 3.2 为后续真实接口保留入口

当前首页数据通过 `getHomePageContent()` 提供：

- 开发阶段默认读本地配置。
- 未来只要把 `VITE_USE_LOCAL_HOME_CONTENT` 设为 `false`，并让 `/api/home` 返回符合 `HomePageData` 的 JSON，就能切到真实接口。

### 3.3 统一文章内容源

当前文章系统不再由“列表页摘要数据 + 详情页 Markdown 正文”两份内容分别维护，而是统一成：

- `src/content/posts/*.md`

每篇 Markdown 文件同时承担两类信息：

1. frontmatter 元数据
2. 正文内容

frontmatter 当前承载这些字段：

- `slug`
- `title`
- `excerpt`
- `publishedAt`
- `author`
- `categoryKey`
- `image`
- `coverRatio`
- `imageSide`
- `series`
- `tags`
- `featured`
- `previewSections`

统一后的好处是：

- `/posts` 列表页直接从 Markdown frontmatter 派生卡片数据
- `/posts/:slug` 详情页直接读取同一篇文章的正文和元数据
- 首页“最新动态”也可以从同一份文章集合派生
- 后续接后台或 CMS 时，迁移边界更清晰

### 3.4 新页面已经接入真实 React 结构

当前目录中已经存在这些 Stitch 导出稿：

- `stitch/stitch_about_me_index`
- `stitch/stitch_about_me_about`
- `stitch/stitch_about_me_article`

当前实现状态：

1. `stitch_about_me_index` 已落成 `/`
2. `stitch_about_me_about` 已落成 `/about`
3. `stitch_about_me_article` 已落成 `/posts`
4. `stitch_about_me_articleDetails` 已落成 `/posts/:slug`

所以下一步推荐顺序是：

1. 把 `about`、`posts` 和 `posts/:slug` 的本地数据切换成 API
2. 再补搜索联想、排序和更多内容模块
3. 如果内容量继续增加，可以补目录导航、文章系列和评论接口

## 4. 推荐的后续扩展方式

### 4.1 接入关于页

- 新建 `src/pages/about/about-page.tsx`
- 新建 `src/components/about/*`
- 在 `src/app/router.tsx` 里把 `/about` 占位页替换成真实组件

### 4.2 接入文章页

- 当前 `src/pages/posts/posts-page.tsx` 已经是归档列表页。
- 当前 `src/pages/post-detail/post-detail-page.tsx` 已经实现了 `/posts/:slug`。
- 当前 `src/services/article-content-service.ts` 负责把 Markdown frontmatter 解析成站点统一文章模型。
- 文章详情页当前由三层组成：
  - `loader`: 从路由参数里读取 `slug`
  - `service`: 基于统一文章源组装文章摘要、Markdown 正文、上一篇 / 下一篇和相关文章
  - `page`: 只负责渲染统一后的详情布局
- Markdown 正文和文章元数据都放在 `src/content/posts/*.md`，这样内容编辑不需要直接修改 React 组件或额外维护一份摘要配置。

### 4.3 接接口

- 在 `src/services` 中新增对应 service 文件。
- 先定义返回类型。
- 再让页面 loader 调用 service。
- 页面组件继续只负责渲染。

## 5. 你重点可以学什么

- 如何把设计稿拆成 React 可维护结构。
- 如何用 `loader + service + page` 组织页面数据流。
- 如何在不破坏设计稿气质的前提下，接入 `shadcn/ui`。
- 如何用中文注释把“为什么这么写”说明清楚，而不是只写“做了什么”。
