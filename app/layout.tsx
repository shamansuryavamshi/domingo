import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const bodyGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Domingo — Sweets Every Sunday",
  description: "Homemade sweets, sold every Sunday.",
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