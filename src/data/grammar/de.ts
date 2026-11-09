/** DUITSE GRAMMATICA: uitleg en oefeningen (zelf geschreven). */
import { tenseTopic } from '@/features/grammar/tenseTopic';
import type { TopicContent } from '@/features/grammar/types';

const t = (id: string, tenses: string[], models: string[], blocks: TopicContent['blocks'], verbs?: (inf: string, tags: string[]) => boolean) =>
  tenseTopic({ id, lang: 'de', tenses, models, blocks, verbs });

export const deGrammar: TopicContent[] = [
  {
    id: 'naamvallen',
    blocks: [
      { type: 'text', text: 'Duits heeft vier **naamvallen**. Die bepalen de vorm van het lidwoord. **Nominativ**: onderwerp (wie/wat doet iets?). **Akkusativ**: lijdend voorwerp (wie/wat + onderwerp + werkwoord?). **Dativ**: meewerkend voorwerp (aan/voor wie?). **Genitiv**: bezit (van wie?).' },
      { type: 'table', caption: 'Bepaald lidwoord (der/die/das)', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig', 'meervoud'], rows: [['Nominativ', 'der', 'die', 'das', 'die'], ['Akkusativ', 'den', 'die', 'das', 'die'], ['Dativ', 'dem', 'der', 'dem', 'den (+n)'], ['Genitiv', 'des (+s)', 'der', 'des (+s)', 'der']] },
      { type: 'table', caption: 'Onbepaald lidwoord (ein) en kein', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig', 'meervoud (kein)'], rows: [['Nominativ', 'ein', 'eine', 'ein', 'keine'], ['Akkusativ', 'einen', 'eine', 'ein', 'keine'], ['Dativ', 'einem', 'einer', 'einem', 'keinen'], ['Genitiv', 'eines', 'einer', 'eines', 'keiner']] },
      { type: 'text', text: 'De bezittelijke voornaamwoorden (**mein, dein, sein, ihr, unser, euer, ihr, Ihr**) krijgen dezelfde uitgangen als ein/kein: Ich sehe mein**en** Bruder.' },
      { type: 'tip', text: 'Alleen mannelijk verandert in de Akkusativ: der → den, ein → einen. In de Dativ meervoud krijgt het zelfstandig naamwoord een extra -n: mit den Kinder**n**.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Ich sehe ___ Hund.', answer: 'den', hint: 'der', explain: 'Lijdend voorwerp, mannelijk: den.' },
      { type: 'gap', sentence: 'Ich gebe ___ Frau ein Buch.', answer: 'der', hint: 'die', explain: 'Meewerkend voorwerp (aan wie?), vrouwelijk: der.' },
      { type: 'gap', sentence: 'Das ist das Auto ___ Vaters.', answer: 'des', hint: 'der', explain: 'Genitiv mannelijk: des (+s).' },
      { type: 'gap', sentence: 'Wir helfen ___ Kind.', answer: 'dem', hint: 'das', explain: 'helfen gaat altijd met de Dativ.' },
      { type: 'gap', sentence: 'Ich habe ___ Bruder.', answer: 'einen', hint: 'ein' },
      { type: 'gap', sentence: 'Er kommt mit ___ Freunden.', answer: 'seinen', hint: 'seine', explain: 'mit + Dativ, meervoud: seinen.' },
      { type: 'gap', sentence: 'Ich habe ___ Zeit.', answer: 'keine', hint: 'kein', explain: 'Zeit is vrouwelijk, Akkusativ: keine.' },
      { type: 'table', title: 'der (mannelijk) in alle naamvallen', rows: [{ label: 'Nominativ', answer: 'der' }, { label: 'Akkusativ', answer: 'den' }, { label: 'Dativ', answer: 'dem' }, { label: 'Genitiv', answer: 'des' }] },
      { type: 'table', title: 'die (vrouwelijk) in alle naamvallen', rows: [{ label: 'Nominativ', answer: 'die' }, { label: 'Akkusativ', answer: 'die' }, { label: 'Dativ', answer: 'der' }, { label: 'Genitiv', answer: 'der' }] },
    ],
  },
  {
    id: 'voorzetsels',
    blocks: [
      { type: 'table', head: ['naamval', 'voorzetsels'], rows: [['altijd Akkusativ', 'durch, für, gegen, ohne, um, bis'], ['altijd Dativ', 'aus, außer, bei, mit, nach, seit, von, zu, gegenüber'], ['wisselvoorzetsels', 'an, auf, hinter, in, neben, über, unter, vor, zwischen']] },
      { type: 'text', text: 'Bij **wisselvoorzetsels** hangt de naamval af van de vraag: **Wohin?** (beweging naar een plek) → **Akkusativ**: Ich gehe in **die** Schule. **Wo?** (plaats, geen verplaatsing) → **Dativ**: Ich bin in **der** Schule.' },
      { type: 'table', caption: 'Samentrekkingen', head: ['kort', 'lang'], rows: [['im', 'in dem'], ['ins', 'in das'], ['am', 'an dem'], ['ans', 'an das'], ['zum', 'zu dem'], ['zur', 'zu der'], ['vom', 'von dem'], ['beim', 'bei dem']] },
    ],
    exercises: [
      { type: 'gap', sentence: 'Ich gehe in ___ Schule. (die, wohin?)', answer: 'die' },
      { type: 'gap', sentence: 'Ich bin in ___ Schule. (die, wo?)', answer: 'der' },
      { type: 'gap', sentence: 'Das Buch liegt auf ___ Tisch. (der)', answer: 'dem', explain: 'Wo? → Dativ.' },
      { type: 'gap', sentence: 'Ich lege das Buch auf ___ Tisch. (der)', answer: 'den', explain: 'Wohin? → Akkusativ.' },
      { type: 'gap', sentence: 'Wir fahren mit ___ Bus. (der)', answer: 'dem', explain: 'mit = altijd Dativ.' },
      { type: 'gap', sentence: 'Das Geschenk ist für ___ Mutter. (meine)', answer: 'meine', explain: 'für = altijd Akkusativ.' },
      { type: 'gap', sentence: 'Er geht ___ Kino. (in + das)', answer: 'ins' },
      { type: 'gap', sentence: 'Ich wohne seit ___ Jahr hier. (ein)', answer: 'einem', explain: 'seit = altijd Dativ.' },
      { type: 'choice', question: 'Wir gehen durch ___ Park.', options: ['den', 'dem', 'der', 'des'], answer: 0, explain: 'durch = altijd Akkusativ, Park is mannelijk.' },
    ],
  },
  {
    id: 'adjektivdeklination',
    blocks: [
      { type: 'text', text: 'Een bijvoeglijk naamwoord **vóór** een zelfstandig naamwoord krijgt een uitgang. Die hangt af van wat ervoor staat.' },
      { type: 'table', caption: 'Na der/die/das (zwak): -e of -en', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig', 'meervoud'], rows: [['Nom', 'der alte Mann', 'die alte Frau', 'das alte Haus', 'die alten Leute'], ['Akk', 'den alten Mann', 'die alte Frau', 'das alte Haus', 'die alten Leute'], ['Dat', 'dem alten Mann', 'der alten Frau', 'dem alten Haus', 'den alten Leuten']] },
      { type: 'table', caption: 'Na ein/kein/mein (gemengd)', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig', 'meervoud'], rows: [['Nom', 'ein alter Mann', 'eine alte Frau', 'ein altes Haus', 'keine alten Leute'], ['Akk', 'einen alten Mann', 'eine alte Frau', 'ein altes Haus', 'keine alten Leute'], ['Dat', 'einem alten Mann', 'einer alten Frau', 'einem alten Haus', 'keinen alten Leuten']] },
      { type: 'text', text: 'Zonder lidwoord (sterk) neemt het bijvoeglijk naamwoord de uitgang van der/die/das over: kalt**er** Kaffee, kalt**e** Milch, kalt**es** Wasser, mit kalt**em** Wasser.' },
      { type: 'tip', text: 'Na ein bij mannelijk en onzijdig zie je het geslacht aan het bijvoeglijk naamwoord: ein alt**er** Mann, ein alt**es** Haus.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'der alt___ Mann', answer: 'e' },
      { type: 'gap', sentence: 'ein alt___ Mann', answer: 'er' },
      { type: 'gap', sentence: 'ein klein___ Kind', answer: 'es' },
      { type: 'gap', sentence: 'mit dem neu___ Auto', answer: 'en' },
      { type: 'gap', sentence: 'eine schön___ Frau', answer: 'e' },
      { type: 'gap', sentence: 'die jung___ Leute', answer: 'en' },
      { type: 'gap', sentence: 'kalt___ Wasser', answer: 'es' },
      { type: 'gap', sentence: 'mit gut___ Freunden', answer: 'en' },
      { type: 'gap', sentence: 'Ich kaufe einen rot___ Pullover.', answer: 'en' },
    ],
  },
  t('praesens', ['praesens'], ['machen', 'arbeiten', 'fahren'], [
    { type: 'text', text: 'Het **Präsens** gebruik je voor nu, gewoontes en vaak ook voor de toekomst (Morgen fahre ich nach Berlin).' },
    { type: 'text', text: 'Uitgangen: **-e, -st, -t, -en, -t, -en**. Eindigt de stam op -d/-t: extra e (du arbeitest). Eindigt de stam op -s/-ß/-z: du krijgt alleen -t (du tanzt).' },
    { type: 'tip', text: 'Sterke werkwoorden veranderen bij **du** en **er/sie/es** van klinker: a → ä (du fährst), e → i (du gibst), e → ie (du siehst).' },
  ]),
  t('perfekt', ['perfekt'], ['machen', 'gehen', 'lesen'], [
    { type: 'text', text: 'Het **Perfekt** is de verleden tijd van de spreektaal: Ich habe Fußball gespielt.' },
    { type: 'text', text: 'Vorm: **haben** of **sein** + **Partizip II** (achteraan in de zin). Zwak: ge-…-t (gemacht). Sterk: ge-…-en (gesehen, gegangen). Geen ge- bij -ieren (studiert) en bij be-, ver-, er-, ent-… (besucht, verstanden).' },
    { type: 'text', text: 'Met **sein**: beweging of verandering van plaats/toestand (gehen, fahren, kommen, aufstehen, werden, sterben) en sein en bleiben.' },
  ]),
  t('praeteritum', ['praeteritum'], ['machen', 'gehen', 'sein'], [
    { type: 'text', text: 'Het **Präteritum** gebruik je vooral in verhalen en geschreven tekst. In de spreektaal vooral bij **sein, haben** en de modale werkwoorden: Ich war krank. Ich hatte keine Zeit.' },
    { type: 'text', text: 'Zwak: stam + **-te** + uitgang (ich machte, du machtest). Sterk: een nieuwe stam (ging, kam, sah) met bij ich en er/sie/es géén uitgang.' },
  ]),
  t('plusquamperfekt', ['plusquamperfekt'], ['machen', 'gehen'], [
    { type: 'text', text: 'Het **Plusquamperfekt** is voor iets dat vóór een ander moment in het verleden gebeurde: Als ich ankam, war der Zug schon abgefahren. Vorm: **hatte/war** + Partizip II.' },
  ]),
  t('futur-1', ['futur1'], ['machen', 'sein'], [
    { type: 'text', text: '**Futur I** = **werden** + **infinitief** (achteraan): Ich werde morgen kommen. Vaak gebruik je in het Duits gewoon het Präsens met een tijdsbepaling.' },
  ]),
  t('konjunktiv-2', ['konjunktiv2'], ['machen', 'sein', 'haben'], [
    { type: 'text', text: 'De **Konjunktiv II** betekent “zou(den)”. Je gebruikt hem voor wensen, beleefde vragen en dingen die niet echt zo zijn: Wenn ich Zeit **hätte**, **würde** ich kommen.' },
    { type: 'text', text: 'Meestal: **würde** + infinitief. Bij **sein** (wäre), **haben** (hätte), **werden** (würde) en de **modale werkwoorden** (könnte, müsste, dürfte, sollte, wollte, möchte) gebruik je een eigen vorm.' },
  ]),
  t('imperativ', ['imperativ'], ['machen', 'geben', 'sein'], [
    { type: 'text', text: 'De **Imperativ** (gebiedende wijs) heeft drie vormen: **du**: stam zonder -st (Mach! Komm!), **ihr**: zoals het Präsens (Macht!), **Sie**: infinitief + Sie (Machen Sie!).' },
    { type: 'tip', text: 'Bij e → i/ie in het Präsens houdt de du-vorm die klinker: Gib! Nimm! Lies! Maar a → ä niet: Fahr!' },
  ]),
  {
    id: 'passiv',
    blocks: [
      { type: 'text', text: 'Het **Passiv** (lijdende vorm) maak je met **werden** + **Partizip II**: Das Haus **wird** gebaut (wordt gebouwd).' },
      { type: 'table', head: ['tijd', 'voorbeeld'], rows: [['Präsens', 'Das Haus wird gebaut.'], ['Präteritum', 'Das Haus wurde gebaut.'], ['Perfekt', 'Das Haus ist gebaut worden.'], ['met modaal ww.', 'Das Haus muss gebaut werden.']] },
      { type: 'text', text: 'Door wie? **von** + Dativ: Der Brief wird **von** meiner Mutter geschrieben.' },
      { type: 'tip', text: 'In het Perfekt van het Passiv wordt geworden: **worden** (zonder ge-).' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Das Auto ___ repariert. (Präsens)', answer: 'wird' },
      { type: 'gap', sentence: 'Die Briefe ___ geschrieben. (Präsens)', answer: 'werden' },
      { type: 'gap', sentence: 'Das Haus ___ 1900 gebaut. (Präteritum)', answer: 'wurde' },
      { type: 'gap', sentence: 'Das Essen ist schon gekocht ___.', answer: 'worden' },
      { type: 'gap', sentence: 'Der Brief wird ___ meiner Mutter geschrieben.', answer: 'von' },
      { type: 'translate', nl: 'Het boek wordt gelezen.', answer: 'Das Buch wird gelesen.' },
      { type: 'translate', nl: 'De deur werd geopend.', answer: 'Die Tür wurde geöffnet.' },
      { type: 'fix', sentence: 'Das Haus ist gebaut geworden.', answer: 'Das Haus ist gebaut worden.', explain: 'In het Passiv: worden, niet geworden.' },
    ],
  },
  t('trennbare-verben', ['praesens', 'perfekt'], ['aufstehen', 'einkaufen'], [
    { type: 'text', text: 'Bij **scheidbare werkwoorden** (aufstehen, anrufen, einkaufen, fernsehen) gaat het voorvoegsel in een hoofdzin naar het **eind**: Ich **stehe** um sieben Uhr **auf**.' },
    { type: 'text', text: 'In het Partizip II staat **ge** tussen voorvoegsel en stam: auf**ge**standen, ein**ge**kauft. In een bijzin blijft het één woord: …, weil ich früh **aufstehe**.' },
  ], (_inf, tags) => tags.includes('scheidbaar')),
  t('modalverben', ['praesens', 'praeteritum'], ['können', 'müssen', 'wollen'], [
    { type: 'text', text: '**Modale werkwoorden**: können (kunnen), müssen (moeten), dürfen (mogen), sollen (moeten/zullen), wollen (willen), mögen (graag hebben; ich möchte = ik zou graag willen).' },
    { type: 'text', text: 'Bij ich en er/sie/es geen uitgang (ich kann, er muss). Het andere werkwoord staat als **infinitief** achteraan: Ich **kann** gut **schwimmen**.' },
  ], (_inf, tags) => tags.includes('modaal')),
  {
    id: 'reflexive-verben',
    blocks: [
      { type: 'text', text: 'Bij **wederkerende werkwoorden** hoort een wederkerend voornaamwoord: sich freuen, sich waschen, sich setzen, sich interessieren für, sich erinnern an.' },
      { type: 'table', head: ['', 'Akkusativ', 'Dativ'], rows: [['ich', 'mich', 'mir'], ['du', 'dich', 'dir'], ['er/sie/es', 'sich', 'sich'], ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie/Sie', 'sich', 'sich']] },
      { type: 'text', text: 'Is er al een lijdend voorwerp, dan gebruik je de **Dativ**: Ich wasche **mich** ↔ Ich wasche **mir** die Hände.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Ich freue ___ auf die Ferien.', answer: 'mich' },
      { type: 'gap', sentence: 'Du interessierst ___ für Musik.', answer: 'dich' },
      { type: 'gap', sentence: 'Wir treffen ___ morgen.', answer: 'uns' },
      { type: 'gap', sentence: 'Er setzt ___ auf den Stuhl.', answer: 'sich' },
      { type: 'gap', sentence: 'Erinnert ihr ___ an den Urlaub?', answer: 'euch' },
      { type: 'gap', sentence: 'Ich wasche ___ die Hände.', answer: 'mir', explain: 'die Hände is al het lijdend voorwerp → Dativ: mir.' },
      { type: 'gap', sentence: 'Putzt du ___ die Zähne?', answer: 'dir' },
      { type: 'translate', nl: 'Ik verheug me.', answer: 'Ich freue mich.' },
    ],
  },
  {
    id: 'woordvolgorde',
    blocks: [
      { type: 'text', text: '**Hoofdzin**: de persoonsvorm staat op de **tweede plaats**. Begin je met iets anders dan het onderwerp, dan komt het onderwerp ná de persoonsvorm (inversie): Ich gehe heute ins Kino → **Heute gehe ich** ins Kino.' },
      { type: 'text', text: 'Het tweede werkwoord (infinitief of Partizip II) staat **achteraan**: Ich habe das Buch **gelesen**. Ich kann gut **schwimmen**.' },
      { type: 'text', text: '**Bijzin** (na dass, weil, wenn, ob, als, obwohl …): de persoonsvorm staat **helemaal achteraan**: …, weil ich müde **bin**. …, dass ich das Buch gelesen **habe**.' },
    ],
    exercises: [
      { type: 'order', words: ['Heute', 'gehe', 'ich', 'ins', 'Kino'], nl: 'Vandaag ga ik naar de bioscoop.' },
      { type: 'order', words: ['Ich', 'habe', 'das', 'Buch', 'gelesen'], nl: 'Ik heb het boek gelezen.' },
      { type: 'order', words: ['Ich', 'bleibe', 'zu', 'Hause,', 'weil', 'ich', 'krank', 'bin'], nl: 'Ik blijf thuis, omdat ik ziek ben.' },
      { type: 'order', words: ['Er', 'sagt,', 'dass', 'er', 'keine', 'Zeit', 'hat'], nl: 'Hij zegt dat hij geen tijd heeft.' },
      { type: 'order', words: ['Morgen', 'kann', 'ich', 'nicht', 'kommen'], nl: 'Morgen kan ik niet komen.' },
      { type: 'fix', sentence: 'Ich weiß, dass er kommt morgen.', answer: 'Ich weiß, dass er morgen kommt.', explain: 'In een bijzin staat de persoonsvorm achteraan.' },
      { type: 'fix', sentence: 'Gestern ich habe Fußball gespielt.', answer: 'Gestern habe ich Fußball gespielt.', explain: 'De persoonsvorm staat op plaats 2: inversie.' },
    ],
  },
  {
    id: 'personalpronomen',
    blocks: [
      { type: 'table', head: ['Nominativ', 'Akkusativ', 'Dativ'], rows: [['ich', 'mich', 'mir'], ['du', 'dich', 'dir'], ['er', 'ihn', 'ihm'], ['sie', 'sie', 'ihr'], ['es', 'es', 'ihm'], ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie', 'sie', 'ihnen'], ['Sie', 'Sie', 'Ihnen']] },
      { type: 'tip', text: 'Werkwoorden met de Dativ: helfen, danken, gefallen, gehören, antworten, schmecken. Kannst du **mir** helfen?' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Ich sehe ___. (er)', answer: 'ihn' },
      { type: 'gap', sentence: 'Kannst du ___ helfen? (ich)', answer: 'mir' },
      { type: 'gap', sentence: 'Ich danke ___. (du)', answer: 'dir' },
      { type: 'gap', sentence: 'Das Geschenk ist für ___. (sie, enkelvoud)', answer: 'sie' },
      { type: 'gap', sentence: 'Er gibt ___ das Buch. (wir)', answer: 'uns' },
      { type: 'gap', sentence: 'Wir besuchen ___ morgen. (ihr)', answer: 'euch' },
      { type: 'gap', sentence: 'Ich schreibe ___ einen Brief. (sie, meervoud)', answer: 'ihnen' },
      { type: 'gap', sentence: 'Das Buch gehört ___. (er)', answer: 'ihm' },
    ],
  },
  {
    id: 'zahlen-uhrzeit-datum',
    blocks: [
      { type: 'text', text: 'Getallen boven de twintig zeg je net als in het Nederlands: eerst de eenheid: **einundzwanzig** (21), **fünfunddreißig** (35). Let op: sechzehn, siebzehn, dreißig (zonder z).' },
      { type: 'table', caption: 'Hoe laat is het?', head: ['tijd', 'Duits'], rows: [['3:00', 'Es ist drei Uhr.'], ['3:10', 'Es ist zehn nach drei.'], ['3:15', 'Es ist Viertel nach drei.'], ['3:30', 'Es ist halb vier.'], ['3:45', 'Es ist Viertel vor vier.']] },
      { type: 'text', text: 'Datum: **am** + rangtelwoord: am ersten Mai, am dritten Oktober. Der Wievielte ist heute? Heute ist der zehnte Juni.' },
    ],
    exercises: [
      { type: 'gap', sentence: '21 = ___', answer: 'einundzwanzig' },
      { type: 'gap', sentence: '35 = ___', answer: 'fünfunddreißig' },
      { type: 'gap', sentence: '17 = ___', answer: 'siebzehn' },
      { type: 'gap', sentence: '30 = ___', answer: 'dreißig' },
      { type: 'gap', sentence: '3:30 = Es ist ___ vier.', answer: 'halb' },
      { type: 'translate', nl: 'Het is kwart over drie.', answer: 'Es ist Viertel nach drei.' },
      { type: 'translate', nl: 'Het is kwart voor vier.', answer: 'Es ist Viertel vor vier.' },
      { type: 'gap', sentence: 'op 1 mei = am ___ Mai', answer: 'ersten' },
    ],
  },
];
