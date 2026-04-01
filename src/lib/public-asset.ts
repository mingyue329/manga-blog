/**
 * 把 public 目录下的资源路径转换成当前部署环境可访问的完整前缀路径。
 * 在本地开发环境中，`BASE_URL` 通常就是 `/`，因此结果仍然会是常见的 `/mp4/xxx.mp4`。
 * 但在 GitHub Pages 这类项目页部署场景中，站点实际挂在 `/{repo}/` 子路径下，
 * 例如 `/manga-blog/`。如果代码里继续硬编码 `/mp4/头像.mp4`，浏览器就会错误地去访问
 * 域名根目录的 `/mp4/头像.mp4`，从而出现线上资源 404。
 * 这里集中做一次拼接后，页面代码只需要传入 public 目录下的相对路径即可。
 */
export function getPublicAssetUrl(assetPath: string): string {
  const normalizedAssetPath = assetPath.replace(/^\/+/, '')
  const baseUrl = import.meta.env.BASE_URL

  return `${baseUrl}${normalizedAssetPath}`
}
