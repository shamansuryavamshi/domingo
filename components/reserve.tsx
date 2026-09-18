import ReservationForm from "@/components/reservation-form";

export default function Reserve() {
  return (
    <section id="reserve" className="scroll-mt-20 bg-brand font-body text-white">
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-black md:text-sm">
              Five pieces · Released every Sunday
            </span>
          </div>
        </div>

        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight">
          Reserve
          <br />
          <span className="block text-[1.2em]">this Sunday</span>
        </h2>

        <p className="mt-8 max-w-2xl text-base font-semibold leading-relaxed md:text-lg">
          Reservations are for this week&apos;s dessert only — it changes every
          Sunday. Five pieces exist. When the count reaches zero, the form
          closes until next week.
        </p>

        <div className="mx-auto mt-14 max-w-7xl">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}