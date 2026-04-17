import type { ReactElement } from "react";

import { getPublicAssetUrl } from "@/shared/lib/public-asset";
import {
  useGsapHoverLift,
  useGsapHoverPreviewCard,
} from "@/shared/lib/use-gsap-hover-preview-card";
import { Card, CardContent } from "@/shared/ui/card";
import type { AboutShowcasePanel } from "@/shared/types/content";

interface AboutShowcaseSectionProps {
  panels: AboutShowcasePanel[];
}

function StatementPanel({
  panel,
}: {
  panel: AboutShowcasePanel;
}): ReactElement {
  const { triggerRef, targetRef } = useGsapHoverLift(8);

  return (
    <div ref={triggerRef as React.RefObject<HTMLDivElement>}>
      <Card
        ref={targetRef}
        className="overflow-hidden border-4 border-black bg-black py-0"
      >
        <CardContent className="manga-halftone flex h-48 items-center justify-center p-0 text-white">
          <span className="-rotate-2 font-heading text-5xl font-black tracking-[0.9rem]">
            {panel.statement}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

function ImagePanel({ panel }: { panel: AboutShowcasePanel }): ReactElement {
  const { triggerRef, cardRef, imageRef, overlayRef } =
    useGsapHoverPreviewCard();

  return (
    <div ref={triggerRef as React.RefObject<HTMLDivElement>}>
      <Card
        ref={cardRef}
        className="manga-panel-hover overflow-hidden border-4 border-black bg-white py-0"
      >
        <CardContent className="manga-preview-media relative h-48 p-0">
          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 bg-black/20"
          />
          <img
            ref={imageRef}
            src={panel.image?.src ? getPublicAssetUrl(panel.image.src) : undefined}
            alt={panel.image?.alt ?? ""}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {panel.accentLabel ? (
            <span className="absolute bottom-3 left-4 border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase italic">
              {panel.accentLabel}
            </span>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ShowcasePanel({ panel }: { panel: AboutShowcasePanel }): ReactElement {
  if (panel.type === "statement") {
    return <StatementPanel panel={panel} />;
  }

  return <ImagePanel panel={panel} />;
}

export function AboutShowcaseSection({
  panels,
}: AboutShowcaseSectionProps): ReactElement {
  return (
    <section id="frames" className="scroll-mt-32 space-y-6">
      <h3 className="manga-section-title">漫画分镜 // FRAMES</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {panels.map((panel, index) => (
          <ShowcasePanel
            key={`${panel.type}-${panel.image?.src ?? panel.statement ?? index}`}
            panel={panel}
          />
        ))}
      </div>
    </section>
  );
}
