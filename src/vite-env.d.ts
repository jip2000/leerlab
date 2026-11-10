/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Naam van je GoatCounter-site (bezoekersteller). */
  readonly VITE_GOATCOUNTER?: string;
  /** Supabase-project (inloggen en synchroniseren). */
  readonly VITE_SUPABASE_URL?: string;
  /** Publieke "anon"-sleutel van Supabase: mag in de site, de database is beveiligd met regels (RLS). */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** "true" = Plus-functies alleen voor abonnees. */
  readonly VITE_PLUS_AAN?: string;
}
