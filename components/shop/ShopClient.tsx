"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export type ShopProduct = {
  id: string;
  name: string;
  priceLabel: string;
  price: number;
  shortDescription: string;
  fullDescription: string;
  scents?: string[];
  featured?: boolean;
  badge?: "popular" | "save20";
};

const PRODUCTS: ShopProduct[] = [
  {
    id: "starter-kit",
    name: "Starter Kit",
    priceLabel: "₹4,999",
    price: 4999,
    shortDescription: "Diffuser + 2 scent bottles",
    fullDescription:
      "Everything you need to begin your AromaIQ ritual: our four-chamber smart diffuser and two curated essential oil bottles. Perfect for smaller spaces and first-time explorers who want intelligent ambience without compromise.",
  },
  {
    id: "full-kit",
    name: "Full Kit",
    priceLabel: "₹7,999",
    price: 7999,
    shortDescription: "Diffuser + 6 scent bottles",
    fullDescription:
      "The complete AromaIQ experience. Full diffuser system with six premium blends so the AI can rotate moods across your week—from deep focus to wind-down. Our most complete bundle for homes that live in scent.",
    featured: true,
    badge: "popular",
  },
  {
    id: "sleep-pack",
    name: "Sleep Pack",
    priceLabel: "₹1,299",
    price: 1299,
    shortDescription: "Cedarwood, Vetiver, Mogra, Vanilla",
    fullDescription:
      "A quartet of oils chosen for calm and depth of rest. Layer them through the evening as AromaIQ softens intensity automatically, or diffuse a single note—each bottle is pure-grade and blended to settle the mind.",
    scents: ["Cedarwood", "Vetiver", "Mogra", "Vanilla"],
  },
  {
    id: "focus-pack",
    name: "Focus Pack",
    priceLabel: "₹1,299",
    price: 1299,
    shortDescription: "Peppermint, Eucalyptus, Bergamot, Rosemary",
    fullDescription:
      "Bright, clarifying botanicals for work sessions and creative sprints. Use with Focus mode in the app for timed bursts of clarity, or let the engine suggest the right oil for your calendar.",
    scents: ["Peppermint", "Eucalyptus", "Bergamot", "Rosemary"],
  },
  {
    id: "monthly-refill",
    name: "Monthly Refill",
    priceLabel: "₹1,499/mo",
    price: 1499,
    shortDescription: "AI-curated, 2 bottles/month",
    fullDescription:
      "Subscribe for two surprise bottles every month, selected by AromaIQ from our library of fifteen oils based on your usage and preferences. Skip or pause anytime—shipping is carbon-neutral where available.",
    badge: "save20",
  },
];

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function ProductImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-cream-deep/95 dark:bg-obsidian-mid/80 ${className ?? ""}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-walnut/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border border-gold/20 flex items-center justify-center">
          <span className="font-display text-2xl text-gold/40 italic">A</span>
        </div>
      </div>
    </div>
  );
}

export default function ShopClient() {
  const [selected, setSelected] = useState<ShopProduct | null>(null);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!selected) return;
    setQty(1);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const close = useCallback(() => setSelected(null), []);

  const handleAddFromOverlay = () => {
    if (!selected) return;
    addItem({
      productId: selected.id,
      name: selected.name,
      price: selected.price,
      quantity: qty,
    });
    close();
  };

  return (
    <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-14">
        <h1 className="text-center font-display text-4xl font-light italic md:text-5xl lg:text-[3.25rem] leading-tight text-obsidian dark:text-ivory">
          Own your ambience.
        </h1>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(p);
                }
              }}
              className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-cream-deep text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 dark:bg-shop-surface ${
                p.featured
                  ? "border-gold"
                  : "border-gold/20 hover:border-gold/40 dark:border-gold/10 dark:hover:border-gold/25"
              }`}
            >
              <div className="relative">
                <ProductImagePlaceholder className="aspect-[4/3] w-full" />
                {p.badge === "popular" && (
                  <span className="absolute left-3 top-3 rounded-full border border-gold/40 bg-ivory/95 px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-gold dark:bg-obsidian/90">
                    Most Popular
                  </span>
                )}
                {p.badge === "save20" && (
                  <span className="absolute left-3 top-3 rounded-full border border-gold/40 bg-ivory/95 px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-gold dark:bg-obsidian/90">
                    Save 20%
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-2xl font-light text-obsidian dark:text-ivory">
                  {p.name}
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
                  {p.shortDescription}
                </p>
                <p className="mt-4 font-display text-xl text-gold">{p.priceLabel}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem({
                      productId: p.id,
                      name: p.name,
                      price: p.price,
                      quantity: 1,
                    });
                  }}
                  className="mt-6 w-full rounded-lg border border-gold/35 bg-gold/10 py-3 font-body text-sm font-medium text-gold transition-colors hover:bg-gold/20"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.button
              type="button"
              aria-label="Close product details"
              className="fixed inset-0 z-[100] bg-obsidian/40 backdrop-blur-sm dark:bg-obsidian/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="shop-detail-title"
              className="fixed inset-x-0 bottom-0 top-[6vh] z-[101] flex max-h-[94vh] flex-col rounded-t-3xl border border-gold/20 bg-cream-deep shadow-[0_-24px_80px_rgba(0,0,0,0.2)] dark:border-gold/15 dark:bg-shop-surface dark:shadow-[0_-24px_80px_rgba(0,0,0,0.65)] md:inset-x-8 md:mx-auto md:max-w-5xl lg:top-[10vh] lg:max-h-[88vh]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-neutral-500 transition-colors hover:border-gold/50 hover:text-obsidian dark:border-gold/20 dark:text-ivory-muted dark:hover:text-ivory"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
                <div className="relative shrink-0 md:w-1/2 md:border-r md:border-gold/15 dark:md:border-gold/10">
                  <ProductImagePlaceholder className="aspect-square w-full md:aspect-auto md:h-full md:min-h-[320px]" />
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6 pb-10 md:p-10 md:pb-10">
                  <div>
                    <h2
                      id="shop-detail-title"
                      className="pr-12 font-display text-3xl font-light leading-tight text-obsidian dark:text-ivory md:text-4xl lg:text-[2.75rem]"
                    >
                      {selected.name}
                    </h2>
                    <p className="mt-3 font-display text-2xl text-gold md:text-3xl">
                      {selected.priceLabel}
                    </p>
                  </div>

                  <p className="font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted md:text-base">
                    {selected.fullDescription}
                  </p>

                  {selected.scents && selected.scents.length > 0 && (
                    <div>
                      <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-gold-muted">
                        Scent notes
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {selected.scents.map((s) => (
                          <li
                            key={s}
                            className="rounded-full border border-gold/35 bg-ivory/80 px-3 py-1.5 font-body text-xs text-gold dark:bg-obsidian/60"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-4 border-t border-gold/15 pt-6 dark:border-gold/10">
                    <div className="flex items-center gap-4">
                      <span className="font-body text-xs uppercase tracking-[0.15em] text-neutral-500 dark:text-ivory-muted">
                        Quantity
                      </span>
                      <div className="flex items-center gap-0 rounded-lg border border-gold/25 bg-cream/90 dark:bg-obsidian/40">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="flex h-10 w-10 items-center justify-center text-neutral-500 transition-colors hover:text-obsidian disabled:opacity-30 dark:text-ivory-muted dark:hover:text-ivory"
                          disabled={qty <= 1}
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center font-body text-sm tabular-nums text-obsidian dark:text-ivory">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="flex h-10 w-10 items-center justify-center text-neutral-500 transition-colors hover:text-obsidian dark:text-ivory-muted dark:hover:text-ivory"
                          onClick={() => setQty((q) => q + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFromOverlay}
                      className="w-full rounded-lg bg-gold py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90"
                    >
                      Add to Cart · {formatInr(selected.price * qty)}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
