"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/base-path";
import ScrollLink from "@/components/scroll-link";

const NAV_ITEMS = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Reviews", id: "reviews" },
  { label: "Reserve", id: "reserve" },
];

const DESKTOP_LINK_BASE =
  "inline-block rounded-md border-2 border-[#111111] bg-[#F8F4E8] px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-[#111111] shadow-[4px_4px_0_0_#111111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const MOBILE_LINK_BASE =
  "block rounded-md border-2 border-[#111111] bg-[#F8F4E8] px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-[#111111] shadow-[4px_4px_0_0_#111111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-transparent">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-2 py-0">
        <ScrollLink
          id="hero"
          aria-label="Domingo — back to top"
          className="order-first shrink-0 -mt-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Image
            src={asset("/domingo.svg")}
            alt=""
            width={150}
            height={56}
            className="h-50 w-auto"
            priority
          />
        </ScrollLink>

        <ul className="hidden items-center gap-3 self-start mt-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <ScrollLink
                id={item.id}
                aria-current={active === item.id ? "true" : undefined}
                className={DESKTOP_LINK_BASE}
              >
                {item.label}
              </ScrollLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mt-10 inline-flex items-center justify-center rounded-md border-2 border-[#111111] bg-[#F8F4E8] p-2.5 text-[#111111] shadow-[4px_4px_0_0_#111111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
        >
          {open ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="mx-auto w-full max-w-7xl px-2 md:hidden">
          <ul
            id="mobile-nav-menu"
            className="mt-2 space-y-2 rounded-lg border-2 border-[#111111] bg-[#F8F4E8] p-3 shadow-[4px_4px_0_0_#111111]"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <ScrollLink
                  id={item.id}
                  onClick={() => setOpen(false)}
                  className={MOBILE_LINK_BASE}
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}