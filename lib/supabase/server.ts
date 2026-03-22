import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service role client — API routes / server only. Bypasses RLS.
 * Never import this file from client components.
 *
 * `global.fetch` uses `cache: "no-store"` because Next.js otherwise caches
 * outbound fetches to Supabase REST, which can freeze an empty `products` list.
 *
 * Prefer `SUPABASE_URL` in .env (same value as NEXT_PUBLIC_SUPABASE_URL) so the
 * server URL is not compile-inlined; `NEXT_PUBLIC_*` is still accepted as fallback.
 */
export function createServiceClient(): SupabaseClient {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!url || !key) {
    throw new Error(
      "Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY in .env, then restart `next dev`."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });
}
