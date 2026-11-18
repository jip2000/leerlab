# Stappenplan: naam, inloggen, live zetten en betalen

Woordwerk werkt nu al, gratis en zonder account. Met deze stappen zet je de rest aan.
De code is klaar: jij maakt alleen accounts aan en plakt sleutels op de goede plek.
Doe de delen **op volgorde**. Elk deel kun je los afmaken en later verder.

| Deel | Wat | Tijd |
|---|---|---|
| 1 | Naam veranderen naar *woordwerk* | 2 min |
| 2 | Inloggen aanzetten (Supabase) | 15 min |
| 3 | Verhuizen naar Cloudflare (nodig voor betalen) | 15 min |
| 4 | Betalen met Stripe | 30 min |
| 5 | Zakelijk regelen (KvK, voorwaarden) | buiten de computer |

> **Twee soorten sleutels.** Een *variabele* mag iedereen zien (zoals een adres).
> Een *secret* is geheim (zoals een wachtwoord): die zet je nooit in de code of in een chat,
> alleen op de plekken die hieronder staan.

**Waar zet je iets op GitHub?** Ga naar je repository → **Settings** → links
**Secrets and variables** → **Actions**. Daar zijn twee tabbladen: **Secrets** en **Variables**.
Klik op **New repository secret** of **New repository variable**.

---

## Deel 1: Naam veranderen (2 minuten)

1. Ga naar **https://github.com/jip2000/leerlab** → **Settings** (bovenaan).
2. Bij **Repository name**: typ `woordwerk` en klik **Rename**.
3. Ga naar **Actions** → links **Publiceren** → **Run workflow** → **Run workflow**.
4. Na ± 1 minuut staat de site op **https://jip2000.github.io/woordwerk/**.

Let op: het oude adres (`…/leerlab/`) werkt daarna niet meer. Heb je dat ergens gedeeld? Pas het daar aan.

---

## Deel 2: Inloggen aanzetten (Supabase, 15 minuten)

Inloggen is **optioneel**: wie geen account wil, gebruikt Woordwerk gewoon zoals nu.
Met een account staan je lijsten en voortgang op al je apparaten. Voor Plus (betalen) is een account wél nodig.

### 2a. Project maken
1. Ga naar **https://supabase.com** → **Start your project** → log in met GitHub.
2. **New project**:
   - Name: `woordwerk`
   - Database password: kies een sterk wachtwoord en **bewaar het** (bijv. in een wachtwoordmanager)
   - Region: **Central EU (Frankfurt)** (gegevens in de EU, belangrijk voor de privacywet)
   - Plan: **Free**
3. Wacht ± 2 minuten tot het project klaar is.

### 2b. Database inrichten
1. Links: **SQL Editor** → **New query**.
2. Open in je repository het bestand **`supabase/schema.sql`**, kopieer alles en plak het in de editor.
3. Klik **Run**. Je ziet "Success".

### 2c. Inlog-instellingen
1. Links: **Authentication** → **URL Configuration**:
   - **Site URL**: `https://jip2000.github.io/woordwerk/`
   - **Redirect URLs** → **Add URL**: `https://jip2000.github.io/woordwerk/`
2. **Authentication** → **Sign In / Providers** → **Email**: laat **Enable** en **Confirm email** aan.

### 2d. Sleutels naar GitHub
1. In Supabase: **Project Settings** (tandwiel) → **API Keys** (of **Data API**). Kopieer:
   - de **Project URL** (zoiets als `https://abcdefgh.supabase.co`)
   - de **anon / publishable key**
   - ⚠️ Nooit de `service_role` / `secret` key gebruiken in de website.
2. Op GitHub, tabblad **Variables**:
   - `VITE_SUPABASE_URL` = de Project URL
   - `VITE_SUPABASE_ANON_KEY` = de anon / publishable key
3. **Actions** → **Publiceren** → **Run workflow**.

### 2e. Testen
1. Open de site → **Meer** → **Account** → **Account maken**.
2. Klik op de link in de bevestigingsmail (kijk ook bij spam).
3. Log op een ander apparaat in: je lijsten staan daar ook.

Accounts zie je in Supabase bij **Authentication** → **Users**.

> Tip: Supabase mag gratis maar een paar mails per uur sturen. Bij veel aanmeldingen:
> **Authentication** → **Emails** → **SMTP Settings** → een maildienst instellen (bijv. Resend, gratis tot 3.000 mails per maand).

---

## Deel 3: Verhuizen naar Cloudflare (15 minuten)

**Waarom?** GitHub Pages is gratis, maar **niet toegestaan voor een betaalde dienst**.
Cloudflare Pages is ook gratis, mag wel commercieel, en is snel in heel Europa.
Je code blijft gewoon op GitHub: Cloudflare bouwt de site automatisch bij elke wijziging.

1. Ga naar **https://dash.cloudflare.com/sign-up** en maak een gratis account.
2. Links: **Workers & Pages** → **Create** → tabblad **Pages** → **Connect to Git**.
3. Kies **GitHub**, geef toegang tot de repository **woordwerk** en kies hem.
4. Instellingen:
   - Project name: `woordwerk` (je site wordt dan **https://woordwerk.pages.dev**)
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Open **Environment variables** en voeg toe (dezelfde waarden als op GitHub):
   - `NODE_VERSION` = `22`
   - `VITE_SITE_URL` = `https://woordwerk.pages.dev/`
   - `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` (uit deel 2)
   - `VITE_GOATCOUNTER` (alleen als je de bezoekersteller gebruikt)
6. **Save and Deploy**. Na ± 2 minuten staat de site op het nieuwe adres.
7. Nieuw adres doorgeven:
   - **Supabase** → **Authentication** → **URL Configuration**: Site URL én Redirect URL op `https://woordwerk.pages.dev/`
   - **GitHub** → Variables: `VITE_SITE_URL` = `https://woordwerk.pages.dev/`
8. GitHub Pages uitzetten: GitHub → **Actions** → links **Publiceren** → rechtsboven **…** → **Disable workflow**.
   Daarna **Settings** → **Pages** → **Unpublish site** (als die knop er staat).

> Eigen domein (bijv. `woordwerk.nl`)? In Cloudflare: je project → **Custom domains**.
> Pas daarna `VITE_SITE_URL` en de Supabase-adressen aan naar je eigen domein.

---

## Deel 4: Betalen met Stripe (30 minuten)

Zo werkt het: iemand klikt op **Plus** → betaalt bij Stripe (iDEAL of creditcard) → Stripe meldt het
aan Supabase → die zet het account op **Plus**. Bij opzeggen gaat het vanzelf terug naar gratis
(aan het einde van de betaalde periode). Klanten zeggen zelf op via **Abonnement beheren**.

Begin in de **testomgeving** van Stripe: daar betaal je met nepgeld. Pas als alles werkt, ga je live (4h).

### 4a. Stripe-account
1. Ga naar **https://dashboard.stripe.com/register**, land **Nederland**.
2. Zorg dat bovenaan **Testmodus** / **Sandbox** aan staat.

### 4b. Product en prijzen
1. **Productcatalogus** → **+ Product toevoegen**:
   - Naam: `Woordwerk Plus`
   - Prijs 1: **€2,99**, **Terugkerend**, **Maandelijks**
   - Klik **Nog een prijs toevoegen** → Prijs 2: **€19,99**, **Terugkerend**, **Jaarlijks**
2. Opslaan. Klik op elke prijs en kopieer de **prijs-ID** (begint met `price_`).

Andere prijzen? Prima, pas dan ook `PRIJS` aan in `src/lib/plan.ts` (of vraag het mij).

### 4c. Betaalmethodes en klantenportaal
1. **Instellingen** → **Betaalmethoden**: zet **iDEAL** en **SEPA-incasso** aan (voor abonnementen met iDEAL).
2. **Instellingen** → **Billing** → **Klantenportaal**: klik **Activeren**. Zet **Abonnementen opzeggen** aan.

### 4d. Supabase-gegevens voor de koppeling
1. In Supabase: **Project Settings** → **General** → kopieer de **Project ID** (bijv. `abcdefgh`).
2. Ga naar **https://supabase.com/dashboard/account/tokens** → **Generate new token** → naam `github` → kopieer het token.

### 4e. Webhook (Stripe meldt betalingen aan Supabase)
1. Stripe → **Developers** (of **Ontwikkelaars**) → **Webhooks** → **+ Eindpunt toevoegen**.
2. Eindpunt-URL: `https://<Project ID>.supabase.co/functions/v1/stripe-webhook`
   (vul je eigen Project ID in uit 4d).
3. Gebeurtenissen kiezen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Opslaan. Klik op **Ondertekeningsgeheim weergeven** en kopieer het (begint met `whsec_`).

### 4f. Alles in GitHub zetten
1. Stripe → **Developers** → **API-sleutels** → kopieer de **Geheime sleutel** (begint met `sk_test_`).
2. GitHub, tabblad **Secrets** (geheim!):
   - `SUPABASE_ACCESS_TOKEN` = het token uit 4d
   - `STRIPE_SECRET_KEY` = de geheime sleutel (`sk_test_…`)
   - `STRIPE_WEBHOOK_SECRET` = het ondertekeningsgeheim (`whsec_…`)
3. GitHub, tabblad **Variables**:
   - `SUPABASE_PROJECT_REF` = de Project ID uit 4d
   - `STRIPE_PRIJS_MAAND` = de `price_…` van €2,99
   - `STRIPE_PRIJS_JAAR` = de `price_…` van €19,99
4. Supabase → **SQL Editor**: plak **`supabase/schema.sql`** nog een keer en klik **Run**
   (dat voegt twee kolommen voor Stripe toe; je oude gegevens blijven staan).
5. GitHub → **Actions** → links **Betalen (Supabase-functies)** → **Run workflow**.
   Wordt het groen? Dan staan de functies klaar.

### 4g. Plus aanzetten en testen
1. Cloudflare → je project → **Settings** → **Environment variables** → `VITE_PLUS_AAN` = `true`
   → daarna **Deployments** → **Retry deployment** (of maak een kleine wijziging).
2. Open de site, log in, ga naar **Plus** en kies een prijs.
3. Betaal met de testkaart **4242 4242 4242 4242**, een datum in de toekomst, CVC `123`.
4. Je komt terug op Woordwerk: vuurwerk en **"Je hebt nu Woordwerk Plus"**.
5. Klik **Abonnement beheren of opzeggen** → zeg op → na het einde van de periode is het weer gratis.

Werkt iets niet? Kijk in Supabase → **Edge Functions** → `stripe-webhook` → **Logs**, of in
Stripe → **Webhooks** → je eindpunt (daar zie je of de melding aankwam).

### 4h. Live gaan (echt geld)
1. Doe eerst deel 5.
2. Zet in Stripe **Testmodus uit** en doe **4b, 4c en 4e opnieuw** (live heeft eigen prijzen en een eigen webhook).
3. Vervang op GitHub de secrets `STRIPE_SECRET_KEY` (`sk_live_…`) en `STRIPE_WEBHOOK_SECRET`,
   en de variabelen `STRIPE_PRIJS_MAAND` en `STRIPE_PRIJS_JAAR`.
4. **Actions** → **Betalen (Supabase-functies)** → **Run workflow**.

**Iemand gratis Plus geven?** Supabase → **Table Editor** → `profiles` → zet `plan` op `plus`
(en `plus_tot` leeg = voor altijd).

---

## Deel 5: Zakelijk regelen

Dit moet je voordat je echt geld vraagt:

1. **KvK**: inschrijven als eenmanszaak (± €82, online). Ben je jonger dan 18? Dan heb je toestemming van je ouders nodig.
2. **Btw**: met de **kleineondernemersregeling (KOR)** reken je geen btw onder €20.000 omzet per jaar. Aanmelden bij de Belastingdienst.
3. **Zakelijke bankrekening** (bijv. bunq, Knab of je eigen bank). Die vul je in bij Stripe voor uitbetalingen.
4. **Teksten**: algemene voorwaarden en een privacyverklaring met je contactgegevens
   (de pagina Privacy staat er al; die vullen we samen aan).
5. **Bezoekersteller**: GoatCounter is gratis voor niet-commerciële sites. Ga je geld vragen, stap dan over
   op **Cloudflare Web Analytics** (gratis, ook commercieel). Zeg het, dan zet ik dat om.

### Wat is gratis en wat is Plus? (aan te passen in `src/lib/plan.ts`)
| Gratis | Plus |
|---|---|
| Lijsten maken, plakken, delen | Foto scannen → flitskaartjes |
| Alle oefenmodi | Werkwoordtrainer |
| Streak, XP, badges | Alle grammatica-oefeningen (gratis: eerste 2 per taal) |
| Grammatica-uitleg | Planner, slim herhalen, statistiek-grafieken |

---

## Hoeveel mensen kunnen Woordwerk gebruiken?

Heel veel. De site draait in de browser van de bezoeker zelf; de server stuurt alleen de bestanden.

| Onderdeel | Grens (gratis) | Betekent |
|---|---|---|
| Cloudflare Pages | onbeperkt dataverkeer | geen zorgen |
| Supabase Free | 50.000 actieve accounts per maand, 500 MB | ruim genoeg om mee te beginnen |
| Stripe | geen vaste kosten | ± 1,5% + €0,25 per betaling (iDEAL: ± €0,29) |
