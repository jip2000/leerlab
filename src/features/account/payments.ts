/**
 * Betalen met Stripe. De website praat niet zelf met Stripe: dat doen de serverfuncties
 * in supabase/functions (plus-betalen, plus-beheren). Die geven een adres terug waar we heen gaan.
 */
import { supabase } from '@/lib/supabase';

async function naar(functie: 'plus-betalen' | 'plus-beheren', body?: object): Promise<string | null> {
  if (!supabase) return 'Inloggen is nog niet ingesteld.';
  const { data, error } = await supabase.functions.invoke<{ url?: string; error?: string }>(functie, { body: body ?? {} });
  if (error || !data?.url) return data?.error ?? 'Dat lukt nu even niet. Probeer het later opnieuw.';
  location.assign(data.url);
  return null;
}

/** Naar de betaalpagina van Stripe. Geeft een foutmelding terug als het niet lukt. */
export const naarBetalen = (periode: 'maand' | 'jaar') => naar('plus-betalen', { periode });

/** Naar de klantenpagina van Stripe: opzeggen, betaalgegevens, facturen. */
export const naarAbonnementBeheren = () => naar('plus-beheren');
