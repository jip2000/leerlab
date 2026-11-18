/**
 * PLUS-BEHEREN: opent de klantenpagina van Stripe. Daar kun je opzeggen,
 * je betaalgegevens wijzigen en facturen downloaden.
 */
import { admin, ingelogdeGebruiker, stripe, stripeKlant } from '../_shared/clients.ts';
import { cors, json, siteUrl } from '../_shared/http.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const db = admin();
    const user = await ingelogdeGebruiker(req, db);
    if (!user) return json({ error: 'Log eerst in met je account.' }, 401);
    const s = stripe();
    const sessie = await s.billingPortal.sessions.create({ customer: await stripeKlant(s, db, user), return_url: `${siteUrl()}#/account`, locale: 'nl' });
    return json({ url: sessie.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Dat lukt nu even niet. Probeer het later opnieuw.' }, 500);
  }
});
