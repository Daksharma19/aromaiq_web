"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const returnUrl = searchParams.get("returnUrl") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          mobile: mobile || null,
          age: age === "" ? null : Number(age),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account");
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
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-body text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <div>
        <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted">
          Full name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gold/25 bg-obsidian/50 px-3 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gold/25 bg-obsidian/50 px-3 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted">
          Mobile
        </label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full rounded-lg border border-gold/25 bg-obsidian/50 px-3 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted">
          Age
        </label>
        <input
          type="number"
          min={1}
          max={120}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full rounded-lg border border-gold/25 bg-obsidian/50 px-3 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>
      <div>
        <label
          htmlFor="signup-password"
          className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gold/25 bg-obsidian/50 py-2.5 pl-3 pr-11 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
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
      <div>
        <label
          htmlFor="signup-confirm"
          className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ivory-muted"
        >
          Confirm password
        </label>
        <div className="relative">
          <input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-gold/25 bg-obsidian/50 py-2.5 pl-3 pr-11 font-body text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ivory-muted transition-colors hover:bg-gold/10 hover:text-ivory"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            aria-pressed={showConfirm}
          >
            {showConfirm ? (
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
        className="mt-2 w-full rounded-lg bg-gold py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-obsidian transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create Account"}
      </button>
      <p className="text-center font-body text-sm text-ivory-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
