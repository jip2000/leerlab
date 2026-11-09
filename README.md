# Woordwerk

Eigen studie-website om woordjes, grammatica en werkwoorden van Europese talen te leren.
Alles draait in je browser; je gegevens blijven op je eigen apparaat.

- De volledige bouwopdracht: [`docs/opdracht.md`](docs/opdracht.md)
- Gemaakte keuzes en planning: [`docs/keuzes.md`](docs/keuzes.md)

## Status

| Fase | Wat | Klaar |
|---|---|---|
| 1 | Basis: design, navigatie, lege pagina's | ✅ |
| 2 | Woordenlijsten | |
| 3 | Oefenen | |

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

## Waar staat wat?

```
src/
  components/ui/       knoppen, kaarten, logo, ring, schakelaar…
  components/layout/   zijbalk, tabbalk, zoekbalk, thema-knop
  pages/               één bestand per pagina
  data/languages.ts    alle talen
  db/                  de lokale database (Dexie / IndexedDB)
  lib/                 hulpfuncties (instellingen, thema, zoeken)
  styles/index.css     kleuren (design tokens) en lettertype
tests/unit/            snelle tests (Vitest)
tests/e2e/             browsertests (Playwright)
```

Kleuren aanpassen? Verander de variabelen bovenaan `src/styles/index.css`.
