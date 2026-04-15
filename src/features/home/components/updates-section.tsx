import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useGsapHoverPreviewCard } from "@/shared/lib/use-gsap-hover-preview-card";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/shared/ui/card";
import type { UpdateArticle, UpdatesSectionData } from "@/shared/types/content";

interface UpdatesSectionProps {
  updates: UpdatesSectionData;
}

/**
 * 渲染单篇更新卡片。
 */
function UpdateCard({ item }: { item: UpdateArticle }): ReactElement {
  const { triggerRef, cardRef, shadowRef, imageRef, overlayRef } =
    useGsapHoverPreviewCard();

  return (
    <Link
      ref={triggerRef as React.Ref<HTMLAnchorElement>}
      to={item.to}
      data-route-enter
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
          <div className="manga-preview-media theme-border-strong relative h-56 border-b-4">
            <div
              ref={overlayRef}
              className="pointer-events-none absolute inset-0 bg-[var(--preview-image-overlay)]"
            />
            <img
              ref={imageRef}
              src={item.image.src}
              alt={item.image.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="ink">{item.tag}</Badge>
              {item.featured ? (
                <Badge variant="outlineInk">推荐阅读</Badge>
              ) : null}
            </div>
            <CardTitle className="font-heading text-2xl font-black leading-tight">
              {item.title}
            </CardTitle>
            <CardDescription className="theme-text-soft line-clamp-3 text-sm font-medium leading-7">
              {item.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex items-center justify-between px-6 pb-6">
            <span className="manga-halftone px-3 py-1 text-xs font-black tracking-[0.18em]">
              {item.date}
            </span>
            <ArrowRight className="size-5" />
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}

/**
 * 渲染更新区卡片列表。
 */
function renderUpdateCards(items: UpdateArticle[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const item of items) {
    elements.push(<UpdateCard key={item.title} item={item} />);
  }

  return elements;
}

/**
 * 渲染首页更新区。
 */
export function UpdatesSection({ updates }: UpdatesSectionProps): ReactElement {
  return (
    <section className="space-y-8">
      <div
        data-route-enter
        className="theme-border-strong flex flex-col gap-4 border-b-8 pb-3 md:flex-row md:items-end md:justify-between"
      >
        <h2 className="manga-section-title italic">{updates.title}</h2>
        <Link
          to={updates.viewAllLink.to}
          className="theme-text-soft text-sm font-black tracking-[0.18em] transition-[transform,color] hover:translate-x-1 hover:text-[var(--copy-strong)]"
        >
          {updates.viewAllLink.label}
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {renderUpdateCards(updates.items)}
      </div>
    </section>
  );
}
