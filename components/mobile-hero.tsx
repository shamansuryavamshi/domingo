import ScrollLink from "@/components/scroll-link";
import { asset } from "@/lib/base-path";

const NAMEPLATE_PATH =
  "M 26 22 C 44 8 74 12 96 20 C 116 8 146 10 168 20 C 194 8 226 10 250 20 C 278 8 312 16 326 34 C 338 50 330 66 336 84 C 342 106 326 124 304 130 C 278 138 250 128 226 132 C 198 138 170 128 146 132 C 116 138 88 130 64 124 C 38 118 18 104 14 82 C 10 62 12 38 26 22 Z";

const ZIGZAG_PATH =
  "M 28 62 L 70 26 L 106 60 L 150 20 L 188 58 L 228 22 L 264 58 L 308 24 L 344 66 L 326 112 L 350 160 L 324 208 L 348 258 L 322 306 L 344 356 L 312 402 L 264 380 L 222 416 L 174 386 L 128 418 L 84 386 L 40 414 L 16 370 L 36 318 L 12 268 L 34 218 L 10 168 L 32 118 Z";

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 450;
const IMAGE_X = (360 - IMAGE_WIDTH) / 2;
const IMAGE_Y = (440 - IMAGE_HEIGHT) / 2;

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
            viewBox="0 0 340 150"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d={NAMEPLATE_PATH} fill="#116f59" transform="translate(5 7)" />
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

        <div className="mobile-hero__visual">
          <svg viewBox="0 0 360 440" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="mobile-hero-zigzag">
                <path d={ZIGZAG_PATH} />
              </clipPath>
            </defs>
            <path
              d={ZIGZAG_PATH}
              fill="none"
              stroke="#ffa3a3"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              transform="translate(7 9)"
            />
            <g clipPath="url(#mobile-hero-zigzag)">
              <rect width="360" height="440" fill="#fff8e7" />
              <image
                href={imageSrc}
                x={IMAGE_X}
                y={IMAGE_Y}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                preserveAspectRatio="none"
              />
            </g>
            <path
              d={ZIGZAG_PATH}
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
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
