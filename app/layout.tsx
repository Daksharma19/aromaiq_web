import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  // Keep headings light-weight for the dark-luxury feel.
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AromaIQ — AI Mood Diffuser",
  description:
    "A dark-luxury smart aroma diffuser that reads your mood and activates the right essential oil blend automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontDisplay.variable} ${fontBody.variable} bg-obsidian text-ivory font-body antialiased`}
      >
        <Navbar />
        <div className="pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
