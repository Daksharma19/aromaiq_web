"use client";

import { motion } from "framer-motion";
import ColorBends from "@/components/backgrounds/ColorBends";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

const painPoints = [
  "15 oils. No idea which to use.",
  "Wrong scent ruins the whole mood.",
  "Timers, apps, manual switches — all friction.",
];

const solutionPills = [
  "Mood-aware AI engine",
  "4-chamber precision diffuser",
  "Zero-friction mobile control",
];

export default function ProblemSolution() {
  return (
    <motion.section
      id="problem"
      className="relative py-24 overflow-hidden"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <ColorBends preset="cool" intensity={1} />
      <div className="absolute inset-0 bg-obsidian/70 z-10 pointer-events-none" />

      <div className="relative z-20 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <motion.div variants={fadeUp}>
            <div className="font-body text-xs text-gold tracking-[0.3em] uppercase">
              THE PROBLEM
            </div>

            <h2 className="mt-5 font-display text-4xl md:text-5xl font-light italic leading-tight">
              Generic diffusers
              <br />
              can&apos;t read a room.
            </h2>

            <p className="mt-5 font-body text-ivory-muted text-sm leading-relaxed">
              Aromatherapy is powerful. But with most diffusers, you&apos;re left
              guessing: the right oils, the right blend, the right moment.
            </p>
            <p className="mt-4 font-body text-ivory-muted text-sm leading-relaxed">
              Manual blending takes effort, timers add friction, and one wrong
              scent can turn the mood off entirely.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {painPoints.map((p) => (
                <div
                  key={p}
                  className="border-l border-gold/40 pl-4 text-ivory-muted font-body text-sm"
                >
                  {p}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="font-body text-xs text-gold tracking-[0.3em] uppercase">
              THE SOLUTION
            </div>

            <h2 className="mt-5 font-display text-4xl md:text-5xl font-light italic leading-tight">
              AromaIQ thinks
              <br />
              for you.
            </h2>

            <p className="mt-5 font-body text-ivory-muted text-sm leading-relaxed">
              AI detects time of day, ambient context, and your usage patterns.
              It selects and blends automatically for the ambience you want.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {solutionPills.map((pill) => (
                <div
                  key={pill}
                  className="inline-flex items-center w-fit rounded-full border border-gold/10 bg-obsidian-light px-5 py-2 font-body text-sm text-ivory"
                >
                  <span className="text-gold mr-2">✦</span>
                  {pill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

