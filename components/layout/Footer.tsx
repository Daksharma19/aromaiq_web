import Link from "next/link";

const footerCols = [
  {
    title: "Shop",
    links: [
      { label: "Starter Kit", href: "/shop" },
      { label: "Full Kit", href: "/shop" },
      { label: "Subscriptions", href: "/shop" },
      { label: "Gift Cards (coming soon)", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "#our-story" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "The App", href: "#app" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Shipping & Returns", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gold/15 bg-cream-deep text-obsidian dark:border-transparent dark:bg-walnut dark:text-ivory transition-colors">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="font-display text-xl tracking-widest text-obsidian dark:text-ivory">
              Aroma<span className="text-gold">IQ</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
              Scent intelligence for modern living.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-neutral-600 dark:text-ivory-muted">
              <Link href="#" className="hover:text-gold transition">
                Instagram
              </Link>
              <Link href="mailto:hello@aromaiq.com" className="hover:text-gold transition">
                hello@aromaiq.com
              </Link>
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <div className="font-body text-sm uppercase tracking-widest text-neutral-600 dark:text-ivory-muted">
                {col.title}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-sm text-neutral-600 transition hover:text-gold dark:text-ivory-muted dark:hover:text-ivory"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-gold/20 pt-6 text-xs text-neutral-600 dark:text-ivory-muted">
          <div>© 2025 AromaIQ. Made with intention in India.</div>
          <div className="text-neutral-500 dark:text-ivory/60">
            Backed by JSW Ventures
          </div>
        </div>
      </div>
    </footer>
  );
}

