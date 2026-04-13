import { resolvePublicAssetPath } from '@/shared/site/site-metadata'

/**
 * 把 `public` 目录下的相对路径转换成当前运行环境可访问的完整地址。
 * 这样内容层只需要关心资源本身，不需要知道项目最终部署在根路径还是子路径。
 */
export function getPublicAssetUrl(assetPath: string): string {
  return resolvePublicAssetPath(import.meta.env.BASE_URL, assetPath)
}
