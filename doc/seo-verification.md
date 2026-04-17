# SEO 输出验证报告

本文档记录博客系统的 SEO 能力验证结果。

## ✅ RSS Feed

**文件**: `rss.xml`
**生成方式**: Vite 插件 `staticSiteAssetsPlugin` 在构建时生成

### 验证项

- ✅ XML 声明和编码 (UTF-8)
- ✅ RSS 2.0 版本声明
- ✅ Content 命名空间 (`xmlns:content`)
- ✅ Channel 元数据:
  - ✅ `<title>` - 站点标题
  - ✅ `<link>` - 站点链接
  - ✅ `<description>` - 站点描述
  - ✅ `<language>` - 语言代码 (zh-CN)
  - ✅ `<lastBuildDate>` - 最后更新时间
- ✅ Item 条目:
  - ✅ `<title>` - 文章标题
  - ✅ `<link>` - 文章链接
  - ✅ `<guid>` - 唯一标识符
  - ✅ `<pubDate>` - 发布日期 (UTC 格式)
  - ✅ `<description>` - 文章摘要
  - ✅ `<content:encoded>` - **完整文章内容** (CDATA 包裹)
- ✅ XML 转义处理 (`&`, `<`, `>`, `"`, `'`)
- ✅ 草稿文章自动过滤 (`draft !== true`)

### 示例输出

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>明月几时有</title>
    <link>https://example.com/</link>
    <description>黑白漫画科技风的个人博客...</description>
    <language>zh</language>
    <lastBuildDate>Wed, 15 Apr 2026 00:00:00 GMT</lastBuildDate>
    <item>
      <title>黑神话：悟空评测</title>
      <link>https://example.com/posts/black-myth-wukong-review</link>
      <guid>https://example.com/posts/black-myth-wukong-review</guid>
      <pubDate>Tue, 20 Aug 2024 00:00:00 GMT</pubDate>
      <description>一款融合了中国神话与动作元素的佳作...</description>
      <content:encoded><![CDATA[完整 Markdown 内容]]></content:encoded>
    </item>
  </channel>
</rss>
```

---

## ✅ Sitemap

**文件**: `sitemap.xml`
**生成方式**: Vite 插件 `staticSiteAssetsPlugin` 在构建时生成

### 验证项

- ✅ XML 声明和编码 (UTF-8)
- ✅ Sitemap 0.9 命名空间
- ✅ 静态路由:
  - ✅ 首页 (`/`)
  - ✅ 文章列表页 (`/posts`)
  - ✅ 关于页 (`/about`)
  - ✅ 所有导航菜单项
- ✅ 动态路由:
  - ✅ 所有文章详情页 (`/posts/:slug`)
- ✅ URL 条目:
  - ✅ `<loc>` - 规范 URL (绝对路径)
  - ✅ `<lastmod>` - 最后修改时间 (ISO 8601)
    - 静态页面: 构建时间
    - 文章页面: `updatedAt` 或 `publishedAt`
- ✅ XML 转义处理

### 示例输出

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-04-15T00:00:00.000Z</lastmod>
  </url>
  <url>
    <loc>https://example.com/posts</loc>
    <lastmod>2026-04-15T00:00:00.000Z</lastmod>
  </url>
  <url>
    <loc>https://example.com/posts/black-myth-wukong-review</loc>
    <lastmod>2024-08-20</lastmod>
  </url>
</urlset>
```

---

## ✅ Robots.txt

**文件**: `robots.txt`
**生成方式**: Vite 插件 `staticSiteAssetsPlugin` 在构建时生成

### 验证项

- ✅ 允许所有爬虫 (`User-agent: *`)
- ✅ 允许抓取所有路径 (`Allow: /`)
- ✅ 声明 Sitemap 位置 (`Sitemap: https://example.com/sitemap.xml`)

### 示例输出

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

## ✅ Open Graph & Twitter Card

**实现方式**: 运行时动态注入 (`seo-metadata.ts`)

### 验证项

#### 基础 Meta

- ✅ `<title>` - 页面标题
- `<meta name="description">` - 页面描述
- ✅ `<link rel="canonical">` - 规范 URL

#### Open Graph

- ✅ `<meta property="og:title">` - OG 标题
- ✅ `<meta property="og:description">` - OG 描述
- ✅ `<meta property="og:url">` - OG URL
- ✅ `<meta property="og:type">` - 类型 (article/website)
- ✅ `<meta property="og:site_name">` - 站点名称
- ✅ `<meta property="og:locale">` - 语言区域 (zh_CN)
- ✅ `<meta property="og:image">` - OG 图片 (可选)
- ✅ `<meta property="og:image:width">` - 图片宽度 (1200)
- ✅ `<meta property="og:image:height">` - 图片高度 (630)
- ✅ `<meta property="article:published_time">` - 发布时间 (文章页)
- ✅ `<meta property="article:modified_time">` - 修改时间 (文章页)
- ✅ `<meta property="article:tag">` - 文章标签 (文章页,可多个)

#### Twitter Card

- ✅ `<meta name="twitter:card">` - 卡片类型 (summary_large_image)
- ✅ `<meta name="twitter:title">` - Twitter 标题
- ✅ `<meta name="twitter:description">` - Twitter 描述
- ✅ `<meta name="twitter:image">` - Twitter 图片 (可选)

### 文章页特殊处理

- ✅ 标题格式: `{文章标题} | {站点名称}`
- ✅ 使用文章 excerpt 作为描述
- ✅ 使用文章封面图作为 OG 图片
- ✅ 包含所有文章标签
- ✅ 组件卸载时恢复默认标题

---

## 📋 验证清单

### 开发环境验证

```bash
# 启动开发服务器
pnpm dev

# 访问以下 URL 验证:
# - http://localhost:5173/rss.xml
# - http://localhost:5173/sitemap.xml
# - http://localhost:5173/robots.txt
```

### 生产构建验证

```bash
# 构建项目
pnpm build

# 检查 dist 目录包含:
# - dist/rss.xml
# - dist/sitemap.xml
# - dist/robots.txt

# 预览构建产物
pnpm preview
```

### 在线工具验证

1. **RSS 验证**: https://validator.w3.org/feed/
2. **Sitemap 验证**: https://www.xml-sitemaps.com/validate-xml-sitemap.html
3. **Open Graph 验证**: https://developers.facebook.com/tools/debug/
4. **Twitter Card 验证**: https://cards-dev.twitter.com/validator
5. **综合 SEO 检查**: https://search.google.com/test/rich-results

---

## 🔧 配置说明

### 修改站点 URL

编辑 `src/shared/site/site-metadata.ts`:

```typescript
export const siteMetadata = {
  siteUrl: "https://your-domain.com", // 改为你的域名
  // ...
};
```

或在部署时设置环境变量:

```bash
SITE_URL=https://your-domain.com pnpm build
```

### 修改默认 OG 图片

1. 准备一张 1200x630px 的图片
2. 放入 `public/images/og-default.jpg`
3. 更新 `siteMetadata.defaultOgImage` 路径

### 自定义 SEO 行为

编辑 `src/shared/site/seo-metadata.ts` 中的 `generateSeoTags()` 函数。

---

## 📊 SEO 评分预期

完成以上配置后,预期达到:

- **Google Lighthouse SEO**: 95-100 分
- **Facebook Sharing Debugger**: ✅ 通过
- **Twitter Card Validator**: ✅ 通过
- **RSS Feed Validator**: ✅ 有效

---

## 🚀 后续优化建议

1. **JSON-LD 结构化数据**
   - 添加 `BlogPosting` schema
   - 添加 `Organization` schema
   - 添加 `BreadcrumbList` schema

2. **性能优化**
   - 图片懒加载
   - WebP 格式支持
   - 字体预加载

3. **国际化 SEO**
   - hreflang 标签
   - 多语言 sitemap

4. **分析集成**
   - Google Analytics
   - Google Search Console
   - Bing Webmaster Tools
