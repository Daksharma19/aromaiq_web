import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-obsidian text-ivory">
      <aside className="flex w-52 shrink-0 flex-col border-r border-gold/10 px-5 py-8 md:w-56">
        <Link
          href="/"
          className="font-display text-lg tracking-widest text-ivory"
        >
          Aroma<span className="text-gold">IQ</span>
        </Link>
        <p className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-ivory-muted">
          Admin
        </p>
        <nav className="mt-10 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 font-body text-sm text-ivory-muted transition hover:bg-gold/10 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/shop"
          className="mt-auto pt-8 font-body text-xs uppercase tracking-wider text-gold/80 hover:text-gold"
        >
          ← Back to shop
        </Link>
      </aside>
      <div className="min-w-0 flex-1 overflow-x-auto p-6 md:p-10">{children}</div>
    </div>
  );
}
