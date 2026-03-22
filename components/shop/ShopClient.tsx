"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useCartSync } from "@/lib/hooks/use-cart-sync";
import { isSupabaseStoragePublicUrl } from "@/lib/is-supabase-storage-url";

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
  imageUrl?: string | null;
  inStock: boolean;
};

type DbProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  in_stock: boolean;
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function mapDbToShop(row: DbProduct): ShopProduct {
  const desc = row.description?.trim() || "";
  const short =
    desc.length > 140 ? `${desc.slice(0, 140).trim()}…` : desc || row.name;
  const cat = (row.category || "").toLowerCase();
  const scentMatch = row.category?.match(/scents:\s*(.+)/i);
  const scents = scentMatch
    ? scentMatch[1].split(/[,|]/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    priceLabel: formatInr(Number(row.price)),
    shortDescription: short,
    fullDescription: desc || row.name,
    scents,
    featured: cat.includes("featured"),
    badge: cat.includes("popular")
      ? "popular"
      : cat.includes("save") || cat.includes("subscription")
        ? "save20"
        : undefined,
    imageUrl: row.image_url,
    inStock: row.in_stock,
  };
}

function ProductImage({
  imageUrl,
  className,
  alt = "",
}: {
  imageUrl?: string | null;
  className?: string;
  alt?: string;
}) {
  if (imageUrl) {
    const supabaseImg = isSupabaseStoragePublicUrl(imageUrl);
    return (
      <div
        className={`relative w-full overflow-hidden bg-obsidian-mid/40 ${className ?? ""}`}
      >
        {supabaseImg ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-provided URLs
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden bg-cream-deep/95 dark:bg-obsidian-mid/80 ${className ?? ""}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-walnut/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20">
          <span className="font-display text-2xl italic text-gold/40">A</span>
        </div>
      </div>
    </div>
  );
}

export default function ShopClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refresh: refreshCart } = useCartSync();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [selected, setSelected] = useState<ShopProduct | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        const rows = (data.products || []) as DbProduct[];
        if (!cancelled) {
          setProducts(rows.map(mapDbToShop));
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Could not load products");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const addToCartApi = useCallback(
    async (p: ShopProduct, quantity: number) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: p.id, quantity }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Could not add to cart");
      }
      await refreshCart();
    },
    [refreshCart]
  );

  const handleAddFromOverlay = async () => {
    if (!selected) return;
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent("/shop")}`);
      return;
    }
    try {
      await addToCartApi(selected, qty);
      close();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    }
  };

  const handleCardAdd = async (e: React.MouseEvent, p: ShopProduct) => {
    e.stopPropagation();
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent("/shop")}`);
      return;
    }
    if (!p.inStock) return;
    try {
      await addToCartApi(p, 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-14">
        <h1 className="text-center font-display text-4xl font-light italic leading-tight text-obsidian dark:text-ivory md:text-5xl lg:text-[3.25rem]">
          Own your ambience.
        </h1>

        {loadingProducts ? (
          <p className="mt-14 text-center font-body text-sm text-neutral-600 dark:text-ivory-muted">
            Loading products…
          </p>
        ) : loadError ? (
          <p className="mt-14 text-center font-body text-sm text-red-400">{loadError}</p>
        ) : products.length === 0 ? (
          <p className="mt-14 text-center font-body text-sm text-neutral-600 dark:text-ivory-muted">
            No products yet. Add some in the admin panel.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
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
                  <ProductImage
                    imageUrl={p.imageUrl}
                    className="aspect-[4/3]"
                    alt={p.name}
                  />
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
                    disabled={!p.inStock || authLoading}
                    onClick={(e) => handleCardAdd(e, p)}
                    className="mt-6 w-full rounded-lg border border-gold/35 bg-gold/10 py-3 font-body text-sm font-medium text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
                  >
                    {!p.inStock ? "Out of stock" : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
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
                <div className="relative min-h-[240px] shrink-0 md:w-1/2 md:border-r md:border-gold/15 dark:md:border-gold/10 md:min-h-[320px]">
                  <ProductImage
                    imageUrl={selected.imageUrl}
                    className="min-h-[240px] md:absolute md:inset-0 md:min-h-0 aspect-square md:aspect-auto"
                    alt={selected.name}
                  />
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
                      disabled={!selected.inStock}
                      onClick={handleAddFromOverlay}
                      className="w-full rounded-lg bg-gold py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      {!user
                        ? "Sign in to add to cart"
                        : !selected.inStock
                          ? "Out of stock"
                          : `Add to Cart · ${formatInr(selected.price * qty)}`}
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
