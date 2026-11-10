/**
 * Vervoegingsmotor ITALIAANS.
 *  - -care/-gare: h vóór e/i (cerchi, cercherò, paghiamo)
 *  - -ciare/-giare: i valt weg vóór e/i (mangi, mangiamo, mangerò)
 *  - -iare: geen dubbele i (studi, studiamo)
 *  - -ire met -isc- (finire → finisco)
 *  - passato prossimo met essere: deelwoord past zich aan (sono andato / andata)
 */
import type { Tense, VerbEngine, VerbInfo } from './types';

type Six = [string, string, string, string, string, string];

interface ItVerb {
  inf: string;
  nl: string;
  isc?: boolean;
  essere?: boolean;
  pres?: Six;
  cong?: Six;
  /** Stam voor futuro/condizionale (andr-, sar-). */
  fut?: string;
  /** Stam voor imperfetto als die afwijkt (face-, dice-, beve-). */
  impf?: string;
  pp?: string;
  impTu?: string;
  noImp?: boolean;
}

const verbs: ItVerb[] = [
  { inf: 'essere', nl: 'zijn', essere: true, pres: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'], cong: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'], fut: 'sar', pp: 'stato', impTu: 'sii' },
  { inf: 'avere', nl: 'hebben', pres: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'], cong: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'], fut: 'avr', impTu: 'abbi' },
  { inf: 'andare', nl: 'gaan', essere: true, pres: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'], fut: 'andr', impTu: "va' / vai" },
  { inf: 'fare', nl: 'doen, maken', pres: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'], fut: 'far', impf: 'face', pp: 'fatto', impTu: "fa' / fai" },
  { inf: 'dire', nl: 'zeggen', pres: ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono'], fut: 'dir', impf: 'dice', pp: 'detto', impTu: "di'" },
  { inf: 'venire', nl: 'komen', essere: true, pres: ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono'], fut: 'verr', pp: 'venuto' },
  { inf: 'potere', nl: 'kunnen', pres: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'], fut: 'potr', noImp: true },
  { inf: 'volere', nl: 'willen', pres: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'], fut: 'vorr', noImp: true },
  { inf: 'dovere', nl: 'moeten', pres: ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono'], cong: ['debba', 'debba', 'debba', 'dobbiamo', 'dobbiate', 'debbano'], fut: 'dovr', noImp: true },
  { inf: 'sapere', nl: 'weten', pres: ['so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno'], cong: ['sappia', 'sappia', 'sappia', 'sappiamo', 'sappiate', 'sappiano'], fut: 'sapr', impTu: 'sappi' },
  { inf: 'stare', nl: 'zijn, blijven', essere: true, pres: ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno'], cong: ['stia', 'stia', 'stia', 'stiamo', 'stiate', 'stiano'], fut: 'star', impTu: "sta' / stai" },
  { inf: 'dare', nl: 'geven', pres: ['do', 'dai', 'dà', 'diamo', 'date', 'danno'], cong: ['dia', 'dia', 'dia', 'diamo', 'diate', 'diano'], fut: 'dar', impTu: "da' / dai" },
  { inf: 'uscire', nl: 'uitgaan', essere: true, pres: ['esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono'] },
  { inf: 'bere', nl: 'drinken', pres: ['bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono'], fut: 'berr', impf: 'beve', pp: 'bevuto' },
  { inf: 'vedere', nl: 'zien', fut: 'vedr', pp: 'visto' },
  { inf: 'leggere', nl: 'lezen', pp: 'letto' },
  { inf: 'scrivere', nl: 'schrijven', pp: 'scritto' },
  { inf: 'prendere', nl: 'nemen', pp: 'preso' },
  { inf: 'mettere', nl: 'zetten, leggen', pp: 'messo' },
  { inf: 'aprire', nl: 'openen', pp: 'aperto' },
  { inf: 'vivere', nl: 'leven', fut: 'vivr', pp: 'vissuto' },
  // regelmatig
  { inf: 'parlare', nl: 'spreken' },
  { inf: 'abitare', nl: 'wonen' },
  { inf: 'lavorare', nl: 'werken' },
  { inf: 'arrivare', nl: 'aankomen', essere: true },
  { inf: 'cercare', nl: 'zoeken' },
  { inf: 'pagare', nl: 'betalen' },
  { inf: 'mangiare', nl: 'eten' },
  { inf: 'cominciare', nl: 'beginnen' },
  { inf: 'studiare', nl: 'studeren' },
  { inf: 'credere', nl: 'geloven' },
  { inf: 'vendere', nl: 'verkopen' },
  { inf: 'dormire', nl: 'slapen' },
  { inf: 'partire', nl: 'vertrekken', essere: true },
  { inf: 'sentire', nl: 'horen, voelen' },
  { inf: 'finire', nl: 'afmaken', isc: true },
  { inf: 'capire', nl: 'begrijpen', isc: true },
  { inf: 'preferire', nl: 'liever hebben', isc: true },
];

export const itTenses: Tense[] = [
  { id: 'presente', label: 'presente' },
  { id: 'passato-prossimo', label: 'passato prossimo' },
  { id: 'imperfetto', label: 'imperfetto' },
  { id: 'trapassato', label: 'trapassato prossimo' },
  { id: 'futuro', label: 'futuro semplice' },
  { id: 'condizionale', label: 'condizionale presente' },
  { id: 'congiuntivo', label: 'congiuntivo presente' },
  { id: 'imperativo', label: 'imperativo', persons: [1, 3, 4] },
];

const PRON = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];
const byInf = new Map(verbs.map((v) => [v.inf, v]));
const get = (inf: string) => {
  const v = byInf.get(inf);
  if (!v) throw new Error(`Onbekend Italiaans werkwoord: ${inf}`);
  return v;
};
const group = (inf: string) => (inf.endsWith('are') ? 'are' : inf.endsWith('ere') ? 'ere' : 'ire');
const stemOf = (inf: string) => inf.slice(0, -3);

/** Stam + uitgang met de spellingsregels. */
function join(inf: string, stem: string, ending: string): string {
  const front = /^[ei]/.test(ending);
  if (/[cg]are$/.test(inf) && front) return `${stem}h${ending}`;
  if (/(ci|gi|i)are$/.test(inf) && /^i/.test(ending) && stem.endsWith('i')) return stem + ending.slice(1);
  if (/[cg]iare$/.test(inf) && /^e/.test(ending) && stem.endsWith('i')) return stem.slice(0, -1) + ending;
  return stem + ending;
}

const PRES = {
  are: ['o', 'i', 'a', 'iamo', 'ate', 'ano'],
  ere: ['o', 'i', 'e', 'iamo', 'ete', 'ono'],
  ire: ['o', 'i', 'e', 'iamo', 'ite', 'ono'],
  isc: ['isco', 'isci', 'isce', 'iamo', 'ite', 'iscono'],
};

function presente(v: ItVerb): string[] {
  if (v.pres) return [...v.pres];
  const g = group(v.inf);
  const end = v.isc ? PRES.isc : PRES[g];
  return end.map((e) => join(v.inf, stemOf(v.inf), e));
}

function imperfetto(v: ItVerb): string[] {
  if (v.inf === 'essere') return ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'];
  const base = v.impf ?? v.inf.slice(0, -2); // parla-, crede-, dormi-
  return ['vo', 'vi', 'va', 'vamo', 'vate', 'vano'].map((e) => base + e);
}

function futStem(v: ItVerb): string {
  if (v.fut) return v.fut;
  const s = stemOf(v.inf);
  if (group(v.inf) === 'ire') return `${s}ir`;
  // -are en -ere → -er-, met spellingsregels (cercherò, mangerò)
  return join(v.inf, s, 'er');
}

function futuro(v: ItVerb): string[] {
  return ['ò', 'ai', 'à', 'emo', 'ete', 'anno'].map((e) => futStem(v) + e);
}
function condizionale(v: ItVerb): string[] {
  return ['ei', 'esti', 'ebbe', 'emmo', 'este', 'ebbero'].map((e) => futStem(v) + e);
}

function congiuntivo(v: ItVerb): string[] {
  if (v.cong) return [...v.cong];
  const p = presente(v);
  const io = p[0]!.replace(/o$/, '');
  const noi = p[3]!; // parliamo, andiamo
  const sing = group(v.inf) === 'are' && !v.pres ? 'i' : 'a';
  const plural = group(v.inf) === 'are' && !v.pres ? 'ino' : 'ano';
  const s = (e: string) => (group(v.inf) === 'are' && !v.pres ? join(v.inf, io, e) : io + e);
  return [s(sing), s(sing), s(sing), noi, noi.replace(/mo$/, 'te'), s(plural)];
}

function participio(v: ItVerb): string {
  if (v.pp) return v.pp;
  return stemOf(v.inf) + { are: 'ato', ere: 'uto', ire: 'ito' }[group(v.inf)];
}

const AVERE_PRES = ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'];
const ESSERE_PRES = ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'];
const AVERE_IMPF = ['avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano'];
const ESSERE_IMPF = ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'];

/** Samengestelde tijd. Bij essere: mannelijk / vrouwelijk als alternatieven. */
function composto(v: ItVerb, aux: 'pres' | 'impf'): string[] {
  const pp = participio(v);
  const base = pp.slice(0, -1);
  if (!v.essere) return (aux === 'pres' ? AVERE_PRES : AVERE_IMPF).map((a) => `${a} ${pp}`);
  return (aux === 'pres' ? ESSERE_PRES : ESSERE_IMPF).map((a, i) => (i < 3 ? `${a} ${base}o / ${a} ${base}a` : `${a} ${base}i / ${a} ${base}e`));
}

function imperativo(v: ItVerb): string[] {
  if (v.noImp) return ['', '', '', '', '', ''];
  const p = presente(v);
  const tu = v.impTu ?? (group(v.inf) === 'are' ? join(v.inf, stemOf(v.inf), 'a') : p[1]!);
  const voi = v.inf === 'essere' ? 'siate' : v.inf === 'avere' ? 'abbiate' : v.inf === 'sapere' ? 'sappiate' : p[4]!;
  return ['', tu, '', p[3]!, voi, ''];
}

function bareForms(inf: string, tense: string): string[] {
  const v = get(inf);
  switch (tense) {
    case 'presente': return presente(v);
    case 'imperfetto': return imperfetto(v);
    case 'futuro': return futuro(v);
    case 'condizionale': return condizionale(v);
    case 'congiuntivo': return congiuntivo(v);
    case 'passato-prossimo': return composto(v, 'pres');
    case 'trapassato': return composto(v, 'impf');
    case 'imperativo': return imperativo(v);
    default: throw new Error(`Onbekende tijd: ${tense}`);
  }
}

const first = (s: string) => s.split(' / ')[0]!;
/** "sono andato / sono andata" → "sono andato/a" om te tonen. */
function show(f: string): string {
  const parts = f.split(' / ');
  const m = parts.length === 2 && /^(.*\S)([oi])$/.exec(parts[0]!);
  if (m && parts[1] === `${m[1]}${m[2] === 'o' ? 'a' : 'e'}`) return `${parts[0]}/${m[2] === 'o' ? 'a' : 'e'}`;
  return first(f);
}

function explain(inf: string, tense: string, i: number): string | undefined {
  const v = get(inf);
  if (tense === 'passato-prossimo' || tense === 'trapassato')
    return v.essere
      ? `${inf} vervoeg je met essere: het deelwoord (${participio(v)}) past zich aan het onderwerp aan (-o, -a, -i, -e).`
      : `Vorm van avere + voltooid deelwoord: ${participio(v)}${v.pp ? ' (onregelmatig)' : ''}.`;
  if (tense === 'presente') {
    if (v.pres) return `${inf} is onregelmatig in de presente. Leer dit rijtje uit je hoofd.`;
    if (v.isc && [0, 1, 2, 5].includes(i)) return `${inf} krijgt -isc- bij io, tu, lui/lei en loro.`;
    if (/[cg]are$/.test(inf) && (i === 1 || i === 3)) return 'Bij -care en -gare komt er een h vóór de i, zodat de klank hard blijft.';
  }
  if (tense === 'futuro' || tense === 'condizionale') return v.fut ? `${inf} heeft een korte stam: ${v.fut}-.` : '-are en -ere krijgen -er-, -ire krijgt -ir-.';
  if (tense === 'congiuntivo') return v.cong ? `${inf} is onregelmatig in de congiuntivo.` : 'Congiuntivo: stam van io + -i (bij -are) of -a (bij -ere/-ire); noi zoals de presente.';
  if (tense === 'imperfetto') return inf === 'essere' ? 'essere: ero, eri, era…' : 'Imperfetto: infinitief zonder -re + -vo, -vi, -va, -vamo, -vate, -vano.';
  return undefined;
}

const info = (v: ItVerb): VerbInfo => ({
  inf: v.inf,
  nl: v.nl,
  tags: [v.pres || v.fut || v.pp ? 'onregelmatig' : 'regelmatig', ...(v.essere ? ['essere'] : []), ...(v.isc ? ['isc'] : [])],
});

export const itEngine: VerbEngine = {
  lang: 'it',
  persons: PRON,
  tenses: itTenses,
  verbs: verbs.map(info),
  presets: [
    { id: 'onr', label: 'Onregelmatig', filter: (v) => v.tags.includes('onregelmatig') },
    { id: 'reg', label: 'Regelmatig', filter: (v) => v.tags.includes('regelmatig') },
    { id: 'essere', label: 'Met essere', filter: (v) => v.tags.includes('essere') },
  ],
  conjugate: (inf, tense) => bareForms(inf, tense).map((f, i) => (!f ? '' : tense === 'imperativo' ? `${first(f)}!` : `${PRON[i]} ${show(f)}`)),
  answer(inf, tense, i) {
    const f = bareForms(inf, tense)[i]!;
    if (!f) return '';
    const prons = i === 2 ? ['lui', 'lei'] : [PRON[i]!];
    const out = f.split(' / ').flatMap((v) => (tense === 'imperativo' ? [v] : [v, ...prons.map((p) => `${p} ${v}`), ...(tense === 'congiuntivo' ? prons.map((p) => `che ${p} ${v}`) : [])]));
    return [...new Set(out)].join(' / ');
  },
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain,
  sentence: (_inf, tense, i) => (tense === 'imperativo' ? { before: '', after: `! (${PRON[i]})` } : { before: `(${PRON[i]}) `, after: '' }),
};
