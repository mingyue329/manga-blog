import type { ReactElement } from "react";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Clock3,
  Sparkles,
  Tags,
} from "lucide-react";
import { Link, useLoaderData } from "react-router-dom";

import { PostMarkdown } from "@/features/posts/components/post-markdown";
import { getPostCoverRatioClass } from "@/shared/lib/post-cover-ratio";
import { getPublicAssetUrl } from "@/shared/lib/public-asset";
import { useGsapHoverPreviewCard } from "@/shared/lib/use-gsap-hover-preview-card";
import { cn } from "@/shared/lib/utils";
import {
  buildPostSeoMetadata,
  generateSeoTags,
} from "@/shared/site/seo-metadata";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import type {
  ArchivePost,
  PostDetailPageData,
  PostReference,
} from "@/shared/types/content";

interface ArticleMetaItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

/**
 * 读取文章详情页的 loader 数据。
 */
function usePostDetailPageData(): PostDetailPageData {
  return useLoaderData() as PostDetailPageData;
}

/**
 * 渲染标签徽章。
 */
function renderTagBadges(tags: string[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const tag of tags) {
    elements.push(
      <Badge key={tag} variant="outlineInk">
        #{tag}
      </Badge>,
    );
  }

  return elements;
}

/**
 * 渲染文章元信息卡片。
 */
function renderArticleMetaItems(metaItems: ArticleMetaItem[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const metaItem of metaItems) {
    const Icon = metaItem.icon;

    elements.push(
      <div
        key={`${metaItem.label}-${metaItem.value}`}
        className="theme-surface-panel theme-border-strong flex items-center gap-3 border-2 px-4 py-3"
      >
        <span className="theme-surface-panel-muted theme-border-strong flex size-10 items-center justify-center border-2">
          <Icon className="size-4" />
        </span>
        <div className="space-y-1">
          <p className="theme-text-muted text-[0.68rem] font-black uppercase tracking-[0.2em]">
            {metaItem.label}
          </p>
          <p className="font-heading text-sm font-black uppercase tracking-[0.14em]">
            {metaItem.value}
          </p>
        </div>
      </div>,
    );
  }

  return elements;
}

/**
 * 渲染“本章线索”列表。
 */
function renderStorySeedItems(post: ArchivePost): ReactElement[] {
  const elements: ReactElement[] = [];

  for (let index = 0; index < post.previewSections.length; index += 1) {
    const previewSection = post.previewSections[index];

    elements.push(
      <li
        key={`${post.slug}-${previewSection.heading}`}
        className="theme-border-faint flex gap-3 border-b-2 pb-3 last:border-b-0 last:pb-0"
      >
        <span className="theme-text-faint font-heading text-sm font-black uppercase tracking-[0.18em]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="theme-text-soft font-medium leading-7">
          {previewSection.heading}
        </span>
      </li>,
    );
  }

  return elements;
}

/**
 * 渲染标题下方的摘要信息。
 */
function renderArticleSummaryLine(post: ArchivePost): ReactElement {
  const summaryParts = [
    `By ${post.author}`,
    post.series ? `Series ${post.series}` : "Series 单篇文章",
    `Cover ${post.coverRatio}`,
  ];

  return (
    <div className="theme-text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-black uppercase tracking-[0.16em]">
      {summaryParts.map((summaryPart) => (
        <span key={summaryPart}>{summaryPart}</span>
      ))}
      {post.featured ? <Badge variant="outlineInk">精选文章</Badge> : null}
    </div>
  );
}

/**
 * 渲染文章右侧事实卡片。
 */
function renderArticleFactItems(post: ArchivePost): ReactElement[] {
  const factItems = [
    { label: "Author", value: post.author },
    { label: "Series", value: post.series ?? "独立篇章" },
    { label: "Cover Ratio", value: post.coverRatio },
    { label: "Featured", value: post.featured ? "Yes" : "No" },
  ];

  return factItems.map((factItem) => (
    <div
      key={`${factItem.label}-${factItem.value}`}
      className="theme-surface-panel theme-border-strong border-2 px-4 py-3"
    >
      <p className="theme-text-muted text-[0.68rem] font-black uppercase tracking-[0.2em]">
        {factItem.label}
      </p>
      <p className="mt-2 font-heading text-sm font-black uppercase tracking-[0.14em]">
        {factItem.value}
      </p>
    </div>
  ));
}

function PostNavigationCard({
  label,
  postReference,
  direction,
}: {
  label: string;
  postReference: PostReference;
  direction: "previous" | "next";
}): ReactElement {
  const { triggerRef, cardRef } = useGsapHoverPreviewCard();
  if (!postReference) {
    throw new Error("PostNavigationCard requires a post reference.");
  }

  const DirectionIcon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <Link
      ref={triggerRef as React.Ref<HTMLAnchorElement>}
      to={postReference.to}
      className="group block h-full"
    >
      <Card
        ref={cardRef}
        className="manga-panel-hover theme-surface-panel theme-border-strong h-full border-4 py-0"
      >
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="outlineInk">{label}</Badge>
            <DirectionIcon className="size-4" />
          </div>
          <h3 className="font-heading text-2xl font-black leading-tight tracking-tight">
            {postReference.title}
          </h3>
          <p className="theme-text-soft line-clamp-3 text-sm leading-7">
            {postReference.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function RelatedPostCard({
  relatedPost,
}: {
  relatedPost: PostReference;
}): ReactElement {
  const { triggerRef, cardRef, shadowRef, imageRef, overlayRef } =
    useGsapHoverPreviewCard();

  return (
    <Link
      ref={triggerRef as React.Ref<HTMLAnchorElement>}
      to={relatedPost.to}
      className="group block h-full"
    >
      <div className="relative h-full">
        <div
          ref={shadowRef}
          className="pointer-events-none absolute inset-0 z-0 theme-surface-ink theme-border-strong border-4"
        />
        <Card
          ref={cardRef}
          className="manga-panel-hover theme-surface-panel theme-border-strong relative z-10 h-full overflow-hidden border-4 py-0"
        >
          <CardContent className="p-0">
            <div
              className={cn(
                "manga-preview-media theme-border-strong border-b-4",
                getPostCoverRatioClass(relatedPost.coverRatio),
              )}
            >
              <div
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 bg-[var(--preview-image-overlay)]"
              />
              <img
                ref={imageRef}
                src={getPublicAssetUrl(relatedPost.image.src)}
                alt={relatedPost.image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="ink">{relatedPost.categoryLabel}</Badge>
                {relatedPost.series ? (
                  <Badge variant="outlineInk">{relatedPost.series}</Badge>
                ) : null}
                <span className="theme-text-faint text-xs font-black uppercase tracking-[0.18em]">
                  {relatedPost.date}
                </span>
              </div>
              <h3 className="font-heading text-2xl font-black leading-tight tracking-tight">
                {relatedPost.title}
              </h3>
              <p className="theme-text-soft line-clamp-3 text-sm leading-7">
                {relatedPost.excerpt}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

/**
 * 渲染相关文章卡片。
 */
function renderRelatedPostCards(relatedPosts: PostReference[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const relatedPost of relatedPosts) {
    elements.push(
      <RelatedPostCard key={relatedPost.slug} relatedPost={relatedPost} />,
    );
  }

  return elements;
}

/**
 * 文章详情页主组件。
 */
export function PostDetailPage(): ReactElement {
  const pageData = usePostDetailPageData();

  // 动态设置文章页 SEO 元数据
  useEffect(() => {
    const seoMetadata = buildPostSeoMetadata(pageData.post);
    const seoTags = generateSeoTags(seoMetadata, true);

    // 设置页面标题
    document.title = seoMetadata.title;

    // 移除旧的 meta 标签（保留基础的 charset 和 viewport）
    const oldMetaTags = document.querySelectorAll("meta[name], meta[property]");
    oldMetaTags.forEach((tag) => tag.remove());

    // 创建临时的 div 来解析 HTML 字符串
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = seoTags;

    // 将新的 meta 标签添加到 head
    tempDiv.querySelectorAll("meta, link[rel='canonical']").forEach((tag) => {
      document.head.appendChild(tag);
    });

    // 清理函数：组件卸载时恢复默认标题
    return () => {
      document.title = "明月几时有";
    };
  }, [pageData.post]);

  const articleMetaItems: ArticleMetaItem[] = [
    {
      label: "发布日期",
      value: pageData.post.date,
      icon: CalendarDays,
    },
    {
      label: "阅读时长",
      value: pageData.readingTimeText,
      icon: Clock3,
    },
    {
      label: "栏目分类",
      value: pageData.post.categoryLabel,
      icon: Bookmark,
    },
  ];

  return (
    <div className="space-y-16 md:space-y-20">
      <header data-route-enter className="relative space-y-8 pt-4 xl:pt-6">
        <div
          className="theme-border-faint absolute -left-8 top-0 hidden size-20 border-4 xl:block"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--line-faint) 48%, transparent)",
          }}
        />
        <div className="space-y-4">
          <p className="manga-label theme-text-muted">
            Article Detail // Markdown
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="ink">{pageData.post.categoryLabel}</Badge>
            <Badge variant="outlineInk">{pageData.readingTimeText}</Badge>
          </div>
        </div>
        <div className="max-w-5xl space-y-5">
          <h1 className="font-heading text-4xl font-black leading-none tracking-tight md:text-6xl xl:text-7xl">
            {pageData.post.title}
          </h1>
          <p className="theme-text-soft max-w-3xl text-lg leading-8 md:text-xl">
            {pageData.post.excerpt}
          </p>
          {renderArticleSummaryLine(pageData.post)}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {renderArticleMetaItems(articleMetaItems)}
        </div>
      </header>

      <section data-route-enter className="space-y-8">
        <Card className="theme-surface-panel theme-border-strong overflow-hidden border-4 py-0 manga-panel">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1.4fr)_320px]">
            <div
              className={cn(
                "theme-border-strong relative overflow-hidden border-b-4 lg:aspect-auto lg:border-r-4 lg:border-b-0",
                getPostCoverRatioClass(pageData.post.coverRatio),
              )}
            >
              <img
                src={getPublicAssetUrl(pageData.post.image.src)}
                alt={pageData.post.image.alt}
                className="h-full w-full object-cover"
              />
              <div className="theme-surface-panel theme-border-strong absolute right-5 top-5 border-4 px-4 py-2 font-heading text-sm font-black uppercase tracking-[0.18em]">
                Detail Panel
              </div>
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <div className="space-y-3">
                <p className="manga-label theme-text-faint">Story Seeds</p>
                <h2 className="font-heading text-3xl font-black tracking-tight">
                  本章线索
                </h2>
                <p className="theme-text-soft text-sm leading-7">
                  这里延续归档页里的分节信息，让读者先知道文章会聊什么，再进入下面的
                  Markdown 正文。
                </p>
              </div>
              <ul className="space-y-4">
                {renderStorySeedItems(pageData.post)}
              </ul>
              <div className="grid gap-3 sm:grid-cols-2">
                {renderArticleFactItems(pageData.post)}
              </div>
              <div className="theme-surface-panel-muted theme-border-strong border-4 px-5 py-4">
                <p className="theme-text-strong text-sm font-bold leading-7">
                  “详情页延续全站的黑白漫画科技风，但把阅读节奏放在第一位，让图像、信息卡片和正文各自承担明确职责。”
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section
        data-route-enter
        className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div className="space-y-10">
          <Card className="theme-surface-panel theme-border-strong w-full border-4 py-0 manga-panel">
            <CardContent className="space-y-6 p-8 md:p-10">
              <div className="theme-border-strong flex items-center gap-3 border-b-4 pb-4">
                <Sparkles className="size-5" />
                <p className="font-heading text-xl font-black uppercase tracking-[0.12em]">
                  Markdown Manuscript
                </p>
              </div>
              <PostMarkdown markdownContent={pageData.markdownContent} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {pageData.previousPost ? (
              <PostNavigationCard
                label="上一篇"
                postReference={pageData.previousPost}
                direction="previous"
              />
            ) : null}
            {pageData.nextPost ? (
              <PostNavigationCard
                label="下一篇"
                postReference={pageData.nextPost}
                direction="next"
              />
            ) : null}
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-32 xl:self-start">
          <Card className="theme-surface-panel theme-border-strong border-4 py-0">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <Tags className="size-4" />
                <p className="font-heading text-xl font-black uppercase tracking-[0.14em]">
                  标签索引
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {renderTagBadges(pageData.post.tags)}
              </div>
            </CardContent>
          </Card>

          <Card className="theme-surface-panel theme-border-strong border-4 py-0">
            <CardContent className="space-y-5 p-6">
              <p className="font-heading text-xl font-black uppercase tracking-[0.14em]">
                阅读动作
              </p>
              <div className="space-y-3">
                <Button asChild variant="ink" size="lg" className="w-full">
                  <Link to="/posts">
                    <ArrowLeft className="size-4" />
                    返回文章列表
                  </Link>
                </Button>
                {pageData.nextPost ? (
                  <Button
                    asChild
                    variant="outlineInk"
                    size="lg"
                    className="w-full"
                  >
                    <Link to={pageData.nextPost.to}>
                      继续阅读
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>

      <section
        data-route-enter
        className="theme-border-strong space-y-8 border-t-8 pt-10"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="manga-label theme-text-muted">Next Panels</p>
            <h2 className="font-heading text-4xl font-black tracking-tight">
              相关文章
            </h2>
          </div>
          <Button asChild variant="outlineInk">
            <Link to="/posts">查看全部文章</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {renderRelatedPostCards(pageData.relatedPosts)}
        </div>
      </section>
    </div>
  );
}
