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

/** Belangrijkste werkwoorden in de tegenwoordige tijd: tabel + rijtjes invullen. */
function werkwoorden(persons: string[], verbs: { inf: string; nl: string; forms: string[] }[], extra: Block[] = []): TopicContent {
  return {
    id: 'werkwoorden-presens',
    blocks: [
      ...extra,
      { type: 'table', head: ['', ...verbs.map((v) => `${v.inf} (${v.nl})`)], rows: persons.map((p, i) => [p, ...verbs.map((v) => v.forms[i]!)]) },
      { type: 'tip', text: 'Dit zijn de allerbelangrijkste werkwoorden om mee te beginnen. Er komen er later meer bij.' },
    ],
    exercises: verbs.flatMap((v): Exercise[] => [
      { type: 'table', title: `${v.inf} (${v.nl})`, rows: persons.map((p, i) => ({ label: p, answer: v.forms[i]! })) },
      ...persons.slice(0, 3).map((p, i): Exercise => ({ type: 'gap', sentence: `${p} ___ (${v.inf})`, answer: v.forms[i]! })),
    ]),
  };
}


export const basisGrammar: Partial<Record<LanguageCode, TopicContent[]>> = {
  sv: [
    werkwoorden(['jag', 'du', 'han/hon', 'vi', 'ni', 'de'], [
      { inf: 'vara', nl: 'zijn', forms: ['är', 'är', 'är', 'är', 'är', 'är'] },
      { inf: 'ha', nl: 'hebben', forms: ['har', 'har', 'har', 'har', 'har', 'har'] },
      { inf: 'tala', nl: 'spreken', forms: ['talar', 'talar', 'talar', 'talar', 'talar', 'talar'] },
    ], [{ type: 'text', text: 'Goed nieuws: Zweedse werkwoorden veranderen **niet** per persoon. Jag är, du är, vi är…' }]),
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
    werkwoorden(['jeg', 'du', 'han/hun', 'vi', 'I', 'de'], [
      { inf: 'være', nl: 'zijn', forms: ['er', 'er', 'er', 'er', 'er', 'er'] },
      { inf: 'have', nl: 'hebben', forms: ['har', 'har', 'har', 'har', 'har', 'har'] },
      { inf: 'tale', nl: 'spreken', forms: ['taler', 'taler', 'taler', 'taler', 'taler', 'taler'] },
    ], [{ type: 'text', text: 'Deense werkwoorden veranderen **niet** per persoon: jeg er, du er, vi er…' }]),
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
    werkwoorden(['jeg', 'du', 'han/hun', 'vi', 'dere', 'de'], [
      { inf: 'være', nl: 'zijn', forms: ['er', 'er', 'er', 'er', 'er', 'er'] },
      { inf: 'ha', nl: 'hebben', forms: ['har', 'har', 'har', 'har', 'har', 'har'] },
      { inf: 'snakke', nl: 'praten', forms: ['snakker', 'snakker', 'snakker', 'snakker', 'snakker', 'snakker'] },
    ], [{ type: 'text', text: 'Noorse werkwoorden veranderen **niet** per persoon: jeg er, du er, vi er…' }]),
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
    werkwoorden(['ja', 'ty', 'on/ona', 'my', 'wy', 'oni/one'], [
      { inf: 'być', nl: 'zijn', forms: ['jestem', 'jesteś', 'jest', 'jesteśmy', 'jesteście', 'są'] },
      { inf: 'mieć', nl: 'hebben', forms: ['mam', 'masz', 'ma', 'mamy', 'macie', 'mają'] },
    ]),
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
    werkwoorden(['já', 'ty', 'on/ona', 'my', 'vy', 'oni'], [
      { inf: 'být', nl: 'zijn', forms: ['jsem', 'jsi', 'je', 'jsme', 'jste', 'jsou'] },
      { inf: 'mít', nl: 'hebben', forms: ['mám', 'máš', 'má', 'máme', 'máte', 'mají'] },
    ]),
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
    werkwoorden(['я', 'ты', 'он/она', 'мы', 'вы', 'они'], [
      { inf: 'говорить', nl: 'spreken', forms: ['говорю', 'говоришь', 'говорит', 'говорим', 'говорите', 'говорят'] },
      { inf: 'читать', nl: 'lezen', forms: ['читаю', 'читаешь', 'читает', 'читаем', 'читаете', 'читают'] },
    ], [{ type: 'text', text: '"Zijn" (быть) laat je in de tegenwoordige tijd meestal weg: Я студент = ik ben student.' }]),
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
    werkwoorden(['minä', 'sinä', 'hän', 'me', 'te', 'he'], [
      { inf: 'olla', nl: 'zijn', forms: ['olen', 'olet', 'on', 'olemme', 'olette', 'ovat'] },
      { inf: 'puhua', nl: 'spreken', forms: ['puhun', 'puhut', 'puhuu', 'puhumme', 'puhutte', 'puhuvat'] },
    ]),
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
    werkwoorden(['ben', 'sen', 'o', 'biz', 'siz', 'onlar'], [
      { inf: 'gelmek', nl: 'komen (nu)', forms: ['geliyorum', 'geliyorsun', 'geliyor', 'geliyoruz', 'geliyorsunuz', 'geliyorlar'] },
      { inf: 'yapmak', nl: 'doen (nu)', forms: ['yapıyorum', 'yapıyorsun', 'yapıyor', 'yapıyoruz', 'yapıyorsunuz', 'yapıyorlar'] },
    ], [{ type: 'text', text: 'De tegenwoordige tijd (-iyor-) gebruik je voor wat nu gebeurt. De uitgang zegt wie het doet: -um (ik), -sun (jij), - (hij/zij), -uz (wij), -sunuz (jullie), -lar (zij).' }]),
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
    werkwoorden(['εγώ', 'εσύ', 'αυτός/αυτή', 'εμείς', 'εσείς', 'αυτοί'], [
      { inf: 'είμαι', nl: 'zijn', forms: ['είμαι', 'είσαι', 'είναι', 'είμαστε', 'είστε', 'είναι'] },
      { inf: 'έχω', nl: 'hebben', forms: ['έχω', 'έχεις', 'έχει', 'έχουμε', 'έχετε', 'έχουν'] },
    ]),
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
    werkwoorden(['ik', 'do', 'hy/sy', 'wy', 'jimme', 'sy'], [
      { inf: 'wêze', nl: 'zijn', forms: ['bin', 'bist', 'is', 'binne', 'binne', 'binne'] },
      { inf: 'hawwe', nl: 'hebben', forms: ['haw', 'hast', 'hat', 'hawwe', 'hawwe', 'hawwe'] },
    ]),
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
      id: 'declinaties',
      blocks: [
        { type: 'table', caption: '1e declinatie: ἡ χώρα (land)', head: ['', 'enkelvoud', 'meervoud'], rows: [['nominativus', 'ἡ χώρα', 'αἱ χῶραι'], ['genitivus', 'τῆς χώρας', 'τῶν χωρῶν'], ['dativus', 'τῇ χώρᾳ', 'ταῖς χώραις'], ['accusativus', 'τὴν χώραν', 'τὰς χώρας']] },
        { type: 'table', caption: '2e declinatie: ὁ λόγος (woord)', head: ['', 'enkelvoud', 'meervoud'], rows: [['nominativus', 'ὁ λόγος', 'οἱ λόγοι'], ['genitivus', 'τοῦ λόγου', 'τῶν λόγων'], ['dativus', 'τῷ λόγῳ', 'τοῖς λόγοις'], ['accusativus', 'τὸν λόγον', 'τοὺς λόγους']] },
        { type: 'table', caption: '2e declinatie onzijdig: τὸ δῶρον (geschenk)', head: ['', 'enkelvoud', 'meervoud'], rows: [['nominativus', 'τὸ δῶρον', 'τὰ δῶρα'], ['genitivus', 'τοῦ δώρου', 'τῶν δώρων'], ['dativus', 'τῷ δώρῳ', 'τοῖς δώροις'], ['accusativus', 'τὸ δῶρον', 'τὰ δῶρα']] },
        { type: 'tip', text: 'Het lidwoord helpt je de naamval te herkennen. Onzijdig: nominativus = accusativus, meervoud op -α.' },
      ],
      exercises: [
        { type: 'choice', question: 'λόγον', options: ['accusativus ev', 'genitivus ev', 'nominativus mv', 'dativus ev'], answer: 0 },
        { type: 'choice', question: 'λόγων', options: ['genitivus mv', 'accusativus mv', 'dativus mv', 'genitivus ev'], answer: 0 },
        { type: 'choice', question: 'χώρᾳ', options: ['dativus ev', 'nominativus ev', 'accusativus ev', 'genitivus ev'], answer: 0 },
        { type: 'choice', question: 'δῶρα', options: ['nominativus/accusativus mv', 'genitivus ev', 'dativus mv', 'nominativus ev'], answer: 0 },
        { type: 'choice', question: 'λόγους', options: ['accusativus mv', 'nominativus mv', 'genitivus ev', 'dativus mv'], answer: 0 },
        { type: 'choice', question: 'χωρῶν', options: ['genitivus mv', 'dativus mv', 'accusativus mv', 'nominativus mv'], answer: 0 },
      ],
    },
    {
      id: 'werkwoorden',
      blocks: [
        { type: 'table', caption: 'λύω (losmaken): indicativus activum', head: ['', 'praesens', 'imperfectum', 'aoristus'], rows: [['1 ev', 'λύω', 'ἔλυον', 'ἔλυσα'], ['2 ev', 'λύεις', 'ἔλυες', 'ἔλυσας'], ['3 ev', 'λύει', 'ἔλυε(ν)', 'ἔλυσε(ν)'], ['1 mv', 'λύομεν', 'ἐλύομεν', 'ἐλύσαμεν'], ['2 mv', 'λύετε', 'ἐλύετε', 'ἐλύσατε'], ['3 mv', 'λύουσι(ν)', 'ἔλυον', 'ἔλυσαν']] },
        { type: 'text', text: 'Imperfectum en aoristus krijgen vooraan een **augment** (ἐ-). De aoristus heeft vaak het kenmerk **-σα-**.' },
        { type: 'tip', text: 'Let op: 1 ev en 3 mv van het imperfectum zijn gelijk (ἔλυον). De context laat zien welke het is.' },
      ],
      exercises: [
        { type: 'choice', question: 'λύομεν', options: ['1 mv praesens', '1 mv imperfectum', '1 mv aoristus', '3 mv praesens'], answer: 0 },
        { type: 'choice', question: 'ἐλύσατε', options: ['2 mv aoristus', '2 mv imperfectum', '2 mv praesens', '3 ev aoristus'], answer: 0 },
        { type: 'choice', question: 'ἔλυε', options: ['3 ev imperfectum', '3 ev aoristus', '3 ev praesens', '2 ev imperfectum'], answer: 0 },
        { type: 'choice', question: 'λύουσι', options: ['3 mv praesens', '3 mv imperfectum', '1 ev praesens', '3 mv aoristus'], answer: 0 },
        { type: 'choice', question: 'ἔλυσα', options: ['1 ev aoristus', '1 ev imperfectum', '3 mv aoristus', '1 ev praesens'], answer: 0 },
        { type: 'choice', question: 'Wat is het augment?', options: ['de ἐ- vooraan bij verleden tijden', 'de -σα- in de aoristus', 'de uitgang -ομεν'], answer: 0 },
      ],
    },
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
