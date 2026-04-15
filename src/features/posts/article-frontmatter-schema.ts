import { parse as parseYaml } from "yaml";

import type {
  GameReference,
  ImageAsset,
  MarkdownPostDocument,
  PostCategoryKey,
  PostCoverRatio,
  PostPreviewSection,
} from "@/shared/types/content";

interface ArticleFrontmatterInput {
  slug?: unknown;
  title?: unknown;
  excerpt?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  author?: unknown;
  categoryKey?: unknown;
  image?: unknown;
  coverRatio?: unknown;
  imageSide?: unknown;
  series?: unknown;
  tags?: unknown;
  featured?: unknown;
  draft?: unknown;
  previewSections?: unknown;
  relatedGames?: unknown;
}

interface PreviewSectionLike {
  heading?: unknown;
  content?: unknown;
}

interface ImageAssetLike {
  src?: unknown;
  alt?: unknown;
}

interface GameReferenceLike {
  appId?: unknown;
  title?: unknown;
  steamUrl?: unknown;
  coverImage?: unknown;
  note?: unknown;
}

interface ParsedMarkdownFile {
  data: ArticleFrontmatterInput;
  content: string;
}

function parseMarkdownFile(
  rawMarkdownContent: string,
  modulePath: string,
): ParsedMarkdownFile {
  const normalizedMarkdownContent = rawMarkdownContent.replace(/\r\n/gu, "\n");

  if (!normalizedMarkdownContent.startsWith("---\n")) {
    throw new Error(
      `文章文件 ${modulePath} 缺少 frontmatter，请在文件顶部补上 --- 包裹的元数据块。`,
    );
  }

  const frontmatterEndIndex = normalizedMarkdownContent.indexOf("\n---\n", 4);

  if (frontmatterEndIndex === -1) {
    throw new Error(
      `文章文件 ${modulePath} 的 frontmatter 没有正确闭合，请检查 --- 分隔符。`,
    );
  }

  const frontmatterBlock = normalizedMarkdownContent.slice(
    4,
    frontmatterEndIndex,
  );
  const parsedFrontmatter = parseYaml(frontmatterBlock);

  if (typeof parsedFrontmatter !== "object" || parsedFrontmatter === null) {
    throw new Error(
      `文章文件 ${modulePath} 的 frontmatter 解析失败，请检查 YAML 结构。`,
    );
  }

  return {
    data: parsedFrontmatter as ArticleFrontmatterInput,
    content: normalizedMarkdownContent.slice(frontmatterEndIndex + 5).trim(),
  };
}

function getModulePathSlug(modulePath: string): string {
  const pathSegments = modulePath.split("/");
  const fileName = pathSegments[pathSegments.length - 1] ?? "";

  return fileName.replace(/\.md$/u, "");
}

function createContentFieldError(
  modulePath: string,
  fieldName: string,
  expectedDescription: string,
): Error {
  return new Error(
    `文章文件 ${modulePath} 的 ${fieldName} 字段格式无效，期望为 ${expectedDescription}。`,
  );
}

function normalizeStringField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string {
  if (typeof value !== "string") {
    throw createContentFieldError(modulePath, fieldName, "非空字符串");
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw createContentFieldError(modulePath, fieldName, "非空字符串");
  }

  return normalizedValue;
}

function normalizeOptionalStringField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return normalizeStringField(value, modulePath, fieldName);
}

function normalizePublishedAt(value: unknown, modulePath: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/u.test(normalizedValue)) {
      return normalizedValue;
    }
  }

  throw createContentFieldError(
    modulePath,
    "publishedAt",
    "YYYY-MM-DD 格式日期",
  );
}

function normalizeOptionalPublishedAt(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/u.test(normalizedValue)) {
      return normalizedValue;
    }
  }

  throw createContentFieldError(modulePath, fieldName, "YYYY-MM-DD 格式日期");
}

function normalizeBooleanField(
  value: unknown,
  modulePath: string,
  fieldName: string,
): boolean {
  if (typeof value !== "boolean") {
    throw createContentFieldError(modulePath, fieldName, "boolean");
  }

  return value;
}

function normalizeOptionalBooleanField(
  value: unknown,
  modulePath: string,
  fieldName: string,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value !== "boolean") {
    throw createContentFieldError(modulePath, fieldName, "boolean");
  }

  return value;
}

function normalizeCategoryKey(
  value: unknown,
  modulePath: string,
): PostCategoryKey {
  if (
    value === "technical" ||
    value === "geek-life" ||
    value === "tutorial" ||
    value === "devlog" ||
    value === "culture"
  ) {
    return value;
  }

  throw createContentFieldError(
    modulePath,
    "categoryKey",
    "technical / geek-life / tutorial / devlog / culture 之一",
  );
}

function normalizeCoverRatio(
  value: unknown,
  modulePath: string,
): PostCoverRatio {
  if (
    value === "portrait" ||
    value === "square" ||
    value === "landscape" ||
    value === "wide"
  ) {
    return value;
  }

  throw createContentFieldError(
    modulePath,
    "coverRatio",
    "portrait / square / landscape / wide 之一",
  );
}

function normalizeImageSide(
  value: unknown,
  modulePath: string,
): "left" | "right" {
  if (value === "left" || value === "right") {
    return value;
  }

  throw createContentFieldError(modulePath, "imageSide", "left 或 right");
}

function normalizeStringArray(
  value: unknown,
  modulePath: string,
  fieldName: string,
): string[] {
  if (!Array.isArray(value)) {
    throw createContentFieldError(modulePath, fieldName, "字符串数组");
  }

  return value.map((item) => normalizeStringField(item, modulePath, fieldName));
}

function normalizeImageAsset(value: unknown, modulePath: string): ImageAsset {
  if (typeof value !== "object" || value === null) {
    throw createContentFieldError(
      modulePath,
      "image",
      "包含 src 和 alt 的对象",
    );
  }

  const imageAsset = value as ImageAssetLike;

  return {
    src: normalizeStringField(imageAsset.src, modulePath, "image.src"),
    alt: normalizeStringField(imageAsset.alt, modulePath, "image.alt"),
  };
}

function normalizePreviewSections(
  value: unknown,
  modulePath: string,
): PostPreviewSection[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw createContentFieldError(
      modulePath,
      "previewSections",
      "包含 heading 和 content 的对象数组",
    );
  }

  return value.map((item) => {
    if (typeof item !== "object" || item === null) {
      throw createContentFieldError(
        modulePath,
        "previewSections",
        "包含 heading 和 content 的对象数组",
      );
    }

    const previewSection = item as PreviewSectionLike;

    return {
      heading: normalizeStringField(
        previewSection.heading,
        modulePath,
        "previewSections.heading",
      ),
      content: normalizeStringField(
        previewSection.content,
        modulePath,
        "previewSections.content",
      ),
    };
  });
}

function normalizeGameReference(
  value: unknown,
  modulePath: string,
): GameReference {
  if (typeof value !== "object" || value === null) {
    throw createContentFieldError(
      modulePath,
      "relatedGames",
      "包含 appId、title、steamUrl 的对象",
    );
  }

  const gameRef = value as GameReferenceLike;

  const appId = gameRef.appId;
  if (typeof appId !== "number" || !Number.isInteger(appId) || appId <= 0) {
    throw createContentFieldError(modulePath, "relatedGames.appId", "正整数");
  }

  return {
    appId,
    title: normalizeStringField(
      gameRef.title,
      modulePath,
      "relatedGames.title",
    ),
    steamUrl: normalizeStringField(
      gameRef.steamUrl,
      modulePath,
      "relatedGames.steamUrl",
    ),
    coverImage:
      gameRef.coverImage === undefined || gameRef.coverImage === null
        ? undefined
        : normalizeStringField(
            gameRef.coverImage,
            modulePath,
            "relatedGames.coverImage",
          ),
    note:
      gameRef.note === undefined || gameRef.note === null
        ? undefined
        : normalizeStringField(gameRef.note, modulePath, "relatedGames.note"),
  };
}

function normalizeOptionalGameReferences(
  value: unknown,
  modulePath: string,
): GameReference[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw createContentFieldError(modulePath, "relatedGames", "游戏引用数组");
  }

  return value.map((item) => normalizeGameReference(item, modulePath));
}

export function validateMarkdownPostDocument(
  modulePath: string,
  rawMarkdownContent: string,
): MarkdownPostDocument {
  const parsedMarkdownFile = parseMarkdownFile(rawMarkdownContent, modulePath);
  const frontmatter = parsedMarkdownFile.data;
  const modulePathSlug = getModulePathSlug(modulePath);
  const declaredSlug =
    frontmatter.slug === undefined
      ? modulePathSlug
      : normalizeStringField(frontmatter.slug, modulePath, "slug");

  if (declaredSlug !== modulePathSlug) {
    throw new Error(
      `文章文件 ${modulePath} 的 slug 与文件名不一致，请保持统一，避免路由混乱。`,
    );
  }

  return {
    slug: declaredSlug,
    title: normalizeStringField(frontmatter.title, modulePath, "title"),
    excerpt: normalizeStringField(frontmatter.excerpt, modulePath, "excerpt"),
    publishedAt: normalizePublishedAt(frontmatter.publishedAt, modulePath),
    updatedAt: normalizeOptionalPublishedAt(
      frontmatter.updatedAt,
      modulePath,
      "updatedAt",
    ),
    author: normalizeStringField(frontmatter.author, modulePath, "author"),
    categoryKey: normalizeCategoryKey(frontmatter.categoryKey, modulePath),
    image: normalizeImageAsset(frontmatter.image, modulePath),
    coverRatio: normalizeCoverRatio(frontmatter.coverRatio, modulePath),
    imageSide: normalizeImageSide(frontmatter.imageSide, modulePath),
    series: normalizeOptionalStringField(
      frontmatter.series,
      modulePath,
      "series",
    ),
    tags: normalizeStringArray(frontmatter.tags, modulePath, "tags"),
    featured: normalizeBooleanField(
      frontmatter.featured,
      modulePath,
      "featured",
    ),
    draft: normalizeOptionalBooleanField(
      frontmatter.draft,
      modulePath,
      "draft",
      false,
    ),
    previewSections: normalizePreviewSections(
      frontmatter.previewSections,
      modulePath,
    ),
    relatedGames: normalizeOptionalGameReferences(
      frontmatter.relatedGames,
      modulePath,
    ),
    markdownContent: parsedMarkdownFile.content.trim(),
  };
}
