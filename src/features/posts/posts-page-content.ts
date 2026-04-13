import type { PostsArchivePageStaticContent } from '@/shared/types/content'

/**
 * 文章归档页静态配置。
 * 归档页里的文章列表和标签列表都从统一的 Markdown 内容源派生，这里只保留固定文案。
 */
export const postsArchivePageContent: PostsArchivePageStaticContent = {
  pageTitle: '文章归档',
  pageTitleHighlight: 'ARCHIVE.2024',
  searchPlaceholder: '搜索标题、标签...',
  tagsTitle: '话题标签',
  hallOfFameTitle: '站内活跃墙',
  hallOfFameMembers: [
    { rank: '01', name: '编辑部 Link', role: 'MVP CONTRIBUTOR' },
    { rank: '02', name: '热帖观察员', role: 'TOP COMMENTER' },
    { rank: '03', name: '选题挖掘机', role: 'TECH EXPLORER' },
  ],
  pageSize: 3,
}
