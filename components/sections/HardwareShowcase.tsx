"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import cards from "@/data/hardware-cards.json";

type HardwareCard = {
  id: number;
  image: string;
  heading: string;
  body: string;
};

const CARDS = cards as HardwareCard[];

export default function HardwareShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Translate the row so the last card ends flush with the right edge.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section
      id="hardware"
      ref={ref}
      className="relative isolate bg-ivory transition-colors dark:bg-obsidian"
      style={{ height: `${CARDS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 w-full max-w-6xl px-4 sm:mb-10 sm:px-6">
          <div className="font-body text-xs uppercase tracking-[0.3em] text-gold">
            Hardware
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-6 px-4 sm:px-6 md:gap-8">
          {CARDS.map((c, i) => (
            <article
              key={c.id}
              className="group flex w-[80vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-gold/20 bg-cream-deep/90 transition-colors hover:border-gold/45 dark:border-gold/15 dark:bg-obsidian-light/70 sm:w-[55vw] md:w-[42vw] lg:w-[34vw]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian/5 dark:bg-obsidian/40">
                <Image
                  src={c.image}
                  alt={c.heading}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 42vw, 34vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full border border-gold/40 bg-ivory/80 font-body text-xs font-semibold text-gold backdrop-blur dark:bg-obsidian/70"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                <h3 className="font-display text-lg font-light leading-snug text-obsidian dark:text-ivory sm:text-xl md:text-2xl">
                  {c.heading}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted md:text-base">
                  {c.body}
                </p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
