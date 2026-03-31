import type { PostsArchivePageStaticContent } from '@/types/content'

/**
 * 文章归档页静态配置。
 * 归档页中的文章列表和标签列表都将从统一 Markdown 内容源派生，因此这里只保留固定页面文案。
 */
export const postsArchivePageContent: PostsArchivePageStaticContent = {
  pageTitle: '博文归档',
  pageTitleHighlight: 'ARCHIVE.2024',
  searchPlaceholder: '搜索存档...',
  tagsTitle: '话题标签',
  hallOfFameTitle: '荣誉殿堂',
  hallOfFameMembers: [
    { rank: '01', name: '林克 Link', role: 'MVP Contributor' },
    { rank: '02', name: '黑客猫酱', role: 'Top Commenter' },
    { rank: '03', name: '字节跃动', role: 'Tech Explorer' },
  ],
  pageSize: 3,
}
