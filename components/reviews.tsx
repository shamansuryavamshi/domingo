import { reviews } from "@/lib/reviews";

export default function Reviews() {
  const featured = reviews.find((review) => review.featured);
  const rest = reviews.filter((review) => review.id !== featured?.id);

  return (
    <section
      id="reviews"
      className="scroll-mt-20 border-t-[3px] border-black bg-[#F8F4E8] font-body text-[#111111]"
    >
      <div className="px-6 py-24 md:px-12 md:py-32">
        <div className="mb-8 flex">
          <div className="inline-flex items-center gap-2.5 rounded-lg border-[3px] border-black bg-white px-3.5 py-1.5 shadow-[4px_4px_0_0_#000]">
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
              <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9Z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-black md:text-sm">
              Word of mouth
            </span>
          </div>
        </div>

        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight">
          Reviews
        </h2>

        <p className="mt-8 max-w-2xl text-base font-semibold leading-relaxed md:text-lg">
          Five pieces exist. So the reviews stay few, and they stay true.
          Collected from the people who got to Sunday first.
        </p>
      </div>

      <div className="px-6 pb-24 md:px-12 md:pb-32">
        {featured && (
          <article className="mx-auto max-w-7xl rounded-lg border-[3px] border-black bg-white p-8 text-black shadow-[4px_4px_0_0_#000] md:p-14">
            <p className="font-black leading-none text-brand" aria-hidden="true">
              &ldquo;
            </p>
            <blockquote className="mt-2 text-[clamp(1.5rem,4vw,2.75rem)] font-black leading-tight tracking-tight">
              {featured.text}
            </blockquote>
            <footer className="mt-8">
              <p className="text-sm font-black uppercase tracking-[0.18em]">
                {featured.name}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
                {featured.product} · {featured.date}
              </p>
            </footer>
          </article>
        )}

        {rest.length > 0 && (
          <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {rest.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border-[3px] border-black bg-white p-6 text-black shadow-[4px_4px_0_0_#000]"
              >
                <p className="font-black leading-none text-brand" aria-hidden="true">
                  &ldquo;
                </p>
                <blockquote className="mt-2 text-base font-bold leading-relaxed md:text-lg">
                  {review.text}
                </blockquote>
                <footer className="mt-6 border-t-2 border-black pt-4">
                  <p className="text-sm font-black uppercase tracking-wide">
                    {review.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
                    {review.product} · {review.date}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}