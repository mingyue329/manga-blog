import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { useGsapHoverLift } from "@/shared/lib/use-gsap-hover-preview-card";
import { getSiteIcon } from "@/shared/lib/site-icons";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import type {
  HeroAction,
  HeroSectionData,
  SiteQuickAction,
  StatusItem,
  StatusPanelData,
} from "@/shared/types/content";

interface HeroAndStatusSectionProps {
  hero: HeroSectionData;
  statusPanel: StatusPanelData;
}

function isVideoAvatarSource(source: string): boolean {
  return source.toLowerCase().endsWith(".mp4");
}

function renderHeroAvatarMedia(hero: HeroSectionData): ReactElement {
  if (isVideoAvatarSource(hero.avatar.src)) {
    return (
      <video
        src={hero.avatar.src}
        aria-label={hero.avatar.alt}
        className="size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={hero.avatar.src}
      alt={hero.avatar.alt}
      className="size-full object-cover"
      loading="eager"
    />
  );
}

function renderHeroActions(actions: HeroAction[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const action of actions) {
    elements.push(
      <Button
        key={action.to}
        asChild
        variant={action.variant}
        size="lg"
        className="min-w-36"
      >
        <Link to={action.to}>{action.label}</Link>
      </Button>,
    );
  }

  return elements;
}

function renderProfileLinks(links: SiteQuickAction[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const link of links) {
    const Icon = getSiteIcon(link.icon);

    elements.push(
      <Button
        key={`${link.label}-${link.to}`}
        asChild
        variant="iconInk"
        size="icon"
        className="size-11"
      >
        {link.external ? (
          <a
            href={link.to}
            aria-label={link.ariaLabel}
            target="_blank"
            rel="noreferrer"
          >
            <Icon className="size-5" />
          </a>
        ) : (
          <Link to={link.to} aria-label={link.ariaLabel}>
            <Icon className="size-5" />
          </Link>
        )}
      </Button>,
    );
  }

  return elements;
}

function renderStatusItems(items: StatusItem[]): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const item of items) {
    const Icon = getSiteIcon(item.icon);

    elements.push(
      <li
        key={`${item.label}-${item.value}`}
        className="flex items-center gap-4"
      >
        <div className="theme-surface-panel-muted theme-border-strong flex size-12 items-center justify-center border-2">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="manga-label theme-text-faint">{item.label}</p>
          <p className="mt-1 text-lg font-extrabold">{item.value}</p>
        </div>
      </li>,
    );
  }

  return elements;
}

function HeroMediaCluster({ hero }: { hero: HeroSectionData }): ReactElement {
  const { triggerRef, targetRef } = useGsapHoverLift(8);

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      className="relative mx-auto w-full max-w-72 flex-none lg:mx-0"
    >
      <div
        ref={targetRef}
        className="theme-surface-panel theme-border-strong relative aspect-square w-full overflow-hidden border-4"
      >
        {renderHeroAvatarMedia(hero)}
        <div className="theme-surface-panel theme-border-strong absolute left-3 top-3 z-30 border-2 px-3 py-1 font-heading text-xs font-black uppercase tracking-[0.18em]">
          {hero.greeting}
        </div>
      </div>
    </div>
  );
}

export function HeroAndStatusSection({
  hero,
  statusPanel,
}: HeroAndStatusSectionProps): ReactElement {
  const MapPinIcon = getSiteIcon("map-pin");

  return (
    <section className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
      <Card className="theme-surface-panel theme-border-strong relative overflow-visible border-4 py-0 manga-panel">
        <div className="manga-speed-lines absolute inset-0 opacity-70" />
        <CardContent className="relative z-10 flex flex-col gap-10 p-6 md:p-8 lg:flex-row lg:items-center">
          <HeroMediaCluster hero={hero} />

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="font-heading text-5xl font-black leading-none tracking-tight md:text-6xl xl:text-7xl">
                {hero.name}
              </h1>
              <p className="theme-text-soft max-w-xl text-lg font-semibold leading-8">
                {hero.signature}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="theme-border-strong theme-surface-panel-muted inline-flex items-center gap-2 border-2 px-3 py-2">
                <MapPinIcon className="size-4" />
                <span className="font-heading text-xs font-black uppercase tracking-[0.16em]">
                  {hero.location}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {renderProfileLinks(hero.profileLinks)}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">{renderHeroActions(hero.actions)}</div>
          </div>
        </CardContent>
        <span className="absolute bottom-4 right-4 text-3xl font-black">※</span>
      </Card>

      <Card className="theme-surface-panel theme-border-strong relative overflow-hidden border-4 py-0 manga-panel-reverse">
        <div className="manga-halftone theme-text-faint absolute -right-10 top-0 size-32 rotate-45" />
        <CardContent className="relative flex h-full flex-col justify-between gap-8 p-6 md:p-8">
          <div>
            <h2 className="theme-border-strong inline-block border-b-4 pb-2 font-heading text-3xl font-black tracking-tight">
              {statusPanel.title}
            </h2>
            <ul className="mt-8 space-y-6">
              {renderStatusItems(statusPanel.items)}
            </ul>
          </div>
          <div className="theme-surface-ink theme-border-strong -rotate-1 border-4 p-4">
            <p className="text-sm font-bold tracking-tight">
              {statusPanel.quote}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
