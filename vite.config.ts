import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'

import {
  resolvePublicAssetPath,
  siteMetadata,
} from './src/shared/site/site-metadata'

/**
 * 把站点元数据注入到 `index.html`。
 * 这样浏览器标题和 favicon 仍然来自同一份共享配置，不会和运行时内容脱节。
 */
function siteMetadataPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null

  return {
    name: 'site-metadata-plugin',
    configResolved(config) {
      resolvedConfig = config
    },
    transformIndexHtml(html) {
      const baseUrl = resolvedConfig?.base ?? '/'
      const faviconUrl = resolvePublicAssetPath(
        baseUrl,
        siteMetadata.faviconPath,
      )

      return html
        .replace(/%SITE_TITLE%/g, siteMetadata.title)
        .replace(/%SITE_FAVICON_URL%/g, faviconUrl)
    },
  }
}

/**
 * Vite 配置入口。
 * 这里集中管理别名、插件和 HTML 注入策略，让开发与构建共用同一套基础配置。
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetadataPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
