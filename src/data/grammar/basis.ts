/**
 * BASISGRAMMATICA voor talen die je meestal niet op school krijgt:
 * lidwoorden/geslacht en telwoorden. (De werkwoorden volgen later.)
 * De telwoorden komen uit de startlijsten (src/data/starter), zodat ze overal gelijk zijn.
 */
import type { LanguageCode } from '@/data/languages';
import { starterLists } from '@/data/starter';
import type { Block, Exercise, TopicContent } from '@/features/grammar/types';

function telwoorden(lang: LanguageCode, extra: Block[] = []): TopicContent {
  const list = starterLists.find((s) => s.lang === lang && s.id.endsWith('getallen'))!;
  const nums = list.words;
  return {
    id: 'telwoorden',
    blocks: [{ type: 'table', head: ['getal', 'woord'], rows: nums.map(([w], i) => [String(i + 1), w.replace(/; /g, ' / ')]) }, ...extra],
    exercises: nums.map(([w], i): Exercise => ({ type: 'gap', sentence: `${i + 1} = ___`, answer: w })),
  };
}

const kies = (question: string, options: string[], answer: number, explain?: string): Exercise => ({ type: 'choice', question, options, answer, explain });

const geslacht = (blocks: Block[], exercises: Exercise[]): TopicContent => ({ id: 'lidwoorden-geslacht', blocks, exercises });

export const basisGrammar: Partial<Record<LanguageCode, TopicContent[]>> = {
  sv: [
    geslacht(
      [
        { type: 'text', text: 'Zweeds heeft twee geslachten: **en**-woorden en **ett**-woorden. Ongeveer drie op de vier woorden is een en-woord: en bil (een auto), ett hus (een huis).' },
        { type: 'text', text: 'Het **bepaald lidwoord** staat achter het woord vast: bil**en** (de auto), hus**et** (het huis).' },
        { type: 'table', head: ['', 'en-woord', 'ett-woord'], rows: [['onbepaald', 'en ost', 'ett äpple'], ['bepaald', 'osten', 'äpplet']] },
      ],
      [kies('___ bröd', ['en', 'ett'], 1), kies('___ ost', ['en', 'ett'], 0), kies('___ ägg', ['en', 'ett'], 1), kies('___ fisk', ['en', 'ett'], 0), kies('"huset" betekent…', ['het huis', 'een huis', 'huizen'], 0), kies('de vis = ', ['fisken', 'fisket', 'en fisk'], 0)],
    ),
    telwoorden('sv'),
  ],
  da: [
    geslacht(
      [
        { type: 'text', text: 'Deens heeft twee geslachten: **en**-woorden en **et**-woorden: en bil, et hus. Het bepaald lidwoord komt achter het woord: bil**en**, hus**et**.' },
        { type: 'table', head: ['', 'en-woord', 'et-woord'], rows: [['onbepaald', 'en ost', 'et æble'], ['bepaald', 'osten', 'æblet']] },
      ],
      [kies('___ brød', ['en', 'et'], 1), kies('___ ost', ['en', 'et'], 0), kies('___ æg', ['en', 'et'], 1), kies('___ kartoffel', ['en', 'et'], 0), kies('"vandet" betekent…', ['het water', 'een water', 'wateren'], 0)],
    ),
    telwoorden('da'),
  ],
  no: [
    geslacht(
      [
        { type: 'text', text: 'Noors (bokmål) heeft drie geslachten: **en** (mannelijk), **ei** (vrouwelijk; je mag ook en gebruiken) en **et** (onzijdig): en bil, ei/en bok, et hus.' },
        { type: 'text', text: 'Het bepaald lidwoord komt achter het woord: bil**en**, bok**a**/bok**en**, hus**et**.' },
      ],
      [kies('___ brød', ['en', 'et'], 1), kies('___ fisk', ['en', 'et'], 0), kies('___ eple', ['en', 'et'], 1), kies('"huset" betekent…', ['het huis', 'een huis', 'huizen'], 0)],
    ),
    telwoorden('no'),
  ],
  pl: [
    geslacht(
      [
        { type: 'text', text: 'Pools heeft **geen lidwoorden**: dom = huis, een huis of het huis. Wel zijn er drie geslachten, die je vaak aan het eind van het woord ziet.' },
        { type: 'table', head: ['geslacht', 'eindigt meestal op', 'voorbeeld'], rows: [['mannelijk', 'medeklinker', 'chleb, ser'], ['vrouwelijk', '-a', 'woda, kawa, ryba'], ['onzijdig', '-o of -e', 'mleko, jajko']] },
      ],
      [kies('Welk geslacht heeft "kawa"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 1), kies('Welk geslacht heeft "mleko"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 2), kies('Welk geslacht heeft "ser"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 0), kies('Heeft Pools lidwoorden zoals "de" en "het"?', ['ja', 'nee'], 1)],
    ),
    telwoorden('pl'),
  ],
  cs: [
    geslacht(
      [
        { type: 'text', text: 'Tsjechisch heeft **geen lidwoorden**. Er zijn drie geslachten (bij mannelijk ook nog bezield/onbezield).' },
        { type: 'table', head: ['geslacht', 'eindigt meestal op', 'voorbeeld'], rows: [['mannelijk', 'medeklinker', 'chléb, sýr'], ['vrouwelijk', '-a (of -e)', 'voda, káva, ryba'], ['onzijdig', '-o (of -e/-í)', 'mléko, maso']] },
      ],
      [kies('Welk geslacht heeft "voda"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 1), kies('Welk geslacht heeft "maso"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 2), kies('Welk geslacht heeft "sýr"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 0)],
    ),
    telwoorden('cs'),
  ],
  ru: [
    geslacht(
      [
        { type: 'text', text: 'Russisch heeft **geen lidwoorden**. Er zijn drie geslachten; je ziet ze meestal aan de laatste letter.' },
        { type: 'table', head: ['geslacht', 'eindigt meestal op', 'voorbeeld'], rows: [['mannelijk', 'medeklinker (of -й)', 'хлеб, сыр'], ['vrouwelijk', '-а / -я', 'вода, рыба'], ['onzijdig', '-о / -е', 'молоко, мясо']] },
        { type: 'tip', text: 'Woorden op een zacht teken (-ь) kunnen mannelijk én vrouwelijk zijn; die moet je leren.' },
      ],
      [kies('Welk geslacht heeft "вода"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 1), kies('Welk geslacht heeft "молоко"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 2), kies('Welk geslacht heeft "хлеб"?', ['mannelijk', 'vrouwelijk', 'onzijdig'], 0)],
    ),
    telwoorden('ru'),
  ],
  fi: [
    geslacht(
      [
        { type: 'text', text: 'Fins heeft **geen lidwoorden en geen geslacht**. Er is zelfs maar één woord voor hij en zij: **hän**.' },
        { type: 'text', text: 'In plaats daarvan heeft Fins veel **naamvallen** (uitgangen achter het woord), bijvoorbeeld talo (huis), talossa (in het huis), talosta (uit het huis).' },
      ],
      [kies('Hoe zeg je "hij" in het Fins?', ['hän', 'se', 'hän voor hij, hun voor zij'], 0), kies('Heeft Fins lidwoorden?', ['ja', 'nee'], 1), kies('"talossa" betekent…', ['in het huis', 'uit het huis', 'naar het huis'], 0), kies('"talosta" betekent…', ['in het huis', 'uit het huis', 'het huis'], 1)],
    ),
    telwoorden('fi'),
  ],
  tr: [
    geslacht(
      [
        { type: 'text', text: 'Turks heeft **geen geslacht** en **geen bepaald lidwoord**. Voor “een” gebruik je soms **bir**: bir elma (een appel). O betekent hij, zij én het.' },
        { type: 'text', text: 'Turks plakt uitgangen achter het woord. Het meervoud is **-ler** of **-lar** (klinkerharmonie): ev → evler (huizen), elma → elmalar (appels).' },
      ],
      [kies('"evler" betekent…', ['huizen', 'het huis', 'een huis'], 0), kies('meervoud van "elma"', ['elmalar', 'elmaler', 'elmas'], 0, 'a in elma → -lar.'), kies('meervoud van "ev"', ['evlar', 'evler', 'eves'], 1, 'e in ev → -ler.'), kies('Hoe zeg je "hij" of "zij"?', ['o', 'ben', 'sen'], 0)],
    ),
    telwoorden('tr'),
  ],
  el: [
    geslacht(
      [
        { type: 'table', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig'], rows: [['de (ev)', 'ο', 'η', 'το'], ['de (mv)', 'οι', 'οι', 'τα'], ['een', 'ένας', 'μία / μια', 'ένα']] },
        { type: 'text', text: 'Je ziet het geslacht vaak aan de uitgang: -ος / -ης / -ας meestal mannelijk (ο καφές), -α / -η vrouwelijk (η πατάτα), -ο / -ι / -μα onzijdig (το νερό, το ψωμί).' },
      ],
      [kies('___ νερό', ['ο', 'η', 'το'], 2), kies('___ καφές', ['ο', 'η', 'το'], 0), kies('___ πατάτα', ['ο', 'η', 'το'], 1), kies('___ ψωμί', ['ο', 'η', 'το'], 2)],
    ),
    telwoorden('el'),
  ],
  fy: [
    geslacht(
      [
        { type: 'text', text: 'Fries heeft twee bepaalde lidwoorden, net als Nederlands: **de** en **it** (het): de man, it hûs. In het meervoud is het altijd **de**: de huzen.' },
        { type: 'text', text: 'Het onbepaald lidwoord is **in** (een): in hûs, in man.' },
      ],
      [kies('___ hûs (het huis)', ['de', 'it'], 1), kies('___ huzen (de huizen)', ['de', 'it'], 0), kies('Hoe zeg je "een" in het Fries?', ['in', 'ien', 'en'], 0)],
    ),
    {
      id: 'telwoorden',
      blocks: [{ type: 'table', head: ['getal', 'woord'], rows: ['ien', 'twa', 'trije', 'fjouwer', 'fiif', 'seis', 'sân', 'acht', 'njoggen', 'tsien'].map((w, i) => [String(i + 1), w]) }],
      exercises: ['ien', 'twa', 'trije', 'fjouwer', 'fiif', 'seis', 'sân', 'acht', 'njoggen', 'tsien'].map((w, i): Exercise => ({ type: 'gap', sentence: `${i + 1} = ___`, answer: w })),
    },
  ],
  grc: [
    {
      id: 'alfabet-accenten',
      blocks: [
        { type: 'table', head: ['letter', 'naam', 'klank'], rows: [['α', 'alfa', 'a'], ['β', 'bèta', 'b'], ['γ', 'gamma', 'g'], ['δ', 'delta', 'd'], ['ε', 'epsilon', 'e (kort)'], ['ζ', 'dzèta', 'dz'], ['η', 'èta', 'è (lang)'], ['θ', 'thèta', 'th'], ['ι', 'jota', 'i'], ['κ', 'kappa', 'k'], ['λ', 'lambda', 'l'], ['μ', 'mu', 'm'], ['ν', 'nu', 'n'], ['ξ', 'ksi', 'ks'], ['ο', 'omikron', 'o (kort)'], ['π', 'pi', 'p'], ['ρ', 'rho', 'r'], ['σ / ς', 'sigma', 's (ς aan het eind van een woord)'], ['τ', 'tau', 't'], ['υ', 'upsilon', 'u (als in Frans "tu")'], ['φ', 'phi', 'f'], ['χ', 'chi', 'ch'], ['ψ', 'psi', 'ps'], ['ω', 'omega', 'ō (lange o)']] },
        { type: 'text', text: 'Accenten: **acutus** (ά), **gravis** (ὰ), **circumflexus** (ᾶ). Een woord dat met een klinker begint, heeft een **spiritus**: lenis (ἀ, geen h) of asper (ἁ, met h-klank).' },
      ],
      exercises: [
        { type: 'choice', question: 'Welke letter is de "ph"?', options: ['φ', 'ψ', 'θ', 'χ'], answer: 0 },
        { type: 'choice', question: 'Welke letter is de lange o?', options: ['ο', 'ω', 'υ', 'θ'], answer: 1 },
        { type: 'choice', question: 'Wanneer schrijf je ς?', options: ['aan het eind van een woord', 'aan het begin', 'altijd'], answer: 0 },
        { type: 'choice', question: 'ἁ heeft een…', options: ['spiritus asper (h-klank)', 'spiritus lenis', 'acutus'], answer: 0 },
        { type: 'choice', question: 'Hoe spreek je ψ uit?', options: ['ps', 'ks', 'ch', 'f'], answer: 0 },
      ],
    },
    {
      id: 'lidwoord',
      blocks: [
        { type: 'table', caption: 'Lidwoord enkelvoud', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig'], rows: [['nominativus', 'ὁ', 'ἡ', 'τό'], ['genitivus', 'τοῦ', 'τῆς', 'τοῦ'], ['dativus', 'τῷ', 'τῇ', 'τῷ'], ['accusativus', 'τόν', 'τήν', 'τό']] },
        { type: 'table', caption: 'Lidwoord meervoud', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig'], rows: [['nominativus', 'οἱ', 'αἱ', 'τά'], ['genitivus', 'τῶν', 'τῶν', 'τῶν'], ['dativus', 'τοῖς', 'ταῖς', 'τοῖς'], ['accusativus', 'τούς', 'τάς', 'τά']] },
      ],
      exercises: [
        { type: 'choice', question: 'accusativus ev mannelijk', options: ['τόν', 'τοῦ', 'τῷ', 'ὁ'], answer: 0 },
        { type: 'choice', question: 'genitivus mv (alle geslachten)', options: ['τῶν', 'τοῖς', 'τούς', 'οἱ'], answer: 0 },
        { type: 'choice', question: 'nominativus ev vrouwelijk', options: ['ἡ', 'ὁ', 'τό', 'αἱ'], answer: 0 },
        { type: 'choice', question: 'dativus mv vrouwelijk', options: ['ταῖς', 'τοῖς', 'τάς', 'τῆς'], answer: 0 },
        { type: 'choice', question: 'nominativus mv onzijdig', options: ['τά', 'οἱ', 'αἱ', 'τό'], answer: 0 },
      ],
    },
  ],
};
