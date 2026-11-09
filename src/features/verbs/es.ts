/**
 * Vervoegingsmotor SPAANS.
 *  - Klinkerwisseling in de "laarsvormen" (yo, tú, él, ellos): e → ie, o → ue, e → i, u → ue
 *  - -ir-werkwoorden met klinkerwisseling: e → i / o → u in indefinido (3e pers.), gerundio
 *    en subjuntivo (nosotros, vosotros): sintió, durmiendo, pidamos
 *  - Spelling: -car → qu, -gar → gu, -zar → c vóór e (busqué, llegue, empiece)
 * Onregelmatig: zie src/data/verbs/es.ts.
 */
import { esVerbs, type EsVerb } from '@/data/verbs/es';
import type { Tense, VerbEngine, VerbInfo } from './types';

export const esTenses: Tense[] = [
  { id: 'presente', label: 'presente' },
  { id: 'presente-continuo', label: 'estar + gerundio' },
  { id: 'indefinido', label: 'pretérito indefinido' },
  { id: 'imperfecto', label: 'pretérito imperfecto' },
  { id: 'perfecto', label: 'pretérito perfecto' },
  { id: 'pluscuamperfecto', label: 'pluscuamperfecto' },
  { id: 'futuro', label: 'futuro' },
  { id: 'condicional', label: 'condicional' },
  { id: 'subjuntivo', label: 'subjuntivo presente' },
  { id: 'subjuntivo-imperfecto', label: 'subjuntivo imperfecto' },
  { id: 'imperativo', label: 'imperativo', persons: [1, 2, 3, 4, 5] },
];

const SHOW = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ellas/ustedes'];
const PRONS = [['yo'], ['tú'], ['él', 'ella', 'usted'], ['nosotros', 'nosotras'], ['vosotros', 'vosotras'], ['ellos', 'ellas', 'ustedes']];
const BOOT = [0, 1, 2, 5];

const byInf = new Map(esVerbs.map((v) => [v.inf, v]));
function get(inf: string): EsVerb {
  const v = byInf.get(inf);
  if (!v) throw new Error(`Onbekend Spaans werkwoord: ${inf}`);
  return v;
}

const group = (inf: string) => (inf.endsWith('ar') ? 'ar' : inf.endsWith('er') ? 'er' : 'ir') as 'ar' | 'er' | 'ir';
const stemOf = (inf: string) => inf.slice(0, -2);

function replaceLast(s: string, from: string, to: string): string {
  const i = s.lastIndexOf(from);
  return i < 0 ? s : s.slice(0, i) + to + s.slice(i + from.length);
}

function boot(stem: string, change: EsVerb['change']): string {
  switch (change) {
    case 'ie':
      return replaceLast(stem, 'e', 'ie');
    case 'ue':
      return replaceLast(stem, 'o', 'ue');
    case 'i':
      return replaceLast(stem, 'e', 'i');
    case 'u-ue':
      return replaceLast(stem, 'u', 'ue');
    default:
      return stem;
  }
}

/** -ir met klinkerwisseling: e → i, o → u (sintió, durmió, pidamos). */
function weak(v: EsVerb, stem: string): string {
  if (group(v.inf) !== 'ir' || !v.change || v.change === 'u-ue') return stem;
  return v.change === 'ue' ? replaceLast(stem, 'o', 'u') : replaceLast(stem, 'e', 'i');
}

/** Spellingsregels om de uitspraak gelijk te houden. */
function spell(inf: string, stem: string, ending: string): string {
  const soft = /^[eé]/.test(ending);
  const hard = /^[aoá]/.test(ending);
  if (inf.endsWith('car') && soft) return stem.replace(/c$/, 'qu') + ending;
  if (inf.endsWith('gar') && soft) return stem.replace(/g$/, 'gu') + ending;
  if (inf.endsWith('zar') && soft) return stem.replace(/z$/, 'c') + ending;
  if (/g[ei]r$/.test(inf) && hard) return stem.replace(/g$/, 'j') + ending;
  if (inf.endsWith('guir') && hard) return stem.replace(/gu$/, 'g') + ending;
  return stem + ending;
}

const END = {
  pres: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
  pret: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
  impf: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], ir: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
  subj: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'], ir: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
};
const FUT = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
const COND = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
const HABER_PRES = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];
const HABER_IMPF = ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'];
const ESTAR = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'];

function presente(v: EsVerb): string[] {
  if (v.pres) return [...v.pres];
  const g = group(v.inf);
  const stem = stemOf(v.inf);
  return END.pres[g].map((e, i) => {
    if (i === 0 && v.yo) return v.yo;
    return spell(v.inf, BOOT.includes(i) ? boot(stem, v.change) : stem, e);
  });
}

function indefinido(v: EsVerb): string[] {
  if (v.pret) return [...v.pret];
  const g = group(v.inf);
  const stem = stemOf(v.inf);
  return END.pret[g].map((e, i) => spell(v.inf, i === 2 || i === 5 ? weak(v, stem) : stem, e));
}

function imperfecto(v: EsVerb): string[] {
  if (v.impf) return [...v.impf];
  const g = group(v.inf);
  return END.impf[g].map((e) => stemOf(v.inf) + e);
}

const futStem = (v: EsVerb) => v.fut ?? v.inf;

function subjuntivo(v: EsVerb): string[] {
  if (v.subj) return [...v.subj];
  const g = group(v.inf);
  // Met een afwijkende yo-vorm (tengo, oigo, veo): de hele subjuntivo komt van die stam.
  const yo = v.yo ?? v.pres?.[0];
  if (yo) {
    const s = yo.replace(/o$/, '');
    return END.subj[g].map((e) => s + e);
  }
  const stem = stemOf(v.inf);
  return END.subj[g].map((e, i) => spell(v.inf, BOOT.includes(i) ? boot(stem, v.change) : weak(v, stem), e));
}

const ACCENT: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const accentLast = (s: string) => s.replace(/([aeiou])([^aeiou]*)$/, (_, v: string, rest: string) => ACCENT[v]! + rest);

function subjImperfecto(v: EsVerb): string[] {
  const base = indefinido(v)[5]!.replace(/ron$/, '');
  const ra = ['ra', 'ras', 'ra', 'ramos', 'rais', 'ran'];
  const se = ['se', 'ses', 'se', 'semos', 'seis', 'sen'];
  return ra.map((e, i) => {
    const b = i === 3 ? accentLast(base) : base;
    return `${b}${e} / ${b}${se[i]}`;
  });
}

function participio(v: EsVerb): string {
  if (v.pp) return v.pp;
  return stemOf(v.inf) + (group(v.inf) === 'ar' ? 'ado' : 'ido');
}

function gerundio(v: EsVerb): string {
  if (v.ger) return v.ger;
  const g = group(v.inf);
  return g === 'ar' ? `${stemOf(v.inf)}ando` : `${weak(v, stemOf(v.inf))}iendo`;
}

function imperativo(v: EsVerb): string[] {
  if (v.noImp) return ['', '', '', '', '', ''];
  const subj = subjuntivo(v);
  const tu = v.impTu ?? presente(v)[2]!;
  const nos = v.inf === 'ir' ? 'vamos / vayamos' : subj[3]!;
  const vos = v.inf.replace(/r$/, 'd');
  return ['', tu, subj[2]!, nos, vos, subj[5]!];
}

function bareForms(inf: string, tense: string): string[] {
  const v = get(inf);
  switch (tense) {
    case 'presente':
      return presente(v);
    case 'presente-continuo':
      return ESTAR.map((e) => `${e} ${gerundio(v)}`);
    case 'indefinido':
      return indefinido(v);
    case 'imperfecto':
      return imperfecto(v);
    case 'perfecto':
      return HABER_PRES.map((h) => `${h} ${participio(v)}`);
    case 'pluscuamperfecto':
      return HABER_IMPF.map((h) => `${h} ${participio(v)}`);
    case 'futuro':
      return FUT.map((e) => futStem(v) + e);
    case 'condicional':
      return COND.map((e) => futStem(v) + e);
    case 'subjuntivo':
      return subjuntivo(v);
    case 'subjuntivo-imperfecto':
      return subjImperfecto(v);
    case 'imperativo':
      return imperativo(v);
    default:
      throw new Error(`Onbekende tijd: ${tense}`);
  }
}

const first = (s: string) => s.split(' / ')[0]!;

function answers(inf: string, tense: string, i: number): string {
  const f = bareForms(inf, tense)[i]!;
  if (!f) return '';
  const out: string[] = [];
  for (const v of f.split(' / ')) {
    out.push(v);
    if (tense !== 'imperativo') for (const p of PRONS[i]!) out.push(`${p} ${v}`);
  }
  return [...new Set(out)].join(' / ');
}

function explain(inf: string, tense: string, i: number): string | undefined {
  const v = get(inf);
  const irregular = !!(v.pres || v.pret || v.yo || v.subj);
  if (tense === 'presente') {
    if (v.pres) return `${inf} is onregelmatig in de presente. Leer dit rijtje uit je hoofd.`;
    if (i === 0 && v.yo) return `${inf} heeft een onregelmatige yo-vorm: ${v.yo}.`;
    if (v.change && BOOT.includes(i)) {
      const c = { ie: 'e → ie', ue: 'o → ue', i: 'e → i', 'u-ue': 'u → ue' }[v.change];
      return `${inf} heeft een klinkerwisseling (${c}) bij yo, tú, él en ellos, maar niet bij nosotros en vosotros.`;
    }
  }
  if (tense === 'indefinido') {
    if (v.pret) return `${inf} is onregelmatig in het indefinido: leer het rijtje (geen accenten bij de onregelmatige stam).`;
    if (i === 0 && /(car|gar|zar)$/.test(inf)) return `Bij -car, -gar en -zar verandert de spelling bij yo om de klank te houden: ${indefinido(v)[0]}.`;
    if ((i === 2 || i === 5) && weak(v, stemOf(inf)) !== stemOf(inf)) return `-ir-werkwoorden met klinkerwisseling veranderen in de 3e persoon: e → i of o → u (${indefinido(v)[2]}).`;
  }
  if (tense === 'imperfecto') return inf === 'ser' || inf === 'ir' || inf === 'ver' ? `${inf} is een van de drie onregelmatige werkwoorden in het imperfecto (ser, ir, ver).` : '-ar: -aba…, -er/-ir: -ía…';
  if (tense === 'perfecto' || tense === 'pluscuamperfecto') return `Vorm van haber + voltooid deelwoord: ${participio(v)}${v.pp ? ' (onregelmatig!)' : ''}.`;
  if (tense === 'futuro' || tense === 'condicional') return v.fut ? `${inf} heeft een onregelmatige stam: ${v.fut}-.` : 'Hele infinitief + uitgang.';
  if (tense === 'subjuntivo') return v.subj ? `${inf} is onregelmatig in de subjuntivo.` : 'Subjuntivo = stam van de yo-vorm (presente) + "omgekeerde" uitgang: -ar → -e, -er/-ir → -a.';
  if (tense === 'presente-continuo') return `estar + gerundio (${gerundio(v)}).`;
  if (tense === 'imperativo' && i === 1 && v.impTu) return `${inf} heeft een korte, onregelmatige tú-vorm: ${v.impTu}.`;
  if (tense === 'subjuntivo-imperfecto') return 'Stam van ellos in het indefinido (zonder -ron) + -ra of -se.';
  void irregular;
  return undefined;
}

const hints: Record<string, string> = {
  presente: 'hoy',
  'presente-continuo': 'ahora mismo',
  indefinido: 'ayer',
  imperfecto: 'de niño',
  perfecto: 'esta mañana',
  pluscuamperfecto: 'antes',
  futuro: 'mañana',
  condicional: 'con más tiempo',
  subjuntivo: 'quiero que…',
  'subjuntivo-imperfecto': 'si…',
};

const info = (v: EsVerb): VerbInfo => {
  const tags: string[] = [];
  if (v.pres || v.pret || v.yo || v.subj || v.fut) tags.push('onregelmatig');
  else if (v.change) tags.push('klinkerwisseling');
  else tags.push('regelmatig');
  if (v.change) tags.push('stam');
  return { inf: v.inf, nl: v.nl, tags };
};

export const esEngine: VerbEngine = {
  lang: 'es',
  persons: SHOW,
  tenses: esTenses,
  verbs: esVerbs.map(info),
  presets: [
    { id: 'onr', label: 'Onregelmatig', filter: (v) => v.tags.includes('onregelmatig') },
    { id: 'stam', label: 'Klinkerwisseling', filter: (v) => v.tags.includes('stam') },
    { id: 'reg', label: 'Regelmatig', filter: (v) => v.tags.includes('regelmatig') },
  ],
  conjugate: (inf, tense) =>
    bareForms(inf, tense).map((f, i) => (!f ? '' : tense === 'imperativo' ? `¡${first(f)}!` : `${SHOW[i]} ${first(f)}`)),
  answer: answers,
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain,
  sentence: (_inf, tense, i) =>
    tense === 'imperativo' ? { before: '¡', after: `! (${SHOW[i]})` } : { before: `(${PRONS[i]![0]}) `, after: ` (${hints[tense]})` },
};
