"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

const CARDS = [
  {
    heading: "Four Independent Chambers",
    body: "Each module controls a separate essential oil. Mix up to 4 scents simultaneously.",
  },
  {
    heading: "ESP32 Precision Control",
    body: "MOSFET-driven misting modules with millisecond response time.",
  },
  {
    heading: "WiFi + Bluetooth Ready",
    body: "Seamless connection to the AromaIQ app. No hub required.",
  },
  {
    heading: "Whisper-Quiet Operation",
    body: "Below 30dB. You'll smell it before you hear it.",
  },
] as const;

const CARD_COUNT = CARDS.length;

function activeIndexFromProgress(p: number): number {
  const segment = 1 / CARD_COUNT;
  const i = Math.floor(p / segment);
  return Math.min(Math.max(i, 0), CARD_COUNT - 1);
}

export default function HardwareShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(activeIndexFromProgress(v));
  });

  return (
    <section
      id="hardware"
      className="relative isolate bg-ivory dark:bg-obsidian transition-colors"
    >
      <div ref={ref} className="relative h-[min(280vh,320svh)] md:h-[280vh]">
        <div className="sticky top-20 z-10 max-h-[calc(100dvh-5rem)] min-h-0 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-5 md:py-6">
            <div className="mb-6 font-body text-xs uppercase tracking-[0.3em] text-gold">
              Hardware
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16">
              <div className="relative min-w-0 pl-1">
                <div
                  className="pointer-events-none absolute left-0 top-2 bottom-2 hidden w-px bg-gradient-to-b from-gold/40 via-gold/15 to-gold/40 md:block"
                  aria-hidden
                />

                <ul className="relative flex flex-col">
                  {CARDS.map((c, i) => {
                    const open = activeIndex === i;
                    const stackInset = open ? 0 : Math.min(i, 3) * 8;

                    return (
                      <li
                        key={c.heading}
                        className={`relative list-none ${i > 0 ? "-mt-2 sm:-mt-2.5" : ""}`}
                        style={{ zIndex: open ? 30 : 10 + i }}
                      >
                        <motion.div
                          animate={{
                            marginLeft: stackInset,
                            scale: open ? 1 : 0.99,
                          }}
                          transition={{
                            duration: 0.38,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={[
                            "rounded-xl border bg-cream-deep/90 dark:bg-obsidian-light/70",
                            open
                              ? "border-gold/45 shadow-[0_10px_32px_rgba(0,0,0,0.14)] dark:border-gold/35 dark:shadow-[0_10px_32px_rgba(0,0,0,0.35)]"
                              : "border-gold/15",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
                            <span
                              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/35 font-body text-[10px] font-semibold text-gold sm:size-8 sm:text-xs"
                              aria-hidden
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-display text-base font-light leading-snug text-obsidian dark:text-ivory sm:text-lg md:text-xl">
                                {c.heading}
                              </div>
                              <motion.div
                                initial={false}
                                animate={{
                                  height: open ? "auto" : 0,
                                  opacity: open ? 1 : 0,
                                }}
                                transition={{
                                  height: {
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                  },
                                  opacity: { duration: 0.28 },
                                }}
                                className="overflow-hidden"
                              >
                                <p className="max-w-md pt-2 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted sm:pt-3 sm:text-[0.9375rem]">
                                  {c.body}
                                </p>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="relative hidden min-h-[12rem] lg:block">
                <div className="sticky top-28">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl border border-gold/20 bg-cream/80 p-8 dark:border-gold/15 dark:bg-obsidian-light/50 xl:p-10"
                  >
                    <div className="font-display text-7xl font-light text-gold/25 xl:text-8xl">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-4 font-display text-2xl font-light italic leading-tight text-obsidian dark:text-ivory xl:text-3xl">
                      {CARDS[activeIndex].heading}
                    </div>
                    <div className="mt-4 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
                      {CARDS[activeIndex].body}
                    </div>
                    <div className="mt-8 h-32 rounded-xl border border-dashed border-gold/25 bg-obsidian/5 dark:bg-obsidian/40" />
                    <p className="mt-3 font-body text-[10px] uppercase tracking-[0.2em] text-gold/50">
                      Product visual placeholder
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
