"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useCartSync } from "@/lib/hooks/use-cart-sync";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { isSupabaseStoragePublicUrl } from "@/lib/is-supabase-storage-url";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function LineImagePlaceholder() {
  return (
    <div
      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gold/15 bg-cream-deep/95 dark:bg-obsidian-mid/80"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-walnut/25" />
      <div className="flex h-full w-full items-center justify-center">
        <span className="font-display text-lg text-gold/35 italic">A</span>
      </div>
    </div>
  );
}

function LineThumb({ item }: { item: CartItem }) {
  if (!item.imageUrl) return <LineImagePlaceholder />;
  const supabaseImg = isSupabaseStoragePublicUrl(item.imageUrl);
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gold/15 bg-cream-deep/95 dark:bg-obsidian-mid/80">
      {supabaseImg ? (
        <Image
          src={item.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}

export default function CartClient() {
  const { user, loading: authLoading } = useAuth();
  const { refresh: refreshCart } = useCartSync();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);

  const total = getTotal();

  useEffect(() => {
    if (user) refreshCart();
  }, [user, refreshCart]);

  const patchLineQuantity = useCallback(
    async (item: CartItem, nextQty: number) => {
      if (user && item.lineId) {
        const res = await fetch(`/api/cart/${item.lineId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: nextQty }),
        });
        if (res.ok) {
          if (nextQty <= 0) {
            removeItem(item.productId);
          } else {
            setQuantity(item.productId, nextQty);
          }
          await refreshCart();
        }
        return;
      }
      if (nextQty <= 0) {
        removeItem(item.productId);
      } else {
        setQuantity(item.productId, nextQty);
      }
    },
    [user, removeItem, setQuantity, refreshCart]
  );

  const deleteLine = useCallback(
    async (item: CartItem) => {
      if (user && item.lineId) {
        const res = await fetch(`/api/cart/${item.lineId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          removeItem(item.productId);
          await refreshCart();
        }
        return;
      }
      removeItem(item.productId);
    },
    [user, removeItem, refreshCart]
  );

  if (authLoading && items.length === 0) {
    return (
      <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-14 text-center">
          <p className="font-body text-sm text-neutral-600 dark:text-ivory-muted">
            Loading cart…
          </p>
        </div>
      </main>
    );
  }

  if (!authLoading && !user && items.length === 0) {
    return (
      <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-10 text-center md:pt-14">
          <h1 className="font-display text-4xl font-light italic text-obsidian dark:text-ivory md:text-5xl">
            Sign in to view your cart
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
            Your cart is saved when you&apos;re logged in. Create an account or sign
            in to continue.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/login?returnUrl=/cart"
              className="inline-flex rounded-lg bg-gold px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
            <Link
              href="/signup?returnUrl=/cart"
              className="inline-flex rounded-lg border border-gold/35 px-8 py-3 font-body text-sm font-medium text-gold transition-colors hover:border-gold/55 hover:bg-gold/5"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-10 text-center md:pt-14">
          <h1 className="font-display text-4xl font-light italic text-obsidian dark:text-ivory md:text-5xl">
            Your cart is empty.
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
            Explore the shop and add a kit or scent pack when you&apos;re ready.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex rounded-lg border border-gold bg-gold/10 px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold/20"
          >
            Browse shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10 md:pt-14">
        <h1 className="text-center font-display text-4xl font-light italic text-obsidian dark:text-ivory md:text-5xl">
          Cart
        </h1>
        <p className="mt-3 text-center font-body text-sm text-neutral-600 dark:text-ivory-muted">
          {items.reduce((n, i) => n + i.quantity, 0)}{" "}
          {items.reduce((n, i) => n + i.quantity, 0) === 1 ? "item" : "items"}
        </p>

        <ul className="mt-12 space-y-4">
          {items.map((item) => {
            const line = item.price * item.quantity;
            return (
              <li
                key={item.lineId ?? item.productId}
                className="flex gap-4 rounded-2xl border border-gold/15 bg-cream-deep p-4 dark:border-gold/10 dark:bg-shop-surface md:p-5"
              >
                <LineThumb item={item} />
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-light text-obsidian dark:text-ivory">
                      {item.name}
                    </h2>
                    <p className="mt-1 font-body text-sm text-gold tabular-nums">
                      {formatInr(item.price)} each
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <div className="flex items-center rounded-lg border border-gold/25 bg-cream/90 dark:bg-obsidian/40">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-obsidian disabled:opacity-30 dark:text-ivory-muted dark:hover:text-ivory"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          patchLineQuantity(item, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center font-body text-sm tabular-nums text-obsidian dark:text-ivory">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-obsidian dark:text-ivory-muted dark:hover:text-ivory"
                        onClick={() =>
                          patchLineQuantity(item, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="min-w-[5rem] text-right font-display text-lg text-gold tabular-nums">
                      {formatInr(line)}
                    </p>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/20 text-neutral-500 transition-colors hover:border-gold/40 hover:text-gold dark:border-gold/15 dark:text-ivory-muted"
                      onClick={() => deleteLine(item)}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 rounded-2xl border border-gold/15 bg-cream-deep p-6 dark:bg-shop-surface md:p-8">
          <div className="flex items-center justify-between border-b border-gold/15 pb-4 dark:border-gold/10">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-ivory-muted">
              Subtotal
            </span>
            <span className="font-display text-2xl text-gold tabular-nums">
              {formatInr(total)}
            </span>
          </div>
          <p className="mt-4 font-body text-xs leading-relaxed text-neutral-600 dark:text-ivory-muted">
            Shipping and taxes are calculated at checkout. Prices shown are
            indicative until payment is confirmed.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/checkout"
              className="flex-1 rounded-lg bg-gold py-3.5 text-center font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/shop"
              className="flex-1 rounded-lg border border-gold/35 py-3.5 text-center font-body text-sm font-medium text-gold transition-colors hover:border-gold/55 hover:bg-gold/5"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
