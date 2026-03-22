"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const callouts = [
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
];

export default function HardwareShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx =
      v < 0.2 ? 0 : v < 0.42 ? 1 : v < 0.64 ? 2 : v < 0.86 ? 3 : 3;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  // Slightly delay initial state after mount to avoid flicker in dev.
  useEffect(() => {
    setActiveIndex(0);
  }, []);

  return (
    <section id="hardware" className="relative bg-obsidian">
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-20 h-[calc(100vh-5rem)] flex items-center">
          <div className="mx-auto max-w-6xl px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative pl-8">
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-gold/15" />

                <div className="flex flex-col gap-8">
                  {callouts.map((c, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={c.heading}
                        className={`relative pl-6 transition-opacity ${
                          isActive ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        <div
                          className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gold shadow-[0_0_0_6px_rgba(201,169,110,0.08)]"
                          aria-hidden="true"
                        />
                        <div className="font-display text-2xl text-ivory font-light">
                          {c.heading}
                        </div>
                        <div className="mt-2 font-body text-ivory-muted text-sm leading-relaxed max-w-sm">
                          {c.body}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                className="relative w-full flex justify-center lg:justify-end"
                style={{ y }}
              >
                <div className="w-full max-w-md aspect-[4/5] rounded-3xl border border-gold/10 bg-obsidian-light/40 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,110,0.18),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(122,92,60,0.2),transparent_55%)]" />
                  <div className="relative h-full p-10 flex flex-col justify-end">
                    <div className="font-body text-xs text-gold tracking-[0.3em] uppercase">
                      HARDWARE SHOWCASE
                    </div>
                    <div className="mt-3 font-display text-4xl text-ivory font-light italic">
                      AromaIQ Diffuser
                    </div>
                    <div className="mt-4 font-body text-ivory-muted text-sm leading-relaxed">
                      Placeholder product visual — replace with real hero media.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

