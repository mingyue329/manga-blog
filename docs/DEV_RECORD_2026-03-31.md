# 2026-03-31 开发记录

## 1. 今日工作范围

今天围绕这个 Stitch 导出的站点，完成了从静态设计稿到可扩展 React 项目的首轮落地，并补上了后续继续开发最需要的基础结构。

## 2. 已完成的开发项

### 2.1 项目基础

- 初始化 `Vite + React + TypeScript` 项目结构。
- 接入 `shadcn/ui`，作为基础 UI 组件来源。
- 建立 `router + loader + service + page` 的组织方式。
- 增加 `.env.example`，预留本地内容与真实 API 切换能力。

### 2.2 页面实现

- 完成首页 `/`。
- 完成关于页 `/about`。
- 完成文章归档页 `/posts`。
- 完成文章详情页 `/posts/:slug`。
- 保留 `404` 和错误边界页面。

### 2.3 文章系统

- 归档页支持搜索、标签筛选、分页。
- 归档页保留“快速预览”抽屉。
- 归档页新增“阅读全文”入口。
- 预览抽屉新增“进入详情页阅读”入口。
- 新增文章详情页数据流：
  - `post-detail-page.loader.ts`
  - `post-detail-page-service.ts`
  - `post-detail-page.tsx`

### 2.4 Markdown 正文能力

- 新增 `react-markdown` 与 `remark-gfm`。
- 新增 `src/content/posts/*.md` 作为文章正文源。
- 新增 `PostMarkdown` 组件，统一渲染：
  - 标题
  - 段落
  - 引用
  - 列表
  - 表格
  - 代码块
- 详情页中心区域切换为 Markdown 渲染。

### 2.5 文章详情页增强

- 增加阅读时长计算。
- 增加上一篇 / 下一篇导航。
- 增加相关文章推荐。
- 把 `stitch_about_me_articleDetails` 的版式风格统一回现有站点的黑白漫画技术风格。

### 2.6 背景动效

- 新增全局点阵背景。
- 增加鼠标悬浮聚焦动效。
- 修正热点位置偏移问题。
- 将 `header` 和 `footer` 调整为透明层，让顶部和底部也能透出背景效果。

### 2.7 文档补充

- 更新 `README.md`。
- 更新 `docs/ARCHITECTURE.md`。
- 更新 `docs/WORK_LOG.md`。
- 新增 `docs/DAILY_SUMMARY_2026-03-31.md`。

## 3. 关键文件

### 3.1 路由

- `src/app/router.tsx`

### 3.2 详情页

- `src/pages/post-detail/post-detail-page.tsx`
- `src/pages/post-detail/post-detail-page.loader.ts`
- `src/services/post-detail-page-service.ts`
- `src/components/posts/post-markdown.tsx`
- `src/content/posts/*.md`

### 3.3 归档页入口调整

- `src/components/posts/posts-archive-list.tsx`
- `src/components/posts/post-preview-sheet.tsx`

### 3.4 背景效果

- `src/components/site/interactive-dot-background.tsx`
- `src/layouts/site-layout.tsx`
- `src/index.css`

## 4. 验证结果

今天已经通过的检查：

- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`

已做的页面级验证：

- `/` 可访问
- `/about` 可访问
- `/posts` 可访问
- `/posts/:slug` 可访问
- 从归档页可以进入详情页
- Markdown 正文可正常渲染
- 背景动效在主内容区、顶部、底部都能正常显示

## 5. 当前状态判断

当前项目已经具备继续迭代的基础，不再只是设计稿还原：

- 路由结构已成型
- 内容层和页面层已分离
- 详情页链路已完整打通
- Markdown 内容可独立维护
- 后续接 API 的切换点已经预留

## 6. 下一步建议

建议按这个顺序继续做：

1. 接入真实文章接口。
2. 给文章详情页补目录导航或评论接口。
3. 继续扩展关于页和文章归档页的内容模块。
