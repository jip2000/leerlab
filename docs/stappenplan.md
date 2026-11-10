# Stappenplan: teller, inloggen en (later) betalen

Woordwerk werkt nu al zonder deze stappen. Pas als je ze doet, komen de teller en het
inloggen aan. Je hoeft **niets in de code** te veranderen: je zet alleen een paar
instellingen ("variabelen") op GitHub, en daarna bouwt GitHub de site opnieuw.

---

## Deel 1: Bezoekersteller (GoatCounter), ± 5 minuten

1. Ga naar **https://www.goatcounter.com** en kies **Sign up**.
2. Vul bij **Code** een korte naam in, bijvoorbeeld `woordwerk`. Je dashboard wordt dan
   `https://woordwerk.goatcounter.com`.
3. Vul je e-mailadres en een wachtwoord in en bevestig je e-mail.
4. Ga naar je repository op GitHub: **https://github.com/jip2000/leerlab**
   → **Settings** → **Secrets and variables** → **Actions** → tabblad **Variables**
   → **New repository variable**:
   - Name: `VITE_GOATCOUNTER`
   - Value: `woordwerk` (de code uit stap 2, zonder `.goatcounter.com`)
5. Ga naar **Actions** → **Publiceren** → **Run workflow** → **Run workflow**.
   Na ± 1 minuut staat de nieuwe versie online.

**Waar zie je bezoekers?** Op `https://woordwerk.goatcounter.com`: bezoekers per dag,
welke pagina's, welke landen, telefoon of laptop. Er worden geen cookies gebruikt, dus je
hebt geen cookie-melding nodig. Bezoekers kunnen het meetellen uitzetten bij Instellingen.

> Let op: GoatCounter is gratis voor niet-commercieel gebruik. Ga je geld vragen (Plus),
> kies dan een betaald GoatCounter-abonnement of stap over op Cloudflare Web Analytics
> (gratis, ook commercieel). Zeg het, dan zet ik dat om.

---

## Deel 2: Inloggen met een account (Supabase), ± 15 minuten

### 2a. Project maken
1. Ga naar **https://supabase.com** → **Start your project** → log in (bijv. met GitHub).
2. **New project**:
   - Name: `woordwerk`
   - Database password: kies een sterk wachtwoord en **bewaar het goed** (bijv. in een wachtwoordmanager)
   - Region: **West EU (Ireland)** of **Central EU (Frankfurt)**: dan staan de gegevens in de EU (belangrijk voor de AVG)
   - Plan: **Free**
3. Wacht tot het project klaar is (± 2 minuten).

### 2b. Database inrichten
1. Klik links op **SQL Editor** → **New query**.
2. Open in je repository het bestand **`supabase/schema.sql`**, kopieer de hele inhoud en plak die in de editor.
3. Klik **Run**. Je ziet "Success". (Dit maakt de tabellen en de beveiliging, zodat iedereen alleen zijn eigen gegevens kan zien.)

### 2c. Inlog-instellingen
1. Links: **Authentication** → **URL Configuration**:
   - **Site URL**: `https://jip2000.github.io/leerlab/`
   - **Redirect URLs** → **Add URL**: `https://jip2000.github.io/leerlab/`
2. **Authentication** → **Sign In / Providers** → **Email**: laat **Enable** en **Confirm email** aan staan.

### 2d. Sleutels in GitHub zetten
1. In Supabase: **Project Settings** (tandwiel) → **API** (of **Data API** / **API Keys**). Kopieer:
   - de **Project URL** (iets als `https://abcdefgh.supabase.co`)
   - de **anon / publishable key** (een lange code)
   - ⚠️ Gebruik **nooit** de `service_role`/`secret` key in de website. Die geeft volledige toegang.
2. Op GitHub (zelfde plek als bij Deel 1) twee variabelen maken:
   - `VITE_SUPABASE_URL` = de Project URL
   - `VITE_SUPABASE_ANON_KEY` = de anon / publishable key
3. **Actions** → **Publiceren** → **Run workflow**.

### 2e. Testen
1. Open de site → **Meer** → **Account** → **Account maken**.
2. Klik op de link in de bevestigingsmail (kijk ook bij spam). Je komt terug op Woordwerk en bent ingelogd.
3. Log op een ander apparaat in met hetzelfde account: je lijsten verschijnen daar ook.

**Waar zie je de accounts?** In Supabase: **Authentication** → **Users**. Daar zie je hoeveel
mensen een account hebben en wanneer ze voor het laatst zijn ingelogd.

**Iemand (of jezelf) gratis Plus geven?** In Supabase: **Table Editor** → `profiles` → zoek
de gebruiker → zet `plan` op `plus`. (Dit doet straks de betaalkoppeling automatisch.)

> Tip: de gratis e-mail van Supabase mag maar een paar mails per uur sturen. Krijg je veel
> aanmeldingen, stel dan bij **Authentication** → **Emails** → **SMTP Settings** een
> maildienst in (bijv. Resend, gratis tot 3.000 mails per maand).

---

## Hoeveel mensen kunnen Woordwerk tegelijk gebruiken?

Heel veel: duizenden tegelijk. De site draait in de browser van de bezoeker zelf. GitHub
stuurt alleen de bestanden, en daarna werkt alles op hun eigen apparaat (zelfs offline).

| Onderdeel | Grens (gratis) | Wat betekent dat? |
|---|---|---|
| GitHub Pages | ± 100 GB dataverkeer per maand | ± 100.000 bezoeken per maand |
| Supabase Free | 50.000 actieve accounts per maand, 500 MB database | Ruim genoeg om mee te beginnen |
| GoatCounter | Gratis voor niet-commercieel | Zie de opmerking bij Deel 1 |

---

## Deel 3: Betalen voor Plus (later, als je er klaar voor bent)

Dit is wat er nodig is. De technische kant bouw ik als je zegt dat je zover bent.

### Wat jij regelt
1. **Inschrijven bij de KvK** als eenmanszaak (± €82, online te regelen). Je krijgt een KvK-nummer en een btw-nummer.
2. **Btw**: met de **kleineondernemersregeling (KOR)** hoef je onder de €20.000 omzet per jaar geen btw te rekenen. Aanmelden bij de Belastingdienst.
3. **Zakelijke bankrekening** (bijv. bunq, Knab of je eigen bank).
4. **Betaaldienst** kiezen:
   - **Stripe**: makkelijkst voor abonnementen (incl. iDEAL en een kant-en-klare pagina waar klanten zelf opzeggen). Kosten per betaling ± 1,5% + €0,25.
   - **Mollie**: Nederlands, iDEAL-specialist. Iets meer werk voor abonnementen.
   - Mijn advies: **Stripe**.
5. **Teksten**: algemene voorwaarden, een privacyverklaring met je contactgegevens (de pagina
   Privacy staat er al, die vullen we aan) en een duidelijke prijs (bijv. €2,99 per maand of €19,99 per jaar).

### Wat ik dan bouw
1. **Verhuizen** naar **Vercel**, **Netlify** of **Cloudflare Pages** (gratis). GitHub Pages mag niet voor een betaalde dienst.
2. Een knop **Word Plus** die naar de betaalpagina van Stripe gaat.
3. Een kleine serverfunctie (Supabase Edge Function) die na betalen automatisch `plan = plus` zet, en bij opzeggen weer terug.
4. Plus aanzetten met de variabele **`VITE_PLUS_AAN` = `true`**.
   Tot die tijd blijft alles gratis voor iedereen.

### Wat is gratis en wat is Plus? (aan te passen in `src/lib/plan.ts`)
| Gratis | Plus |
|---|---|
| Lijsten maken, plakken, delen | Foto scannen → flitskaartjes |
| Alle oefenmodi | Werkwoordtrainer |
| Streak, XP, badges | Alle grammatica-oefeningen (gratis: eerste 2 per taal) |
| Grammatica-uitleg | Planner, slim herhalen, statistiek-grafieken |
