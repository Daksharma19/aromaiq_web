"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import ColorBends from "@/components/backgrounds/ColorBends";
import {
  fadeUp,
  scaleIn,
  slideFromLeft,
  slideFromRight,
} from "@/lib/motion-variants";
import problemImage from "@/public/images/diffuser.png";
import solutionImage from "@/public/images/image1.png";

const PROBLEM_IMAGE_ALT = "AromaIQ smart diffuser";
const SOLUTION_IMAGE_ALT = "AromaIQ mobile interface";

const painPoints = [
  "15 oils. No idea which to use.",
  "Wrong scent ruins the whole mood.",
  "Timers, apps, manual switches - all friction.",
];

const solutionPills = [
  "Mood-aware AI engine",
  "4-chamber precision diffuser",
  "Zero-friction mobile control",
];

const viewAnim = {
  once: true,
  amount: 0.25,
  margin: "-60px 0px",
} as const;

function ProblemSolutionImage({
  image,
  imageAlt,
}: {
  image: StaticImageData;
  imageAlt: string;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gold/15 bg-obsidian-light/40">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.06] via-transparent to-walnut/25" />
    </div>
  );
}

function CenterSpine({ lineScale }: { lineScale: MotionValue<number> }) {
  return (
    <div
      className="relative hidden w-12 shrink-0 flex-col items-center md:flex md:w-14"
      aria-hidden
    >
      <div className="z-10 h-3 w-3 rounded-full border-2 border-gold bg-obsidian shadow-[0_0_0_4px_rgba(14,12,10,0.9)]" />
      <div className="relative my-1 min-h-[min(52vh,520px)] w-px flex-1 bg-gold/20">
        <motion.div
          className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-gold via-gold/70 to-gold/30"
          style={{
            height: "100%",
            scaleY: lineScale,
          }}
        />
      </div>
      <div className="z-10 h-3 w-3 rounded-full border-2 border-gold bg-obsidian shadow-[0_0_0_4px_rgba(14,12,10,0.9)]" />
    </div>
  );
}

function ProblemCopy() {
  return (
    <>
      <div className="font-body text-xs uppercase tracking-[0.3em] text-gold">
        The problem
      </div>
      <h2 className="mt-5 font-display text-4xl font-light italic leading-tight text-ivory md:text-5xl">
        Generic diffusers
        <br />
        can&apos;t read a room.
      </h2>
      <p className="mt-5 font-body text-sm leading-relaxed text-ivory-muted">
        Aromatherapy is powerful. But with most diffusers, you&apos;re left
        guessing: the right oils, the right blend, the right moment.
      </p>
      <p className="mt-4 font-body text-sm leading-relaxed text-ivory-muted">
        Manual blending takes effort, timers add friction, and one wrong scent
        can turn the mood off entirely.
      </p>
      <div className="mt-7 flex flex-col gap-3">
        {painPoints.map((p) => (
          <div
            key={p}
            className="border-l border-gold/40 pl-4 font-body text-sm text-ivory-muted"
          >
            {p}
          </div>
        ))}
      </div>
    </>
  );
}

function SolutionCopy() {
  return (
    <>
      <div className="font-body text-xs uppercase tracking-[0.3em] text-gold">
        The solution
      </div>
      <h2 className="mt-5 font-display text-4xl font-light italic leading-tight text-ivory md:text-5xl">
        AromaIQ thinks
        <br />
        for you.
      </h2>
      <p className="mt-5 font-body text-sm leading-relaxed text-ivory-muted">
        AI detects time of day, ambient context, and your usage patterns. It
        selects and blends automatically for the ambience you want.
      </p>
      <div className="mt-7 flex flex-col gap-3">
        {solutionPills.map((pill) => (
          <div
            key={pill}
            className="inline-flex w-fit items-center rounded-full border border-gold/15 bg-obsidian-light px-5 py-2 font-body text-sm text-ivory"
          >
            <span className="mr-2 text-gold">✦</span>
            {pill}
          </div>
        ))}
      </div>
    </>
  );
}

export default function ProblemSolution() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.25"],
  });

  const lineScale = useTransform(scrollYProgress, [0.08, 0.92], [0, 1], {
    clamp: true,
  });

  return (
    <section
      ref={containerRef}
      id="problem"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <ColorBends preset="cool" intensity={1} />
      <div className="pointer-events-none absolute inset-0 z-10 bg-obsidian/70" />

      <div className="relative z-20 mx-auto max-w-6xl px-6">
        {/* Mobile: linear stack */}
        <div className="flex flex-col gap-14 md:hidden">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewAnim}
          >
            <ProblemSolutionImage
              image={problemImage}
              imageAlt={PROBLEM_IMAGE_ALT}
            />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewAnim}
          >
            <ProblemCopy />
          </motion.div>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewAnim}
          >
            <ProblemSolutionImage
              image={solutionImage}
              imageAlt={SOLUTION_IMAGE_ALT}
            />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewAnim}
          >
            <SolutionCopy />
          </motion.div>
        </div>

        {/* Desktop: zigzag + center spine */}
        <div className="hidden min-h-[min(88vh,900px)] md:grid md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-x-8 lg:gap-x-12">
          <div className="flex flex-col justify-between gap-16 lg:gap-20">
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewAnim}
            >
              <ProblemCopy />
            </motion.div>
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ ...viewAnim, amount: 0.2 }}
              transition={{ delay: 0.08 }}
            >
              <ProblemSolutionImage
                image={problemImage}
                imageAlt={PROBLEM_IMAGE_ALT}
              />
            </motion.div>
          </div>

          <CenterSpine lineScale={lineScale} />

          <div className="flex flex-col justify-between gap-16 lg:gap-20">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewAnim}
            >
              <ProblemSolutionImage
                image={solutionImage}
                imageAlt={SOLUTION_IMAGE_ALT}
              />
            </motion.div>
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewAnim}
              transition={{ delay: 0.06 }}
            >
              <SolutionCopy />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
