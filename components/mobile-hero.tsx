import ScrollLink from "@/components/scroll-link";
import { asset } from "@/lib/base-path";

const NAMEPLATE_PATH =
  "M 200 14 C 246 12 292 16 330 30 C 360 41 382 56 388 76 C 394 96 382 114 356 126 C 330 138 296 142 258 144 C 220 146 184 146 148 142 C 112 138 78 132 54 118 C 30 104 18 86 24 66 C 30 46 48 32 76 24 C 110 14 154 16 200 14 Z";

interface MobileHeroProps {
  name: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
}

export default function MobileHero({
  name,
  image,
  ctaLabel,
  ctaTarget,
}: MobileHeroProps) {
  const imageSrc = image || asset("/creme.svg");

  return (
    <div className="mobile-hero">
      <div className="mobile-hero__inner">
        <div className="mobile-hero__nameplate">
          <svg
            className="mobile-hero__nameplate-frame"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d={NAMEPLATE_PATH} fill="#116f59" transform="translate(6 8)" />
            <path
              d={NAMEPLATE_PATH}
              fill="#fff8e7"
              stroke="#111111"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <h2 className="mobile-hero__nameplate-text">{name}</h2>
        </div>

        <div className="mobile-hero__stage">
          <img
            src={asset("/star.svg")}
            alt=""
            aria-hidden="true"
            className="mobile-hero__star"
          />
          <div className="mobile-hero__dessert-position">
            <img
              src={imageSrc}
              alt=""
              className="mobile-hero__dessert"
              decoding="async"
            />
          </div>
        </div>

        <div className="mobile-hero__cta-row">
          <ScrollLink id={ctaTarget} className="mobile-hero__cta">
            {ctaLabel}
            <span className="mobile-hero__cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </ScrollLink>
        </div>
      </div>
    </div>
  );
}
