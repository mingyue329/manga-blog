import type { CSSProperties, ReactElement } from "react";

interface BannerCrossfadeMarqueeProps {
  src: string;
  alt: string;
  imagePosition?: string;
  mediaRef?: React.Ref<HTMLImageElement>;
  positionClassName?: string;
}

export function BannerCrossfadeMarquee({
  src,
  alt,
  imagePosition,
  mediaRef,
  positionClassName = "absolute",
}: BannerCrossfadeMarqueeProps): ReactElement {
  const bannerStyle = {
    ["--banner-object-position" as string]: imagePosition ?? "center center",
  } as CSSProperties;

  return (
    <div
      className={`banner-parallax-media pointer-events-none inset-0 overflow-hidden ${positionClassName}`}
      style={bannerStyle}
    >
      <img
        ref={mediaRef}
        className="banner-parallax-image"
        src={src}
        alt={alt}
      />
    </div>
  );
}
