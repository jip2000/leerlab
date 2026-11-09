/**
 * Kennisbank van de hulp-tutor. Elk item: trefwoorden, een antwoord en (optioneel) knoppen.
 * Een vraag toevoegen? Voeg hier een item toe en draai `npm test`.
 */
export interface TutorAction {
  label: string;
  to: string;
}

export interface KnowledgeItem {
  id: string;
  keywords: string[];
  answer: string;
  actions?: TutorAction[];
}

export const knowledge: KnowledgeItem[] = [
  { id: 'lijst-maken', keywords: ['lijst maken', 'nieuwe lijst', 'woordenlijst', 'woorden invoeren', 'lijst toevoegen', 'woordjes invoeren', 'woordjes toevoegen'],
    answer: 'Ga naar Mijn lijsten en kies Nieuwe lijst. Kies de talen, typ een titel en vul de woorden in. Tab springt naar het volgende vak, Enter maakt een nieuwe rij. Bij "Boek en hoofdstuk" zet je je lesmethode erin, dan vind je de lijst terug onder Mijn boeken.',
    actions: [{ label: 'Nieuwe lijst', to: '/lijsten/nieuw' }] },
  { id: 'plakken', keywords: ['plakken', 'importeren', 'excel', 'google sheets', 'kopieren', 'kopiëren', 'csv'],
    answer: 'Kies bij Mijn lijsten voor Importeren. Plak je woorden met één paar per regel, bijvoorbeeld "la maison = het huis", of kolommen uit Excel. Woordwerk herkent het scheidingsteken zelf. Een CSV-bestand kan ook.',
    actions: [{ label: 'Importeren', to: '/lijsten/importeren' }] },
  { id: 'foto', keywords: ['foto', 'scannen', 'camera', 'boek fotograferen', 'plaatje', 'afbeelding'],
    answer: 'Met Foto scannen maak je een foto van de woordjes in je boek. Snijd het stuk met de woorden bij, kies Tekst herkennen en controleer de woorden (gele vakjes = de computer twijfelt). Daarna kun je meteen oefenen met flitskaartjes. Tip: goed licht en je telefoon recht boven de bladzijde.',
    actions: [{ label: 'Foto scannen', to: '/scannen' }] },
  { id: 'delen', keywords: ['delen', 'klasgenoot', 'vriend', 'sturen', 'link', 'samen'],
    answer: 'Open een lijst, kies Meer acties en dan Delen met een link. Stuur die link naar je klasgenoot. Die opent hem en slaat de lijst met één klik op. Er is geen account nodig.',
    actions: [{ label: 'Mijn lijsten', to: '/lijsten' }] },
  { id: 'boek', keywords: ['boek', 'methode', 'hoofdstuk', 'leerjaar', 'niveau', 'grandes lignes', 'neue kontakte', 'stepping stones'],
    answer: 'Bij het maken of bewerken van een lijst vul je Boek, Leerjaar, Niveau en Hoofdstuk in. Dan staat je boek onder Mijn boeken, met de lijsten per hoofdstuk. De woorden uit je boek zet je erin met typen, plakken of een foto.',
    actions: [{ label: 'Mijn lijsten', to: '/lijsten' }] },
  { id: 'oefenen', keywords: ['oefenen', 'leren', 'overhoren', 'modus', 'flashcard', 'flitskaart', 'meerkeuze', 'typen', 'koppelen', 'snel', 'luisteren', 'dictee'],
    answer: 'Bij Oefenen kies je een of meer lijsten en een manier: Flashcards, Typen, Meerkeuze, Toets, Leren (slim: kaart, meerkeuze, typen), Luisteren, Koppelen of Snel-ronde. Je kiest ook de richting en of je wilt husselen.',
    actions: [{ label: 'Oefenen', to: '/oefenen' }] },
  { id: 'toets-cijfer', keywords: ['cijfer', 'toets modus', 'toetsmodus', 'proeftoets', 'punt'],
    answer: 'Kies bij Oefenen de manier Toets. Je krijgt elk woord één keer, zonder hulp. Aan het eind krijg je een cijfer zoals op school (1 + 9 × goed/totaal) en kun je alleen je fouten oefenen.',
    actions: [{ label: 'Oefenen', to: '/oefenen' }] },
  { id: 'nakijken', keywords: ['nakijken', 'accent', 'hoofdletter', 'typfout', 'bijna goed', 'fout gerekend', 'lidwoord', 'meerdere antwoorden', 'haakjes'],
    answer: 'Bij Instellingen → Nakijken stel je in of hoofdletters, accenten, leestekens en kleine typfouten meetellen, en of het lidwoord moet. Meerdere goede antwoorden scheid je in je lijst met ; of /. Wat tussen haakjes staat, mag je weglaten.',
    actions: [{ label: 'Instellingen', to: '/instellingen' }] },
  { id: 'tekens', keywords: ['speciale tekens', 'accent typen', 'toetsenbord', 'trema', 'umlaut', 'cedille', 'teken typen'],
    answer: 'Onder het invulvak staat een balk met speciale tekens voor de taal waarin je typt (é, ç, ß, ñ…). Met de pijl-omhoog-knop krijg je hoofdletters.' },
  { id: 'streak', keywords: ['streak', 'vlam', 'dagen op rij', 'reeks'],
    answer: 'Je streak is het aantal dagen op rij dat je hebt geoefend. Eén vraag beantwoorden is al genoeg voor die dag. Mis je een dag en heb je een bevriezer 🧊, dan blijft je streak heel.',
    actions: [{ label: 'Naar Home', to: '/' }] },
  { id: 'bevriezer', keywords: ['bevriezer', 'freeze', 'ijsblokje', 'dag gemist', 'vergeten te oefenen'],
    answer: 'Een bevriezer 🧊 beschermt je streak als je een dag mist. Je verdient er één bij elke 7 dagen op rij (je kunt er maximaal 2 hebben). Hij wordt vanzelf gebruikt.' },
  { id: 'xp', keywords: ['xp', 'punten', 'level', 'niveau omhoog'],
    answer: 'Je krijgt XP voor elk antwoord (meer voor typen dan voor flashcards), plus een bonus voor afmaken en voor foutloos. Met XP ga je levels omhoog. Je level zie je op Home en bij Statistieken.',
    actions: [{ label: 'Statistieken', to: '/statistieken' }] },
  { id: 'badges', keywords: ['badge', 'beloning', 'prijs', 'medaille', 'rewards'],
    answer: 'Badges verdien je bijvoorbeeld voor je eerste lijst, 7 dagen op rij, 100 goede antwoorden, een foutloze oefening of een 10 in de toets. Alle badges zie je bij Statistieken.',
    actions: [{ label: 'Bekijk badges', to: '/statistieken' }] },
  { id: 'dagdoel', keywords: ['dagdoel', 'doel', 'hoeveel per dag', 'minuten per dag'],
    answer: 'Je dagdoel is hoeveel je per dag wilt oefenen: een aantal minuten of een aantal goede woorden. De ring op Home loopt vol. Aanpassen doe je bij Instellingen.',
    actions: [{ label: 'Instellingen', to: '/instellingen' }] },
  { id: 'herhalen', keywords: ['herhalen', 'vandaag herhalen', 'slim herhalen', 'spaced repetition', 'bakje', 'onthouden'],
    answer: 'Woordwerk onthoudt per woord hoe goed je het kent (5 bakjes). Goed = het woord komt pas later terug; fout = snel weer. Op Home staat "Vandaag herhalen" met één knop. Zo onthoud je woorden veel langer.',
    actions: [{ label: 'Naar Home', to: '/' }] },
  { id: 'werkwoorden', keywords: ['werkwoord', 'vervoegen', 'vervoeging', 'rijtje', 'conjugeren', 'tijden', 'passé composé', 'perfekt', 'onregelmatig'],
    answer: 'Bij Werkwoorden kies je een taal (Frans, Duits, Engels of Spaans), werkwoorden, tijden en personen. Oefen los, als heel rijtje, in een zin of omgekeerd. Bij een fout zie je waarom. Combinaties die je fout had komen vaker terug.',
    actions: [{ label: 'Werkwoorden', to: '/werkwoorden' }] },
  { id: 'grammatica', keywords: ['grammatica', 'uitleg', 'regel', 'naamval', 'lidwoorden', 'subjonctif', 'conditionals', 'ser estar'],
    answer: 'Bij Grammatica kies je een taal en een onderwerp. Eerst lees je de uitleg met tabellen en voorbeelden, dan oefen je met invullen, kiezen, vertalen, fouten verbeteren en zinnen bouwen.',
    actions: [{ label: 'Grammatica', to: '/grammatica' }] },
  { id: 'videos', keywords: ['video', 'youtube', 'filmpje', 'uitlegvideo', 'math with menno', 'aantekening'],
    answer: 'Bij Video\'s plak je een YouTube-link. De video speelt in Woordwerk zelf. Je kunt aantekeningen met tijden maken (klik op de tijd om terug te springen) en de video koppelen aan een lijst of grammatica-onderwerp.',
    actions: [{ label: "Video's", to: '/videos' }] },
  { id: 'planner', keywords: ['planner', 'planning', 'toets plannen', 'leerschema', 'proefwerk', 'schema', 'agenda', 'toets'],
    answer: 'Zet je toets in de Planner: vak, datum en lijsten. Woordwerk verdeelt de woorden over de dagen ervoor en de laatste dagen herhaal je alles. Op Home zie je elke dag wat je moet doen, met een Start-knop.',
    actions: [{ label: 'Planner', to: '/planner' }] },
  { id: 'statistieken', keywords: ['statistiek', 'grafiek', 'voortgang', 'hoeveel geoefend', 'moeilijkste'],
    answer: 'Bij Statistieken zie je je oefentijd per dag of week, een kalender, je beste vakken, je moeilijkste woorden en al je badges.',
    actions: [{ label: 'Statistieken', to: '/statistieken' }] },
  { id: 'backup', keywords: ['back-up', 'backup', 'opslaan', 'kwijt', 'ander apparaat', 'nieuwe telefoon', 'verhuizen', 'exporteren'],
    answer: 'Alles staat alleen op dit apparaat. Bij Instellingen → Back-up kies je Exporteer alles: dan krijg je één bestand. Met Importeer back-up zet je het terug, ook op een ander apparaat.',
    actions: [{ label: 'Instellingen', to: '/instellingen' }] },
  { id: 'installeren', keywords: ['installeren', 'app', 'beginscherm', 'startscherm', 'offline', 'zonder internet', 'icoon'],
    answer: 'Zet Woordwerk op je beginscherm. Op iPhone: Safari → Delen → Zet op beginscherm. Op Android: menu → Toevoegen aan startscherm. Daarna werkt het ook zonder internet (behalve video\'s en de eerste keer tekst herkennen). Op iPhone kan je streak als getal op het icoon staan (Instellingen).',
    actions: [{ label: 'Instellingen', to: '/instellingen' }] },
  { id: 'donker', keywords: ['donker', 'dark mode', 'licht', 'thema', 'kleur'],
    answer: 'Rechtsboven staat de thema-knop: systeem, licht of donker. Ook bij Instellingen → Thema.',
    actions: [{ label: 'Instellingen', to: '/instellingen' }] },
  { id: 'uitspraak', keywords: ['uitspraak', 'voorlezen', 'luisteren', 'geluid', 'hoe spreek je', 'stem'],
    answer: 'Klik op het luidspreker-icoontje naast een woord om het te horen. Bij Instellingen zet je automatisch voorlezen en geluidjes aan of uit.',
    actions: [{ label: 'Instellingen', to: '/instellingen' }] },
  { id: 'andere-talen', keywords: ['zweeds', 'pools', 'italiaans', 'portugees', 'russisch', 'turks', 'nieuwe taal', 'startlijst', 'andere taal'],
    answer: 'Voor talen die je meestal niet op school krijgt, staan er startlijsten (begroeten, getallen, eten) onder Mijn lijsten → Een nieuwe taal proberen.',
    actions: [{ label: 'Startlijsten', to: '/lijsten' }] },
  { id: 'privacy', keywords: ['privacy', 'account', 'inloggen', 'wachtwoord', 'gegevens', 'veilig'],
    answer: 'Woordwerk heeft geen account nodig. Alles wat je invoert, blijft in je eigen browser op dit apparaat. Niemand anders kan het zien.' },
  { id: 'tips', keywords: ['tip', 'hoe leer ik', 'beter leren', 'snel leren', 'onthouden lukt niet', 'woordjes leren', 'studeren'],
    answer: 'Een paar tips: 1) Oefen elke dag een beetje, liever 10 minuten per dag dan een uur de avond ervoor. 2) Gebruik de Leren-modus: kaart, meerkeuze en typen. 3) Doe elke dag "Vandaag herhalen". 4) Oefen ook de andere richting. 5) Doe de dag voor de toets een Toets-ronde en oefen daarna alleen je fouten.',
    actions: [{ label: 'Oefenen', to: '/oefenen' }] },
];

export const suggestions = ['Hoe maak ik een lijst?', 'Hoe scan ik mijn boek?', 'Wat is een streak?', 'Hoe plan ik een toets?', 'Tips om beter te leren'];
