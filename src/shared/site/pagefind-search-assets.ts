import type { IndexFile } from 'pagefind'
import { close, createIndex } from 'pagefind'

import { getPostCategoryLabel } from '../../features/posts/article-derived-data'
import { loadPublicMarkdownPostDocumentsFromFileSystem } from './static-site-assets'
import { siteMetadata } from './site-metadata'

interface PagefindSearchFile {
  path: string
  content: Uint8Array
}

/**
 * 把 Markdown 内容压平成适合全文索引的纯文本。
 * Pagefind 不需要保留展示语义，只需要稳定的可搜索文本。
 */
function stripMarkdown(markdownContent: string): string {
  return markdownContent
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`([^`]+)`/gu, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/^#{1,6}\s+/gmu, '')
    .replace(/[>*_~|-]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

/**
 * 组合 Pagefind 使用的正文。
 * 摘要和全文一起写入，可以兼顾搜索命中率与结果相关性。
 */
function buildSearchContent(markdownContent: string, excerpt: string): string {
  return [excerpt, stripMarkdown(markdownContent)].join('\n')
}

/**
 * 规范化 Pagefind 输出文件路径。
 * 这里会去掉工具默认加上的 `pagefind/` 前缀，便于后续统一挂载到 Vite 产物目录。
 */
function buildPagefindFiles(files: IndexFile[]): PagefindSearchFile[] {
  return files.map((file) => ({
    path: file.path.replace(/^pagefind[\\/]/u, ''),
    content: file.content,
  }))
}

/**
 * 构建文章搜索索引文件。
 * 索引生成发生在 Node 侧，因此这里全部依赖文件系统和共享内容解析逻辑。
 */
export async function buildPagefindSearchFiles(): Promise<PagefindSearchFile[]> {
  const { index, errors } = await createIndex({
    forceLanguage: siteMetadata.language,
    includeCharacters: '-_/#',
  })

  if (!index) {
    throw new Error(
      `Pagefind 索引初始化失败：${errors.join('；') || '未知错误'}`,
    )
  }

  try {
    const documents = loadPublicMarkdownPostDocumentsFromFileSystem()

    for (const document of documents) {
      const recordResponse = await index.addCustomRecord({
        url: `/posts/${document.slug}`,
        language: siteMetadata.language,
        content: buildSearchContent(
          document.markdownContent,
          [
            document.title,
            document.excerpt,
            document.author,
            document.series ?? '',
            getPostCategoryLabel(document.categoryKey),
            ...document.tags,
            ...document.previewSections.flatMap((section) => [
              section.heading,
              section.content,
            ]),
          ].join('\n'),
        ),
        meta: {
          slug: document.slug,
          title: document.title,
          excerpt: document.excerpt,
          category: getPostCategoryLabel(document.categoryKey),
          date: document.publishedAt,
          image: document.image.src,
          image_alt: document.image.alt,
        },
        filters: {
          category: [document.categoryKey],
          tag: document.tags,
          featured: [String(document.featured)],
        },
        sort: {
          publishedAt: document.publishedAt.replaceAll('-', ''),
        },
      })

      if (recordResponse.errors.length > 0) {
        throw new Error(
          `Pagefind 记录写入失败（${document.slug}）：${recordResponse.errors.join('；')}`,
        )
      }
    }

    const fileResponse = await index.getFiles()

    if (fileResponse.errors.length > 0) {
      throw new Error(
        `Pagefind 索引文件生成失败：${fileResponse.errors.join('；')}`,
      )
    }

    return buildPagefindFiles(fileResponse.files)
  } finally {
    await index.deleteIndex()
    await close()
  }
}

/**
 * 根据 Pagefind 文件后缀返回响应类型。
 * 开发态通过中间件直接喂二进制内容时，需要自己补上正确的 Content-Type。
 */
export function getPagefindContentType(filePath: string): string {
  if (filePath.endsWith('.js')) {
    return 'application/javascript; charset=utf-8'
  }

  if (filePath.endsWith('.css')) {
    return 'text/css; charset=utf-8'
  }

  if (filePath.endsWith('.json')) {
    return 'application/json; charset=utf-8'
  }

  if (filePath.endsWith('.wasm')) {
    return 'application/wasm'
  }

  return 'application/octet-stream'
}
