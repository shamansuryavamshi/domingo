"use client";

import { useEffect, useState } from "react";
import ScrollLink from "@/components/scroll-link";
import { asset } from "@/lib/base-path";

const NAMEPLATE_PATH =
  "M 200 14 C 246 12 292 16 330 30 C 360 41 382 56 388 76 C 394 96 382 114 356 126 C 330 138 296 142 258 144 C 220 146 184 146 148 142 C 112 138 78 132 54 118 C 30 104 18 86 24 66 C 30 46 48 32 76 24 C 110 14 154 16 200 14 Z";

const DEFAULT_TUNE = {
  starSize: 100,
  starX: 50,
  starY: 50,
  dessertSize: 78,
  dessertX: 50,
  dessertY: 50,
};

type Tune = typeof DEFAULT_TUNE;
type TuneKey = keyof Tune;

interface MobileHeroProps {
  name: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mobile-hero__tune-row">
      <span className="mobile-hero__tune-label">
        {label}
        <span>{value}%</span>
      </span>
      <input
        className="mobile-hero__tune-range"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function MobileHero({
  name,
  image,
  ctaLabel,
  ctaTarget,
}: MobileHeroProps) {
  const imageSrc = image || asset("/creme.svg");
  const isFallbackDessert = !image;
  const [tune, setTune] = useState<Tune>(DEFAULT_TUNE);
  const [tuneOpen, setTuneOpen] = useState(false);
  const [tuneCollapsed, setTuneCollapsed] = useState(false);
  const [tuneTab, setTuneTab] = useState<"star" | "dessert">("star");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("domingo-mobile-tune-v4");
      if (saved) {
        setTune({ ...DEFAULT_TUNE, ...JSON.parse(saved) });
      }
    } catch {
      // ignore malformed or unavailable storage
    }

    const params = new URLSearchParams(window.location.search);
    const enabled =
      process.env.NODE_ENV === "development" || params.has("tune");
    if (enabled) setTuneOpen(true);
  }, []);

  useEffect(() => {
    if (!tuneOpen) return;
    try {
      window.localStorage.setItem("domingo-mobile-tune-v4", JSON.stringify(tune));
    } catch {
      // ignore unavailable storage
    }
  }, [tune, tuneOpen]);

  function update(key: TuneKey, value: number) {
    setTune((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setTune(DEFAULT_TUNE);
    setCopied(false);
  }

  async function copyValues() {
    const css = `.mobile-hero__star {
  width: ${tune.starSize}%;
  left: ${tune.starX}%;
  top: ${tune.starY}%;
}

.mobile-hero__dessert-position {
  width: ${tune.dessertSize}%;
  left: ${tune.dessertX}%;
  top: ${tune.dessertY}%;
}`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy these values:", css);
    }
  }

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
            style={{
              width: `${tune.starSize}%`,
              left: `${tune.starX}%`,
              top: `${tune.starY}%`,
            }}
          />
          <div
            className={`mobile-hero__dessert-position${isFallbackDessert ? " is-fallback" : ""}`}
            style={{
              width: `${tune.dessertSize}%`,
              left: `${tune.dessertX}%`,
              top: `${tune.dessertY}%`,
            }}
          >
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

      {tuneOpen && tuneCollapsed && (
        <button
          type="button"
          className="mobile-hero__tune-fab"
          onClick={() => setTuneCollapsed(false)}
        >
          Tune
        </button>
      )}

      {tuneOpen && !tuneCollapsed && (
        <div
          className="mobile-hero__tune"
          role="region"
          aria-label="Mobile hero tuning"
        >
          <div className="mobile-hero__tune-head">
            <span className="mobile-hero__tune-title">Tune hero</span>
            <button
              type="button"
              className="mobile-hero__tune-button"
              onClick={reset}
            >
              Reset
            </button>
            <button
              type="button"
              className="mobile-hero__tune-button"
              onClick={copyValues}
            >
              {copied ? "Copied" : "Copy CSS"}
            </button>
            <button
              type="button"
              className="mobile-hero__tune-close"
              onClick={() => setTuneCollapsed(true)}
              aria-label="Collapse tuning panel"
            >
              &times;
            </button>
          </div>

          <div className="mobile-hero__tune-tabs">
            <button
              type="button"
              className={`mobile-hero__tune-tab${tuneTab === "star" ? " is-active" : ""}`}
              onClick={() => setTuneTab("star")}
            >
              Star
            </button>
            <button
              type="button"
              className={`mobile-hero__tune-tab${tuneTab === "dessert" ? " is-active" : ""}`}
              onClick={() => setTuneTab("dessert")}
            >
              Creme
            </button>
          </div>

          {tuneTab === "star" ? (
            <>
              <Slider
                label="Size"
                value={tune.starSize}
                min={80}
                max={600}
                onChange={(value) => update("starSize", value)}
              />
              <Slider
                label="Position X"
                value={tune.starX}
                min={-50}
                max={150}
                onChange={(value) => update("starX", value)}
              />
              <Slider
                label="Position Y"
                value={tune.starY}
                min={-50}
                max={150}
                onChange={(value) => update("starY", value)}
              />
            </>
          ) : (
            <>
              <Slider
                label="Size"
                value={tune.dessertSize}
                min={80}
                max={500}
                onChange={(value) => update("dessertSize", value)}
              />
              <Slider
                label="Position X"
                value={tune.dessertX}
                min={-50}
                max={150}
                onChange={(value) => update("dessertX", value)}
              />
              <Slider
                label="Position Y"
                value={tune.dessertY}
                min={-50}
                max={150}
                onChange={(value) => update("dessertY", value)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
