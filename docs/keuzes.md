# Gemaakte keuzes

Antwoorden op de startvragen (zie `opdracht.md`, hoofdstuk 17).

| Vraag | Keuze |
|---|---|
| Naam van de site | **Woordwerk** |
| Hoofdkleur | **Fris groen** (mint/smaragd): vrolijk en kalm |
| Code bewaren | GitHub, repository **leerlab** |
| Online zetten | Gratis hosting (GitHub Pages of vergelijkbaar), geen server |
| Lettertype | **Plus Jakarta Sans** (Google Fonts) |

## Techniek (aanvulling op hoofdstuk 13.1)
- React + Vite + TypeScript (strict), Tailwind CSS v4, React Router, Zustand, Dexie (IndexedDB).
- Iconen: Lucide.
- Animaties: **Motion** (de nieuwe naam van Framer Motion, zelfde makers).
- Tests: Vitest (unit) en Playwright (browser).

## Plan fase 1 – Basis
1. Project opzetten met alle pakketten en de mappenstructuur uit 13.4.
2. Design-systeem: kleuren als CSS-variabelen (incl. kleur per vak), licht/donker (systeem + schakelaar), lettertype, basisonderdelen (Button, Card, Input, Badge, ProgressRing).
3. `src/data/languages.ts` met alle 19 talen (vlag, speciale tekens, leesrichting, grammatica-onderdelen).
4. Dexie-database met alle tabellen uit het datamodel (13.5).
5. Navigatie: tabbalk onderaan op mobiel (4 hoofdpagina's + "Meer"), zijbalk op desktop, zoekbalk bovenaan.
6. Alle 10 pagina's als nette lege pagina's.
7. Eigen logo (SVG) en zachte paginaovergangen (met `prefers-reduced-motion`).
8. Browsertest op mobiel (390×844) en desktop (1440×900) + screenshots.

**Klaar als:** de site start, ziet er mooi uit op mobiel en desktop, en je kunt tussen pagina's wisselen.

## Afspraken na fase 1

- **Woordenlijsten uit schoolboeken** worden níet gekopieerd: die zijn eigendom van de uitgevers.
  In plaats daarvan:
  - Lijsten zijn te ordenen per **boek → leerjaar/niveau → hoofdstuk** (de boeknaam typ je zelf; bekende methodes worden voorgesteld).
  - Woorden uit je eigen boek zet je erin via typen, plakken, CSV of (straks) een **foto**.
  - Klasgenoten delen lijsten met een **deellink**.
  - Voor talen die je meestal niet op school krijgt zijn er **eigen startlijsten per thema** (zelf geschreven).
- **Foto → flitskaartjes is belangrijk**, en schuift daarom naar voren.

## Nieuwe fasevolgorde

| Fase | Wat |
|---|---|
| 1 | Basis ✅ |
| 2 | Woordenlijsten ✅ |
| 3 | Oefenen (flashcards, typen, meerkeuze, toets) + streak, XP, levels, badges ✅ |
| 4 | **Foto scannen** (was fase 7) ✅ |
| 5 | Slim herhalen (spaced repetition) ✅ |
| 6 | Werkwoordtrainer ✅ |
| 7 | Grammatica ✅ (FR, DE, EN, ES) |
| 8 | Extra oefenmodi ✅ |
| 9 | Video's en planner ✅ |
| 10 | Statistieken: grafieken, heatmap, moeilijkste woorden ✅ |
| 11 | PWA, offline, back-up, afwerking ✅ (plus hulp-tutor) |
| 12 | Uitbreiden met meer talen ✅ deels |

## Afspraken na fase 2

- Streak en beloningen (zoals bij taal-apps) zijn naar voren gehaald in fase 3: streak met weekoverzicht,
  bevriezers, XP en levels, dagdoel, 12 badges, confetti.
- Streak op het beginscherm van je telefoon: een website kan geen echte widget maken. Wel:
  installeren op het beginscherm (eigen icoon) en op iPhone het streak-getal op het app-icoon.

## Afspraken bij "alle fases achter elkaar"

- Hulp-tutor rechtsonder: gebouwd **zonder AI** (gratis, werkt offline, kennisbank met antwoorden + knoppen).
  Een echte AI (bijv. Claude) kan later, maar kost geld per bericht en vraagt een API-sleutel op een eigen
  server. Daar moet eerst toestemming voor komen.

## Grammatica en Werkwoorden onder één knop (11 november)

- Op de telefoon stond Werkwoorden in de balk onderaan en zat Grammatica verstopt onder "Meer", terwijl
  het bij elkaar hoort. Nu is er één knop **Grammatica** met twee tabbladen: **Onderwerpen** (uitleg en
  oefeningen per taal) en **Werkwoorden** (de werkwoordtrainer).
- De adressen zijn niet veranderd (`/grammatica` en `/werkwoorden`), dus oude links en bladwijzers
  blijven werken. Zoeken op "werkwoorden" brengt je nog steeds naar de trainer.
- Welke pagina's bij een menu-item horen, staat op één plek: `sub` in `src/components/layout/nav.ts`.

## Wat nog open staat

- ~~Werkwoordtrainer Italiaans, Portugees, Latijn~~ ✅ (10 november)
- ~~Oudgrieks: declinaties en werkwoorden~~ ✅ (basis: 1e/2e declinatie, praesens/imperfectum/aoristus van λύω)
- ~~Basistalen: belangrijkste werkwoorden~~ ✅ (2–3 werkwoorden per taal; meer kan later)
- ~~Plaatje per woord~~ ✅
- ~~Knop "Alles aanvinken"~~ ✅ bij werkwoorden, tijden, personen en lijsten
- Echte AI voor de tutor of de foto-herkenning (vraagt API-sleutel + server, dus eerst toestemming).
- Plaatje uit een foto knippen (nu: los plaatje uploaden).
