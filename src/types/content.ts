/**
 * 表示一张可复用的图片资源。
 * 这里单独抽类型，是为了后续接接口时可以直接沿用同一份数据结构。
 */
export interface ImageAsset {
  src: string
  alt: string
}

/**
 * 表示站点中的一个普通路由链接。
 * Header、Footer 和按钮都可以复用这个结构，避免重复定义字段。
 */
export interface NavigationLink {
  label: string
  to: string
}

/**
 * 为页面中可配置的图标建立统一键值。
 * 这样数据层只保存字符串，组件层再把字符串翻译成具体的 Lucide 图标。
 */
export type SiteIconKey =
  | 'gamepad-2'
  | 'code-2'
  | 'terminal-square'
  | 'map-pin'
  | 'braces'
  | 'database'
  | 'container'
  | 'figma'
  | 'wind'

/**
 * 表示 Header 右上角的快捷入口。
 * 除了跳转信息外，还额外记录图标和无障碍标签。
 */
export interface SiteQuickAction extends NavigationLink {
  icon: SiteIconKey
  ariaLabel: string
}

/**
 * 表示页脚中的链接项。
 * 这里保留 external 标记，方便以后判断是否使用 target="_blank"。
 */
export interface FooterLink extends NavigationLink {
  external?: boolean
}

/**
 * 表示站点品牌信息。
 * 设计稿里既有中文品牌名，也有英文标识，因此拆成两个字段更清晰。
 */
export interface SiteBrand {
  primaryLabel: string
  secondaryLabel: string
}

/**
 * 表示整个站点级配置。
 * 这些数据由布局层消费，和具体页面内容分离，便于今后扩展多页应用。
 */
export interface SiteConfig {
  brand: SiteBrand
  navigation: NavigationLink[]
  quickActions: SiteQuickAction[]
  footer: {
    links: FooterLink[]
    copyright: string
  }
}

/**
 * 表示首页 Hero 区域里的按钮样式类型。
 * 这个字段会直接映射到自定义的 shadcn Button variant。
 */
export type HomeActionVariant = 'ink' | 'outlineInk'

/**
 * 表示首页 Hero 的操作按钮。
 */
export interface HeroAction extends NavigationLink {
  variant: HomeActionVariant
}

/**
 * 表示首页 Hero 区域的数据。
 */
export interface HeroSectionData {
  speechBubble: string
  titleLead: string
  titleHighlight: string
  description: string
  avatar: ImageAsset
  actions: HeroAction[]
}

/**
 * 表示状态卡片中的一行状态数据。
 */
export interface StatusItem {
  label: string
  value: string
  icon: SiteIconKey
}

/**
 * 表示右侧状态卡片的数据。
 */
export interface StatusPanelData {
  title: string
  items: StatusItem[]
  quote: string
}

/**
 * 表示动态列表中的一篇文章。
 */
export interface UpdateArticle {
  tag: string
  title: string
  description: string
  date: string
  to: string
  image: ImageAsset
  featured: boolean
}

/**
 * 表示首页动态区的数据。
 */
export interface UpdatesSectionData {
  title: string
  viewAllLink: NavigationLink
  items: UpdateArticle[]
}

/**
 * 表示首页中不包含文章列表项的静态配置。
 * 首页里的“最新动态”卡片将由统一的文章内容源生成，因此这里仅保留固定文案和跳转配置。
 */
export type HomePageStaticContent = Omit<HomePageData, 'updates'> & {
  updates: Omit<UpdatesSectionData, 'items'>
}

/**
 * 表示“正在游玩”卡片的数据。
 */
export interface PlayingSectionData {
  title: string
  gameTitle: string
  progressLabel: string
  progressValue: number
  note: string
}

/**
 * 表示技术栈中的一项能力。
 */
export interface TechStackItem {
  name: string
  icon: SiteIconKey
}

/**
 * 表示技术栈区域的数据。
 */
export interface StackSectionData {
  title: string
  items: TechStackItem[]
}

/**
 * 表示首页完整数据。
 * 后续如果首页改成接口驱动，只需要保证返回值满足这个接口即可。
 */
export interface HomePageData {
  hero: HeroSectionData
  statusPanel: StatusPanelData
  updates: UpdatesSectionData
  playing: PlayingSectionData
  stack: StackSectionData
}

/**
 * 表示关于页左侧目录中的一项锚点导航。
 * 这些锚点会直接映射到页面内的章节 id，方便用户快速跳转。
 */
export interface AboutSectionLink {
  id: string
  label: string
}

/**
 * 表示关于页中的单个能力值条目。
 */
export interface AboutStatItem {
  label: string
  secondaryLabel: string
  value: number
  valueText: string
}

/**
 * 表示关于页技能树节点的图标类型。
 */
export type AboutSkillIconKey = 'terminal-square' | 'figma' | 'database'

/**
 * 表示关于页中的一个技能节点。
 */
export interface AboutSkillNode {
  title: string
  description: string
  icon: AboutSkillIconKey
  emphasized?: boolean
}

/**
 * 表示装备图标类型。
 */
export type GearIconKey =
  | 'keyboard'
  | 'mouse'
  | 'laptop'
  | 'headphones'
  | 'camera'
  | 'coffee'

/**
 * 表示关于页中的一件装备。
 */
export interface GearItem {
  name: string
  rarity: string
  icon: GearIconKey
}

/**
 * 表示关于页底部展示区块的类型。
 */
export type AboutShowcasePanelType = 'image' | 'statement'

/**
 * 表示关于页底部的分镜面板。
 */
export interface AboutShowcasePanel {
  type: AboutShowcasePanelType
  image?: ImageAsset
  statement?: string
  accentLabel?: string
}

/**
 * 表示关于页的完整数据结构。
 */
export interface AboutPageData {
  pageTitle: string
  pageTitleHighlight: string
  profileName: string
  profileTagline: string
  profileLevel: string
  profileImage: ImageAsset
  quote: string
  sectionLinks: AboutSectionLink[]
  statsTitle: string
  stats: AboutStatItem[]
  skillsTitle: string
  skills: AboutSkillNode[]
  gearTitle: string
  gearItems: GearItem[]
  showcasePanels: AboutShowcasePanel[]
}

/**
 * 表示文章卡片的分类标签。
 */
export type PostCategoryKey =
  | 'technical'
  | 'geek-life'
  | 'tutorial'
  | 'devlog'
  | 'culture'

/**
 * 表示文章封面图在前台页面中的展示比例。
 * 这里不直接把宽高比写死到组件里，而是先收敛成统一枚举，便于后续继续从 frontmatter 或接口控制封面排版。
 */
export type PostCoverRatio = 'portrait' | 'square' | 'landscape' | 'wide'

/**
 * 表示文章预览中的一个内容段落。
 */
export interface PostPreviewSection {
  heading: string
  content: string
}

/**
 * 表示文章归档页中的单篇文章。
 */
export interface ArchivePost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  categoryKey: PostCategoryKey
  categoryLabel: string
  image: ImageAsset
  coverRatio: PostCoverRatio
  imageSide: 'left' | 'right'
  series: string | null
  tags: string[]
  featured: boolean
  previewSections: PostPreviewSection[]
}

/**
 * 表示统一文章内容源中的一篇 Markdown 文档。
 * 这个类型位于 ArchivePost 之下，是更底层的“原始内容模型”，同时携带 frontmatter 元数据和正文内容。
 */
export interface MarkdownPostDocument {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  author: string
  categoryKey: PostCategoryKey
  image: ImageAsset
  coverRatio: PostCoverRatio
  imageSide: 'left' | 'right'
  series: string | null
  tags: string[]
  featured: boolean
  previewSections: PostPreviewSection[]
  markdownContent: string
}

/**
 * 表示荣誉榜成员。
 */
export interface HallOfFameMember {
  rank: string
  name: string
  role: string
}

/**
 * 表示文章归档页的完整数据结构。
 */
export interface PostsArchivePageData {
  pageTitle: string
  pageTitleHighlight: string
  searchPlaceholder: string
  tagsTitle: string
  tags: string[]
  hallOfFameTitle: string
  hallOfFameMembers: HallOfFameMember[]
  posts: ArchivePost[]
  pageSize: number
}

/**
 * 表示归档页中不包含文章列表与标签列表的静态配置。
 * 真正的文章卡片和标签集合会从统一 Markdown 内容源派生出来，因此这里只保留页面固定文案。
 */
export type PostsArchivePageStaticContent = Omit<
  PostsArchivePageData,
  'posts' | 'tags'
>

/**
 * 表示文章详情页中可复用的文章跳转摘要。
 * 这个结构会同时服务于“上一篇 / 下一篇”和“相关文章”区域，避免不同区域各自维护一套近似字段。
 */
export interface PostReference {
  slug: string
  title: string
  excerpt: string
  date: string
  categoryLabel: string
  tags: string[]
  image: ImageAsset
  coverRatio: PostCoverRatio
  series: string | null
  to: string
}

/**
 * 表示文章详情页完整的数据结构。
 * 列表页只关心摘要信息，而详情页还需要 Markdown 正文、阅读时长和导航关系，因此单独抽出一个类型更清晰。
 */
export interface PostDetailPageData {
  post: ArchivePost
  markdownContent: string
  readingTimeText: string
  previousPost: PostReference | null
  nextPost: PostReference | null
  relatedPosts: PostReference[]
}
