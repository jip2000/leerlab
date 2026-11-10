/**
 * Verbinding met Supabase (inloggen + synchroniseren).
 * Staat alleen aan als VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY zijn ingesteld.
 * De "anon key" is openbaar bedoeld; de database is beveiligd met Row Level Security
 * (zie supabase/schema.sql). Zet hier NOOIT de "service_role"-sleutel.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } }) : null;

export const accountsConfigured = !!supabase;

/**
 * Na klikken op de link in een bevestigings- of wachtwoordmail komt de gebruiker terug met
 * "#access_token=…" in het adres. Dat botst met onze #/-pagina's, dus: eerst Supabase het laten
 * verwerken, daarna netjes naar de accountpagina.
 */
export async function handleAuthRedirect(): Promise<void> {
  const h = location.hash;
  if (!supabase || !/access_token=|error_description=/.test(h)) return;
  const recovery = /type=recovery/.test(h);
  const error = /error_description=([^&]+)/.exec(h)?.[1];
  await supabase.auth.getSession(); // verwerkt de tokens uit het adres
  history.replaceState(null, '', `${location.pathname}#/account${recovery ? '?nieuw-wachtwoord=1' : error ? `?fout=${error}` : ''}`);
}
