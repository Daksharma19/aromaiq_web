/**
 * Next/Image remotePatterns only include this project's Supabase Storage.
 * External URLs (Amazon, etc.) must use <img> to avoid hostname errors.
 */
export function isSupabaseStoragePublicUrl(src: string | null | undefined): boolean {
  if (!src) return false;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  try {
    const u = new URL(src);
    const b = new URL(base);
    return (
      u.hostname === b.hostname &&
      u.pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
