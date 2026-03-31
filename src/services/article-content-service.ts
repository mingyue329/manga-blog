import { parse as parseYaml } from 'yaml'

import type {
  ArchivePost,
  ImageAsset,
  MarkdownPostDocument,
  PostCategoryKey,
  PostCoverRatio,
  PostPreviewSection,
  UpdateArticle,
} from '@/types/content'

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

const articleMarkdownModules = import.meta.glob('../content/posts/*.md', {
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
 * 解析 Markdown 文件中的 frontmatter 与正文。
 * 这里不依赖 Node 侧库，而是直接在浏览器可运行的环境里完成 frontmatter 切分和 YAML 解析。
 */
function parseMarkdownFile(
  rawMarkdownContent: string,
  modulePath: string,
): ParsedMarkdownFile {
  const normalizedMarkdownContent = rawMarkdownContent.replace(/\r\n/gu, '\n')

  if (!normalizedMarkdownContent.startsWith('---\n')) {
    throw new Error(
      `文章内容文件 ${modulePath} 缺少 frontmatter，请在文件顶部添加 --- 包裹的元数据块。`,
    )
  }

  const frontmatterEndIndex = normalizedMarkdownContent.indexOf('\n---\n', 4)

  if (frontmatterEndIndex === -1) {
    throw new Error(
      `文章内容文件 ${modulePath} 的 frontmatter 没有正确闭合，请检查 --- 分隔符。`,
    )
  }

  const frontmatterBlock = normalizedMarkdownContent.slice(4, frontmatterEndIndex)
  const parsedFrontmatter = parseYaml(frontmatterBlock)

  if (typeof parsedFrontmatter !== 'object' || parsedFrontmatter === null) {
    throw new Error(
      `文章内容文件 ${modulePath} 的 frontmatter 解析失败，请检查 YAML 结构。`,
    )
  }

  return {
    data: parsedFrontmatter as ArticleFrontmatter,
    content: normalizedMarkdownContent.slice(frontmatterEndIndex + 5).trim(),
  }
}

/**
 * 从 Markdown 模块路径中提取文件级 slug。
 * 这里把文件名视为路由层的稳定标识，这样未来即使 frontmatter 没写 slug，也不会影响详情页寻址。
 */
function getModulePathSlug(modulePath: string): string {
  const pathSegments = modulePath.split('/')
  const fileName = pathSegments[pathSegments.length - 1] ?? ''

  return fileName.replace(/\.md$/u, '')
}

/**
 * 生成更容易定位问题的错误信息。
 * 统一格式后，后续如果某篇 Markdown frontmatter 写错，能直接知道是哪一个文件、哪个字段出错。
 */
function createContentFieldError(
  modulePath: string,
  fieldName: string,
  expectedDescription: string,
): Error {
  return new Error(
    `文章内容文件 ${modulePath} 的 ${fieldName} 字段格式无效，期望 ${expectedDescription}。`,
  )
}

/**
 * 把未知值校验并收敛成字符串。
 * frontmatter 来自 Markdown 文本，不做显式校验的话，页面层很容易在运行时才暴露问题。
 */
function normalizeStringField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string {
  if (typeof value !== 'string') {
    throw createContentFieldError(modulePath, fieldName, '字符串')
  }

  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw createContentFieldError(modulePath, fieldName, '非空字符串')
  }

  return normalizedValue
}

/**
 * 规范 frontmatter 里的可选字符串字段。
 * `series` 这类字段未来可能允许文章暂时不归属任何系列，因此这里允许缺省，但一旦填写就必须是非空字符串。
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
 * 把 frontmatter 里的发布日期收敛成 ISO 日期字符串。
 * 统一存成 `YYYY-MM-DD` 后，既方便排序，也方便后续对接真实后台接口。
 */
function normalizePublishedAt(
  value: unknown,
  modulePath: string,
): string {
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
 * 规范 frontmatter 中的布尔开关字段。
 * `featured` 这类字段会直接影响首页推荐排序和列表页强调样式，因此必须在内容层先收敛成稳定的 boolean。
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
 * 把日期转换成站点当前统一使用的展示格式。
 * 页面组件只关心展示文案，因此格式转换应该在内容层完成，而不是散落到多个组件里。
 */
function formatPublishedDate(publishedAt: string): string {
  return publishedAt.replaceAll('-', '.')
}

/**
 * 校验分类键是否属于当前站点允许的文章分类。
 * 这样分类来源就会被统一约束，避免页面上出现不受控的随机标签。
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
 * 读取文章封面比例配置。
 * 这个字段属于纯展示元数据，未来不管内容来自 Markdown 还是后台接口，都应该继续复用同一套比例语义。
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
 * 读取文章卡片中封面图的左右布局方向。
 * 这个字段属于视觉排版元数据，因此保留在 frontmatter 中比写死在组件里更灵活。
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
 * 把 frontmatter 中的字符串数组做统一校验。
 * 标签是文章列表、相关文章和筛选器共用的数据，因此这里必须保证输出稳定。
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
 * 校验 frontmatter 中的图片对象。
 * 图片字段后续很可能来自对象存储或后台上传，所以先把结构严格收紧，能减少后续迁移成本。
 */
function normalizeImageAsset(
  value: unknown,
  modulePath: string,
): ImageAsset {
  if (typeof value !== 'object' || value === null) {
    throw createContentFieldError(modulePath, 'image', '包含 src 与 alt 的对象')
  }

  const imageAsset = value as ImageAssetLike

  return {
    src: normalizeStringField(imageAsset.src, modulePath, 'image.src'),
    alt: normalizeStringField(imageAsset.alt, modulePath, 'image.alt'),
  }
}

/**
 * 校验文章预览分节数据。
 * 这些字段既用于归档页预览，也用于详情页的“本章线索”，所以统一维护在 frontmatter 中最合适。
 */
function normalizePreviewSections(
  value: unknown,
  modulePath: string,
): PostPreviewSection[] {
  if (!Array.isArray(value)) {
    throw createContentFieldError(
      modulePath,
      'previewSections',
      '包含 heading 与 content 的对象数组',
    )
  }

  const normalizedSections: PostPreviewSection[] = []

  for (const item of value) {
    if (typeof item !== 'object' || item === null) {
      throw createContentFieldError(
        modulePath,
        'previewSections',
        '包含 heading 与 content 的对象数组',
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
 * 把一篇 Markdown 文档解析成统一文章模型。
 * 这里的目标不是单纯“能读出来”，而是把文章元数据彻底收拢成站点内部稳定可复用的结构。
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
      `文章内容文件 ${modulePath} 的 slug 与文件名不一致，请保持两者统一，避免路由混乱。`,
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
 * 统一在内容层完成排序后，列表页、详情页和首页推荐区都可以共享同一套顺序语义。
 */
function sortMarkdownPostDocuments(
  documents: MarkdownPostDocument[],
): MarkdownPostDocument[] {
  return [...documents].sort((leftDocument, rightDocument) =>
    rightDocument.publishedAt.localeCompare(leftDocument.publishedAt),
  )
}

/**
 * 为首页“最新动态”生成更贴近运营语义的排序。
 * 这里优先展示被标记为 featured 的文章，其次再按发布日期倒序，避免首页推荐区只能机械地显示最近几篇内容。
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
 * 在模块初始化阶段构建统一文章缓存。
 * 文章内容是构建期静态资源，提前解析可以避免每次进入页面都重复做 frontmatter 处理。
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
 * 根据分类键获取页面展示时使用的分类标签。
 * 分类展示文案应该由内容层统一决定，而不是在多个页面组件里重复判断。
 */
export function getPostCategoryLabel(categoryKey: PostCategoryKey): string {
  return postCategoryLabels[categoryKey]
}

/**
 * 读取站点内所有 Markdown 文章文档。
 * 返回拷贝而不是原引用，避免调用方不小心改坏模块级缓存。
 */
export function getAllMarkdownPostDocuments(): MarkdownPostDocument[] {
  return structuredClone(markdownPostDocumentCache)
}

/**
 * 把统一文章文档模型转换成归档页使用的文章卡片数据。
 * 页面层不需要关心原始发布日期格式和分类标签推导，因此在这里一次性转换完。
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
 * 读取归档页使用的全部文章卡片数据。
 * 归档页和详情页虽然展示层不同，但都应该从同一批 Markdown 文档派生数据。
 */
export function getAllArchivePosts(): ArchivePost[] {
  const archivePosts: ArchivePost[] = []

  for (const document of markdownPostDocumentCache) {
    archivePosts.push(buildArchivePost(document))
  }

  return archivePosts
}

/**
 * 从统一文章文档中读取全部标签。
 * 标签顺序跟随文章发布时间和首次出现顺序，这样更符合前端筛选器的阅读直觉。
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
 * 按 slug 获取原始 Markdown 文章文档。
 * 详情页需要正文、日期和标签等完整信息，因此应该直接读取统一内容模型，而不是从页面数据里反查。
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
 * 生成首页“最新动态”区域使用的文章卡片。
 * 首页不应该再维护一份重复的文章摘要，因此直接从统一文章集合中截取最新内容。
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
