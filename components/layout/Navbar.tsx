"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useProfileStore, initialsFromName } from "@/lib/profile-store";
import { useAuth } from "@/components/auth/auth-context";
import { useCartSync } from "@/lib/hooks/use-cart-sync";
import ProfileDrawer from "@/components/layout/ProfileDrawer";

const navLinks = [
  { label: "Shop", href: "/shop" },
  // { label: "How It Works", href: "#how-it-works" },
  { label: "Our Story", href: "/our-story" },
];

function BrandMark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className="flex h-9 shrink-0 items-center sm:h-10"
      aria-label="AromaIQ home"
      onClick={onNavigate}
    >
      <span className="font-display text-2xl font-light italic tracking-widest text-gold sm:text-3xl">
      AromaIQ
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { user, loading, refresh, setUser } = useAuth();
  const { refresh: refreshCart } = useCartSync();
  const itemsCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const clearCart = useCartStore((s) => s.clearCart);
  const setProfile = useProfileStore((s) => s.setProfile);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1], { clamp: true });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.name,
        email: user.email,
        phone: user.mobile ?? "",
      });
      refreshCart();
    }
  }, [user, setProfile, refreshCart]);

  const initials = user ? initialsFromName(user.name) : "";

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    clearCart();
    setUser(null);
    refresh();
  }, [clearCart, refresh, setUser]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <motion.div
          className="pointer-events-none absolute inset-0 border-b border-gold/10 bg-obsidian/90 backdrop-blur-md"
          style={{ opacity: bgOpacity }}
        />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="relative flex h-20 items-center justify-between">
            <div className="relative z-10 shrink-0">
              <BrandMark />
            </div>

            <nav
              className="absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
              aria-label="Main"
            >
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-body text-sm uppercase tracking-widest text-ivory-muted transition hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
              {user?.role === "admin" ? (
                <Link
                  href="/admin/products"
                  className="font-body text-sm uppercase tracking-widest text-gold transition hover:text-gold-light"
                >
                  Admin
                </Link>
              ) : null}
            </nav>

            <div className="relative z-10 flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center p-2"
                aria-label="Cart"
              >
                <ShoppingBag className="text-ivory" size={20} />
                {itemsCount > 0 ? (
                  <span className="absolute -top-0.5 right-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1 font-body text-[11px] text-obsidian">
                    {itemsCount}
                  </span>
                ) : null}
              </Link>

              {!loading && !user ? (
                <>
                  <Link
                    href="/login"
                    className="hidden rounded-lg border border-gold/35 px-4 py-2 font-body text-sm text-gold transition-colors hover:border-gold/55 hover:bg-gold/5 sm:inline-flex"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden rounded-lg bg-gold px-4 py-2 font-body text-sm font-medium text-obsidian transition-opacity hover:opacity-90 sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                </>
              ) : null}

              {!loading && user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(true)}
                    className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-obsidian-light/80 font-display text-xs text-ivory"
                    aria-label="Open profile"
                  >
                    {initials}
                  </button>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="hidden font-body text-xs uppercase tracking-wider text-ivory-muted hover:text-gold lg:inline"
                  >
                    Log out
                  </button>
                </>
              ) : null}

              <button
                type="button"
                className="inline-flex items-center justify-center p-2 md:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="text-ivory" size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-sm" />

            <motion.div
              className="relative mx-auto h-full max-w-6xl px-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between py-6">
                <BrandMark onNavigate={() => setMenuOpen(false)} />

                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="text-ivory" size={22} />
                </button>
              </div>

              <motion.nav
                className="mt-10 flex flex-col gap-6"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {navLinks.map((l) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link
                      href={l.href}
                      className="font-display text-3xl font-light italic text-ivory transition hover:text-gold"
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                {user?.role === "admin" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link
                      href="/admin/products"
                      className="font-display text-3xl font-light italic text-gold transition hover:text-gold-light"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </motion.div>
                ) : null}
                {!user ? (
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href="/cart"
                      className="w-fit font-body text-sm uppercase tracking-wider text-ivory-muted"
                      onClick={() => setMenuOpen(false)}
                    >
                      Cart{itemsCount > 0 ? ` (${itemsCount})` : ""}
                    </Link>
                    <Link
                      href="/login"
                      className="w-fit rounded-lg border border-gold/35 px-6 py-3 font-body text-sm text-gold"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="w-fit rounded-lg bg-gold px-6 py-3 font-body text-sm text-obsidian"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="mt-4 w-fit font-body text-sm uppercase tracking-wider text-ivory-muted"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    Log out
                  </button>
                )}
              </motion.nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
