"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useProfileStore, initialsFromName } from "@/lib/profile-store";
import ProfileDrawer from "@/components/layout/ProfileDrawer";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "How It Works", href: "#how-it-works" },
  // { label: "Scents", href: "#scents" },
  { label: "Our Story", href: "#our-story" },
];

export default function Navbar() {
  const itemsCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const fullName = useProfileStore((s) => s.fullName);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1], { clamp: true });
  const initials = initialsFromName(fullName);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <motion.div
          className="pointer-events-none absolute inset-0 border-b border-gold/10 bg-obsidian/90 backdrop-blur-md"
          style={{ opacity: bgOpacity }}
        />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl tracking-widest text-ivory"
              aria-label="AromaIQ home"
            >
              Aroma<span className="text-gold">IQ</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-body text-sm uppercase tracking-widest text-ivory-muted transition hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center p-2"
                aria-label="Cart"
              >
                <ShoppingBag className="text-ivory" size={20} />
                {itemsCount > 0 ? (
                  <span className="absolute -top-0.5 right-0.5 min-w-6 h-6 px-1 rounded-full bg-gold text-obsidian text-[11px] font-body flex items-center justify-center">
                    {itemsCount}
                  </span>
                ) : null}
              </Link>

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
                className="md:hidden inline-flex items-center justify-center p-2"
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
              className="relative mx-auto max-w-6xl h-full px-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between py-6">
                <Link
                  href="/"
                  className="font-display text-xl tracking-widest text-ivory"
                  onClick={() => setMenuOpen(false)}
                >
                  Aroma<span className="text-gold">IQ</span>
                </Link>

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
              </motion.nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
