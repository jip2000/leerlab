/**
 * Werkwoorden NEDERLANDS, FRIES, ZWEEDS, DEENS en NOORS (bokmål), als tabellen.
 * Alleen de belangrijkste werkwoorden en tijden: genoeg om de basis te oefenen.
 */
import { same, tableEngine, type Six, type TableVerb } from './table';

const onr = (v: TableVerb): TableVerb => ({ ...v, tags: [...(v.tags ?? []), 'onregelmatig'] });
const reg = (v: TableVerb): TableVerb => ({ ...v, tags: [...(v.tags ?? []), 'regelmatig'] });
const presets = [
  { id: 'onr', label: 'Onregelmatig', filter: (v: { tags: string[] }) => v.tags.includes('onregelmatig') },
  { id: 'reg', label: 'Regelmatig', filter: (v: { tags: string[] }) => v.tags.includes('regelmatig') },
];

/* ───────────────────────── NEDERLANDS ───────────────────────── */

const nlTt = (ik: string, jij: string, hij = jij, mv = ''): Six => [ik, jij, hij, mv, mv, mv];
const nlVt = (ev: string, mv: string): Six => [ev, ev, ev, mv, mv, mv];
/** Voltooid: hulpwerkwoord hebben en/of zijn + voltooid deelwoord. */
function nlVtt(pp: string, aux: 'hebben' | 'zijn' | 'beide'): Six {
  const h: Six = ['heb', 'hebt', 'heeft', 'hebben', 'hebben', 'hebben'];
  const z: Six = ['ben', 'bent', 'is', 'zijn', 'zijn', 'zijn'];
  return h.map((_, i) => {
    const a = aux === 'zijn' ? [z[i]] : aux === 'hebben' ? [h[i]] : [h[i], z[i]];
    return a.map((x) => `${x} ${pp}`).join(' / ');
  }) as Six;
}
const nl = (inf: string, nlw: string, tt: Six, vt: Six, pp: string, aux: 'hebben' | 'zijn' | 'beide'): TableVerb => ({
  inf, nl: nlw, forms: { tt, vt, vtt: nlVtt(pp, aux) },
});

export const nlEngine = tableEngine({
  lang: 'nl',
  persons: ['ik', 'jij', 'hij/zij', 'wij', 'jullie', 'zij'],
  tenses: [
    { id: 'tt', label: 'tegenwoordige tijd' },
    { id: 'vt', label: 'verleden tijd' },
    { id: 'vtt', label: 'voltooide tijd' },
  ],
  presets,
  verbs: [
    onr(nl('zijn', '', ['ben', 'bent', 'is', 'zijn', 'zijn', 'zijn'], nlVt('was', 'waren'), 'geweest', 'zijn')),
    onr(nl('hebben', '', ['heb', 'hebt', 'heeft', 'hebben', 'hebben', 'hebben'], nlVt('had', 'hadden'), 'gehad', 'hebben')),
    onr(nl('gaan', '', nlTt('ga', 'gaat', 'gaat', 'gaan'), nlVt('ging', 'gingen'), 'gegaan', 'zijn')),
    onr(nl('komen', '', nlTt('kom', 'komt', 'komt', 'komen'), nlVt('kwam', 'kwamen'), 'gekomen', 'zijn')),
    onr(nl('doen', '', nlTt('doe', 'doet', 'doet', 'doen'), nlVt('deed', 'deden'), 'gedaan', 'hebben')),
    onr(nl('zien', '', nlTt('zie', 'ziet', 'ziet', 'zien'), nlVt('zag', 'zagen'), 'gezien', 'hebben')),
    onr(nl('lopen', '', nlTt('loop', 'loopt', 'loopt', 'lopen'), nlVt('liep', 'liepen'), 'gelopen', 'beide')),
    onr(nl('willen', '', ['wil', 'wilt / wil', 'wil', 'willen', 'willen', 'willen'], nlVt('wilde / wou', 'wilden / wouden'), 'gewild', 'hebben')),
    onr(nl('kunnen', '', ['kan', 'kunt / kan', 'kan', 'kunnen', 'kunnen', 'kunnen'], nlVt('kon', 'konden'), 'gekund', 'hebben')),
    onr(nl('worden', '', nlTt('word', 'wordt', 'wordt', 'worden'), nlVt('werd', 'werden'), 'geworden', 'zijn')),
    onr(nl('zeggen', '', nlTt('zeg', 'zegt', 'zegt', 'zeggen'), nlVt('zei', 'zeiden'), 'gezegd', 'hebben')),
    onr(nl('schrijven', '', nlTt('schrijf', 'schrijft', 'schrijft', 'schrijven'), nlVt('schreef', 'schreven'), 'geschreven', 'hebben')),
    onr(nl('eten', '', nlTt('eet', 'eet', 'eet', 'eten'), nlVt('at', 'aten'), 'gegeten', 'hebben')),
    reg(nl('maken', '', nlTt('maak', 'maakt', 'maakt', 'maken'), nlVt('maakte', 'maakten'), 'gemaakt', 'hebben')),
    reg(nl('werken', '', nlTt('werk', 'werkt', 'werkt', 'werken'), nlVt('werkte', 'werkten'), 'gewerkt', 'hebben')),
    reg(nl('spelen', '', nlTt('speel', 'speelt', 'speelt', 'spelen'), nlVt('speelde', 'speelden'), 'gespeeld', 'hebben')),
    reg(nl('wonen', '', nlTt('woon', 'woont', 'woont', 'wonen'), nlVt('woonde', 'woonden'), 'gewoond', 'hebben')),
    reg(nl('fietsen', '', nlTt('fiets', 'fietst', 'fietst', 'fietsen'), nlVt('fietste', 'fietsten'), 'gefietst', 'beide')),
  ],
  explain: (v, tense) => {
    if (!v.tags?.includes('regelmatig')) return undefined;
    if (tense === 'vt') return "Regelmatig: eindigt de stam op een letter uit 't kofschip (t, k, f, s, ch, p), dan -te(n); anders -de(n).";
    if (tense === 'vtt') return "Voltooid deelwoord: ge- + stam + t of d ('t kofschip).";
    return 'Tegenwoordige tijd: ik = stam, jij/hij = stam + t, meervoud = hele werkwoord.';
  },
});

/* ───────────────────────── FRIES ───────────────────────── */

const fyTt = (ik: string, do_: string, hy: string, mv: string): Six => [ik, do_, hy, mv, mv, mv];

export const fyEngine = tableEngine({
  lang: 'fy',
  persons: ['ik', 'do', 'hy/sy', 'wy', 'jimme', 'sy'],
  tenses: [{ id: 'tt', label: 'tegenwoordige tijd' }],
  presets,
  verbs: [
    onr({ inf: 'wêze', nl: 'zijn', forms: { tt: fyTt('bin', 'bist', 'is', 'binne') } }),
    onr({ inf: 'hawwe', nl: 'hebben', forms: { tt: fyTt('haw', 'hast', 'hat', 'hawwe') } }),
    onr({ inf: 'gean', nl: 'gaan', forms: { tt: fyTt('gean', 'giest', 'giet', 'geane') } }),
    onr({ inf: 'komme', nl: 'komen', forms: { tt: fyTt('kom', 'komst', 'komt', 'komme') } }),
    onr({ inf: 'dwaan', nl: 'doen', forms: { tt: fyTt('doch', 'dochst', 'docht', 'dogge') } }),
    onr({ inf: 'sjen', nl: 'zien', forms: { tt: fyTt('sjoch', 'sjochst', 'sjocht', 'sjogge') } }),
    onr({ inf: 'witte', nl: 'weten', forms: { tt: fyTt('wit', 'witst', 'wit', 'witte') } }),
    onr({ inf: 'wolle', nl: 'willen', forms: { tt: fyTt('wol', 'wolst', 'wol', 'wolle') } }),
    onr({ inf: 'kinne', nl: 'kunnen', forms: { tt: fyTt('kin', 'kinst', 'kin', 'kinne') } }),
    reg({ inf: 'meitsje', nl: 'maken', forms: { tt: fyTt('meitsje', 'makkest', 'makket', 'meitsje') } }),
    reg({ inf: 'wurkje', nl: 'werken', forms: { tt: fyTt('wurkje', 'wurkest', 'wurket', 'wurkje') } }),
  ],
});

/* ───────────────────────── SCANDINAVISCH ───────────────────────── */
// Zweeds, Deens en Noors: één vorm voor alle personen. Fijn: je leert vooral de stam en de tijd.

const scan = (inf: string, nlw: string, pres: string, pret: string, perf: string, tags: string[]): TableVerb => ({
  inf, nl: nlw, tags, forms: { presens: same(pres), preteritum: same(pret), perfekt: same(perf) },
});
const scanTenses = (perf: string) => [
  { id: 'presens', label: 'presens' },
  { id: 'preteritum', label: 'preteritum' },
  { id: 'perfekt', label: perf },
];
const O = ['onregelmatig'];
const R = ['regelmatig'];

export const svEngine = tableEngine({
  lang: 'sv',
  persons: ['jag', 'du', 'han/hon', 'vi', 'ni', 'de'],
  tenses: scanTenses('perfekt'),
  presets,
  verbs: [
    scan('vara', 'zijn', 'är', 'var', 'har varit', O),
    scan('ha', 'hebben', 'har', 'hade', 'har haft', O),
    scan('göra', 'doen', 'gör', 'gjorde', 'har gjort', O),
    scan('gå', 'gaan, lopen', 'går', 'gick', 'har gått', O),
    scan('komma', 'komen', 'kommer', 'kom', 'har kommit', O),
    scan('se', 'zien', 'ser', 'såg', 'har sett', O),
    scan('säga', 'zeggen', 'säger', 'sa / sade', 'har sagt', O),
    scan('kunna', 'kunnen', 'kan', 'kunde', 'har kunnat', O),
    scan('vilja', 'willen', 'vill', 'ville', 'har velat', O),
    scan('äta', 'eten', 'äter', 'åt', 'har ätit', O),
    scan('skriva', 'schrijven', 'skriver', 'skrev', 'har skrivit', O),
    scan('läsa', 'lezen', 'läser', 'läste', 'har läst', R),
    scan('tala', 'spreken', 'talar', 'talade', 'har talat', R),
    scan('arbeta', 'werken', 'arbetar', 'arbetade', 'har arbetat', R),
    scan('bo', 'wonen', 'bor', 'bodde', 'har bott', R),
  ],
  explain: (_v, tense) => (tense === 'perfekt' ? 'Perfekt = har + supinum (bijv. har talat, har skrivit).' : 'In het Zweeds is de vorm voor alle personen hetzelfde.'),
});

export const daEngine = tableEngine({
  lang: 'da',
  persons: ['jeg', 'du', 'han/hun', 'vi', 'I', 'de'],
  tenses: scanTenses('perfektum'),
  presets,
  verbs: [
    scan('være', 'zijn', 'er', 'var', 'har været', O),
    scan('have', 'hebben', 'har', 'havde', 'har haft', O),
    scan('gøre', 'doen', 'gør', 'gjorde', 'har gjort', O),
    scan('gå', 'gaan, lopen', 'går', 'gik', 'er gået', O),
    scan('komme', 'komen', 'kommer', 'kom', 'er kommet', O),
    scan('se', 'zien', 'ser', 'så', 'har set', O),
    scan('sige', 'zeggen', 'siger', 'sagde', 'har sagt', O),
    scan('kunne', 'kunnen', 'kan', 'kunne', 'har kunnet', O),
    scan('ville', 'willen', 'vil', 'ville', 'har villet', O),
    scan('skrive', 'schrijven', 'skriver', 'skrev', 'har skrevet', O),
    scan('spise', 'eten', 'spiser', 'spiste', 'har spist', R),
    scan('tale', 'spreken', 'taler', 'talte', 'har talt', R),
    scan('arbejde', 'werken', 'arbejder', 'arbejdede', 'har arbejdet', R),
    scan('bo', 'wonen', 'bor', 'boede', 'har boet', R),
    scan('læse', 'lezen', 'læser', 'læste', 'har læst', R),
  ],
  explain: (_v, tense) => (tense === 'perfekt' ? 'Perfektum = har (of er bij beweging) + voltooid deelwoord.' : 'In het Deens is de vorm voor alle personen hetzelfde.'),
});

export const noEngine = tableEngine({
  lang: 'no',
  persons: ['jeg', 'du', 'han/hun', 'vi', 'dere', 'de'],
  tenses: scanTenses('perfektum'),
  presets,
  verbs: [
    scan('være', 'zijn', 'er', 'var', 'har vært', O),
    scan('ha', 'hebben', 'har', 'hadde', 'har hatt', O),
    scan('gjøre', 'doen', 'gjør', 'gjorde', 'har gjort', O),
    scan('gå', 'gaan, lopen', 'går', 'gikk', 'har gått', O),
    scan('komme', 'komen', 'kommer', 'kom', 'har kommet / er kommet', O),
    scan('se', 'zien', 'ser', 'så', 'har sett', O),
    scan('si', 'zeggen', 'sier', 'sa', 'har sagt', O),
    scan('kunne', 'kunnen', 'kan', 'kunne', 'har kunnet', O),
    scan('ville', 'willen', 'vil', 'ville', 'har villet', O),
    scan('skrive', 'schrijven', 'skriver', 'skrev / skreiv', 'har skrevet', O),
    scan('spise', 'eten', 'spiser', 'spiste', 'har spist', R),
    scan('snakke', 'praten', 'snakker', 'snakket / snakka', 'har snakket / har snakka', R),
    scan('jobbe', 'werken', 'jobber', 'jobbet / jobba', 'har jobbet / har jobba', R),
    scan('bo', 'wonen', 'bor', 'bodde', 'har bodd', R),
    scan('lese', 'lezen', 'leser', 'leste', 'har lest', R),
  ],
  explain: (_v, tense) => (tense === 'perfekt' ? 'Perfektum = har + voltooid deelwoord.' : 'In het Noors is de vorm voor alle personen hetzelfde.'),
});
