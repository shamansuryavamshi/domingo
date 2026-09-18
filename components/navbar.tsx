"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/base-path";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Reserve", href: "/reserve" },
];

const DESKTOP_LINK_CLASS =
  "inline-block rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-transparent">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-2 py-0">
        <Link href="/" className="order-first shrink-0 -mt-10">
          <Image
            src={asset("/domingo.svg")}
            alt="Domingo"
            width={150}
            height={56}
            className="h-50 w-auto"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-3 self-start mt-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className={DESKTOP_LINK_CLASS}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mt-10 inline-flex items-center justify-center rounded-md border-2 border-black bg-white p-2.5 text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
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
            className="mt-2 space-y-2 rounded-lg border-2 border-black bg-cream p-3 shadow-neubrutal"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md border-2 border-black bg-white px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}