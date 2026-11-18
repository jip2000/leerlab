/** Kleine hulpjes voor de serverfuncties: CORS (de website staat op een ander adres) en JSON-antwoorden. */
export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/** Verplichte instelling (secret) ophalen, met een duidelijke fout als hij ontbreekt. */
export function env(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Instelling ${name} ontbreekt. Zie docs/stappenplan.md.`);
  return v;
}

/** Adres van de site, altijd met een / aan het eind. */
export const siteUrl = () => env('SITE_URL').replace(/\/?$/, '/');
