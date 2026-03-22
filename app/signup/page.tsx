import { Suspense } from "react";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

function SignupCard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gold/15 bg-shop-surface p-8 shadow-xl dark:bg-obsidian-light/40">
        <Link
          href="/"
          className="block text-center font-display text-2xl tracking-widest text-ivory"
        >
          Aroma<span className="text-gold">IQ</span>
        </Link>
        <p className="mt-2 text-center font-body text-sm text-ivory-muted">
          Create your account
        </p>
        <Suspense
          fallback={<p className="mt-8 text-center text-ivory-muted">Loading…</p>}
        >
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return <SignupCard />;
}
