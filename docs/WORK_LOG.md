# 工作日志

## 2026-03-31

### 本次完成

- 初始化 `Vite + React + TypeScript` 项目。
- 接入 `Tailwind CSS v4` 和 `shadcn/ui`。
- 建立路由、布局、数据、服务、类型四层结构。
- 根据 Stitch 首页导出稿实现首页界面。
- 根据 Stitch 关于页导出稿实现 `/about` 页面。
- 根据 Stitch 文章归档导出稿实现 `/posts` 页面。
- 增加首页本地数据源与真实 API 切换能力。
- 增加关于页与归档页的本地数据源与真实 API 切换能力。
- 增加固定头部场景下的自定义锚点滚动逻辑。
- 为 `/posts` 增加搜索、标签筛选、分页和文章预览抽屉。
- 为核心函数和基础组件补充中文注释。

### 已验证

- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`

### GitHub Pages 自动化
- 新增 `scripts/deploy-github-pages.ps1`，提供 GitHub Pages 的构建与发布自动化脚本。
- 在 `package.json` 中补充 `pnpm build:pages` 和 `pnpm deploy:pages` 两个命令。
- 使用独立输出目录 `.deploy-gh-pages`，避免和本地常规 `dist` 构建产物互相干扰。
- 脚本会自动根据当前仓库远端推导 GitHub Pages 的 `base` 路径与预览链接，并补齐 `.nojekyll` 和 `404.html`。
- 已执行一次 `pnpm build:pages` 与 `pnpm deploy:pages`，成功将当前静态产物推送到远端 `gh-pages` 分支。
- 当前仓库的目标预览地址为 `https://mingyue329.github.io/manga-blog/`，若首次启用 GitHub Pages，还需要到仓库 `Settings > Pages` 中把 Source 设为 `gh-pages / root`。
- 修正 GitHub Pages 下的前端路由基路径：为 React Router 补充 basename，并同步修复首页快捷锚点入口在子路径部署时丢失仓库名前缀的问题。
- 重新执行 `pnpm deploy:pages` 发布修复版后，站点根地址已恢复为首页而不再直接命中站内 404。

### 细节微调

- 将首页 Hero 区 `Hello_World` 气泡标签继续上移 5px，并让 Hero 卡片改为 `overflow-visible`，使气泡可以自然越过卡片边界形成悬浮感。
- 本地预览下检查了：
  - 首页可访问
  - `/about` 可访问
  - `/posts` 可访问
  - `/posts` 搜索、标签筛选、分页和预览抽屉可用
  - 移动端导航按钮可触发抽屉
  - 顶部快捷入口可从其他路由滚动回首页对应区块
  - `/about` 章节导航可滚动到对应区块

### 当前状态

- 首页已完成。
- `/about` 已完成首轮落地。
- `/posts` 已完成首轮落地。
- `/posts/:slug` 已完成首轮落地，正文中心区域改为 Markdown 文档渲染。

### 后续建议

1. 接入真实 API，把归档页和详情页的本地静态配置切换出去。
2. 继续补文章排序、搜索联想和关于页更多模块。
3. 如果文章数量增加，可以补目录导航、文章系列和评论数据接口。

### 动态背景修正

- 修正全局点阵背景的鼠标坐标计算方式，改为基于背景容器自身坐标定位聚焦区域，解决热点与鼠标指针偏移的问题。
- 调整背景聚焦层的尺寸与透明度，让鼠标悬停时的点阵凸显范围更明显，同时避免在边缘区域出现错位。
- 将站点头部和页脚改为透明层，让顶部和底部也能直接透出全局点阵动效，保持整站视觉一致。

### 文章详情页落地

- 根据 `stitch/stitch_about_me_articleDetails` 新增真实文章详情路由 `/posts/:slug`。
- 新增文章详情页 `loader + service + page` 结构，为后续对接真实接口预留独立入口。
- 在 `src/content/posts` 下补充 Markdown 正文文档，把中心内容区改为 Markdown 渲染，而不是继续把正文硬编码在 TS 文件里。
- 新增 `PostMarkdown` 组件，统一处理标题、段落、引用、列表、表格和代码块样式。
- 调整归档页和预览抽屉入口，让用户可以从 `/posts` 直接进入真实详情页。

## 2026-04-01

### 本次完成

- 把文章列表页、文章详情页和首页“最新动态”统一到同一份 Markdown 内容源。
- 为 `src/content/posts/*.md` 增加 frontmatter，收拢文章标题、摘要、日期、封面、标签和预览分节。
- 新增 `src/services/article-content-service.ts`，统一负责解析 Markdown frontmatter 并派生文章卡片数据。
- 调整 `home-page-service.ts`，让首页最新动态改为从统一文章源自动生成。
- 调整 `posts-page-service.ts`，让归档页文章列表和标签列表都从统一文章源派生。
- 继续扩展 Markdown frontmatter，为每篇文章补入 `author`、`coverRatio`、`series` 和 `featured`。
- 调整文章类型定义与 `article-content-service.ts`，让新增字段从 frontmatter 一路进入归档页、详情页和首页推荐区。
- 调整文章详情页与归档页展示，让作者、系列、封面比例和精选状态不再停留在数据层。
- 重写 `post-detail-page-service.ts`，让详情页不再依赖旧的静态摘要配置。
- 将 `src/data/home-page-content.ts` 与 `src/data/posts-page-content.ts` 收敛为页面固定配置，不再重复维护文章内容。
- 把站点顶部改成半透明描图纸风格，在保留点阵背景透出的同时提升导航层次和可读性。
- 调整全局点阵背景参数，把点距缩小到原来的一半，并同步缩小基础点与聚焦点尺寸，让背景更细密。
- 继续加重顶部描图纸 Header 的外框厚度，让它和全站黑白粗边框语言更一致。
- 把全站内容区最大宽度从 1280px 扩到 1480px，减少超宽屏下两侧留白过多的问题。
- 修正首页底部“正在游玩 / 技术栈”卡片的溢出裁切，让顶部黑色标签不再被卡片边界挡住。

### 已验证

- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`
- 本地预览下检查了：
  - 首页“最新动态”已切到统一文章源
  - `/posts` 归档页仍可正常展示文章卡片与标签筛选
  - `/posts/:slug` 详情页仍可正常读取 Markdown 正文
  - 运行时已消除 frontmatter 解析导致的浏览器错误

### 当前状态

- 当前文章相关的前台展示已经统一使用 `src/content/posts/*.md` 作为内容源。
- 页面静态文案与文章内容已经完成拆层，后续前台继续扩展会更稳。

### 后续建议

1. 下一步可以继续补文章目录导航、系列聚合页或更细的封面裁剪策略。
2. 如果后面准备接后台，可以直接围绕现在这套 frontmatter 字段设计接口。
3. 文章数量变多后，可以继续补目录导航、文章系列和代码高亮增强。
## 2026-04-02

### 本次完成

- 把 `dist/mp4/头像.mp4` 复制到可维护的静态资源目录 `public/mp4/头像.mp4`。
- 调整首页 Hero 头像渲染逻辑，让首页头像同时兼容图片与 mp4 视频资源。
- 将首页头像资源改为 `public/mp4/头像.mp4`，并继续保持首页当前的 1:1 方形头像尺寸与裁切方式。

### 已验证

- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`
### 资源路径与总结文档
- 修复首页头像视频在 GitHub Pages 上的资源路径问题：不再直接使用 `/mp4/头像.mp4`，而是改为通过 `import.meta.env.BASE_URL` 自动拼接仓库子路径。
- 新增 `src/lib/public-asset.ts`，后续 public 目录静态资源都可以复用这个方法生成部署安全的访问地址。
- 新增今日总结文档 `docs/DAILY_SUMMARY_2026-04-02.md`，整理了 GitHub Pages 构建原理、脚本职责、部署链路和今天的任务结果。
