import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'

import {
  resolvePublicAssetPath,
  siteMetadata,
} from './src/shared/site/site-metadata'
import {
  buildPagefindSearchFiles,
  getPagefindContentType,
} from './src/shared/site/pagefind-search-assets'
import {
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
} from './src/shared/site/static-site-assets'

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

function staticSiteAssetsPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null

  function getSiteUrl(): string {
    return process.env.SITE_URL ?? siteMetadata.siteUrl
  }

  function getStaticAssets(): Record<string, string> {
    const siteUrl = getSiteUrl()

    return {
      'rss.xml': buildRssXml(siteUrl),
      'sitemap.xml': buildSitemapXml(siteUrl),
      'robots.txt': buildRobotsTxt(siteUrl),
    }
  }

  function getRequestPath(baseUrl: string, assetFileName: string): string {
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

    return `${normalizedBaseUrl}${assetFileName}`.replace(/\/{2,}/g, '/')
  }

  return {
    name: 'static-site-assets-plugin',
    configResolved(config) {
      resolvedConfig = config
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const requestPath = request.url?.split('?')[0] ?? ''
        const baseUrl = resolvedConfig?.base ?? '/'
        const staticAssets = getStaticAssets()

        for (const [assetFileName, content] of Object.entries(staticAssets)) {
          if (requestPath !== getRequestPath(baseUrl, assetFileName)) {
            continue
          }

          response.setHeader(
            'Content-Type',
            assetFileName.endsWith('.txt')
              ? 'text/plain; charset=utf-8'
              : 'application/xml; charset=utf-8',
          )
          response.end(content)
          return
        }

        next()
      })
    },
    generateBundle() {
      const staticAssets = getStaticAssets()

      for (const [fileName, source] of Object.entries(staticAssets)) {
        this.emitFile({
          type: 'asset',
          fileName,
          source,
        })
      }
    },
  }
}

function pagefindSearchPlugin(): Plugin {
  let pagefindFilesPromise: Promise<Map<string, Uint8Array>> | null = null

  async function getPagefindFiles(): Promise<Map<string, Uint8Array>> {
    if (!pagefindFilesPromise) {
      pagefindFilesPromise = buildPagefindSearchFiles().then((files) => {
        return new Map(files.map((file) => [file.path, file.content]))
      })
    }

    return pagefindFilesPromise
  }

  function invalidatePagefindFiles(): void {
    pagefindFilesPromise = null
  }

  return {
    name: 'pagefind-search-plugin',
    configureServer(server) {
      server.watcher.on('change', (changedPath) => {
        if (!changedPath.includes(`${path.sep}src${path.sep}features${path.sep}posts${path.sep}content${path.sep}posts${path.sep}`)) {
          return
        }

        invalidatePagefindFiles()
      })

      server.middlewares.use(async (request, response, next) => {
        const requestPath = request.url?.split('?')[0] ?? ''
        const normalizedBaseUrl = server.config.base.endsWith('/')
          ? server.config.base
          : `${server.config.base}/`
        const pagefindPathPrefix = `${normalizedBaseUrl}pagefind/`.replace(
          /\/{2,}/g,
          '/',
        )

        if (!requestPath.startsWith(pagefindPathPrefix)) {
          next()
          return
        }

        const relativePagefindPath = requestPath.slice(pagefindPathPrefix.length)
        const pagefindFiles = await getPagefindFiles()
        const content = pagefindFiles.get(relativePagefindPath)

        if (!content) {
          next()
          return
        }

        response.setHeader('Content-Type', getPagefindContentType(relativePagefindPath))
        response.end(Buffer.from(content))
      })
    },
    async generateBundle() {
      const pagefindFiles = await getPagefindFiles()

      for (const [filePath, content] of pagefindFiles.entries()) {
        this.emitFile({
          type: 'asset',
          fileName: `pagefind/${filePath}`,
          source: content,
        })
      }
    },
  }
}

/**
 * Vite 配置入口。
 * 这里集中管理别名、插件和 HTML 注入策略，让开发与构建共用同一套基础配置。
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    siteMetadataPlugin(),
    staticSiteAssetsPlugin(),
    pagefindSearchPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
