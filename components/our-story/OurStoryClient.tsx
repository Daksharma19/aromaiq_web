"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb } from "lucide-react";

const storyFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const viewport = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" };

function ChapterMotion({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={storyFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

function FounderPhoto({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) {
  const [showImg, setShowImg] = useState(true);

  return (
    <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-[0_0_0_4px_rgba(201,169,110,0.12)]">
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- optional files in /public/founders
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setShowImg(false)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-obsidian-mid font-display text-3xl font-light italic text-gold/70">
          {initials}
        </div>
      )}
    </div>
  );
}

function StatusRow({
  label,
  state,
}: {
  label: string;
  state: "active" | "dim";
}) {
  const active = state === "active";
  return (
    <div className="flex items-center gap-3 border-b border-gold/10 py-3 last:border-0">
      <span
        className={`relative flex h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-gold" : "bg-ivory-muted/25"
        }`}
        aria-hidden
      >
        {active ? (
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
        ) : null}
      </span>
      <span className="font-body text-sm text-ivory">{label}</span>
      <span className="ml-auto font-body text-xs uppercase tracking-wider text-gold-muted">
        {active ? "In progress" : "Building"}
      </span>
    </div>
  );
}

export default function OurStoryClient() {
  const timelineTopRef = useRef<HTMLDivElement>(null);
  const timelineBottomRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollTop } = useScroll({
    target: timelineTopRef,
    offset: ["start 0.75", "end 0.35"],
  });
  const { scrollYProgress: scrollBottom } = useScroll({
    target: timelineBottomRef,
    offset: ["start 0.75", "end 0.35"],
  });
  const lineScaleTop = useTransform(scrollTop, [0, 1], [0, 1]);
  const lineScaleBottom = useTransform(scrollBottom, [0, 1], [0, 1]);

  return (
    <main className="min-h-screen bg-obsidian text-ivory">
      {/* Hero */}
      <header className="mx-auto max-w-4xl px-6 pb-16 pt-12 text-center md:pb-24 md:pt-16">
        <motion.p
          className="font-body text-[11px] font-medium uppercase tracking-[0.35em] text-gold"
          variants={storyFadeUp}
          initial="hidden"
          animate="visible"
        >
          Our Story
        </motion.p>
        <motion.h1
          className="mt-5 font-display text-[clamp(2rem,6vw,3.5rem)] font-light italic leading-[1.12] text-ivory text-balance"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          Built from a bedroom.
          <br />
          Aimed at every room.
        </motion.h1>
      </header>

      {/* Timeline part 1 — chapters 1–2 (line ends before Team) */}
      <div ref={timelineTopRef} className="relative mx-auto max-w-5xl px-6 pb-8">
        <div
          className="pointer-events-none absolute bottom-0 left-8 top-0 w-px bg-gold/20 md:left-1/2 md:-translate-x-1/2"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute left-8 top-0 h-full w-px origin-top bg-gold md:left-1/2 md:-translate-x-1/2"
          style={{ scaleY: lineScaleTop }}
          aria-hidden
        />

        {/* Chapter 1 */}
        <section className="relative grid grid-cols-1 gap-8 pb-20 md:grid-cols-[1fr_auto_1fr] md:gap-0 md:pb-28">
          <div className="hidden md:block" />
          <div className="absolute left-8 top-8 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-obsidian md:left-1/2 md:top-10">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </div>
          <div className="pl-14 md:col-start-1 md:row-start-1 md:pl-0 md:pr-12 md:text-right">
            <ChapterMotion>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-gold-muted">
                2024
              </p>
              <p className="mt-2 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-gold">
                The Idea
              </p>
              <h2 className="mt-4 font-display text-2xl font-light italic text-ivory md:text-3xl">
                What if your room knew how you felt?
              </h2>
              <p className="mt-5 font-body text-sm leading-relaxed text-ivory-muted md:ml-auto md:max-w-md">
                Two college students frustrated by the chaos of modern life —
                deadlines, sleepless nights, zero focus. Scent had always worked
                for them intuitively. Why wasn&apos;t there a device smart enough
                to figure that out automatically?
              </p>
            </ChapterMotion>
          </div>
          <div className="flex justify-start pl-14 md:col-start-3 md:row-start-1 md:justify-start md:pl-12">
            <ChapterMotion className="flex h-full items-start pt-2 md:pt-4">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-2xl border border-gold/40 bg-obsidian-light/40"
                aria-hidden
              >
                <Lightbulb
                  className="h-14 w-14 text-gold/90"
                  strokeWidth={1}
                />
              </div>
            </ChapterMotion>
          </div>
        </section>

        {/* Chapter 2 */}
        <section className="relative grid grid-cols-1 gap-8 pb-20 md:grid-cols-[1fr_auto_1fr] md:pb-28">
          <div className="absolute left-8 top-8 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-obsidian md:left-1/2 md:top-10">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </div>
          <div className="pl-14 md:col-start-3 md:pl-12">
            <ChapterMotion>
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-gold">
                The Vision
              </p>
              <h2 className="mt-4 font-display text-2xl font-light italic text-ivory md:text-3xl">
                AI that learns your nose.
              </h2>
              <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-ivory-muted">
                The idea took shape — a diffuser with 4 scent chambers, controlled
                by an app that learns your patterns. Citrus in the morning to
                brighten the start. Deep woods at night for real sleep. Bergamot
                and peppermint when deadlines hit. The machine learns what works
                for you, not just what works in general.
              </p>
              <div className="mt-8 rounded-xl border border-gold/35 bg-shop-surface/80 p-5 md:max-w-md">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold-muted">
                  Revenue model
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-ivory">
                  Three streams —{" "}
                  <span className="text-gold">Personal Diffusers</span>
                  {" · "}
                  <span className="text-gold">
                    Commercial big diffusers
                  </span>{" "}
                  for cafés and restaurants{" · "}
                  <span className="text-gold">
                    Recurring scent subscriptions
                  </span>
                </p>
              </div>
            </ChapterMotion>
          </div>
          <div className="hidden md:col-start-1 md:block" />
        </section>

        <div className="absolute bottom-0 left-8 z-10 flex h-4 w-4 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-obsidian md:left-1/2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        </div>
      </div>

      {/* Chapter 3 — Team (no timeline line; full-width editorial block) */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20 md:pb-28">
        <ChapterMotion className="md:text-center">
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-gold md:text-center">
            The Team
          </p>
          <h2 className="mt-4 font-display text-2xl font-light italic text-ivory md:text-3xl">
            Two builders. One obsession.
          </h2>
        </ChapterMotion>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:mx-auto md:max-w-3xl">
          <ChapterMotion className="rounded-2xl border border-gold/15 bg-obsidian-light/30 p-8 text-center">
            <FounderPhoto
              src="/images/ayush.png"
              alt="Ayush Raj"
              initials="AR"
            />
            <p className="mt-6 font-display text-xl font-light text-ivory">
              Ayush Raj
            </p>
            <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gold">
              CEO
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-ivory-muted">
              Visionary leader driving innovation in smart wellness technology.
            </p>
          </ChapterMotion>
          <ChapterMotion className="rounded-2xl border border-gold/15 bg-obsidian-light/30 p-8 text-center">
            <FounderPhoto
              src="/images/daksh.png"
              alt="Daksh Sharma"
              initials="DS"
            />
            <p className="mt-6 font-display text-xl font-light text-ivory">
              Daksh Sharma
            </p>
            <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gold">
              CTO
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-ivory-muted">
              Technical mastermind crafting intelligent aroma experiences.
            </p>
          </ChapterMotion>
        </div>
      </section>

      {/* Timeline part 2 — chapters 4–6 (line restarts) */}
      <div ref={timelineBottomRef} className="relative">
        <div
          className="pointer-events-none absolute bottom-0 left-8 top-0 w-px bg-gold/20 md:left-1/2 md:-translate-x-1/2"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute left-8 top-0 h-full w-px origin-top bg-gold md:left-1/2 md:-translate-x-1/2"
          style={{ scaleY: lineScaleBottom }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-6 pb-8">
        {/* Chapter 4 */}
        <section className="relative grid grid-cols-1 gap-8 pb-20 md:grid-cols-[1fr_auto_1fr] md:pb-28">
          <div className="absolute left-8 top-8 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-obsidian md:left-1/2 md:top-10">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </div>
          <div className="pl-14 md:col-start-1 md:pr-12 md:text-right">
            <ChapterMotion>
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-gold">
                The Mentors
              </p>
              <h2 className="mt-4 font-display text-2xl font-light italic text-ivory md:text-3xl">
                Guided by the best.
              </h2>
              <p className="mt-5 font-body text-sm leading-relaxed text-ivory-muted md:ml-auto md:max-w-md">
                From day one, we knew we needed more than just a great idea. Our
                college backed us early. Janam Mehta of JSW Ventures saw what we
                were building and joined as a mentor — helping us think bigger,
                move smarter, and build right.
              </p>
              <div className="mt-8 flex flex-col gap-3 md:ml-auto md:max-w-md md:items-end">
                <div className="w-full rounded-xl border border-gold/35 bg-shop-surface/60 px-4 py-3 text-left md:max-w-sm">
                  <p className="font-display text-lg text-ivory">Our College</p>
                  <p className="mt-1 font-body text-xs text-ivory-muted">
                    Early support &amp; belief
                  </p>
                </div>
                <div className="w-full rounded-xl border border-gold/35 bg-shop-surface/60 px-4 py-3 text-left md:max-w-sm">
                  <p className="font-display text-lg text-ivory">
                    Janam Mehta
                  </p>
                  <p className="mt-1 font-body text-xs text-gold-muted">
                    JSW Ventures · Mentor
                  </p>
                </div>
              </div>
            </ChapterMotion>
          </div>
          <div className="hidden md:block" />
        </section>

        {/* Chapter 5 */}
        <section className="relative grid grid-cols-1 gap-8 pb-24 md:grid-cols-[1fr_auto_1fr] md:pb-32">
          <div className="absolute left-8 top-8 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-obsidian md:left-1/2 md:top-10">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </div>
          <div className="hidden md:block" />
          <div className="pl-14 md:col-start-3 md:pl-12">
            <ChapterMotion>
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-gold">
                Where We Are
              </p>
              <h2 className="mt-4 font-display text-2xl font-light italic text-ivory md:text-3xl">
                Prototype on the workbench.
              </h2>
              <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-ivory-muted">
                Right now we are heads down building the MVP — a 4-scent
                diffuser hardware prototype controlled by a Flutter mobile app.
                The hardware is being assembled. The app is being wired. The AI
                is being trained. This is day one of something much larger.
              </p>
              <div className="mt-8 max-w-md rounded-xl border border-gold/20 bg-obsidian-light/40 px-4">
                <StatusRow label="Hardware prototype" state="active" />
                <StatusRow label="Mobile app" state="active" />
                <StatusRow label="AI mood engine" state="dim" />
              </div>
            </ChapterMotion>
          </div>
        </section>
        </div>

      {/* Chapter 6 — full bleed */}
      <section className="relative overflow-hidden border-t border-gold/10 px-6 py-24 md:py-32">
        <div className="absolute left-8 top-20 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-obsidian md:left-1/2 md:top-24">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden
        >
          <div className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.14),transparent_65%)]" />
          <div className="absolute -right-1/4 bottom-0 h-[60%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(125,92,60,0.12),transparent_60%)]" />
          <div className="absolute left-1/2 top-1/2 h-[40%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.06),transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <ChapterMotion>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gold-muted">
              Where We&apos;re Going
            </p>
            <h2 className="mt-6 font-display text-[clamp(2rem,5.5vw,3.75rem)] font-light leading-[1.08] text-ivory text-balance">
              Every room. Every mood. Every person.
            </h2>
            <p className="mx-auto mt-8 max-w-2xl font-body text-base leading-relaxed text-ivory-muted md:text-lg">
              Personal bedrooms. College dorms. Coffee shops. Boardrooms.
              Anywhere a scent can shift the energy of a space — AromaIQ will be
              there.
            </p>
            <Link
              href="/shop"
              className="mt-12 inline-flex rounded-lg border border-gold/40 bg-transparent px-10 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
            >
              Explore the shop
            </Link>
          </ChapterMotion>
        </div>
      </section>
      </div>
    </main>
  );
}
