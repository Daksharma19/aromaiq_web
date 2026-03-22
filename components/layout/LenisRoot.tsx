"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth scrolling. Framer Motion scroll hooks read the same
 * document scroll position Lenis drives.
 */
export default function LenisRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
