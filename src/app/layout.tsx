import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aditya Agrawal — Quantitative Investor & Builder",
  description:
    "Aspiring quantitative investor, researcher, entrepreneur, and mathematician. Building at the intersection of finance, mathematics, and technology.",
  keywords: [
    "quantitative finance",
    "Aditya Agrawal",
    "statistical arbitrage",
    "entrepreneur",
    "mathematics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
