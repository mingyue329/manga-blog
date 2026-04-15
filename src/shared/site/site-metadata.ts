/**
 * 站点级元数据配置。
 * 这部分配置不直接描述某个页面的业务内容，而是描述整个站点在构建期和运行期都需要共享的基础信息，
 * 例如浏览器标签标题、favicon 资源路径等。
 * 之所以单独抽到这里，是为了让 React 运行时代码和 Vite 构建配置都能复用同一份数据，
 * 避免 `index.html`、运行时脚本和页面配置各自维护一套标题与静态资源路径。
 */
export const siteMetadata = {
  title: "KawaiiTech | 星码绽放",
  description: "黑白漫画科技风的个人博客，记录游戏、技术与创作过程。",
  siteUrl: "https://example.com",
  language: "zh",
  faviconPath: "favicon.ico",
  defaultOgImage: "/images/og-default.jpg", // 默认 Open Graph 图片
} as const;

/**
 * 根据部署基路径和 public 资源相对路径，生成最终可访问的静态资源 URL。
 * 这个函数是整个项目统一处理 public 资源路径的底层入口：
 * 1. 本地开发时，`baseUrl` 通常是 `/`，返回结果会是 `/favicon.ico` 或 `/mp4/头像.mp4`
 * 2. GitHub Pages 项目页部署时，`baseUrl` 会是 `/manga-blog/`
 *    返回结果就会自动变成 `/manga-blog/favicon.ico` 或 `/manga-blog/mp4/头像.mp4`
 * 这样就不用在业务代码里手写仓库名前缀，也不会因为部署环境变化而出现资源 404。
 */
export function resolvePublicAssetPath(
  baseUrl: string,
  assetPath: string,
): string {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedAssetPath = assetPath.replace(/^\/+/, "");

  return `${normalizedBaseUrl}${normalizedAssetPath}`;
}
