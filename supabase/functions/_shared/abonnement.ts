/**
 * Van een Stripe-abonnement naar ons eigen plan ('gratis' of 'plus').
 * Geen imports, zodat de website-tests dit ook kunnen controleren.
 */
export type Plan = 'gratis' | 'plus';

/** Statussen waarbij iemand Plus heeft. 'past_due' = betaling mislukt, Stripe probeert het nog even opnieuw. */
const ACTIEF = ['active', 'trialing', 'past_due'];

/** Extra dagen na het einde van de betaalde periode, voor als de verlenging net iets later binnenkomt. */
export const SPEELRUIMTE_DAGEN = 2;

export interface AbonnementInfo {
  status: string;
  /** Einde van de betaalde periode (Unix-seconden), zoals Stripe het geeft. */
  periodeEinde?: number | null;
}

export function planVanAbonnement(a: AbonnementInfo): { plan: Plan; plus_tot: string | null } {
  if (!ACTIEF.includes(a.status)) return { plan: 'gratis', plus_tot: null };
  if (!a.periodeEinde) return { plan: 'plus', plus_tot: null };
  const tot = new Date((a.periodeEinde + SPEELRUIMTE_DAGEN * 86400) * 1000);
  return { plan: 'plus', plus_tot: tot.toISOString() };
}
