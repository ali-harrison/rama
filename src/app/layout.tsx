import type { Metadata } from "next";
import { Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAMA — garments made visible",
  description:
    "Raw construction. Exposed seams. Natural fabrics that age with wear. Light that reveals imperfection, not perfection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
