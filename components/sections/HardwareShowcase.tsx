"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

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

/** Past this scroll progress, hover (or tap) picks the expanded card; default is first. */
const INTERACTIVE_PROGRESS = 0.82;

function scrollProgressToIndex(v: number): number {
  if (v < 0.2) return 0;
  if (v < 0.38) return 1;
  if (v < 0.56) return 2;
  if (v < INTERACTIVE_PROGRESS) return 3;
  return 3;
}

export default function HardwareShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [scrollExpanded, setScrollExpanded] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tapExpanded, setTapExpanded] = useState<number | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollExpanded(scrollProgressToIndex(v));
    setInteractive(v >= INTERACTIVE_PROGRESS);
  });

  useEffect(() => {
    setScrollExpanded(0);
    setInteractive(false);
    setHovered(null);
    setTapExpanded(null);
  }, []);

  const expandedIndex = interactive
    ? hovered !== null
      ? hovered
      : tapExpanded !== null
        ? tapExpanded
        : 0
    : scrollExpanded;

  const handleCardEnter = useCallback((i: number) => {
    if (!interactive) return;
    setHovered(i);
    setTapExpanded(null);
  }, [interactive]);

  const handleCardLeave = useCallback(() => {
    setHovered(null);
  }, []);

  const handleCardClick = useCallback(
    (i: number) => {
      if (!interactive) return;
      setTapExpanded((prev) => (prev === i ? null : i));
      setHovered(null);
    },
    [interactive]
  );

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
              {/* Left: vertical stack — scroll expands 1→4, then hover/tap */}
              <div className="relative min-w-0 pl-1">
                <div
                  className="pointer-events-none absolute left-0 top-2 bottom-2 hidden w-px bg-gradient-to-b from-gold/40 via-gold/15 to-gold/40 md:block"
                  aria-hidden
                />

                <ul
                  className="relative flex flex-col"
                  onMouseLeave={handleCardLeave}
                >
                  {CARDS.map((c, i) => {
                    const open = expandedIndex === i;
                    const stackInset = open ? 0 : Math.min(i, 3) * 10;

                    return (
                      <motion.li
                        key={c.heading}
                        layout
                        transition={{
                          layout: {
                            type: "spring",
                            damping: 32,
                            stiffness: 380,
                          },
                        }}
                        className="relative list-none"
                        style={{ zIndex: open ? 30 : 10 + i }}
                      >
                        <motion.div
                          layout
                          animate={{
                            marginLeft: stackInset,
                            scale: open ? 1 : 0.985,
                          }}
                          transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 360,
                          }}
                          className={[
                            "rounded-xl border bg-cream-deep/90 dark:bg-obsidian-light/70",
                            open
                              ? "border-gold/50 shadow-[0_12px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
                              : "border-gold/15",
                            i > 0 ? "-mt-2 sm:-mt-2.5" : "",
                          ].join(" ")}
                        >
                          <motion.button
                            type="button"
                            layout
                            onMouseEnter={() => handleCardEnter(i)}
                            onClick={() => handleCardClick(i)}
                            className="w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                            aria-expanded={open}
                          >
                            <div className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
                              <span
                                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/35 font-body text-[10px] font-semibold text-gold sm:size-8 sm:text-xs"
                                aria-hidden
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0 flex-1">
                                <motion.div
                                  layout="position"
                                  className="font-display text-base font-light leading-snug text-obsidian dark:text-ivory sm:text-lg md:text-xl"
                                >
                                  {c.heading}
                                </motion.div>
                                <motion.div
                                  layout
                                  initial={false}
                                  animate={{
                                    height: open ? "auto" : 0,
                                    opacity: open ? 1 : 0,
                                  }}
                                  transition={{
                                    height: {
                                      type: "spring",
                                      damping: 34,
                                      stiffness: 320,
                                    },
                                    opacity: { duration: 0.22 },
                                  }}
                                  className="overflow-hidden"
                                >
                                  <p className="max-w-md pt-2 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted sm:pt-3 sm:text-[0.9375rem]">
                                    {c.body}
                                  </p>
                                </motion.div>
                              </div>
                            </div>
                          </motion.button>
                        </motion.div>
                      </motion.li>
                    );
                  })}
                </ul>

                <p className="mt-4 font-body text-[11px] text-neutral-500 dark:text-ivory-muted/70 sm:text-xs">
                  {interactive
                    ? "Hover a card to expand it — or tap on touch devices."
                    : "Keep scrolling — each card opens in turn."}
                </p>
              </div>

              {/* Right: synced index + product placeholder */}
              <div className="relative hidden min-h-[12rem] lg:block">
                <div className="sticky top-28">
                  <motion.div
                    key={expandedIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl border border-gold/20 bg-cream/80 p-8 dark:border-gold/15 dark:bg-obsidian-light/50 xl:p-10"
                  >
                    <div className="font-display text-7xl font-light text-gold/25 xl:text-8xl">
                      {String(expandedIndex + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-4 font-display text-2xl font-light italic leading-tight text-obsidian dark:text-ivory xl:text-3xl">
                      {CARDS[expandedIndex].heading}
                    </div>
                    <div className="mt-4 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
                      {CARDS[expandedIndex].body}
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
