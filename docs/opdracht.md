# Bouwopdracht: mijn eigen studie-website

Je gaat een complete studie-website voor mij bouwen. Ik zit in 4 vwo en wil één plek waar ik woordjes, grammatica en werkwoorden van alle Europese talen kan leren, met flashcards, oefeningen, foto's van mijn boek en uitlegvideo's.

Lees dit hele document eerst helemaal door voordat je begint. Werk daarna in de fases die onderaan staan. Maak na elke fase iets dat werkt en dat ik kan uitproberen.

---

## 0. Belangrijkste regels

1. **Eigen site, geen kopie.** De site is geïnspireerd op de functies van StudyGo (woordenlijsten en oefenen) en Verbuga (werkwoorden vervoegen), maar krijgt een **eigen naam, eigen logo, eigen kleuren en eigen teksten**. Gebruik geen namen, logo's, afbeeldingen of teksten van die sites.
2. **Gebruik de skills.** Gebruik de `frontend-design` skill voor het design en de `webapp-testing` skill om de site in een browser te testen (als die skills beschikbaar zijn).
3. **Werk in fases.** Bouw niet alles in één keer. Volg de fases in hoofdstuk 15. Laat na elke fase zien wat er werkt.
4. **Eerst een plan.** Laat mij eerst een kort plan zien (mappenstructuur, techniek, volgorde) voordat je code schrijft.
5. **Leg uit in simpele woorden.** Ik ben 15/16 en geen ervaren programmeur. Leg na elke stap kort uit wat je hebt gedaan en hoe ik het kan starten.
6. **Vraag bij twijfel.** Als iets in dit document onduidelijk is of tegenstrijdig, vraag het mij in plaats van te gokken.
7. **Taalkundig correct.** Alle grammatica-uitleg, vervoegingen en voorbeeldzinnen moeten kloppen. Controleer dit extra goed en schrijf automatische tests voor de vervoegingen.
8. **Alles in het Nederlands.** De hele interface is in het Nederlands (later uitbreidbaar naar Engels).

---

## 1. Voor wie is de site?

- Middelbare scholieren (vooral havo/vwo, klas 1 t/m 6), in de eerste plaats ikzelf.
- Ze leren vooral voor toetsen: woordjes per hoofdstuk, grammatica, werkwoorden.
- Ze gebruiken vaak hun **telefoon**, maar ook een laptop. Beide moeten perfect werken.
- Ze hebben weinig geduld: alles moet snel, duidelijk en leuk zijn.

---

## 2. Talen

De site ondersteunt deze talen, zowel voor woordenlijsten als voor grammatica:

| Taal | Code | Speciale tekens (knoppenbalk) |
|---|---|---|
| Nederlands | nl | é ë ï ö ü |
| Engels | en | — |
| Frans | fr | é è ê ë à â ç ù û ü î ï ô œ æ « » |
| Duits | de | ä ö ü ß Ä Ö Ü |
| Spaans | es | á é í ó ú ñ ü ¿ ¡ |
| Portugees | pt | á à â ã é ê í ó ô õ ú ç |
| Italiaans | it | à è é ì ò ù |
| Latijn | la | ā ē ī ō ū (optioneel, lengtetekens) |
| Oudgrieks | grc | Grieks toetsenbord (α β γ … + accenten), optioneel |
| Zweeds | sv | å ä ö |
| Deens | da | æ ø å |
| Noors | no | æ ø å |
| Pools | pl | ą ć ę ł ń ó ś ź ż |
| Tsjechisch | cs | á č ď é ě í ň ó ř š ť ú ů ý ž |
| Fins | fi | ä ö |
| Grieks (modern) | el | Grieks alfabet |
| Russisch | ru | Cyrillisch alfabet |
| Turks | tr | ç ğ ı İ ö ş ü |
| Fries | fy | â ê ô û ú |

Belangrijk:
- **Talen zijn instelbaar via een configuratiebestand** (bijv. `src/data/languages.ts`) met per taal: naam, code, vlag-emoji, speciale tekens, of de taal van rechts naar links gaat (niet nodig nu, maar wel voorbereid) en welke grammatica-onderdelen er zijn.
- Een nieuwe taal toevoegen moet kunnen door alleen dat bestand en een databestand toe te voegen.
- **Prioriteit voor grammatica-inhoud:** eerst Frans, Duits, Engels, Spaans; daarna Latijn, Italiaans, Portugees, Nederlands; daarna de rest. Woordenlijsten werken meteen voor álle talen.

---

## 3. Pagina's en navigatie

Navigatie: onderaan op mobiel (tabbalk), links op desktop (zijbalk).

1. **Home / Dashboard** – dagdoel, streak, "verder waar je was", woorden die vandaag herhaald moeten worden, komende toetsen.
2. **Mijn lijsten** – alle woordenlijsten, in mappen per vak en hoofdstuk.
3. **Oefenen** – kies een of meer lijsten en een oefenmodus.
4. **Grammatica** – kies een taal, dan een onderwerp: uitleg + oefeningen.
5. **Werkwoorden** – vervoegingstrainer per taal (zoals Verbuga).
6. **Foto scannen** – foto van je boek → flashcards.
7. **Video's** – uitlegvideo's per vak/hoofdstuk.
8. **Planner** – toetsen invoeren, automatisch leerschema.
9. **Statistieken** – voortgang, grafieken, badges.
10. **Instellingen** – thema, geluid, nakijkregels, back-up.

Extra:
- **Zoekbalk** bovenaan: zoeken in lijsten, woorden en grammatica-onderwerpen.
- **Sneltoetsen** op desktop (bijv. spatie = kaart omdraaien, Enter = controleren, 1-4 = meerkeuze).

---

## 4. Woordenlijsten

### 4.1 Een lijst maken
- Kies **taal links** en **taal rechts** (bijv. Nederlands – Frans).
- Titel, vak, map/hoofdstuk, tags (bijv. "toets week 12").
- Woorden invoeren in een tabel: links | rechts. Tab springt naar het volgende veld, Enter maakt een nieuwe rij.
- Per woord optioneel:
  - **Lidwoord / geslacht** (de/het, le/la/l', der/die/das, el/la, il/lo/la, o/a…). Instelbaar of het lidwoord meegeteld wordt bij nakijken.
  - **Meervoud** of extra vormen (bijv. Latijn: *rosa, rosae, f.*; Duits: *das Haus, -¨er*).
  - **Voorbeeldzin**.
  - **Afbeelding** (uploaden of uit een foto knippen).
  - **Notitie / ezelsbruggetje**.
- **Meerdere goede antwoorden** met `;` of `/`: "huis; woning" → beide goed.
- **Optionele delen tussen haakjes**: "(zich) wassen" → "wassen" is ook goed.

### 4.2 Importeren
- **Plakken uit tekst**: een blok tekst plakken met per regel `woord = vertaling`, `woord - vertaling`, `woord; vertaling` of tab-gescheiden (uit Excel/Google Sheets). De site herkent het scheidingsteken automatisch en laat een voorbeeld zien.
- **CSV-bestand** importeren en exporteren.
- **Via foto** (zie hoofdstuk 8).

### 4.3 Beheren
- Lijsten bewerken, dupliceren, samenvoegen, omdraaien (links ↔ rechts), verwijderen (met "ongedaan maken").
- Mappen per vak met eigen kleur en icoon.
- Sorteren op naam, datum, voortgang.
- **Delen**: lijst exporteren als bestand of als link met de data erin gecodeerd (geen server nodig), zodat een klasgenoot hem kan importeren.

### 4.4 Uitspraak
- Luisterknop bij elk woord via de **Web Speech API** (`speechSynthesis`) in de juiste taal/stem.
- Instelling: automatisch voorlezen tijdens oefenen aan/uit.

---

## 5. Oefenmodi (zoals StudyGo)

Bij elke oefening kies ik:
- **Welke lijsten** (één of meerdere tegelijk).
- **Richting**: links → rechts, rechts → links, of door elkaar.
- **Volgorde**: op volgorde of gehusseld.
- **Alleen moeilijke woorden** (woorden die ik vaak fout had).

### 5.1 Flashcards
- Grote kaart, tik of spatie = omdraaien met een vloeiende 3D-flip.
- Na het omdraaien: knoppen **"Wist ik"** / **"Wist ik niet"** (of swipe rechts/links op mobiel).
- Woorden die ik niet wist komen later in de ronde terug.

### 5.2 Typen (overhoren)
- Ik zie het woord en typ de vertaling.
- **Nakijkregels** (instelbaar in Instellingen):
  - Hoofdletters tellen wel/niet mee.
  - Accenten tellen wel/niet mee (bij niet: "bijna goed" met het juiste accent getoond).
  - Leestekens en spaties aan begin/eind negeren.
  - Kleine typfouten (1 letter, via Levenshtein-afstand) = "bijna goed", ik kies zelf of het goed telt.
- Speciale-tekens-balk voor de taal waarin ik typ.
- Bij fout: het goede antwoord tonen, verschil markeren, en het woord later opnieuw vragen. Ik moet het fout getypte woord eerst één keer goed overtypen.

### 5.3 Meerkeuze
- 4 opties: 1 goed, 3 fout. De foute opties komen uit dezelfde lijst en lijken bij voorkeur op het goede antwoord (zelfde woordsoort/lengte).
- Toetsen 1-4 op desktop.

### 5.4 Toets-modus
- Elk woord één keer, geen hulp, geen tweede kans.
- Aan het eind: **cijfer (1-10)**, percentage, lijst met fouten, knop "oefen alleen je fouten".

### 5.5 Luisteren / dictee
- Het woord wordt voorgelezen, ik typ wat ik hoor (in de vreemde taal).

### 5.6 Koppelen (spel)
- Raster met woorden en vertalingen door elkaar; tik de paren aan. Timer en highscore.

### 5.7 Snel-ronde
- 60 seconden, zoveel mogelijk goed. Combo-teller.

### 5.8 Leren-modus (slim)
- Combineert de modi: eerst flashcard, dan meerkeuze, dan typen. Een woord is pas "gekend" als ik het een paar keer achter elkaar goed heb.
- Voortgangsbalk bovenin.

### 5.9 Algemeen tijdens oefenen
- Pauzeren en later verdergaan (sessie wordt opgeslagen).
- Geluidjes bij goed/fout (uit te zetten).
- Aan het eind een samenvatting met confetti bij 100%.

---

## 6. Slim herhalen (spaced repetition)

- Gebruik een eenvoudig algoritme zoals **SM-2** of het **Leitner-systeem** (5 bakjes).
- Elk woord krijgt een "volgende herhaaldatum". Goed = langer wachten, fout = snel terug.
- Op het dashboard: **"Vandaag herhalen: 23 woorden"** met één knop om te starten.
- Moeilijkheid per woord bijhouden (hoe vaak fout).

---

## 7. Grammatica en werkwoorden (zoals Verbuga, maar voor alle talen)

### 7.1 Opbouw
Per taal een lijst onderwerpen. Elk onderwerp heeft:
1. **Uitleg**: korte, duidelijke uitleg in het Nederlands met tabellen, kleuren en voorbeeldzinnen (met vertaling).
2. **Oefeningen**: meerdere soorten (zie 7.4).
3. **Voortgang**: percentage per onderwerp.

Alle inhoud staat in **databestanden** (JSON of TypeScript) per taal, zodat ik zelf onderwerpen kan toevoegen of verbeteren, bijv. `src/data/grammar/fr/*.json`.

### 7.2 Werkwoordtrainer
Per taal:
- **Werkwoorden kiezen**: lijsten zoals "top 25 onregelmatig", "regelmatig op -er", of zelf aanvinken. Zelf werkwoorden toevoegen kan ook.
- **Tijden kiezen** (per taal verschillend, zie hieronder).
- **Personen** (ik, jij, hij/zij, wij, jullie, zij) – instelbaar welke.
- **Oefenvorm A – los**: "aller · passé composé · nous" → typ "nous sommes allé(e)s".
- **Oefenvorm B – rijtje**: het hele rijtje invullen in een tabel.
- **Oefenvorm C – in een zin**: "Hier, nous ___ (aller) au cinéma."
- **Oefenvorm D – omgekeerd**: ik zie een vorm ("vous fîtes") en kies werkwoord + tijd + persoon.
- **Feedback**: fout deel markeren, goede vorm tonen, korte uitleg waarom (bijv. "aller vervoeg je met être, dus het voltooid deelwoord krijgt de uitgang van het onderwerp").
- **Statistiek per werkwoord en per tijd**; foute combinaties komen vaker terug.

**Data-aanpak voor vervoegingen:**
- Regelmatige werkwoorden worden met **regels** gemaakt (stam + uitgangen), inclusief spellingsregels (bijv. FR *manger → nous mangeons*, *commencer → nous commençons*, *appeler → j'appelle*; DE *arbeiten → du arbeitest*; ES klinkerwisselingen *e→ie, o→ue, e→i*).
- Onregelmatige werkwoorden worden **volledig uitgeschreven** in een databestand.
- Schrijf **unit tests** (Vitest) die voor de belangrijkste werkwoorden alle vormen controleren.
- Begin per taal met de ±50 meest gebruikte werkwoorden en breid later uit.

### 7.3 Onderwerpen per taal (minimaal)

**Frans**
- Tijden: présent, passé composé (avoir/être, accord du participe), imparfait, plus-que-parfait, futur simple, futur proche, passé récent, conditionnel présent en passé, subjonctif présent, impératif, passé simple (alleen herkennen), gérondif.
- Lidwoorden (le/la/les, un/une/des, partitif du/de la/des, de na ontkenning).
- Bijvoeglijke naamwoorden (geslacht, meervoud, plaats, beau/bel/belle).
- Persoonlijke voornaamwoorden (onderwerp, lijdend/meewerkend voorwerp, plaats in de zin), y en en.
- Bezittelijke en aanwijzende voornaamwoorden.
- Betrekkelijke voornaamwoorden (qui, que, dont, où, lequel).
- Ontkenning (ne…pas/jamais/plus/rien/personne).
- Vragen stellen (est-ce que, inversie).
- Si-zinnen.
- Telwoorden, klok, datum.

**Duits**
- Naamvallen (nominativ, akkusativ, dativ, genitiv) met tabellen voor der/die/das, ein/eine, kein, possessiva.
- Voorzetsels met vaste naamval en wisselvoorzetsels.
- Bijvoeglijk naamwoord-verbuiging (sterk, zwak, gemengd).
- Tijden: Präsens, Perfekt (haben/sein), Präteritum, Plusquamperfekt, Futur I, Konjunktiv II (würde, wäre, hätte), Imperativ, Passiv.
- Scheidbare werkwoorden, modale werkwoorden, wederkerende werkwoorden.
- Woordvolgorde (hoofdzin, bijzin met werkwoord achteraan, inversie).
- Persoonlijke voornaamwoorden in alle naamvallen.
- Telwoorden, klok, datum.

**Engels**
- Tijden: present simple/continuous, past simple/continuous, present perfect (simple/continuous), past perfect, future (will, going to, present continuous), future perfect.
- Onregelmatige werkwoorden (3 rijtjes).
- Conditionals (0, 1, 2, 3).
- Passive voice, reported speech.
- Modale werkwoorden.
- Bijvoeglijke naamwoorden vs. bijwoorden, trappen van vergelijking.
- Some/any, much/many, a few/a little.
- Betrekkelijke voornaamwoorden, gerund vs. to-infinitive.

**Spaans**
- Ser vs. estar, hay.
- Tijden: presente, pretérito perfecto, pretérito indefinido, imperfecto, pluscuamperfecto, futuro, condicional, subjuntivo presente en imperfecto, imperativo, gerundio (estar + -ando/-iendo).
- Klinkerwisselende werkwoorden, gustar-constructie.
- Lidwoorden, geslacht, meervoud, bijvoeglijk naamwoord.
- Voornaamwoorden (lijdend/meewerkend voorwerp, le → se).
- Por vs. para.

**Portugees**
- Ser vs. estar, tijden (presente, pretérito perfeito, imperfeito, futuro, condicional, conjuntivo), persoonlijke infinitief, voornaamwoorden en hun plaats.

**Italiaans**
- Essere/avere, tijden (presente, passato prossimo, imperfetto, futuro, condizionale, congiuntivo, imperativo), lidwoorden (il/lo/la/l'/i/gli/le), voorzetsels met lidwoord (del, nella…).

**Latijn** (gymnasium)
- Declinaties 1 t/m 5 (alle naamvallen enkelvoud/meervoud), adjectieven (1e/2e en 3e declinatie), voornaamwoorden (is/ea/id, hic, ille, qui/quae/quod).
- Conjugaties 1 t/m 4 + gemengd, esse en posse, ire, ferre, velle.
- Tijden: praesens, imperfectum, futurum, perfectum, plusquamperfectum, futurum exactum; actief en passief; indicativus, coniunctivus, imperativus, participia, infinitivi.
- Oefenvorm "determineren": een vorm krijgen en naamval/getal/geslacht of persoon/getal/tijd/wijs/genus bepalen.
- Stamtijden oefenen (*laudo, laudare, laudavi, laudatum*).

**Oudgrieks** (gymnasium, later)
- Alfabet en accenten, lidwoord, declinaties, praesens/imperfectum/aoristus van de meest voorkomende werkwoorden.

**Nederlands**
- Werkwoordspelling (d/t/dt, verleden tijd 't kofschip, voltooid deelwoord), zinsontleding (onderwerp, persoonsvorm, lijdend voorwerp…), woordsoorten.

**Overige talen (Zweeds, Pools, enz.)**
- In eerste instantie alleen woordenlijsten + basis: lidwoorden/geslacht, telwoorden, de 20 belangrijkste werkwoorden in de tegenwoordige tijd. Structuur zo maken dat er later meer bij kan.

### 7.4 Soorten grammatica-oefeningen
- Invullen (gat in een zin).
- Kiezen uit opties.
- Tabel invullen (bijv. hele naamvallentabel).
- Zin vertalen (met tolerantie voor kleine verschillen).
- Fout zoeken en verbeteren.
- Woorden in de goede volgorde slepen (zinsbouw).
- Determineren (Latijn/Grieks).
- Elke oefening geeft uitleg bij een fout antwoord en een link terug naar de uitleg.

---

## 8. Foto van je boek → flashcards

### 8.1 Stappen
1. **Foto maken** met de camera van mijn telefoon (`<input type="file" accept="image/*" capture="environment">`) of een afbeelding uploaden. Meerdere foto's tegelijk moet kunnen.
2. **Bijsnijden en draaien**: ik kan het stuk met de woordjes selecteren en de foto rechtzetten.
3. **Beeld verbeteren** (automatisch, met canvas): grijswaarden, contrast verhogen, scherper maken, zodat de tekstherkenning beter werkt.
4. **Tekst herkennen** met **Tesseract.js** (draait in de browser, geen API-sleutel, gratis). Taalpakketten laden voor de twee gekozen talen (bijv. `nld+fra`). Een voortgangsbalk tonen tijdens het herkennen.
5. **Woordparen herkennen**:
   - Regels met een scheidingsteken (`=`, `-`, `–`, `:`, tab, meerdere spaties) worden in links/rechts gesplitst.
   - Twee kolommen naast elkaar: gebruik de positie van de woorden (bounding boxes van Tesseract) om linker- en rechterkolom te koppelen per regel.
   - Paginanummers, kopjes en losse rommeltekens eruit filteren.
6. **Controlescherm**: een bewerkbare tabel met alle gevonden paren, naast de foto. Twijfelachtige woorden (lage herkenningszekerheid) geel gemarkeerd. Ik kan rijen verbeteren, verwijderen, toevoegen, links/rechts omwisselen en regels samenvoegen of splitsen.
7. **Opslaan** als nieuwe lijst of toevoegen aan een bestaande lijst. Daarna meteen "Oefenen".

### 8.2 Extra
- De foto wordt bij de lijst bewaard, zodat ik later terug kan kijken.
- Ook uit een foto van een **grammatica-tabel** (bijv. een vervoegingsrijtje) moet ik woorden kunnen overnemen naar een lijst.
- **Optioneel, later**: een "slimme modus" met een AI-model (bijv. de Claude API) voor betere herkenning. Dit vereist een API-sleutel en een kleine server, dus **niet** in de eerste versies; alleen de code zo opzetten dat het later kan.

---

## 9. Uitlegvideo's

- Per vak en hoofdstuk kan ik een **YouTube-link** plakken (bijvoorbeeld van wiskunde-uitleg zoals Math with Menno, of taaluitleg).
- De video wordt **in de site zelf** getoond (YouTube-embed, `youtube-nocookie.com`), naast mijn oefeningen of grammatica-uitleg.
- Per video: titel, vak, hoofdstuk, **aantekeningen** (met tijdstempels waar ik op kan klikken), vinkje "bekeken".
- Video's koppelen aan een woordenlijst of grammatica-onderwerp, zodat ze daar ook verschijnen.

---

## 10. Planner (leren voor toetsen)

- Ik voer een toets in: vak, datum, welke lijsten/onderwerpen.
- De site maakt automatisch een **leerschema**: elke dag een deel van de woorden, de laatste dagen alles herhalen.
- Op het dashboard: "Toets Frans over 4 dagen – vandaag 15 minuten oefenen".
- Agenda-weergave per week.

---

## 11. Voortgang en motivatie

- **Per lijst**: percentage gekend (bijv. groen = gekend, oranje = bijna, rood = nog leren).
- **Per grammatica-onderwerp en per werkwoord/tijd**: percentage.
- **Streak**: dagen op rij geoefend, met vlammetje.
- **Dagdoel**: instelbaar (bijv. 10 minuten of 50 woorden), met een ring die volloopt.
- **XP en levels**: punten voor oefenen.
- **Badges**: bijv. "Eerste lijst", "7 dagen streak", "100 werkwoorden goed", "Alle Duitse naamvallen".
- **Statistieken**: grafiek van oefentijd per dag/week, kalender-heatmap, moeilijkste woorden, beste vakken.
- Geen druk of schuldgevoel: vriendelijke teksten ("Lekker bezig!", "Morgen weer verder?").

---

## 12. Design

### 12.1 Stijl
- **Modern, vrolijk en rustig.** Denk aan een fijne, moderne leer-app: veel witruimte, afgeronde hoeken (12-20px), zachte schaduwen.
- **Eigen kleurenpalet**: één hoofdkleur (bijv. een frisse blauw-paars of groen), plus kleuren per vak (Frans blauw, Duits rood/geel, Spaans oranje, enz.). Gebruik design tokens (CSS-variabelen) zodat het thema makkelijk aan te passen is.
- **Lichte en donkere modus**, automatisch volgens het systeem, met een schakelaar.
- **Lettertype**: een vriendelijk, goed leesbaar lettertype (bijv. Inter, Nunito of Plus Jakarta Sans via Google Fonts). Grote, duidelijke tekst op flashcards.
- **Iconen**: één consistente icon-set (bijv. Lucide).

### 12.2 Animaties
- Flip-animatie van flashcards (3D).
- Kleine "pop" bij een goed antwoord, zacht schudden bij fout.
- Confetti bij 100% en bij een nieuwe badge.
- Vloeiende overgangen tussen pagina's (bijv. Framer Motion).
- Respecteer `prefers-reduced-motion`: animaties uit voor wie dat wil.

### 12.3 Mobiel eerst
- Alles goed te bedienen met één duim. Knoppen minimaal 44×44 px.
- Swipen bij flashcards.
- Toetsenbord op mobiel mag de invoer niet bedekken.
- Werkt vanaf 360 px breed tot grote schermen.

### 12.4 Toegankelijkheid
- Goed contrast (WCAG AA).
- Alles bedienbaar met toetsenbord.
- Labels voor schermlezers.
- Kleur is nooit de enige aanwijzing (ook een icoon/tekst bij goed/fout).

---

## 13. Techniek

### 13.1 Stack
- **React + Vite + TypeScript**.
- **Tailwind CSS** voor de styling.
- **React Router** voor de pagina's.
- **Zustand** (of iets vergelijkbaars, simpel) voor de state.
- **IndexedDB via Dexie.js** om alles lokaal op te slaan (beter dan localStorage, omdat er ook foto's in moeten). Kleine instellingen mogen in localStorage.
- **Tesseract.js** voor tekstherkenning.
- **Framer Motion** voor animaties, **canvas-confetti** voor confetti.
- **Recharts** (of vergelijkbaar) voor grafieken.
- **Vitest** voor tests, **Playwright** voor browsertests.

Als je voor een onderdeel iets beters weet, leg dan uit waarom en vraag het eerst.

### 13.2 Geen server (voorlopig)
- Alles draait in de browser, geen account nodig.
- **Back-up**: knop "Exporteer alles" (JSON-bestand) en "Importeer back-up".
- Structuur wel zo opzetten dat later accounts en synchronisatie (bijv. met Supabase) kunnen worden toegevoegd.

### 13.3 Installeerbaar en offline (PWA)
- De site is een **Progressive Web App**: installeerbaar op mijn telefoon-beginscherm, met eigen icoon, en werkt **offline** (behalve video's en het eerste keer laden van OCR-taalpakketten).

### 13.4 Mappenstructuur (voorstel)
```
src/
  components/      herbruikbare onderdelen (Button, Card, Flashcard, CharBar…)
  pages/           één map per pagina
  features/
    lists/         woordenlijsten
    practice/      oefenmodi
    srs/           slim herhalen
    grammar/       grammatica-engine en oefeningen
    verbs/         werkwoordtrainer en vervoegingsregels
    scan/          foto → flashcards
    videos/
    planner/
    stats/
  data/
    languages.ts
    grammar/<taal>/...
    verbs/<taal>/...
  db/              Dexie-database en types
  lib/             hulpfuncties (nakijken, levenshtein, parsers)
  styles/
tests/
```

### 13.5 Datamodel (globaal)
- **Folder**: id, naam, kleur, icoon.
- **WordList**: id, titel, taalLinks, taalRechts, folderId, tags, gemaaktOp, bijgewerktOp, fotoIds.
- **WordItem**: id, listId, links, rechts, lidwoord, extraVormen, voorbeeldzin, notitie, afbeeldingId, positie.
- **ReviewState** (per woord en richting): bakje/interval, gemak, volgendeHerhaling, aantalGoed, aantalFout.
- **Session**: id, type, lijsten, start, eind, score, antwoorden.
- **GrammarProgress**: taal, onderwerpId, score, laatsteKeer.
- **VerbProgress**: taal, werkwoord, tijd, persoon, aantalGoed, aantalFout.
- **Video**: id, url, titel, vak, hoofdstuk, notities, bekeken, gekoppeldAan.
- **Test** (planner): id, vak, datum, lijsten, onderwerpen.
- **Settings**: thema, nakijkregels, geluid, dagdoel, voorlezen.
- **Badge**: id, behaaldOp.

### 13.6 Kwaliteit
- TypeScript strict mode.
- Code netjes opgesplitst in kleine bestanden met duidelijke namen.
- Korte commentaren bij lastige stukken (in het Nederlands of Engels).
- Een `README.md` met: hoe ik de site start (`npm install`, `npm run dev`), hoe ik een taal of grammatica-onderwerp toevoeg, en hoe ik een back-up maak.

---

## 14. Testen

- **Unit tests** voor: nakijken (accenten, hoofdletters, typfouten, meerdere antwoorden, haakjes), het herhaal-algoritme, het splitsen van geplakte tekst en OCR-regels, en vervoegingen (minimaal 20 werkwoorden per taal met alle tijden).
- **Browsertests** (Playwright / webapp-testing skill) voor: een lijst maken, flashcards oefenen, een toets doen, een werkwoordoefening doen, een foto uploaden.
- Test op mobiel formaat (bijv. 390×844) en desktop (1440×900).
- Na elke fase: alle tests moeten slagen voordat je verdergaat.

---

## 15. Fases (bouwvolgorde)

Werk deze fases één voor één af. Laat na elke fase zien wat werkt en wacht op mijn "ok" voordat je aan de volgende begint.

**Fase 1 – Basis**
- Project opzetten (Vite, React, TS, Tailwind, router, Dexie).
- Design-systeem: kleuren, lettertype, knoppen, kaarten, licht/donker.
- Navigatie en lege pagina's.
- ✅ Klaar als: de site start, ziet er mooi uit op mobiel en desktop, en ik kan tussen pagina's wisselen.

**Fase 2 – Woordenlijsten**
- Lijsten maken, bewerken, mappen, plakken-importeren, CSV, uitspraak.
- ✅ Klaar als: ik een lijst Frans–Nederlands kan maken, opslaan, en hij er na herladen nog is.

**Fase 3 – Oefenen**
- Flashcards, typen (met alle nakijkregels en tekenbalk), meerkeuze, toets-modus.
- ✅ Klaar als: ik een lijst kan oefenen in alle vier de modi en een cijfer krijg.

**Fase 4 – Slim herhalen en dashboard**
- Spaced repetition, "vandaag herhalen", streak, dagdoel.

**Fase 5 – Werkwoordtrainer**
- Eerst Frans, dan Duits, Engels, Spaans. Alle oefenvormen, met tests.

**Fase 6 – Grammatica**
- Uitleg + oefeningen, eerst Frans en Duits, daarna de andere talen.

**Fase 7 – Foto scannen**
- Camera/upload, bijsnijden, beeld verbeteren, Tesseract, controlescherm, opslaan.

**Fase 8 – Extra oefenmodi**
- Luisteren/dictee, koppelen, snel-ronde, leren-modus.

**Fase 9 – Video's en planner**

**Fase 10 – Statistieken, badges, XP**

**Fase 11 – PWA, offline, back-up, afwerking**
- Installeerbaar maken, offline testen, export/import, laatste designverbeteringen, README.

**Fase 12 – Uitbreiden**
- Latijn, Italiaans, Portugees, Nederlands, daarna de overige talen.

---

## 16. Wat je níet moet doen

- Geen namen, logo's, teksten of afbeeldingen van StudyGo, Verbuga of andere bestaande sites gebruiken.
- Geen inhoud letterlijk overnemen uit schoolboeken of methodes; schrijf eigen uitleg en voorbeeldzinnen.
- Geen API-sleutels in de code zetten.
- Geen betaalde diensten gebruiken zonder het mij te vragen.
- Niet alles in één groot bestand stoppen.
- Niet doorgaan naar de volgende fase als er nog dingen kapot zijn.

---

## 17. Om te beginnen

1. Lees dit document helemaal.
2. Stel mij eventueel 3 tot 5 vragen als iets onduidelijk is (bijv. naam van de site, hoofdkleur).
3. Laat het plan voor fase 1 zien.
4. Begin na mijn "ok" met fase 1.
