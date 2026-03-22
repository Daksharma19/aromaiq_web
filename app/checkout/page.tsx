import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-ivory text-obsidian transition-colors dark:bg-obsidian dark:text-ivory">
      <div className="mx-auto max-w-lg px-6 pb-24 pt-10 md:pt-14 text-center">
        <h1 className="font-display text-4xl font-light italic text-obsidian dark:text-ivory md:text-5xl">
          Checkout
        </h1>
        <p className="mt-6 font-body text-sm leading-relaxed text-neutral-600 dark:text-ivory-muted">
          Secure payment (e.g. Razorpay) will plug in here. For now, review your
          cart and complete your order when checkout is enabled.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/cart"
            className="inline-flex justify-center rounded-lg border border-gold bg-gold/10 px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold/20"
          >
            Back to cart
          </Link>
          <Link
            href="/shop"
            className="inline-flex justify-center rounded-lg border border-gold/35 px-8 py-3 font-body text-sm font-medium text-gold transition-colors hover:border-gold/55 hover:bg-gold/5"
          >
            Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
