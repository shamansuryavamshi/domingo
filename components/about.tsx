"use client";

import { useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/base-path";

const PILLARS = [
  {
    title: "Small-batch",
    text: "Five pieces. No more, no restocks. The whole batch fits in one hand.",
  },
  {
    title: "Handcrafted",
    text: "Every dessert is made by hand, start to finish. No assembly lines, no shortcuts.",
  },
  {
    title: "Quality over quantity",
    text: "One honest dessert done properly beats a dozen that no one remembers.",
  },
];

const DEFAULT_IMAGE_X = 0;
const DEFAULT_IMAGE_Y = 0;
const DEFAULT_IMAGE_SCALE = 1;

const X_RANGE = { min: -100, max: 100, step: 1 } as const;
const Y_RANGE = { min: -100, max: 100, step: 1 } as const;
const SCALE_RANGE = { min: 0.5, max: 2, step: 0.01 } as const;

const TRANSLATE_PERCENT_PER_UNIT = 0.5;

const SHAMAN_IMAGE = {
  src: asset("/shaman.png"),
  alt: "Shaman Suryavamshi, the Sunday dessert studio",
} as const;

export default function About() {
  const [imageX, setImageX] = useState(DEFAULT_IMAGE_X);
  const [imageY, setImageY] = useState(DEFAULT_IMAGE_Y);
  const [imageScale, setImageScale] = useState(DEFAULT_IMAGE_SCALE);

  const handleReset = () => {
    setImageX(DEFAULT_IMAGE_X);
    setImageY(DEFAULT_IMAGE_Y);
    setImageScale(DEFAULT_IMAGE_SCALE);
  };

  const imageTransform = `translate(${imageX * TRANSLATE_PERCENT_PER_UNIT}%, ${
    imageY * TRANSLATE_PERCENT_PER_UNIT
  }%) scale(${imageScale})`;

  return (
    <section id="about" className="scroll-mt-20 bg-brand font-body text-white">
      <div className="px-6 py-24 md:px-12 md:py-32">
        <div className="mb-8 flex">
          <div className="inline-flex items-center gap-2.5 rounded-lg border-[3px] border-black bg-cream px-3.5 py-1.5 shadow-[4px_4px_0_0_#000]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v20M2 12h20M12 2a10 10 0 0 1 10 10M12 2A10 10 0 0 0 2 12M5 12a7 7 0 0 1 14 0" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-black md:text-sm">
              A Sunday dessert studio — Bangalore
            </span>
          </div>
        </div>

        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight">
          About
          <br />
          <span className="block text-[1.3em]">Domingo</span>
        </h2>

        <p className="mt-10 max-w-3xl text-base font-semibold leading-relaxed md:text-lg">
          Domingo is a dessert studio built around a single decision: make one
          dessert at a time, and only on Sundays. &ldquo;Domingo&rdquo; is
          Spanish for Sunday. The studio exists because most desserts are made
          for everyone, everywhere, all the time. We make one for very few
          people, once a week.
        </p>
      </div>

      <div className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-lg border-[3px] border-black bg-cream px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[4px_4px_0_0_#000]">
            The philosophy
          </p>
          <h3 className="mb-12 text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight">
            Fewer, better,
            <br />
            <span className="text-cream/90">by hand</span>
          </h3>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border-[3px] border-black bg-cream shadow-neubrutal md:max-w-lg">
            <div className="absolute inset-0" style={{ transform: imageTransform }}>
              <Image
                src={SHAMAN_IMAGE.src}
                alt={SHAMAN_IMAGE.alt}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-6 w-full rounded-lg border-[3px] border-black bg-[#F8F4E8] p-5 text-[#111111] shadow-neubrutal md:max-w-lg">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em]">
              Image position
            </p>

            <div className="mb-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <label
                  htmlFor="shaman-image-x"
                  className="text-xs font-black uppercase tracking-[0.18em]"
                >
                  X Position
                </label>
                <output
                  htmlFor="shaman-image-x"
                  className="text-xs font-bold tabular-nums"
                >
                  {imageX}
                </output>
              </div>
              <input
                id="shaman-image-x"
                type="range"
                min={X_RANGE.min}
                max={X_RANGE.max}
                step={X_RANGE.step}
                value={imageX}
                onChange={(event) => setImageX(Number(event.target.value))}
                className="w-full min-w-0 accent-brand"
              />
            </div>

            <div className="mb-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <label
                  htmlFor="shaman-image-y"
                  className="text-xs font-black uppercase tracking-[0.18em]"
                >
                  Y Position
                </label>
                <output
                  htmlFor="shaman-image-y"
                  className="text-xs font-bold tabular-nums"
                >
                  {imageY}
                </output>
              </div>
              <input
                id="shaman-image-y"
                type="range"
                min={Y_RANGE.min}
                max={Y_RANGE.max}
                step={Y_RANGE.step}
                value={imageY}
                onChange={(event) => setImageY(Number(event.target.value))}
                className="w-full min-w-0 accent-brand"
              />
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <label
                  htmlFor="shaman-image-scale"
                  className="text-xs font-black uppercase tracking-[0.18em]"
                >
                  Scale
                </label>
                <output
                  htmlFor="shaman-image-scale"
                  className="text-xs font-bold tabular-nums"
                >
                  {imageScale.toFixed(2)}
                </output>
              </div>
              <input
                id="shaman-image-scale"
                type="range"
                min={SCALE_RANGE.min}
                max={SCALE_RANGE.max}
                step={SCALE_RANGE.step}
                value={imageScale}
                onChange={(event) => setImageScale(Number(event.target.value))}
                className="w-full min-w-0 accent-brand"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-block rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Reset
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.title}
                className="flex flex-col rounded-lg border-[3px] border-black bg-white p-6 text-black shadow-[4px_4px_0_0_#000]"
              >
                <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-4 text-2xl font-black uppercase tracking-tight">
                  {pillar.title}
                </h4>
                <p className="mt-3 text-sm font-semibold leading-relaxed md:text-base">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-3xl text-base font-semibold leading-relaxed md:text-lg">
            The studio is based in Bangalore. The kitchen may move — the Sunday
            ritual stays. What never changes is the count: one dessert, five
            pieces, one day a week.
          </p>
        </div>
      </div>
    </section>
  );
}
