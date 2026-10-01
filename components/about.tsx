import Image from "next/image";

import ScrollLink from "@/components/scroll-link";
import { asset } from "@/lib/base-path";

const STATS = [
  { value: "01", label: "Dessert per Sunday" },
  { value: "05", label: "Pieces in existence" },
  { value: "When it's gone", label: "It's gone" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-brand font-body text-white">
      <div className="px-6 py-24 md:px-12 md:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
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

          <Image
            src={asset("/shaman.png")}
            alt="Shaman Suryavamshi, the Sunday dessert studio"
            width={1111}
            height={1416}
            sizes="(max-width: 1023px) 92vw, 36vw"
            className="mx-auto h-auto w-full max-w-md lg:mx-0 lg:ml-auto"
          />
        </div>
      </div>

      <div className="bg-cream px-6 py-16 text-black md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_0_#000]"
              >
                <p className="text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] opacity-70 md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="mb-4 inline-block rounded-lg border-[3px] border-black bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]">
                The Sunday concept
              </p>
              <h3 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight">
                One dessert.
                <br />
                Five pieces.
                <br />
                A weekly wait.
              </h3>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-semibold leading-relaxed md:text-lg">
                Every Sunday releases a new dessert and retires it the same
                day. Five pieces are made. The recipe never returns. The wait
                is the point — six days of anticipation for one craving that
                only Sunday can answer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}