/**
 * Canonical site URL, used for absolute share links and Open Graph metadata.
 *
 * Precedence:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override (custom domain).
 *  2. Vercel's auto-injected production / deployment URL (no config needed).
 *  3. localhost for local development.
 *
 * Note: client-side share buttons additionally prefer `window.location.href`
 * at runtime, so shared links are always correct for the current domain.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
