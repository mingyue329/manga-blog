# 今日工作总结（2026-04-02）

## 今天完成了什么

1. 把首页头像资源从构建产物目录迁移到可维护的静态资源目录。
   现在头像视频统一放在 `public/mp4/头像.mp4`，避免继续依赖临时构建目录里的文件。

2. 让首页 Hero 头像同时兼容图片和视频。
   首页头像组件现在可以根据资源后缀自动判断渲染 `<img>` 还是 `<video>`，并继续保持 1:1 方形尺寸和 `object-cover` 裁切策略。

3. 做了 GitHub Pages 自动化发布脚本。
   新增了 `scripts/deploy-github-pages.ps1`，并在 `package.json` 中补了：
   - `pnpm build:pages`
   - `pnpm deploy:pages`

4. 把项目成功发布到了 GitHub Pages。
   发布目录不是默认 `dist`，而是单独使用 `.deploy-gh-pages`，这样可以避开 Windows 下 `dist` 目录文件占用导致的构建失败。

5. 修复了 GitHub Pages 子路径部署下的前端路由问题。
   React Router 现在已经补上 basename，站点部署到 `/manga-blog/` 这种路径时，不会再把首页误判成站内 404。

6. 修复了首页头像视频在 GitHub Pages 上的资源路径问题。
   之前代码写死的是 `/mp4/头像.mp4`，浏览器会去访问域名根目录。
   现在改成通过 `getPublicAssetUrl()` 自动拼接 `import.meta.env.BASE_URL`，因此 GitHub Pages 上会访问：

```text
https://mingyue329.github.io/manga-blog/mp4/%E5%A4%B4%E5%83%8F.mp4
```

## 这次 GitHub Pages 构建的原理

### 1. 为什么需要新建 `gh-pages` 分支

前端源码和最终可部署静态文件不是一回事。

- `main` 分支里放的是源码：`src/`、`components/`、`services/`、Markdown、脚本、配置文件
- `gh-pages` 分支里放的是构建后的纯静态产物：`index.html`、`assets/*.js`、`assets/*.css`、图片、视频

GitHub Pages 最适合直接托管静态文件，所以常见做法是：

1. 在主分支开发源码
2. 构建出静态网站
3. 把静态产物单独推到 `gh-pages` 分支

这样做的好处是：

- 主分支不会被构建产物污染
- 部署内容和源码职责分离
- GitHub Pages 只需要读取一份“干净的静态站点”

### 2. `pnpm build:pages` 是干嘛的

这个命令只做“构建”，不做“发布”。

它内部会调用：

```bash
powershell -ExecutionPolicy Bypass -File ./scripts/deploy-github-pages.ps1 -BuildOnly
```

执行过程大致是：

1. 读取当前仓库的 GitHub 远端地址
2. 根据远端仓库名推导站点基础路径
   例如当前仓库是 `mingyue329/manga-blog`
   所以 Pages 基础路径就是 `/manga-blog/`
3. 执行 `pnpm typecheck`
4. 执行 `pnpm lint`
5. 执行 Vite 生产构建，输出到 `.deploy-gh-pages`
6. 额外生成：
   - `.nojekyll`
   - `404.html`

这一步结束后，你本地已经得到一份可部署的静态站点，但还没有推上 GitHub。

### 3. `pnpm deploy:pages` 是干嘛的

这个命令会“构建 + 推送”。

它内部会调用同一个脚本，但不带 `-BuildOnly`，所以流程会多一步：

1. 先完成 Pages 构建
2. 进入 `.deploy-gh-pages`
3. 在这个目录里临时初始化一个 Git 仓库
4. 提交当前静态产物
5. 强制推送到远端 `gh-pages` 分支

注意这里不是切换你当前项目的开发分支去提交，而是在构建目录里临时做一次独立 Git 提交。
这样不会污染你主仓库的开发历史。

### 4. 为什么 GitHub 能直接预览

因为 GitHub Pages 本质上就是一个“静态文件托管服务”。

它会把你指定分支里的静态文件直接当网站内容发布出来。

对这个项目来说：

- `gh-pages` 分支里有 `index.html`
- 页面依赖的 JS/CSS 在 `assets/`
- 头像视频在 `mp4/`

GitHub Pages 读取这些文件后，就能直接把它们作为网站返回给浏览器。

浏览器访问时的过程是：

1. 用户访问 `https://mingyue329.github.io/manga-blog/`
2. GitHub Pages 返回 `index.html`
3. 浏览器再去加载 `assets/*.js` 和 `assets/*.css`
4. React 启动后根据当前 URL 匹配路由，渲染首页、文章页、关于页

所以 GitHub 能“直接预览”，并不是它懂 React，而是：
它只负责把静态文件发给浏览器，真正运行 React 的是浏览器里的 JS。

### 5. 为什么还要额外生成 `404.html`

因为 GitHub Pages 只认识静态文件路径，不认识 React Router 的前端路由。

例如你直接访问：

```text
/manga-blog/posts
```

GitHub Pages 会先尝试找一个真实存在的静态文件 `/posts`。
如果找不到，就会走 `404.html`。

这时我们把 `404.html` 做成和 `index.html` 一样的入口页，React 启动后就能重新接管路由，
于是浏览器虽然底层走了 404 回退，但页面最终依然能正确渲染成 `/posts` 页面。

## 今天碰到的关键问题

### 问题 1：GitHub Pages 首页显示站内 404

原因：
- React Router 没有设置 basename
- 站点部署在 `/manga-blog/`
- 路由却按域名根路径 `/` 去匹配

解决：
- 在 `src/app/router.tsx` 中根据 `import.meta.env.BASE_URL` 自动生成 basename

### 问题 2：首页头像视频线上 404

原因：
- 代码里写死了 `/mp4/头像.mp4`
- 这会访问 `https://mingyue329.github.io/mp4/...`
- 但当前站点实际挂在 `/manga-blog/`

解决：
- 新增 `src/lib/public-asset.ts`
- 统一通过 `getPublicAssetUrl('mp4/头像.mp4')` 生成资源地址

## 当前结果

- GitHub Pages 预览地址：
  [https://mingyue329.github.io/manga-blog/](https://mingyue329.github.io/manga-blog/)
- 正确的视频地址：
  [https://mingyue329.github.io/manga-blog/mp4/%E5%A4%B4%E5%83%8F.mp4](https://mingyue329.github.io/manga-blog/mp4/%E5%A4%B4%E5%83%8F.mp4)
- 当前自动化脚本可用命令：
  - `pnpm build:pages`
  - `pnpm deploy:pages`

## 今天改动的关键文件

- `scripts/deploy-github-pages.ps1`
- `package.json`
- `src/app/router.tsx`
- `src/components/site/site-header.tsx`
- `src/data/home-page-content.ts`
- `src/lib/public-asset.ts`
- `docs/WORK_LOG.md`

## 下一步建议

1. 把后续所有 public 静态资源都统一走 `getPublicAssetUrl()`，避免再出现 GitHub Pages 子路径问题。
2. 如果后面图片、视频资源变多，可以继续整理成 `public/images`、`public/mp4`、`public/icons` 三类目录。
3. 后续如果接后台，前台的 Pages 发布脚本可以继续保留，因为它和后台是否存在并不冲突。
