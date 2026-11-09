/** NEDERLANDSE GRAMMATICA (zelf geschreven). */
import type { TopicContent } from '@/features/grammar/types';

export const nlGrammar: TopicContent[] = [
  {
    id: 'werkwoordspelling',
    blocks: [
      { type: 'text', text: 'De **stam** van een werkwoord is de ik-vorm: worden → **word**, vinden → **vind**, lopen → **loop**.' },
      { type: 'table', head: ['persoon', 'regel', 'voorbeeld'], rows: [['ik', 'stam', 'ik word, ik vind'], ['jij / je, u, hij, zij, het', 'stam + t', 'jij wordt, hij vindt, u wordt'], ['jij/je **achter** de persoonsvorm', 'stam (geen t!)', 'word jij?, vind je dat?'], ['wij, jullie, zij', 'hele werkwoord', 'wij worden']] },
      { type: 'tip', text: 'Twijfel je tussen d, t of dt? Vervang het werkwoord door **lopen**: hij loopt → hij word**t**. Loop jij? → Word jij? (geen t).' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Hij ___ morgen zestien.', answer: 'wordt', hint: 'worden' },
      { type: 'gap', sentence: '___ jij morgen zestien?', answer: 'Word', hint: 'worden', explain: 'jij staat achter de persoonsvorm: geen t.' },
      { type: 'gap', sentence: 'Ik ___ het een leuk boek.', answer: 'vind', hint: 'vinden' },
      { type: 'gap', sentence: 'Jij ___ altijd je sleutels.', answer: 'vergeet', hint: 'vergeten', explain: 'Stam vergeet + t → vergeett is geen Nederlands: de stam eindigt al op t.' },
      { type: 'gap', sentence: 'Wanneer ___ je jarig?', answer: 'word', hint: 'worden' },
      { type: 'gap', sentence: 'Het ___ steeds kouder.', answer: 'wordt', hint: 'worden' },
      { type: 'choice', question: 'Welke zin is goed?', options: ['Hij antwoordt niet.', 'Hij antwoord niet.', 'Hij antwoordd niet.'], answer: 0 },
      { type: 'fix', sentence: 'Vindt jij dit ook moeilijk?', answer: 'Vind jij dit ook moeilijk?', explain: 'jij achter de persoonsvorm: alleen de stam.' },
    ],
  },
  {
    id: 'verleden-tijd',
    blocks: [
      { type: 'text', text: 'Zwakke werkwoorden: **stam + te(n)** of **stam + de(n)**. Eindigt de stam op een letter uit **’t kofschip** (t, k, f, s, ch, p), dan **-te**. Anders **-de**.' },
      { type: 'table', head: ['hele ww.', 'stam', 'verleden tijd'], rows: [['werken', 'werk', 'werkte'], ['fietsen', 'fiets', 'fietste'], ['praten', 'praat', 'praatte'], ['wonen', 'woon', 'woonde'], ['branden', 'brand', 'brandde'], ['leven', 'leef', 'leefde'], ['verhuizen', 'verhuis', 'verhuisde']] },
      { type: 'tip', text: 'Bij leven en verhuizen kijk je naar de **v** en **z** in het hele werkwoord: die staan niet in ’t kofschip, dus -de.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Gisteren ___ wij naar school.', answer: 'fietsten', hint: 'fietsen' },
      { type: 'gap', sentence: 'Vorig jaar ___ ze naar Utrecht.', answer: 'verhuisde', hint: 'verhuizen' },
      { type: 'gap', sentence: 'Hij ___ veel te veel.', answer: 'praatte', hint: 'praten' },
      { type: 'gap', sentence: 'Wij ___ vroeger in Gent.', answer: 'woonden', hint: 'wonen' },
      { type: 'gap', sentence: 'Het vuur ___ de hele nacht.', answer: 'brandde', hint: 'branden' },
      { type: 'gap', sentence: 'Zij ___ hard voor haar toets.', answer: 'werkte', hint: 'werken' },
      { type: 'gap', sentence: 'De dinosaurus ___ miljoenen jaren geleden.', answer: 'leefde', hint: 'leven' },
      { type: 'gap', sentence: 'Ik ___ de hond.', answer: 'redde', hint: 'redden' },
    ],
  },
  {
    id: 'voltooid-deelwoord',
    blocks: [
      { type: 'text', text: 'Zwak voltooid deelwoord: **ge + stam + t/d**. Ook hier ’t kofschip: gewerkt, gefietst, gewoond. Eindigt de stam al op t of d, dan komt er niets bij: gepraat, gebrand.' },
      { type: 'text', text: 'Begint het werkwoord met **be-, ge-, her-, ver-, ont-** of **er-**, dan komt er geen ge- voor: betaald, verhuisd, herhaald, ontdekt.' },
      { type: 'tip', text: 'Twijfel je tussen d en t aan het eind? Maak het deelwoord langer: verhuisd → de verhuis**d**e dozen. Betaald → de betaal**d**e rekening.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Ik heb mijn huiswerk ___.', answer: 'gemaakt', hint: 'maken' },
      { type: 'gap', sentence: 'De brief is gisteren ___.', answer: 'verstuurd', hint: 'versturen' },
      { type: 'gap', sentence: 'Heb jij de rekening al ___?', answer: 'betaald', hint: 'betalen' },
      { type: 'gap', sentence: 'Ik heb de vraag ___.', answer: 'beantwoord', hint: 'beantwoorden' },
      { type: 'gap', sentence: 'We hebben lang ___.', answer: 'gepraat', hint: 'praten' },
      { type: 'gap', sentence: 'Zij is vorig jaar ___.', answer: 'verhuisd', hint: 'verhuizen' },
      { type: 'gap', sentence: 'Wie heeft Amerika ___?', answer: 'ontdekt', hint: 'ontdekken' },
      { type: 'gap', sentence: 'Hij heeft de hele dag ___.', answer: 'gefietst', hint: 'fietsen' },
    ],
  },
  {
    id: 'zinsontleding',
    blocks: [
      { type: 'table', head: ['zinsdeel', 'hoe vind je het?'], rows: [['persoonsvorm (pv)', 'Verandert als je de zin in een andere tijd of in het meervoud/enkelvoud zet. Staat vooraan in een vraag.'], ['onderwerp (ow)', 'Wie of wat + pv?'], ['werkwoordelijk gezegde (wg)', 'Alle werkwoorden in de zin.'], ['naamwoordelijk gezegde (ng)', 'Koppelwerkwoord (zijn, worden, blijven, lijken, schijnen, blijken, heten) + wat over het onderwerp gezegd wordt.'], ['lijdend voorwerp (lv)', 'Wie of wat + gezegde + onderwerp?'], ['meewerkend voorwerp (mv)', 'Aan of voor wie/wat? (soms staat aan/voor er al)'], ['bijwoordelijke bepaling (bwb)', 'Waar, wanneer, hoe, waarom…?']] },
      { type: 'examples', items: [['Mijn broer | geeft | de hond | een koekje.', 'ow | pv | mv | lv'], ['Morgen | gaan | wij | naar Parijs.', 'bwb | pv | ow | bwb']] },
    ],
    exercises: [
      { type: 'choice', question: '"Morgen gaan wij naar Parijs." Wat is de persoonsvorm?', options: ['Morgen', 'gaan', 'wij', 'naar Parijs'], answer: 1 },
      { type: 'choice', question: '"Morgen gaan wij naar Parijs." Wat is het onderwerp?', options: ['Morgen', 'gaan', 'wij', 'Parijs'], answer: 2 },
      { type: 'choice', question: '"Mijn broer geeft de hond een koekje." Wat is het lijdend voorwerp?', options: ['Mijn broer', 'de hond', 'een koekje', 'geeft'], answer: 2 },
      { type: 'choice', question: '"Ik stuur mijn oma een kaart." Wat is het meewerkend voorwerp?', options: ['Ik', 'mijn oma', 'een kaart', 'stuur'], answer: 1 },
      { type: 'choice', question: '"Gisteren heeft Sanne haar fiets gerepareerd." Wat is het werkwoordelijk gezegde?', options: ['heeft', 'gerepareerd', 'heeft gerepareerd', 'Gisteren'], answer: 2 },
      { type: 'choice', question: '"Hij is erg moe." Wat voor gezegde is "is erg moe"?', options: ['werkwoordelijk gezegde', 'naamwoordelijk gezegde', 'lijdend voorwerp', 'bijwoordelijke bepaling'], answer: 1, explain: 'zijn is hier een koppelwerkwoord.' },
      { type: 'choice', question: '"In de zomer zwemmen we in zee." Wat is "in de zomer"?', options: ['onderwerp', 'lijdend voorwerp', 'bijwoordelijke bepaling', 'meewerkend voorwerp'], answer: 2 },
    ],
  },
  {
    id: 'woordsoorten',
    blocks: [
      { type: 'table', head: ['woordsoort', 'voorbeeld'], rows: [['zelfstandig naamwoord', 'huis, liefde, Amsterdam'], ['bijvoeglijk naamwoord', 'een **snelle** auto'], ['werkwoord', 'lopen, is, heeft'], ['lidwoord', 'de, het, een'], ['voornaamwoord', 'ik, mijn, deze, die, wie'], ['telwoord', 'drie, derde, veel'], ['bijwoord', 'hij rent **snel**, heel, gisteren'], ['voorzetsel', 'op, in, naar, met'], ['voegwoord', 'en, maar, omdat, dat'], ['tussenwerpsel', 'au!, hé, nou']] },
      { type: 'tip', text: 'Een bijvoeglijk naamwoord zegt iets over een zelfstandig naamwoord; een bijwoord over iets anders (een werkwoord, een bijvoeglijk naamwoord of de hele zin).' },
    ],
    exercises: [
      { type: 'choice', question: '"Hij rent snel." Welke woordsoort is "snel"?', options: ['bijvoeglijk naamwoord', 'bijwoord', 'werkwoord', 'voorzetsel'], answer: 1 },
      { type: 'choice', question: '"een snelle auto": "snelle" is een…', options: ['bijvoeglijk naamwoord', 'bijwoord', 'zelfstandig naamwoord', 'telwoord'], answer: 0 },
      { type: 'choice', question: '"Ik blijf thuis omdat ik ziek ben." "omdat" is een…', options: ['voorzetsel', 'voegwoord', 'bijwoord', 'voornaamwoord'], answer: 1 },
      { type: 'choice', question: '"Het boek ligt op tafel." "op" is een…', options: ['voorzetsel', 'voegwoord', 'lidwoord', 'bijwoord'], answer: 0 },
      { type: 'choice', question: '"Ik heb drie broers." "drie" is een…', options: ['telwoord', 'bijvoeglijk naamwoord', 'lidwoord', 'voornaamwoord'], answer: 0 },
      { type: 'choice', question: '"Zij leest een boek." "Zij" is een…', options: ['lidwoord', 'voornaamwoord', 'zelfstandig naamwoord', 'voegwoord'], answer: 1 },
      { type: 'choice', question: '"Au! Dat doet pijn." "Au" is een…', options: ['tussenwerpsel', 'bijwoord', 'werkwoord', 'telwoord'], answer: 0 },
    ],
  },
];
