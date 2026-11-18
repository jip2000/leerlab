import { describe, expect, it } from 'vitest';
import { planVanAbonnement, SPEELRUIMTE_DAGEN } from '../../supabase/functions/_shared/abonnement';

describe('Stripe-abonnement → plan', () => {
  const einde = Date.UTC(2027, 0, 31) / 1000;
  it('actief abonnement = Plus tot het einde van de periode (+ speelruimte)', () => {
    const r = planVanAbonnement({ status: 'active', periodeEinde: einde });
    expect(r.plan).toBe('plus');
    expect(new Date(r.plus_tot!).getTime()).toBe((einde + SPEELRUIMTE_DAGEN * 86400) * 1000);
  });
  it('proefperiode en mislukte betaling (nog even) ook Plus', () => {
    expect(planVanAbonnement({ status: 'trialing', periodeEinde: einde }).plan).toBe('plus');
    expect(planVanAbonnement({ status: 'past_due', periodeEinde: einde }).plan).toBe('plus');
  });
  it('opgezegd, gestopt of nooit betaald = gratis', () => {
    for (const status of ['canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused']) {
      expect(planVanAbonnement({ status, periodeEinde: einde })).toEqual({ plan: 'gratis', plus_tot: null });
    }
  });
});
