import Image from "next/image";
import { asset } from "@/lib/base-path";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-brand">
      <Image
        src={asset("/star.svg")}
        alt=""
        fill
        className="pointer-events-none object-cover"
        style={{ transform: "translate(33%, 12%) scale(2.35)" }}
        sizes="100vw"
        priority
      />

      <div className="absolute inset-0 animate-float">
        <Image
          src={asset("/creme.svg")}
          alt=""
          fill
          className="pointer-events-none object-cover"
          style={{ transform: "translate(27%, 7%) scale(1)" }}
          sizes="100vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 -mt-28 flex flex-col justify-center font-body">
        <div
          className="mb-8 flex translate-x-[1%] translate-y-[200%] px-6 md:mb-10 md:px-12"
        >
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
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-black md:text-sm">
              This week&apos;s special
            </span>
          </div>
        </div>

        <div className="-mt-8 translate-y-[25%]">
          <h2 className="px-6 text-left text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.9] tracking-tight text-white md:px-12 md:text-[10rem]">
            <span>Creme</span>
            <br />
            <span className="block text-[1.35em]">Brulee</span>
          </h2>
        </div>

        <div className="mt-8 translate-y-[100%]">
          <p className="max-w-3xl px-6 text-base font-semibold leading-relaxed text-white md:px-12 md:text-lg">
            One handcrafted dessert every Sunday. Limited pieces.
            <br />
            When it&apos;s gone, it&apos;s gone.
          </p>
        </div>
      </div>
    </section>
  );
}