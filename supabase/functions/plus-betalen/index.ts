/**
 * PLUS-BETALEN: maakt een betaalpagina bij Stripe en geeft het adres terug.
 * De website stuurt { periode: 'maand' | 'jaar' } mee; je moet ingelogd zijn.
 */
import { admin, ingelogdeGebruiker, stripe, stripeKlant } from '../_shared/clients.ts';
import { cors, env, json, siteUrl } from '../_shared/http.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const db = admin();
    const user = await ingelogdeGebruiker(req, db);
    if (!user) return json({ error: 'Log eerst in met je account.' }, 401);
    const { periode } = await req.json().catch(() => ({ periode: 'maand' }));
    const prijs = env(periode === 'jaar' ? 'STRIPE_PRIJS_JAAR' : 'STRIPE_PRIJS_MAAND');

    const s = stripe();
    const sessie = await s.checkout.sessions.create({
      mode: 'subscription',
      customer: await stripeKlant(s, db, user),
      client_reference_id: user.id,
      line_items: [{ price: prijs, quantity: 1 }],
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
      locale: 'nl',
      success_url: `${siteUrl()}#/plus?betaald=1`,
      cancel_url: `${siteUrl()}#/plus`,
    });
    return json({ url: sessie.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Betalen lukt nu even niet. Probeer het later opnieuw.' }, 500);
  }
});
