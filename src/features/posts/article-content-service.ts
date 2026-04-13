import { parse as parseYaml } from 'yaml'

import type {
  ArchivePost,
  ImageAsset,
  MarkdownPostDocument,
  PostCategoryKey,
  PostCoverRatio,
  PostPreviewSection,
  UpdateArticle,
} from '@/shared/types/content'

interface ArticleFrontmatter {
  slug?: unknown
  title?: unknown
  excerpt?: unknown
  publishedAt?: unknown
  author?: unknown
  categoryKey?: unknown
  image?: unknown
  coverRatio?: unknown
  imageSide?: unknown
  series?: unknown
  tags?: unknown
  featured?: unknown
  previewSections?: unknown
}

interface PreviewSectionLike {
  heading?: unknown
  content?: unknown
}

interface ImageAssetLike {
  src?: unknown
  alt?: unknown
}

interface ParsedMarkdownFile {
  data: ArticleFrontmatter
  content: string
}

const articleMarkdownModules = import.meta.glob('./content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const postCategoryLabels: Record<PostCategoryKey, string> = {
  technical: 'TECHNICAL',
  'geek-life': 'GEEK LIFE',
  tutorial: 'TUTORIAL',
  devlog: 'DEVLOG',
  culture: 'CULTURE',
}

/**
 * 解析 Markdown 文件中的 frontmatter 和正文。
 * 文章内容已经被收口到 `features/posts/content/posts`，这里负责把原始文本整理成稳定的数据结构。
 */
function parseMarkdownFile(
  rawMarkdownContent: string,
  modulePath: string,
): ParsedMarkdownFile {
  const normalizedMarkdownContent = rawMarkdownContent.replace(/\r\n/gu, '\n')

  if (!normalizedMarkdownContent.startsWith('---\n')) {
    throw new Error(
      `文章文件 ${modulePath} 缺少 frontmatter，请在文件顶部补上 --- 包裹的元数据块。`,
    )
  }

  const frontmatterEndIndex = normalizedMarkdownContent.indexOf('\n---\n', 4)

  if (frontmatterEndIndex === -1) {
    throw new Error(
      `文章文件 ${modulePath} 的 frontmatter 没有正确闭合，请检查 --- 分隔符。`,
    )
  }

  const frontmatterBlock = normalizedMarkdownContent.slice(4, frontmatterEndIndex)
  const parsedFrontmatter = parseYaml(frontmatterBlock)

  if (typeof parsedFrontmatter !== 'object' || parsedFrontmatter === null) {
    throw new Error(
      `文章文件 ${modulePath} 的 frontmatter 解析失败，请检查 YAML 结构。`,
    )
  }

  return {
    data: parsedFrontmatter as ArticleFrontmatter,
    content: normalizedMarkdownContent.slice(frontmatterEndIndex + 5).trim(),
  }
}

/**
 * 从模块路径中提取文件级 slug。
 * 这里直接把文件名视为路由标识，避免内容作者在两个位置维护 slug。
 */
function getModulePathSlug(modulePath: string): string {
  const pathSegments = modulePath.split('/')
  const fileName = pathSegments[pathSegments.length - 1] ?? ''

  return fileName.replace(/\.md$/u, '')
}

/**
 * 统一生成内容字段错误，方便快速定位是哪篇文章的哪个字段有问题。
 */
function createContentFieldError(
  modulePath: string,
  fieldName: string,
  expectedDescription: string,
): Error {
  return new Error(
    `文章文件 ${modulePath} 的 ${fieldName} 字段格式无效，期望为 ${expectedDescription}。`,
  )
}

/**
 * 规范必填字符串字段。
 */
function normalizeStringField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string {
  if (typeof value !== 'string') {
    throw createContentFieldError(modulePath, fieldName, '非空字符串')
  }

  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw createContentFieldError(modulePath, fieldName, '非空字符串')
  }

  return normalizedValue
}

/**
 * 规范可选字符串字段。
 */
function normalizeOptionalStringField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string | null {
  if (value === undefined || value === null) {
    return null
  }

  return normalizeStringField(value, modulePath, fieldName)
}

/**
 * 统一发布日期格式，方便排序和展示。
 */
function normalizePublishedAt(value: unknown, modulePath: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim()

    if (/^\d{4}-\d{2}-\d{2}$/u.test(normalizedValue)) {
      return normalizedValue
    }
  }

  throw createContentFieldError(modulePath, 'publishedAt', 'YYYY-MM-DD 格式日期')
}

/**
 * 规范布尔字段。
 */
function normalizeBooleanField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): boolean {
  if (typeof value !== 'boolean') {
    throw createContentFieldError(modulePath, fieldName, 'boolean')
  }

  return value
}

/**
 * 把内部日期格式转换成前台展示文案。
 */
function formatPublishedDate(publishedAt: string): string {
  return publishedAt.replaceAll('-', '.')
}

/**
 * 校验文章分类。
 */
function normalizeCategoryKey(
  value: unknown,
  modulePath: string,
): PostCategoryKey {
  if (
    value === 'technical' ||
    value === 'geek-life' ||
    value === 'tutorial' ||
    value === 'devlog' ||
    value === 'culture'
  ) {
    return value
  }

  throw createContentFieldError(
    modulePath,
    'categoryKey',
    'technical / geek-life / tutorial / devlog / culture 之一',
  )
}

/**
 * 校验封面比例配置。
 */
function normalizeCoverRatio(
  value: unknown,
  modulePath: string,
): PostCoverRatio {
  if (
    value === 'portrait' ||
    value === 'square' ||
    value === 'landscape' ||
    value === 'wide'
  ) {
    return value
  }

  throw createContentFieldError(
    modulePath,
    'coverRatio',
    'portrait / square / landscape / wide 之一',
  )
}

/**
 * 校验封面图朝向。
 */
function normalizeImageSide(
  value: unknown,
  modulePath: string,
): 'left' | 'right' {
  if (value === 'left' || value === 'right') {
    return value
  }

  throw createContentFieldError(modulePath, 'imageSide', 'left 或 right')
}

/**
 * 规范字符串数组字段。
 */
function normalizeStringArray(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string[] {
  if (!Array.isArray(value)) {
    throw createContentFieldError(modulePath, fieldName, '字符串数组')
  }

  const normalizedValues: string[] = []

  for (const item of value) {
    normalizedValues.push(normalizeStringField(item, modulePath, fieldName))
  }

  return normalizedValues
}

/**
 * 校验图片资源对象。
 */
function normalizeImageAsset(
  value: unknown,
  modulePath: string,
): ImageAsset {
  if (typeof value !== 'object' || value === null) {
    throw createContentFieldError(modulePath, 'image', '包含 src 和 alt 的对象')
  }

  const imageAsset = value as ImageAssetLike

  return {
    src: normalizeStringField(imageAsset.src, modulePath, 'image.src'),
    alt: normalizeStringField(imageAsset.alt, modulePath, 'image.alt'),
  }
}

/**
 * 校验预览分节内容。
 */
function normalizePreviewSections(
  value: unknown,
  modulePath: string,
): PostPreviewSection[] {
  if (!Array.isArray(value)) {
    throw createContentFieldError(
      modulePath,
      'previewSections',
      '包含 heading 和 content 的对象数组',
    )
  }

  const normalizedSections: PostPreviewSection[] = []

  for (const item of value) {
    if (typeof item !== 'object' || item === null) {
      throw createContentFieldError(
        modulePath,
        'previewSections',
        '包含 heading 和 content 的对象数组',
      )
    }

    const previewSection = item as PreviewSectionLike

    normalizedSections.push({
      heading: normalizeStringField(
        previewSection.heading,
        modulePath,
        'previewSections.heading',
      ),
      content: normalizeStringField(
        previewSection.content,
        modulePath,
        'previewSections.content',
      ),
    })
  }

  return normalizedSections
}

/**
 * 把单篇 Markdown 文章整理成站点内部统一使用的内容模型。
 */
function buildMarkdownPostDocument(
  modulePath: string,
  rawMarkdownContent: string,
): MarkdownPostDocument {
  const parsedMarkdownFile = parseMarkdownFile(rawMarkdownContent, modulePath)
  const frontmatter = parsedMarkdownFile.data
  const modulePathSlug = getModulePathSlug(modulePath)
  const declaredSlug =
    frontmatter.slug === undefined
      ? modulePathSlug
      : normalizeStringField(frontmatter.slug, modulePath, 'slug')

  if (declaredSlug !== modulePathSlug) {
    throw new Error(
      `文章文件 ${modulePath} 的 slug 与文件名不一致，请保持统一，避免路由混乱。`,
    )
  }

  return {
    slug: declaredSlug,
    title: normalizeStringField(frontmatter.title, modulePath, 'title'),
    excerpt: normalizeStringField(frontmatter.excerpt, modulePath, 'excerpt'),
    publishedAt: normalizePublishedAt(frontmatter.publishedAt, modulePath),
    author: normalizeStringField(frontmatter.author, modulePath, 'author'),
    categoryKey: normalizeCategoryKey(frontmatter.categoryKey, modulePath),
    image: normalizeImageAsset(frontmatter.image, modulePath),
    coverRatio: normalizeCoverRatio(frontmatter.coverRatio, modulePath),
    imageSide: normalizeImageSide(frontmatter.imageSide, modulePath),
    series: normalizeOptionalStringField(frontmatter.series, modulePath, 'series'),
    tags: normalizeStringArray(frontmatter.tags, modulePath, 'tags'),
    featured: normalizeBooleanField(frontmatter.featured, modulePath, 'featured'),
    previewSections: normalizePreviewSections(
      frontmatter.previewSections,
      modulePath,
    ),
    markdownContent: parsedMarkdownFile.content.trim(),
  }
}

/**
 * 按发布日期倒序整理文章集合。
 */
function sortMarkdownPostDocuments(
  documents: MarkdownPostDocument[],
): MarkdownPostDocument[] {
  return [...documents].sort((leftDocument, rightDocument) =>
    rightDocument.publishedAt.localeCompare(leftDocument.publishedAt),
  )
}

/**
 * 为首页更新区生成更符合运营语义的排序。
 * 首页优先展示精选文章，其次再看发布时间。
 */
function sortFeaturedMarkdownPostDocuments(
  documents: MarkdownPostDocument[],
): MarkdownPostDocument[] {
  return [...documents].sort((leftDocument, rightDocument) => {
    if (leftDocument.featured !== rightDocument.featured) {
      return Number(rightDocument.featured) - Number(leftDocument.featured)
    }

    return rightDocument.publishedAt.localeCompare(leftDocument.publishedAt)
  })
}

/**
 * 在模块初始化阶段构建文章缓存。
 * 文章是静态内容，提前解析可以减少页面层的重复工作。
 */
function buildMarkdownPostDocumentCache(): MarkdownPostDocument[] {
  const documents: MarkdownPostDocument[] = []

  for (const [modulePath, rawMarkdownContent] of Object.entries(
    articleMarkdownModules,
  )) {
    documents.push(buildMarkdownPostDocument(modulePath, rawMarkdownContent))
  }

  return sortMarkdownPostDocuments(documents)
}

const markdownPostDocumentCache = buildMarkdownPostDocumentCache()

/**
 * 根据分类键返回前台展示文案。
 */
export function getPostCategoryLabel(categoryKey: PostCategoryKey): string {
  return postCategoryLabels[categoryKey]
}

/**
 * 返回全部 Markdown 文章文档。
 * 这里返回拷贝而不是原始缓存，避免调用方误改全局状态。
 */
export function getAllMarkdownPostDocuments(): MarkdownPostDocument[] {
  return structuredClone(markdownPostDocumentCache)
}

/**
 * 把统一文章文档转换成归档页卡片模型。
 */
function buildArchivePost(document: MarkdownPostDocument): ArchivePost {
  return {
    slug: document.slug,
    title: document.title,
    excerpt: document.excerpt,
    date: formatPublishedDate(document.publishedAt),
    author: document.author,
    categoryKey: document.categoryKey,
    categoryLabel: getPostCategoryLabel(document.categoryKey),
    image: { ...document.image },
    coverRatio: document.coverRatio,
    imageSide: document.imageSide,
    series: document.series,
    tags: [...document.tags],
    featured: document.featured,
    previewSections: document.previewSections.map((previewSection) => ({
      heading: previewSection.heading,
      content: previewSection.content,
    })),
  }
}

/**
 * 读取归档页需要的全部文章卡片数据。
 */
export function getAllArchivePosts(): ArchivePost[] {
  const archivePosts: ArchivePost[] = []

  for (const document of markdownPostDocumentCache) {
    archivePosts.push(buildArchivePost(document))
  }

  return archivePosts
}

/**
 * 读取全部标签，顺序跟随文章首次出现的顺序。
 */
export function getAllArticleTags(): string[] {
  const deduplicatedTags = new Set<string>()

  for (const document of markdownPostDocumentCache) {
    for (const tag of document.tags) {
      deduplicatedTags.add(tag)
    }
  }

  return [...deduplicatedTags]
}

/**
 * 按 slug 读取原始 Markdown 文章文档。
 */
export function getMarkdownPostDocumentBySlug(
  slug: string,
): MarkdownPostDocument | null {
  for (const document of markdownPostDocumentCache) {
    if (document.slug === slug) {
      return structuredClone(document)
    }
  }

  return null
}

/**
 * 生成首页更新区使用的文章卡片。
 */
export function getLatestUpdateArticles(limit: number): UpdateArticle[] {
  const latestArticles: UpdateArticle[] = []
  const homepageSortedDocuments =
    sortFeaturedMarkdownPostDocuments(markdownPostDocumentCache)

  for (
    let index = 0;
    index < homepageSortedDocuments.length && latestArticles.length < limit;
    index += 1
  ) {
    const document = homepageSortedDocuments[index]

    latestArticles.push({
      tag: getPostCategoryLabel(document.categoryKey),
      title: document.title,
      description: document.excerpt,
      date: formatPublishedDate(document.publishedAt),
      to: `/posts/${document.slug}`,
      image: { ...document.image },
      featured: document.featured,
    })
  }

  return latestArticles
}
