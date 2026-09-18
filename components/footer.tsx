import ScrollLink from "@/components/scroll-link";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-black bg-cream px-6 py-10 text-black md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="text-lg font-black uppercase tracking-tight">
          Domingo — Sunday Dessert Studio
        </p>
        <ScrollLink
          id="hero"
          className="inline-block rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Back to top
        </ScrollLink>
      </div>
    </footer>
  );
}