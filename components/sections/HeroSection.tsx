"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import VideoBackground from "@/components/backgrounds/VideoBackground";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <VideoBackground src="/assets/hero1.mp4" className="z-0" />

      {/* Overlay layers (critical for readability). */}
      <div className="absolute inset-0 z-10 bg-ivory/65 dark:bg-obsidian/60" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-ivory/95 via-ivory/30 to-transparent dark:from-obsidian/95 dark:via-obsidian/25 dark:to-transparent" />
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      <div className="relative z-30 mx-auto max-w-6xl px-6 h-full">
        <div className="flex min-h-[100svh] items-center justify-center py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-6 font-display font-light tracking-tight text-4xl md:text-5xl lg:text-8xl leading-none text-obsidian dark:text-ivory"
            >
              <span className="block">Breathe</span>
              <span className="block relative after:absolute after:-bottom-3 after:left-0 after:w-full after:h-[1px] after:bg-gold after:opacity-80">
                Differently.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-6 font-body text-lg max-w-md mx-auto text-neutral-700 dark:text-ivory-muted"
            >
              AromaIQ reads your mood and fills the room with exactly what you
              need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              <Link
                href="/shop"
                className="bg-gold text-obsidian font-body font-medium px-8 py-4 rounded-xl hover:bg-gold-light active:scale-98 transition-all"
              >
                Shop Now
              </Link>

            {/* TODO: remove this in production if did not want  */}
            
              {/* <Link
                href="/waitlist"
                className="border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all duration-300 px-8 py-4 rounded-xl font-body font-medium active:scale-98"
              >
                Join Waitlist
              </Link> */}

              
            </motion.div>

            <div className="mt-14">
              <Link
                href="#problem"
                className="inline-flex flex-col items-center gap-2 text-sm font-body text-neutral-600 dark:text-ivory-muted"
              >
                <motion.div
                  animate={{ y: [0, 4, 0], opacity: [0.8, 1, 0.85] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown className="text-gold" size={20} />
                </motion.div>
                <span>Scroll to explore</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

