# KawaiiTech Home

这是一个基于 `Vite + React + TypeScript + shadcn/ui` 搭建的前端项目，用来把 Stitch 导出的首页稿落成可继续扩展的 React 应用。

## 已完成内容

- 完成首页 React 化实现，视觉方向对齐黑白漫画科技风。
- 接入 `react-router-dom`，首页、博文页、关于页和 404 路由都已建好。
- 完成 `/about` 真实页面实现，包含玩家档案、技能树、装备清单和分镜展示。
- 完成 `/posts` 真实页面实现，包含搜索、标签筛选、分页和文章预览抽屉。
- 预留接口接入槽位，首页内容当前由本地 `service` 层提供，后续可切换到真实 API。
- `about` 和 `posts` 也已经接入独立 `loader + service` 数据流，后续可直接替换成远程接口。
- 接入 `shadcn/ui` 并按当前设计系统重写成方角、重边框风格。
- 为业务函数和基础 UI 组件补充中文注释，便于后续学习和维护。

## 启动方式

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

## 环境变量

复制 `.env.example` 后按需要调整：

```bash
VITE_USE_LOCAL_HOME_CONTENT=true
VITE_API_BASE_URL=/api
```

说明：

- `VITE_USE_LOCAL_HOME_CONTENT=true` 时，首页读取本地静态内容。
- `VITE_USE_LOCAL_ABOUT_CONTENT=true` 时，关于页读取本地静态内容。
- `VITE_USE_LOCAL_POSTS_CONTENT=true` 时，文章归档页读取本地静态内容。
- `VITE_USE_LOCAL_POST_DETAIL_CONTENT=true` 时，文章详情页读取本地 Markdown 正文和本地摘要数据。
- 把对应变量改成 `false` 后，页面会走各自 `service` 文件中的真实接口请求逻辑。

## 目录说明

- `src/app`: 应用路由入口。
- `src/layouts`: 全局布局。
- `src/components`: 页面业务组件和 shadcn/ui 基础组件。
- `src/data`: 当前使用的静态内容配置。
- `src/content/posts`: 文章详情页使用的 Markdown 正文文档。
- `src/services`: 接口封装和页面数据服务。
- `src/types`: 全局业务类型定义。
- `docs`: 架构说明和工作日志。
- `stitch`: Stitch 导出的原始设计参考文件。

## 当前路由状态

- `/`: 已完成首页实现。
- `/posts`: 已完成归档页实现，支持搜索、标签筛选、分页和文章预览。
- `/posts/:slug`: 已完成文章详情页实现，正文中心区域使用 Markdown 文档渲染。
- `/about`: 已完成档案页实现。

说明：

- `stitch/stitch_about_me_about` 和 `stitch/stitch_about_me_article` 已经完成首轮 React 化落地。
- `stitch/stitch_about_me_articleDetails` 已整理成统一站点风格的文章详情页。
- 后续可以继续从现有数据层扩展成真实 API，或直接在 `src/content/posts` 中新增 Markdown 正文。

## 参考文档

- [项目结构说明](D:\code\figma\docs\ARCHITECTURE.md)
- [开发记录（2026-03-31）](D:\code\figma\docs\DEV_RECORD_2026-03-31.md)
- [学习笔记（2026-03-31）](D:\code\figma\docs\LEARNING_NOTES_2026-03-31.md)
- [代码阅读指南（2026-03-31）](D:\code\figma\docs\CODE_READING_GUIDE_2026-03-31.md)
- [今日工作总结（2026-03-31）](D:\code\figma\docs\DAILY_SUMMARY_2026-03-31.md)
- [工作日志](D:\code\figma\docs\WORK_LOG.md)
