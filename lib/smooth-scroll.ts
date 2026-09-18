"use client";

import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null): void {
  lenisInstance = lenis;
}

export function scrollToSection(id: string): void {
  if (typeof document === "undefined") return;

  const target = document.getElementById(id);
  if (!target) return;

  const offset = 88;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -offset, duration: 1.2 });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}