# Woordwerk

Eigen studie-website om woordjes, grammatica en werkwoorden van Europese talen te leren.
Alles draait in je browser; je gegevens blijven op je eigen apparaat.

**De site:** https://jip2000.github.io/leerlab/

- De volledige bouwopdracht: [`docs/opdracht.md`](docs/opdracht.md)
- Gemaakte keuzes en planning: [`docs/keuzes.md`](docs/keuzes.md)

## Status

| Fase | Wat | Klaar |
|---|---|---|
| 1 | Basis: design, navigatie, lege pagina's | ✅ |
| 2 | Woordenlijsten: boeken, mappen, plakken, CSV, delen, uitspraak, startlijsten | ✅ |
| 3 | Oefenen (flashcards, typen, meerkeuze, toets) + streak, XP, levels, badges | ✅ |
| 4 | Foto scannen (Tesseract, bijsnijden, controlescherm) | ✅ |
| 5 | Slim herhalen (Leitner, 5 bakjes), Vandaag herhalen, gekend/bijna/nog leren | ✅ |
| 6 | Werkwoordtrainer Frans, Duits, Engels, Spaans (4 oefenvormen, uitleg, statistiek) | ✅ |
| 7 | Grammatica: 70 onderwerpen met uitleg en oefeningen (FR, DE, EN, ES) | ✅ |
| 8 | Extra modi: leren, luisteren/dictee, koppelen, snel-ronde | ✅ |
| 9 | Video's (YouTube, aantekeningen met tijden) en planner (leerschema, weekagenda) | ✅ |

De volledige planning staat in [`docs/keuzes.md`](docs/keuzes.md).

## De site starten op je eigen computer

Je hebt [Node.js](https://nodejs.org) nodig (versie 22 of nieuwer). Daarna, in deze map:

```bash
npm install
```

```bash
npm run dev
```

Open dan de link die verschijnt (meestal http://localhost:5173).

## Testen

```bash
npm test
```

```bash
npx playwright install chromium
```

```bash
npm run e2e
```

`npm test` controleert de logica (snel). `npm run e2e` opent de site in een echte browser,
op telefoon- en laptopformaat. De `playwright install` hoef je maar één keer te doen.

## Online zetten (GitHub Pages)

Bij elke push naar `main` wordt de site automatisch gebouwd en gepubliceerd.
Eenmalig instellen op GitHub: **Settings → Pages → Source: GitHub Actions**.

## Een taal toevoegen

1. Open `src/data/languages.ts`.
2. Voeg de code toe aan `LanguageCode` en een nieuw blok aan de lijst `languages`
   (naam, vlag, kleur, speciale tekens, stem voor voorlezen, onderwerpen).
3. Draai `npm test`: die controleert onder andere of de kleur genoeg contrast heeft.

## Streak, XP en badges

- **Streak**: dagen op rij geoefend. Mis je een dag en heb je een 🧊 bevriezer, dan blijft je streak heel.
  Een bevriezer verdien je bij elke 7 dagen streak (max. 2).
- **XP**: 5 per flashcard, 8 per meerkeuzevraag, 10 per getypt antwoord, +20 voor afmaken, +20 voor foutloos.
- **Badges** staan in `src/features/progress/badges.ts`. Een nieuwe badge = één regel toevoegen.
- **Op je beginscherm**: zet Woordwerk op je beginscherm (iPhone: Delen → Zet op beginscherm).
  Op iPhone kan je streak dan als getal op het icoon staan (Instellingen → Je streak op je beginscherm).

## Een grammatica-onderwerp toevoegen

1. Zet de id en titel in `src/data/languages.ts` (bij `grammarTopics` van de taal).
2. Schrijf de uitleg en oefeningen in `src/data/grammar/<taal>.ts`. Soorten oefeningen:
   `gap` (invullen), `choice` (kiezen), `table` (tabel), `translate` (vertalen), `fix` (fout verbeteren), `order` (volgorde).
3. Draai `npm test`: die controleert of elk onderwerp inhoud heeft en of alle oefeningen geldig zijn.

## Een werkwoord toevoegen

- Regelmatig: zet het in `src/data/verbs/<taal>.ts` met alleen infinitief en vertaling. De regels doen de rest.
- Onregelmatig: schrijf de afwijkende vormen uit (zie de uitleg bovenaan elk databestand).
- Draai `npm test`: de vervoegingstests (`tests/unit/verbs-*.test.ts`) controleren honderden vormen.

## Een startlijst toevoegen

Startlijsten (voor talen die je meestal niet op school krijgt) staan in `src/data/starter/index.ts`.
Voeg een taal of thema toe en draai `npm test`: die controleert op dubbele woorden en verkeerde lidwoorden.

## Waar staat wat?

```
src/
  components/ui/       knoppen, kaarten, logo, ring, schakelaar…
  components/layout/   zijbalk, tabbalk, zoekbalk, thema-knop
  pages/               één bestand per pagina (pages/lists/ voor alles rond lijsten)
  features/lists/      opslaan, dupliceren, samenvoegen… van lijsten
  data/languages.ts    alle talen
  db/                  de lokale database (Dexie / IndexedDB)
  data/starter/        eigen startlijsten per thema
  lib/                 hulpfuncties (plakken, CSV, delen, voorlezen, zoeken…)
  styles/index.css     kleuren (design tokens) en lettertype
tests/unit/            snelle tests (Vitest)
tests/e2e/             browsertests (Playwright)
```

Kleuren aanpassen? Verander de variabelen bovenaan `src/styles/index.css`.
