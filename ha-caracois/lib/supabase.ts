import { createClient } from "@supabase/supabase-js";

// The Supabase project URL and the *publishable/anon* key are designed to be
// shipped to the browser — they are safe to expose. Access is protected by
// Row Level Security on `caracois_spots` (public read + insert only).
// Env vars take precedence so the values can be overridden / rotated without a
// code change; the baked-in defaults let the app build & run on a fresh Vercel
// project without any manual env configuration.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://wmjbifxydtgkpchqcqou.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_y8NBkx3QA54Ex1G-yheKWQ_D6at11zm";

export const supabase = createClient(url, key);
