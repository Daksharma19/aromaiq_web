"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useProfileStore, initialsFromName } from "@/lib/profile-store";

type Tab = "orders" | "profile";

type DemoOrder = {
  id: string;
  date: string;
  product: string;
  status: "Delivered" | "Processing" | "Shipped";
  price: string;
};

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "ORD-AI7-9241",
    date: "12 Jan 2025",
    product: "Full Kit",
    status: "Delivered",
    price: "₹7,999",
  },
  {
    id: "ORD-AI7-8802",
    date: "3 Feb 2025",
    product: "Sleep Pack",
    status: "Shipped",
    price: "₹1,299",
  },
  {
    id: "ORD-AI7-9012",
    date: "18 Feb 2025",
    product: "Starter Kit",
    status: "Processing",
    price: "₹4,999",
  },
];

function statusPillClass(status: DemoOrder["status"]) {
  switch (status) {
    case "Delivered":
      return "border-gold/50 bg-gold/15 text-gold-light";
    case "Shipped":
      return "border-gold/40 bg-gold/10 text-gold";
    default:
      return "border-gold/35 bg-gold/8 text-gold-muted";
  }
}

type ProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders] = useState<DemoOrder[]>(DEMO_ORDERS);

  const fullName = useProfileStore((s) => s.fullName);
  const email = useProfileStore((s) => s.email);
  const phone = useProfileStore((s) => s.phone);
  const city = useProfileStore((s) => s.city);
  const setProfile = useProfileStore((s) => s.setProfile);

  const [draft, setDraft] = useState({
    fullName,
    email,
    phone,
    city,
  });

  const [editing, setEditing] = useState(false);

  const syncDraftFromStore = () => {
    setDraft({ fullName, email, phone, city });
  };

  useEffect(() => {
    if (!open) setEditing(false);
  }, [open]);

  useEffect(() => {
    if (!editing) {
      setDraft({ fullName, email, phone, city });
    }
  }, [fullName, email, phone, city, editing]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const initials = useMemo(() => initialsFromName(fullName), [fullName]);

  const inputClass =
    "w-full rounded-lg border border-gold/25 bg-obsidian/50 px-3 py-2.5 font-body text-sm text-ivory placeholder:text-ivory-muted/50 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30";

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close profile"
            className="fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-drawer-title"
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-gold/15 bg-obsidian shadow-[-12px_0_48px_rgba(0,0,0,0.5)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
              <h2
                id="profile-drawer-title"
                className="font-display text-xl font-light italic text-ivory"
              >
                Account
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ivory-muted transition-colors hover:bg-gold/10 hover:text-ivory"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex border-b border-gold/10 px-2">
              {(
                [
                  { id: "orders" as const, label: "Orders" },
                  { id: "profile" as const, label: "Profile" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-3 font-body text-sm uppercase tracking-[0.15em] transition-colors ${
                    tab === t.id
                      ? "border-b-2 border-gold text-gold"
                      : "border-b-2 border-transparent text-ivory-muted hover:text-ivory"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              {tab === "orders" ? (
                <div>
                  <h3 className="font-display text-2xl font-light italic text-ivory">
                    Your Orders
                  </h3>

                  {orders.length === 0 ? (
                    <p className="mt-8 font-body text-sm leading-relaxed text-ivory-muted">
                      No orders yet. Start with a kit.
                    </p>
                  ) : (
                    <ul className="mt-6 space-y-4">
                      {orders.map((o) => (
                        <li
                          key={o.id}
                          className="rounded-xl border border-gold/12 bg-obsidian-light/50 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-body text-xs uppercase tracking-wider text-gold-muted">
                                {o.id}
                              </p>
                              <p className="mt-1 font-body text-xs text-ivory-muted">
                                {o.date}
                              </p>
                            </div>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 font-body text-[10px] font-medium uppercase tracking-wider ${statusPillClass(o.status)}`}
                            >
                              {o.status}
                            </span>
                          </div>
                          <p className="mt-3 font-display text-lg font-light text-ivory">
                            {o.product}
                          </p>
                          <p className="mt-2 font-display text-lg text-gold">
                            {o.price}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-obsidian-light/40 font-display text-2xl text-ivory"
                    aria-hidden
                  >
                    {initials}
                  </div>

                  <div className="mt-8 w-full space-y-4">
                    <div>
                      <label
                        htmlFor="pf-name"
                        className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
                      >
                        Full Name
                      </label>
                      {editing ? (
                        <input
                          id="pf-name"
                          value={draft.fullName}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, fullName: e.target.value }))
                          }
                          className={inputClass}
                        />
                      ) : (
                        <p className="rounded-lg border border-transparent px-3 py-2.5 font-body text-sm text-ivory">
                          {fullName || "—"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="pf-email"
                        className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
                      >
                        Email
                      </label>
                      {editing ? (
                        <input
                          id="pf-email"
                          type="email"
                          value={draft.email}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, email: e.target.value }))
                          }
                          className={inputClass}
                        />
                      ) : (
                        <p className="rounded-lg border border-transparent px-3 py-2.5 font-body text-sm text-ivory">
                          {email || "—"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="pf-phone"
                        className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
                      >
                        Phone
                      </label>
                      {editing ? (
                        <input
                          id="pf-phone"
                          type="tel"
                          value={draft.phone}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, phone: e.target.value }))
                          }
                          className={inputClass}
                        />
                      ) : (
                        <p className="rounded-lg border border-transparent px-3 py-2.5 font-body text-sm text-ivory">
                          {phone || "—"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="pf-city"
                        className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
                      >
                        City
                      </label>
                      {editing ? (
                        <input
                          id="pf-city"
                          value={draft.city}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, city: e.target.value }))
                          }
                          className={inputClass}
                        />
                      ) : (
                        <p className="rounded-lg border border-transparent px-3 py-2.5 font-body text-sm text-ivory">
                          {city || "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (editing) {
                        setProfile({
                          fullName: draft.fullName,
                          email: draft.email,
                          phone: draft.phone,
                          city: draft.city,
                        });
                        setEditing(false);
                      } else {
                        syncDraftFromStore();
                        setEditing(true);
                      }
                    }}
                    className={
                      editing
                        ? "mt-8 w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90"
                        : "mt-8 w-full rounded-lg border border-gold/35 bg-transparent py-3 font-body text-sm font-medium text-gold transition-colors hover:border-gold/55 hover:bg-gold/5"
                    }
                  >
                    {editing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
