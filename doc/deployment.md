# 部署指南

本文档介绍如何将博客部署到常见的静态托管平台。

## 前置要求

- Node.js 18+ 和 pnpm
- Git 仓库（可选，用于自动化部署）

## 本地构建

在部署前，先本地构建验证：

```bash
pnpm install
pnpm build
```

构建产物位于 `dist/` 目录。

## GitHub Pages 部署

### 方式一：使用 GitHub Actions（推荐）

1. 在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. 在 `vite.config.ts` 中设置 base：

```typescript
export default defineConfig({
  base: '/你的仓库名/', // 例如 '/my-blog/'
  // ...其他配置
})
```

3. 推送到 main 分支，GitHub Actions 会自动构建和部署。

### 方式二：手动部署

```bash
pnpm build
# 将 dist/ 目录内容推送到 gh-pages 分支
```

## Cloudflare Pages 部署

### 方式一：Git 集成（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages > Create application > Pages
3. 连接 Git 仓库
4. 配置构建设置：
   - Framework preset: None
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: `/`
5. 点击 Save and Deploy

### 方式二：Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy dist
```

## Vercel 部署

### 方式一：Git 集成（推荐）

1. 登录 [Vercel](https://vercel.com/)
2. Import Git Repository
3. 框架预设自动检测为 Vite
4. 保持默认配置，点击 Deploy

### 方式二：Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

## Netlify 部署

### 方式一：Git 集成

1. 登录 [Netlify](https://netlify.com/)
2. Add new site > Import from Git
3. 配置构建设置：
   - Build command: `pnpm build`
   - Publish directory: `dist`
4. 点击 Deploy site

### 方式二：Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 自定义域名

### GitHub Pages

1. 在仓库 Settings > Pages > Custom domain 中设置域名
2. 在项目根目录添加 `CNAME` 文件，内容为你的域名
3. 在 DNS 提供商处配置 CNAME 记录指向 `用户名.github.io`

### Cloudflare Pages

1. 在 Pages 项目设置中添加自定义域名
2. 按照提示配置 DNS 记录（通常使用 CNAME）

### Vercel / Netlify

在各自的控制台中直接添加自定义域名，平台会自动配置 DNS。

## 环境变量

如果需要使用环境变量（如 API 密钥），在各平台的控制台中配置：

- **GitHub Actions**: 在 Settings > Secrets and variables > Actions 中配置
- **Cloudflare Pages**: 在 Settings > Environment variables 中配置
- **Vercel**: 在 Settings > Environment Variables 中配置
- **Netlify**: 在 Site settings > Environment variables 中配置

在代码中使用：

```typescript
// Vite 中访问环境变量需要以 VITE_ 开头
const apiUrl = import.meta.env.VITE_API_URL
```

## 部署检查清单

部署前确认：

- [ ] 运行 `pnpm typecheck` 无类型错误
- [ ] 运行 `pnpm lint` 无 lint 错误
- [ ] 本地运行 `pnpm preview` 验证构建产物
- [ ] 检查 `dist/` 目录包含所有必要文件
- [ ] 验证 RSS、Sitemap、Robots.txt 已生成
- [ ] 测试主要页面路由正常
- [ ] 检查移动端响应式布局

## 常见问题

### 资源路径 404

确保 `vite.config.ts` 中的 `base` 配置与部署路径一致。

### 路由刷新 404

SPA 路由需要在服务器端配置回退到 `index.html`。各平台处理方式：

- **GitHub Pages**: 添加 `404.html` 复制 `index.html` 内容
- **Cloudflare Pages**: 添加 `_routes.json` 配置
- **Vercel / Netlify**: 自动处理，无需额外配置

### 图片加载失败

检查图片路径是否正确，确保：
- 相对路径以 `/` 开头（如 `/images/xxx.jpg`）
- 图片文件确实存在于 `public/` 目录
