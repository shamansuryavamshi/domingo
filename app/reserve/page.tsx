import type { Metadata } from "next";
import ReservationForm from "@/components/reservation-form";

export const metadata: Metadata = {
  title: "Reserve — DOMINGO Sunday Dessert Studio",
  description:
    "Reserve this Sunday's dessert. Only five handcrafted pieces are made each week — reservations are limited to five total.",
};

export default function ReservePage() {
  return (
    <main className="bg-brand font-body text-white">
      <section className="relative px-6 pb-24 pt-40 md:px-12 md:pt-52">
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-black md:text-sm">
              Five pieces · Released every Sunday
            </span>
          </div>
        </div>

        <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] font-black uppercase leading-[0.9] tracking-tight">
          Reserve
          <br />
          <span className="block text-[1.2em]">this Sunday</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base font-semibold leading-relaxed md:text-lg">
          Reservations are for this week&apos;s dessert only — it changes every
          Sunday. Five pieces exist. When the count reaches zero, the form
          closes until next week.
        </p>

        <div className="mx-auto mt-14 max-w-7xl">
          <ReservationForm />
        </div>
      </section>
    </main>
  );
}