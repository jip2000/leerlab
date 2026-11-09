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
| 8 | Extra oefenmodi |
| 9 | Video's en planner |
| 10 | Statistieken: grafieken, heatmap, moeilijkste woorden |
| 11 | PWA, offline, back-up, afwerking |
| 12 | Uitbreiden met meer talen |

## Afspraken na fase 2

- Streak en beloningen (zoals bij taal-apps) zijn naar voren gehaald in fase 3: streak met weekoverzicht,
  bevriezers, XP en levels, dagdoel, 12 badges, confetti.
- Streak op het beginscherm van je telefoon: een website kan geen echte widget maken. Wel:
  installeren op het beginscherm (eigen icoon) en op iPhone het streak-getal op het app-icoon.
