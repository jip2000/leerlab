/**
 * STRIPE-WEBHOOK: Stripe meldt hier betalingen, verlengingen en opzeggingen.
 * Wij zetten dan in de database plan = 'plus' of weer 'gratis'.
 * Deze functie moet zonder inlogcontrole draaien (Stripe heeft geen account bij ons);
 * daarom controleren we de handtekening van Stripe (STRIPE_WEBHOOK_SECRET).
 */
import Stripe from 'npm:stripe@17.7.0';
import { admin, stripe } from '../_shared/clients.ts';
import { env } from '../_shared/http.ts';
import { planVanAbonnement } from '../_shared/abonnement.ts';

const crypto = Stripe.createSubtleCryptoProvider();

async function verwerk(sub: Stripe.Subscription) {
  const db = admin();
  // In nieuwere Stripe-versies staat het einde van de periode bij de regels van het abonnement.
  const item = sub.items?.data?.[0] as (Stripe.SubscriptionItem & { current_period_end?: number }) | undefined;
  const periodeEinde = (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end ?? item?.current_period_end;
  const { plan, plus_tot } = planVanAbonnement({ status: sub.status, periodeEinde });
  const klant = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const userId = sub.metadata?.user_id;
  const update = { plan, plus_tot, stripe_customer_id: klant, stripe_subscription_id: sub.id };
  const q = userId ? db.from('profiles').update(update).eq('id', userId) : db.from('profiles').update(update).eq('stripe_customer_id', klant);
  const { error } = await q;
  if (error) throw error;
  console.log(`abonnement ${sub.id}: ${sub.status} → ${plan}`);
}

Deno.serve(async (req) => {
  const handtekening = req.headers.get('stripe-signature');
  if (!handtekening) return new Response('Geen handtekening', { status: 400 });
  const body = await req.text();
  const s = stripe();
  let event: Stripe.Event;
  try {
    event = await s.webhooks.constructEventAsync(body, handtekening, env('STRIPE_WEBHOOK_SECRET'), undefined, crypto);
  } catch (e) {
    console.error('Ongeldige handtekening', e);
    return new Response('Ongeldige handtekening', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sessie = event.data.object;
        if (sessie.mode === 'subscription' && sessie.subscription) {
          const id = typeof sessie.subscription === 'string' ? sessie.subscription : sessie.subscription.id;
          await verwerk(await s.subscriptions.retrieve(id));
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await verwerk(event.data.object);
        break;
      default:
        break; // andere meldingen hebben we niet nodig
    }
    return new Response(JSON.stringify({ ontvangen: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    // 500 → Stripe probeert het later automatisch opnieuw.
    return new Response('Fout bij verwerken', { status: 500 });
  }
});
