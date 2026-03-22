"use client";

import { motion } from "framer-motion";
import ColorBends from "@/components/backgrounds/ColorBends";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

const steps = [
  {
    number: "01",
    title: "Open the app",
    body: "Set your mood, activity, or just let AromaIQ decide automatically.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          stroke="#C9A96E"
          strokeWidth="1.6"
          opacity="0.9"
        />
        <path
          d="M10 18h4"
          stroke="#C9A96E"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI selects your blend",
    body: "Our engine picks from 15 essential oils based on your mood profile and time of day.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l1.2 4.2L17.4 7l-4.2 1.2L12 12l-1.2-3.8L6.6 7l4.2-.8L12 2Z"
          stroke="#C9A96E"
          strokeWidth="1.6"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M5 14c1.5-1.5 4-1.5 5.5 0S14.5 15.5 16 14"
          stroke="#C9A96E"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Your room transforms",
    body: "The 4-chamber diffuser activates within seconds. Adjust intensity anytime.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9c2 2 4 2 6 0s4-2 6 0 4 2 4 2"
          stroke="#C9A96E"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M4 14c2 2 4 2 6 0s4-2 6 0 4 2 4 2"
          stroke="#C9A96E"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    
    <motion.section
      id="how-it-works"
      className="relative py-24 overflow-hidden"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <ColorBends preset="warm" intensity={0.95} />
      <div className="absolute inset-0 z-10 bg-ivory/80 pointer-events-none dark:bg-obsidian/70" />

      <div className="relative z-20 mx-auto max-w-6xl px-6">
        <motion.h2
          variants={fadeUp}
          className="text-center font-display text-4xl md:text-5xl font-light italic text-obsidian dark:text-ivory"
        >
          Three steps to
          <br />
          perfect ambience.
        </motion.h2>

        <div className="mt-12 relative">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {steps.map((s) => (
              <motion.div
                key={s.number}
                variants={fadeUp}
                className="flex-1 rounded-2xl border border-gold/20 bg-cream-deep p-8 dark:border-gold/15 dark:bg-obsidian-light"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-6xl text-gold/20 leading-none">
                      {s.number}
                    </div>
                    <div className="mt-4 font-display text-2xl font-light text-obsidian dark:text-ivory">
                      {s.title}
                    </div>
                  </div>
                  <div className="mt-1 text-gold/90">{s.icon}</div>
                </div>

                <p className="mt-5 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

