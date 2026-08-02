import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Menu", href: "/#menu" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-transparent">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-2 py-0">
        <Link href="/" className="order-first shrink-0 -mt-10">
          <Image
            src="/domingo.svg"
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
              <Link
                href={item.href}
                className="inline-block rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}