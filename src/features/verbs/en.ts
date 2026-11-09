/**
 * Vervoegingsmotor ENGELS.
 *  - he/she/it + s; -es na s, sh, ch, x, z, o (goes, watches); medeklinker + y → ies (studies)
 *  - -ing: e valt weg (making), ie → ying (lying), medeklinker verdubbelen (stopping)
 *  - -ed: e → d (lived), medeklinker + y → ied (studied), verdubbelen (stopped)
 *  - Samentrekkingen (I'm, he's, they've, I'll …) tellen ook als goed.
 */
import { enIrregular, enRegular } from '@/data/verbs/en';
import type { Tense, VerbEngine, VerbInfo } from './types';

export const enTenses: Tense[] = [
  { id: 'present-simple', label: 'present simple' },
  { id: 'present-continuous', label: 'present continuous' },
  { id: 'past-simple', label: 'past simple' },
  { id: 'past-continuous', label: 'past continuous' },
  { id: 'present-perfect', label: 'present perfect' },
  { id: 'present-perfect-continuous', label: 'present perfect continuous' },
  { id: 'past-perfect', label: 'past perfect' },
  { id: 'future-will', label: 'future (will)' },
  { id: 'going-to', label: 'future (going to)' },
  { id: 'future-perfect', label: 'future perfect' },
];

const PRON = ['I', 'you', 'he', 'we', 'you', 'they'];
const SHOW = ['I', 'you', 'he/she/it', 'we', 'you', 'they'];

const irr = new Map(enIrregular.map(([inf, past, pp, nl]) => [inf, { past, pp, nl }]));
const reg = new Map(enRegular.map((v) => [v.inf, v]));

function doubles(inf: string): boolean {
  if (reg.get(inf)?.double || ['begin', 'forget', 'admit', 'refer', 'occur'].includes(inf)) return true;
  // Eén lettergreep, eindigend op medeklinker-klinker-medeklinker (niet w, x, y): stop, plan, run, sit.
  const syllables = inf.match(/[aeiouy]+/g)?.length ?? 0;
  return syllables === 1 && /[^aeiou][aeiou][^aeiouwxy]$/.test(inf);
}

export function thirdPerson(inf: string): string {
  if (inf === 'have') return 'has';
  if (inf === 'be') return 'is';
  if (/(s|sh|ch|x|z|o)$/.test(inf)) return `${inf}es`;
  if (/[^aeiou]y$/.test(inf)) return `${inf.slice(0, -1)}ies`;
  return `${inf}s`;
}

export function ing(inf: string): string {
  if (inf === 'be') return 'being';
  if (inf.endsWith('ie')) return `${inf.slice(0, -2)}ying`;
  if (/(ee|ye|oe)$/.test(inf)) return `${inf}ing`;
  if (/[^aeiou]e$/.test(inf)) return `${inf.slice(0, -1)}ing`;
  if (doubles(inf)) return `${inf}${inf.slice(-1)}ing`;
  return `${inf}ing`;
}

export function ed(inf: string): string {
  if (inf.endsWith('e')) return `${inf}d`;
  if (/[^aeiou]y$/.test(inf)) return `${inf.slice(0, -1)}ied`;
  if (doubles(inf)) return `${inf}${inf.slice(-1)}ed`;
  return `${inf}ed`;
}

const past = (inf: string) => irr.get(inf)?.past ?? ed(inf);
const pp = (inf: string) => irr.get(inf)?.pp ?? ed(inf);
const first = (s: string) => s.split(' / ')[0]!;

const BE_PRES = ['am', 'are', 'is', 'are', 'are', 'are'];
const BE_PAST = ['was', 'were', 'was', 'were', 'were', 'were'];
const HAVE = (i: number) => (i === 2 ? 'has' : 'have');

function bareForms(inf: string, tense: string): string[] {
  const all = [0, 1, 2, 3, 4, 5];
  const ppAlt = (fn: (p: string) => string) => pp(inf).split(' / ').map(fn).join(' / ');
  switch (tense) {
    case 'present-simple':
      return inf === 'be' ? BE_PRES : all.map((i) => (i === 2 ? thirdPerson(inf) : inf));
    case 'present-continuous':
      return all.map((i) => `${BE_PRES[i]} ${ing(inf)}`);
    case 'past-simple':
      return inf === 'be' ? BE_PAST : all.map(() => past(inf));
    case 'past-continuous':
      return all.map((i) => `${BE_PAST[i]} ${ing(inf)}`);
    case 'present-perfect':
      return all.map((i) => ppAlt((p) => `${HAVE(i)} ${p}`));
    case 'present-perfect-continuous':
      return all.map((i) => `${HAVE(i)} been ${ing(inf)}`);
    case 'past-perfect':
      return all.map(() => ppAlt((p) => `had ${p}`));
    case 'future-will':
      return all.map(() => `will ${inf}`);
    case 'going-to':
      return all.map((i) => `${BE_PRES[i]} going to ${inf}`);
    case 'future-perfect':
      return all.map(() => ppAlt((p) => `will have ${p}`));
    default:
      throw new Error(`Onbekende tijd: ${tense}`);
  }
}

/** I am → I'm, he has → he's, they will → they'll … */
function contract(pron: string, rest: string): string | null {
  const m = /^(am|are|is|has|have|had|will)\b(.*)$/.exec(rest);
  if (!m) return null;
  const short: Record<string, string> = { am: "'m", are: "'re", is: "'s", has: "'s", have: "'ve", had: "'d", will: "'ll" };
  return `${pron}${short[m[1]!]}${m[2]}`;
}

function answers(inf: string, tense: string, i: number): string {
  const f = bareForms(inf, tense)[i]!;
  const out: string[] = [];
  for (const v of f.split(' / ')) {
    const prons = i === 2 ? ['he', 'she', 'it'] : [PRON[i]!];
    for (const p of prons) {
      out.push(`${p} ${v}`);
      const c = contract(p, v);
      if (c) out.push(c);
    }
    out.push(v);
  }
  return [...new Set(out)].join(' / ');
}

function explain(inf: string, tense: string, i: number): string | undefined {
  const isIrr = irr.has(inf);
  switch (tense) {
    case 'present-simple':
      if (i === 2 && inf !== 'be') {
        if (inf === 'have') return 'Bij he/she/it wordt have: has.';
        if (/(s|sh|ch|x|z|o)$/.test(inf)) return `Bij he/she/it komt er -es achter als het werkwoord eindigt op s, sh, ch, x, z of o: ${thirdPerson(inf)}.`;
        if (/[^aeiou]y$/.test(inf)) return `Medeklinker + y wordt -ies bij he/she/it: ${thirdPerson(inf)}.`;
        return 'Bij he/she/it komt er een -s achter het werkwoord.';
      }
      return inf === 'be' ? 'be is onregelmatig: I am, you are, he/she/it is.' : undefined;
    case 'present-continuous':
    case 'past-continuous':
    case 'present-perfect-continuous':
      return `Continuous = vorm van be + werkwoord-ing (${ing(inf)}). ${inf.endsWith('e') && !/(ee|ye|oe)$/.test(inf) ? 'De e valt weg.' : doubles(inf) ? 'De laatste medeklinker wordt verdubbeld.' : ''}`.trim();
    case 'past-simple':
      return isIrr ? `${inf} is onregelmatig: ${inf} – ${irr.get(inf)!.past} – ${irr.get(inf)!.pp}.` : `Regelmatig: werkwoord + -ed (${ed(inf)}).`;
    case 'present-perfect':
      return `Present perfect = have/has + voltooid deelwoord (${first(pp(inf))}).${i === 2 ? ' Bij he/she/it: has.' : ''}`;
    case 'past-perfect':
      return `Past perfect = had + voltooid deelwoord (${first(pp(inf))}).`;
    case 'future-will':
      return 'Future = will + hele werkwoord (voor alle personen hetzelfde).';
    case 'going-to':
      return 'Going to = am/is/are + going to + hele werkwoord. Gebruik je voor plannen.';
    case 'future-perfect':
      return `Future perfect = will have + voltooid deelwoord (${first(pp(inf))}).`;
  }
  return undefined;
}

const hints: Record<string, string> = {
  'present-simple': 'every day',
  'present-continuous': 'right now',
  'past-simple': 'yesterday',
  'past-continuous': 'when the phone rang',
  'present-perfect': 'already',
  'present-perfect-continuous': 'for two hours',
  'past-perfect': 'before we arrived',
  'future-will': 'tomorrow',
  'going-to': 'next week',
  'future-perfect': 'by tomorrow',
};

export const enEngine: VerbEngine = {
  lang: 'en',
  persons: SHOW,
  tenses: enTenses,
  verbs: [
    ...enIrregular.map(([inf, , , nl]): VerbInfo => ({ inf, nl, tags: ['onregelmatig'] })),
    ...enRegular.map((v): VerbInfo => ({ inf: v.inf, nl: v.nl, tags: ['regelmatig'] })),
  ],
  presets: [
    { id: 'onr', label: 'Onregelmatig', filter: (v) => v.tags.includes('onregelmatig') },
    { id: 'reg', label: 'Regelmatig', filter: (v) => v.tags.includes('regelmatig') },
  ],
  conjugate: (inf, tense) => bareForms(inf, tense).map((f, i) => `${SHOW[i]} ${first(f)}`),
  answer: answers,
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain,
  sentence: (_inf, tense, i) => ({ before: `${PRON[i]!.charAt(0).toUpperCase()}${PRON[i]!.slice(1)} `, after: ` (${hints[tense]})` }),
};
