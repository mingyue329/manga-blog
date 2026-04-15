import type {
  ArchivePost,
  MarkdownPostDocument,
  PostCategoryKey,
  PostReference,
} from "@/shared/types/content";

const postCategoryLabels: Record<PostCategoryKey, string> = {
  technical: "TECHNICAL",
  "geek-life": "GEEK LIFE",
  tutorial: "TUTORIAL",
  devlog: "DEVLOG",
  culture: "CULTURE",
};

export function getPostCategoryLabel(categoryKey: PostCategoryKey): string {
  return postCategoryLabels[categoryKey];
}

export function formatPublishedDate(publishedAt: string): string {
  return publishedAt.replaceAll("-", ".");
}

export function sortMarkdownPostDocuments(
  documents: MarkdownPostDocument[],
): MarkdownPostDocument[] {
  return [...documents].sort((leftDocument, rightDocument) =>
    rightDocument.publishedAt.localeCompare(leftDocument.publishedAt),
  );
}

export function sortHomepageMarkdownPostDocuments(
  documents: MarkdownPostDocument[],
): MarkdownPostDocument[] {
  return [...documents].sort((leftDocument, rightDocument) => {
    if (leftDocument.featured !== rightDocument.featured) {
      return Number(rightDocument.featured) - Number(leftDocument.featured);
    }

    return rightDocument.publishedAt.localeCompare(leftDocument.publishedAt);
  });
}

export function buildArchivePost(document: MarkdownPostDocument): ArchivePost {
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
    previewSections: document.previewSections.map(
      (previewSection: { heading: string; content: string }) => ({
        heading: previewSection.heading,
        content: previewSection.content,
      }),
    ),
    relatedGames: document.relatedGames
      ? document.relatedGames.map(
          (game: {
            appId: number;
            title: string;
            steamUrl: string;
            coverImage?: string;
            note?: string;
          }) => ({ ...game }),
        )
      : undefined,
  };
}

export function collectArticleTags(
  documents: MarkdownPostDocument[],
): string[] {
  const deduplicatedTags = new Set<string>();

  for (const document of documents) {
    for (const tag of document.tags) {
      deduplicatedTags.add(tag);
    }
  }

  return [...deduplicatedTags];
}

export function buildPostReference(post: ArchivePost): PostReference {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    categoryLabel: post.categoryLabel,
    tags: [...post.tags],
    image: { ...post.image },
    coverRatio: post.coverRatio,
    series: post.series,
    to: `/posts/${post.slug}`,
  };
}

function getReadableUnitCount(markdownContent: string): number {
  const markdownWithoutCodeFence = markdownContent
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`[^`]+`/gu, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, " ")
    .replace(/\[[^\]]+\]\([^)]*\)/gu, " ")
    .replace(/[>#*_~|-]/gu, " ");

  const latinWords = markdownWithoutCodeFence.match(/[A-Za-z0-9_]+/gu) ?? [];
  const chineseCharacters =
    markdownWithoutCodeFence.match(/[\p{Script=Han}]/gu) ?? [];

  return latinWords.length + chineseCharacters.length;
}

export function buildReadingTimeText(markdownContent: string): string {
  const readableUnitCount = getReadableUnitCount(markdownContent);
  const minutes = Math.max(1, Math.ceil(readableUnitCount / 280));

  return `${minutes} 分钟阅读`;
}

export function buildAdjacentReference(
  archivePosts: ArchivePost[],
  currentPostIndex: number,
  offset: number,
): PostReference | null {
  const targetPost = archivePosts[currentPostIndex + offset];

  if (!targetPost) {
    return null;
  }

  return buildPostReference(targetPost);
}

function countSharedTags(
  currentPost: ArchivePost,
  nextPost: ArchivePost,
): number {
  let sharedTagCount = 0;

  for (const currentTag of currentPost.tags) {
    for (const nextTag of nextPost.tags) {
      if (currentTag === nextTag) {
        sharedTagCount += 1;
      }
    }
  }

  return sharedTagCount;
}

export function buildRelatedPosts(
  archivePosts: ArchivePost[],
  currentPost: ArchivePost,
  limit = 3,
): PostReference[] {
  const scoredPosts: Array<{
    post: ArchivePost;
    score: number;
    order: number;
  }> = [];

  for (let index = 0; index < archivePosts.length; index += 1) {
    const post = archivePosts[index];

    if (post.slug === currentPost.slug) {
      continue;
    }

    scoredPosts.push({
      post,
      score: countSharedTags(currentPost, post),
      order: index,
    });
  }

  scoredPosts.sort((leftPost, rightPost) => {
    if (rightPost.score !== leftPost.score) {
      return rightPost.score - leftPost.score;
    }

    return leftPost.order - rightPost.order;
  });

  return scoredPosts
    .slice(0, limit)
    .map(({ post }) => buildPostReference(post));
}
