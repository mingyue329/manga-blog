# 2026-03-31 代码阅读指南

## 1. 这份文档怎么用

这不是功能清单，而是一份“按文件阅读”的学习路线。建议你不要一口气把所有文件都打开，而是按下面的顺序一层层看，这样更容易理解项目是怎么组织起来的。

## 2. 推荐阅读顺序

建议按这个顺序读：

1. `src/app/router.tsx`
2. `src/pages/post-detail/post-detail-page.loader.ts`
3. `src/services/post-detail-page-service.ts`
4. `src/pages/post-detail/post-detail-page.tsx`
5. `src/components/posts/post-markdown.tsx`
6. `src/components/posts/posts-archive-list.tsx`
7. `src/components/posts/post-preview-sheet.tsx`
8. `src/components/site/interactive-dot-background.tsx`
9. `src/layouts/site-layout.tsx`
10. `src/index.css`

## 3. 逐文件阅读说明

### 3.1 `src/app/router.tsx`

阅读目标：

- 理解项目有哪些页面
- 理解页面和 loader 是怎么绑定的
- 理解详情页路由为什么是 `/posts/:slug`

你应该重点看什么：

- 首页、归档页、关于页、详情页分别怎么挂载
- `SiteLayout` 是怎么包住所有子路由的
- `errorElement` 为什么要放在布局层

你能学到什么：

- React Router 在中型项目里的基本组织方式
- 为什么要在路由层决定 loader，而不是在页面内部自己请求

### 3.2 `src/pages/post-detail/post-detail-page.loader.ts`

阅读目标：

- 理解路由参数怎么进入页面数据流

你应该重点看什么：

- `params.slug` 的读取
- 为什么这里不直接写一堆业务逻辑
- 为什么缺少 `slug` 时直接抛出 `Response`

你能学到什么：

- loader 层应该尽量薄
- 参数校验和数据获取入口可以先在这里收口

### 3.3 `src/services/post-detail-page-service.ts`

阅读目标：

- 理解详情页真正的数据是怎么拼出来的

这份文件是今天最值得反复看的文件之一。

你应该重点看什么：

- `getMarkdownContentBySlug`
- `buildFallbackMarkdown`
- `getReadingTimeText`
- `buildPostReference`
- `buildRelatedPosts`
- `getPostDetailPageContent`

你能学到什么：

- service 层为什么适合处理“数据加工”
- 本地静态内容和远程接口切换应该放在哪一层
- 为什么上一篇 / 下一篇 / 相关文章都不应该直接写在页面组件里

阅读建议：

- 先看最底部的 `getPostDetailPageContent`
- 再倒着看它依赖了哪些辅助函数
- 最后再看文件顶部的 Markdown 读取逻辑

### 3.4 `src/pages/post-detail/post-detail-page.tsx`

阅读目标：

- 理解详情页 JSX 是怎么分块组织的

你应该重点看什么：

- `renderArticleMetaItems`
- `renderPostNavigationCard`
- `renderRelatedPostCards`
- `PostDetailPage`

你能学到什么：

- 一个复杂页面怎么拆成“页面内部小函数”
- 为什么要把重复结构抽成渲染函数
- 页面组件如何尽量专注于布局，而不是数据处理

阅读建议：

- 先看 `PostDetailPage` 最外层返回结构
- 再看它调用了哪些渲染函数
- 最后再看每个渲染函数内部的 JSX 细节

### 3.5 `src/components/posts/post-markdown.tsx`

阅读目标：

- 理解 Markdown 样式为什么要单独收口

你应该重点看什么：

- 为什么是外层 `div` 挂 class，而不是直接给 `ReactMarkdown` 传 `className`
- Markdown 常见元素的统一样式怎么写
- 代码块、表格、引用为什么要专门定义

你能学到什么：

- “统一规则收口”这种组件设计思路
- 当一个能力会被重复使用时，为什么值得抽成独立组件

### 3.6 `src/components/posts/posts-archive-list.tsx`

阅读目标：

- 理解归档页和详情页是怎么打通的

你应该重点看什么：

- “阅读全文”链接
- “快速预览”按钮
- 卡片区域怎么同时保留两种阅读入口

你能学到什么：

- 同一个业务模块可以同时提供轻量入口和完整入口
- 页面增强时不一定要推翻旧交互，也可以共存

### 3.7 `src/components/posts/post-preview-sheet.tsx`

阅读目标：

- 理解为什么预览抽屉仍然保留

你应该重点看什么：

- 抽屉打开逻辑
- 标签展示
- “进入详情页阅读”按钮

你能学到什么：

- 详情页做出来之后，旧的预览机制不一定要删
- 预览和详情是两种不同的使用场景

### 3.8 `src/components/site/interactive-dot-background.tsx`

阅读目标：

- 理解全局背景动效的实现方式

你应该重点看什么：

- 鼠标位置如何进入状态
- 为什么要区分 `current` 和 `target`
- 为什么用 `requestAnimationFrame`
- 为什么要计算相对坐标而不是直接用视口坐标

你能学到什么：

- 前端动画里常见的“缓动跟随”实现方式
- 鼠标热点偏移问题通常是怎么产生和修正的

### 3.9 `src/layouts/site-layout.tsx`

阅读目标：

- 理解全局布局层负责什么

你应该重点看什么：

- 背景组件挂载位置
- `Header` / `Footer` / `Outlet` 的组织关系
- 为什么背景层应该放在布局层，而不是单个页面里

你能学到什么：

- 站点级能力应该挂在哪一层最合适

### 3.10 `src/index.css`

阅读目标：

- 理解项目的全局视觉规则都放在哪里

你应该重点看什么：

- 全局 CSS 变量
- 点阵背景相关的 utility class
- 漫画风格相关的工具类

你能学到什么：

- 为什么项目级视觉语言要尽量集中管理
- 哪些样式适合写在组件里，哪些适合放全局

## 4. 阅读时建议你重点问自己的问题

每看一个文件，可以问自己这几个问题：

1. 这个文件的职责是什么？
2. 这个职责为什么放在这里，而不是别的层？
3. 这里有哪些逻辑被主动抽走了？
4. 如果以后接 API 或加功能，这一层会怎么改？

## 5. 最值得反复看的文件

如果你时间不多，只看这 4 个文件最划算：

1. `src/app/router.tsx`
2. `src/services/post-detail-page-service.ts`
3. `src/pages/post-detail/post-detail-page.tsx`
4. `src/components/site/interactive-dot-background.tsx`

## 6. 一句话总结

这套代码最值得学习的地方，不是某一个组件写得多炫，而是它把“路由、数据、页面、内容、动效”这几件事分得比较清楚。你后面如果自己写项目，也尽量训练这种“先分层，再写功能”的习惯。
