import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const bodyGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DOMINGO — Sunday Dessert Studio",
    template: "%s",
  },
  description:
    "DOMINGO is a Sunday dessert studio. One handcrafted dessert every Sunday, made in a batch of five pieces. When it's gone, it's gone.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={bodyGrotesk.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}