import Stripe from 'npm:stripe@17.7.0';
import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2.49.4';
import { env } from './http.ts';

export const stripe = () => new Stripe(env('STRIPE_SECRET_KEY'), { httpClient: Stripe.createFetchHttpClient() });

/** Supabase met volledige rechten. Alleen op de server gebruiken, nooit in de website. */
export const admin = (): SupabaseClient => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });

/** Wie roept deze functie aan? (De website stuurt de inlogcode mee.) */
export async function ingelogdeGebruiker(req: Request, db: SupabaseClient): Promise<User | null> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  return data.user ?? null;
}

/** Stripe-klant bij een gebruiker: bestaande opzoeken of een nieuwe maken. */
export async function stripeKlant(s: Stripe, db: SupabaseClient, user: User): Promise<string> {
  const { data } = await db.from('profiles').select('stripe_customer_id').eq('id', user.id).maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id;
  const klant = await s.customers.create({ email: user.email, metadata: { user_id: user.id } });
  await db.from('profiles').upsert({ id: user.id, stripe_customer_id: klant.id });
  return klant.id;
}
