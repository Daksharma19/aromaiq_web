"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const returnUrl = searchParams.get("returnUrl") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }
      setUser(data.user);
      router.push(returnUrl);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-body text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gold/25 bg-obsidian/50 px-3 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gold/25 bg-obsidian/50 py-3 pl-3 pr-11 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ivory-muted transition-colors hover:bg-gold/10 hover:text-ivory"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gold py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
      <p className="text-center font-body text-sm text-ivory-muted">
        No account?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
