"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "domingo-tablet-tune-v1";

const DEFAULT_TUNE = {
  artScale: 100,
  artX: 0,
  artY: 0,
  starScale: 100,
  starX: 0,
  starY: 0,
  dessertScale: 100,
  dessertX: 0,
  dessertY: 0,
  titleScale: 100,
  descScale: 100,
  copyX: 0,
};

type Tune = typeof DEFAULT_TUNE;
type TuneKey = keyof Tune;

const VARIABLES: Record<TuneKey, { name: string; unit: string; factor: number }> = {
  artScale: { name: "--tune-art-scale", unit: "", factor: 100 },
  artX: { name: "--tune-art-x", unit: "%", factor: 1 },
  artY: { name: "--tune-art-y", unit: "%", factor: 1 },
  starScale: { name: "--tune-star-scale", unit: "", factor: 100 },
  starX: { name: "--tune-star-x", unit: "%", factor: 1 },
  starY: { name: "--tune-star-y", unit: "%", factor: 1 },
  dessertScale: { name: "--tune-dessert-scale", unit: "", factor: 100 },
  dessertX: { name: "--tune-dessert-x", unit: "%", factor: 1 },
  dessertY: { name: "--tune-dessert-y", unit: "%", factor: 1 },
  titleScale: { name: "--tune-title-scale", unit: "", factor: 100 },
  descScale: { name: "--tune-desc-scale", unit: "", factor: 100 },
  copyX: { name: "--tune-copy-x", unit: "px", factor: 1 },
};

const TABLES = {
  art: [
    { key: "artScale", label: "Group size", min: 50, max: 150 },
    { key: "artX", label: "Group X", min: -20, max: 20 },
    { key: "artY", label: "Group Y", min: -20, max: 20 },
  ],
  star: [
    { key: "starScale", label: "Star size", min: 50, max: 150 },
    { key: "starX", label: "Star X", min: -20, max: 20 },
    { key: "starY", label: "Star Y", min: -20, max: 20 },
  ],
  dessert: [
    { key: "dessertScale", label: "Creme size", min: 50, max: 150 },
    { key: "dessertX", label: "Creme X", min: -20, max: 20 },
    { key: "dessertY", label: "Creme Y", min: -20, max: 20 },
  ],
  copy: [
    { key: "titleScale", label: "Title size", min: 50, max: 150 },
    { key: "descScale", label: "Text size", min: 50, max: 150 },
    { key: "copyX", label: "Copy X", min: -100, max: 200 },
  ],
} as const;

type TabKey = keyof typeof TABLES;

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
    <label className="hero-tune-row">
      <span className="hero-tune-label">
        {label}
        <span>{value}</span>
      </span>
      <input
        className="hero-tune-range"
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

export default function TabletTune() {
  const [tune, setTune] = useState<Tune>(DEFAULT_TUNE);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<TabKey>("art");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setTune({ ...DEFAULT_TUNE, ...JSON.parse(saved) });
    } catch {
      // ignore malformed or unavailable storage
    }

    const params = new URLSearchParams(window.location.search);
    setEnabled(process.env.NODE_ENV === "development" || params.has("tune"));

    const query = window.matchMedia(
      "(min-width: 768px) and (max-width: 1365px) and (orientation: landscape)",
    );
    const update = () => setVisible(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    for (const key of Object.keys(VARIABLES) as TuneKey[]) {
      const { name, unit, factor } = VARIABLES[key];
      hero.style.setProperty(name, `${tune[key] / factor}${unit}`);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tune));
    } catch {
      // ignore unavailable storage
    }
  }, [tune]);

  function update(key: TuneKey, value: number) {
    setTune((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setTune(DEFAULT_TUNE);
    setCopied(false);
  }

  function cssText() {
    const lines = (Object.keys(VARIABLES) as TuneKey[]).map((key) => {
      const { name, unit, factor } = VARIABLES[key];
      return `    ${name}: ${tune[key] / factor}${unit};`;
    });
    return `@media screen and (min-width: 768px) and (max-width: 1365px) and (orientation: landscape) and (min-height: 600px) {\n  #hero {\n${lines.join("\n")}\n  }\n}`;
  }

  async function copyValues() {
    const css = cssText();
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy these values:", css);
    }
  }

  if (!enabled || !visible) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        className="hero-tune-fab"
        onClick={() => setCollapsed(false)}
      >
        Tune
      </button>
    );
  }

  return (
    <div className="hero-tune" role="region" aria-label="Tablet landscape tuning">
      <div className="hero-tune-head">
        <span className="hero-tune-title">Tune tablet</span>
        <button type="button" className="hero-tune-button" onClick={reset}>
          Reset
        </button>
        <button type="button" className="hero-tune-button" onClick={copyValues}>
          {copied ? "Copied" : "Copy CSS"}
        </button>
        <button
          type="button"
          className="hero-tune-close"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse tuning panel"
        >
          &times;
        </button>
      </div>

      <div className="hero-tune-tabs">
        {(Object.keys(TABLES) as TabKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`hero-tune-tab${tab === key ? " is-active" : ""}`}
            onClick={() => setTab(key)}
          >
            {key === "dessert" ? "Creme" : key}
          </button>
        ))}
      </div>

      {TABLES[tab].map((row) => (
        <Slider
          key={row.key}
          label={row.label}
          value={tune[row.key]}
          min={row.min}
          max={row.max}
          onChange={(value) => update(row.key, value)}
        />
      ))}
    </div>
  );
}
