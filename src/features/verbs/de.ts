/**
 * Vervoegingsmotor DUITS.
 *
 * Zwakke werkwoorden met regels:
 *  - e-invoeging als de stam eindigt op -d/-t of op -m/-n na een medeklinker: du arbeitest, er öffnet
 *  - stam op -s/-ß/-x/-z: du krijgt alleen -t: du tanzt, du heißt
 *  - geen ge- bij -ieren en onscheidbare voorvoegsels (be-, ver-, er- …): besucht, studiert
 *  - scheidbare werkwoorden: ich stehe auf, ich bin aufgestanden
 * Sterke en onregelmatige werkwoorden: zie src/data/verbs/de.ts.
 */
import { deVerbs, type DeVerb } from '@/data/verbs/de';
import type { Tense, VerbEngine, VerbInfo } from './types';

export const deTenses: Tense[] = [
  { id: 'praesens', label: 'Präsens' },
  { id: 'praeteritum', label: 'Präteritum' },
  { id: 'perfekt', label: 'Perfekt' },
  { id: 'plusquamperfekt', label: 'Plusquamperfekt' },
  { id: 'futur1', label: 'Futur I' },
  { id: 'konjunktiv2', label: 'Konjunktiv II' },
  { id: 'imperativ', label: 'Imperativ', persons: [1, 4, 5] },
];

const PRON = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
const PRON_SHOW = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
const INSEP = /^(be|ver|er|ent|emp|ge|zer|miss)/;

const byInf = new Map(deVerbs.map((v) => [v.inf, v]));
function get(inf: string): DeVerb {
  const v = byInf.get(inf);
  if (!v) throw new Error(`Onbekend Duits werkwoord: ${inf}`);
  return v;
}

/** Het werkwoord zonder scheidbaar voorvoegsel: aufstehen → stehen. */
const baseInf = (v: DeVerb) => (v.prefix ? v.inf.slice(v.prefix.length) : v.inf);
const stemOf = (inf: string) => inf.replace(/e?n$/, '');

/** Heeft de stam een extra e nodig vóór -st en -t? */
export function needsE(stem: string): boolean {
  return /[dt]$/.test(stem) || /[^aeiouäöülrhmn][mn]$/.test(stem);
}
const sibilant = (stem: string) => /(s|ß|x|z)$/.test(stem);

const isStrong = (v: DeVerb) => !!v.praet && !v.mixed;
const isWeak = (v: DeVerb) => !v.praet && !v.pres;

function presentBase(v: DeVerb): string[] {
  if (v.pres) return [...v.pres];
  const stem = stemOf(baseInf(v));
  const e = needsE(stem) ? 'e' : '';
  const du = v.du ?? stem + (sibilant(stem) ? 't' : `${e}st`);
  const er = v.er ?? stem + `${e}t`;
  return [`${stem}e`, du, er, baseInf(v), `${stem}${e}t`, baseInf(v)];
}

function praeteritumBase(v: DeVerb): string[] {
  if (!v.praet) {
    const stem = stemOf(baseInf(v));
    const t = stem + (needsE(stem) ? 'ete' : 'te');
    return [t, `${t}st`, t, `${t}n`, `${t}t`, `${t}n`];
  }
  if (v.mixed) {
    const s = v.praet.replace(/e$/, '');
    return [`${s}e`, `${s}est`, `${s}e`, `${s}en`, `${s}et`, `${s}en`];
  }
  const p = v.praet;
  const du = /(s|ß|z|d|t)$/.test(p) ? `${p}est` : `${p}st`;
  const ihr = /[dt]$/.test(p) ? `${p}et` : `${p}t`;
  return [p, du, p, `${p}en`, ihr, `${p}en`];
}

export function partizip(v: DeVerb): string {
  if (v.pp) return (v.prefix ?? '') + v.pp;
  const inf = baseInf(v);
  const stem = stemOf(inf);
  const end = needsE(stem) ? 'et' : 't';
  const ge = /ieren$/.test(inf) || INSEP.test(inf) ? '' : 'ge';
  return `${v.prefix ?? ''}${ge}${stem}${end}`;
}

/** Plakt het scheidbare voorvoegsel achter de vorm: stehe → stehe auf. */
const sep = (v: DeVerb, f: string) => (v.prefix ? `${f} ${v.prefix}` : f);
const first = (s: string) => s.split(' / ')[0]!;

function konjunktiv2(v: DeVerb): string[] {
  const wuerde = presentOf('werden', 'konjunktiv2Würde').map((w) => `${w} ${v.inf}`);
  if (!v.k2) return wuerde;
  const s = v.k2;
  // Bij wär- en käm- mag du/ihr ook zonder e: du wärst / wärest, ihr kämt / kämet.
  const soft = v.inf === 'sein' || v.inf === 'kommen';
  const forms = [
    `${s}e`,
    soft ? (v.inf === 'sein' ? `${s}st / ${s}est` : `${s}est / ${s}st`) : `${s}est`,
    `${s}e`,
    `${s}en`,
    soft ? (v.inf === 'sein' ? `${s}t / ${s}et` : `${s}et / ${s}t`) : `${s}et`,
    `${s}en`,
  ].map((f) => f.split(' / ').map((x) => sep(v, x)).join(' / '));
  return v.k2Only ? forms : forms.map((f, i) => `${f} / ${wuerde[i]}`);
}

function presentOf(inf: string, which: 'praesens' | 'praeteritum' | 'konjunktiv2Würde'): string[] {
  if (which === 'konjunktiv2Würde') return ['würde', 'würdest', 'würde', 'würden', 'würdet', 'würden'];
  const v = get(inf);
  return which === 'praesens' ? presentBase(v) : praeteritumBase(v);
}

function imperativ(v: DeVerb): string[] {
  if (v.noImp || v.modal || v.inf === 'wissen') return ['', '', '', '', '', ''];
  if (v.inf === 'sein') return ['', 'sei', '', '', 'seid', 'seien Sie'];
  const stem = stemOf(baseInf(v));
  const pres = presentBase(v);
  let du: string;
  if (v.impDu) du = v.impDu;
  else if (needsE(stem)) du = `${stem}e`;
  else du = `${stem} / ${stem}e`;
  const p = v.prefix;
  const withP = (f: string) => f.split(' / ').map((x) => (p ? `${x} ${p}` : x)).join(' / ');
  return ['', withP(du), '', '', withP(pres[4]!), p ? `${baseInf(v)} Sie ${p}` : `${v.inf} Sie`];
}

function bareForms(inf: string, tense: string): string[] {
  const v = get(inf);
  const aux = v.aux === 'sein' ? 'sein' : 'haben';
  const pp = partizip(v);
  switch (tense) {
    case 'praesens':
      return presentBase(v).map((f) => sep(v, f));
    case 'praeteritum':
      return praeteritumBase(v).map((f) => sep(v, f));
    case 'perfekt':
      return presentBase(get(aux)).map((a) => `${a} ${pp}`);
    case 'plusquamperfekt':
      return praeteritumBase(get(aux)).map((a) => `${a} ${pp}`);
    case 'futur1':
      return presentBase(get('werden')).map((w) => `${w} ${v.inf}`);
    case 'konjunktiv2':
      return konjunktiv2(v);
    case 'imperativ':
      return imperativ(v);
    default:
      throw new Error(`Onbekende tijd: ${tense}`);
  }
}

function display(tense: string, i: number, f: string): string {
  if (!f) return '';
  const one = first(f);
  if (tense === 'imperativ') return `${one}!`;
  return `${PRON_SHOW[i]} ${one}`;
}

function answers(inf: string, tense: string, i: number): string {
  const f = bareForms(inf, tense)[i]!;
  if (!f) return '';
  const out: string[] = [];
  for (const v of f.split(' / ')) {
    if (tense === 'imperativ') {
      out.push(v);
      continue;
    }
    const prons = i === 2 ? ['er', 'sie', 'es'] : [PRON[i]!];
    for (const p of prons) out.push(`${p} ${v}`);
    out.push(v);
  }
  return [...new Set(out)].join(' / ');
}

function explain(inf: string, tense: string, i: number): string | undefined {
  const v = get(inf);
  const stem = stemOf(baseInf(v));
  const pp = partizip(v);
  if (tense === 'perfekt' || tense === 'plusquamperfekt') {
    const hulp = tense === 'perfekt' ? 'Präsens' : 'Präteritum';
    const base = v.aux === 'sein'
      ? `${inf} vervoeg je met sein (beweging of verandering, of bleiben/sein). Dus: sein (${hulp}) + ${pp}.`
      : `Dit maak je met haben (${hulp}) + het voltooid deelwoord: ${pp}.`;
    if (/ieren$/.test(inf)) return `${base} Werkwoorden op -ieren krijgen geen ge-.`;
    if (!v.prefix && INSEP.test(inf)) return `${base} Met be-, ver-, er-, ent-, emp-, ge-, zer- of miss- krijgt het deelwoord geen ge-.`;
    if (v.prefix) return `${base} ${inf} is scheidbaar: ge- komt tussen ${v.prefix} en de stam.`;
    return base;
  }
  if (tense === 'praesens') {
    if (v.pres) return `${inf} is onregelmatig in het Präsens. Leer dit rijtje uit je hoofd.`;
    if ((i === 1 || i === 2) && (v.du || v.er)) return `${inf} is een sterk werkwoord: bij du en er/sie/es verandert de klinker (du ${v.du}, er ${v.er}).`;
    if (i === 1 && sibilant(stem)) return `De stam (${stem}) eindigt op een s-klank, dus du krijgt alleen -t: du ${stem}t.`;
    if ((i === 1 || i === 2 || i === 4) && needsE(stem)) return `De stam (${stem}) eindigt op -d, -t of -m/-n na een medeklinker: dan komt er een extra e bij (${stem}e${i === 1 ? 'st' : 't'}).`;
    if (v.prefix) return `${inf} is scheidbaar: het voorvoegsel ${v.prefix} gaat naar het eind van de zin.`;
  }
  if (tense === 'praeteritum') {
    if (isWeak(v)) return `Zwak werkwoord: stam + -te (${stem}${needsE(stem) ? 'ete' : 'te'}).`;
    if (isStrong(v)) return `Sterk werkwoord: de stam van het Präteritum is ${v.praet}-. Bij ich en er/sie/es komt er geen uitgang achter.`;
    return `${inf} is gemengd/onregelmatig: ${v.praet}.`;
  }
  if (tense === 'futur1') return 'Futur I = werden (Präsens) + infinitief.';
  if (tense === 'konjunktiv2')
    return v.k2 ? `${inf} heeft een eigen vorm in de Konjunktiv II (${v.k2}e)${v.k2Only ? '' : '; würde + infinitief mag ook'}.` : 'Konjunktiv II maak je bij de meeste werkwoorden met würde + infinitief.';
  if (tense === 'imperativ' && i === 1 && v.impDu) return `Bij werkwoorden met e → i(e) in het Präsens verandert de klinker ook in de gebiedende wijs: ${v.impDu}!`;
  return undefined;
}

const hints: Record<string, string> = {
  praesens: 'jetzt',
  praeteritum: 'gestern',
  perfekt: 'gestern',
  plusquamperfekt: 'davor',
  futur1: 'morgen',
  konjunktiv2: 'wenn ich Zeit hätte',
};

const info = (v: DeVerb): VerbInfo => {
  const tags: string[] = [];
  if (v.modal) tags.push('modaal');
  if (v.pres && !v.modal) tags.push('onregelmatig');
  if (isStrong(v) || (v.mixed && !v.modal)) tags.push('sterk');
  if (isWeak(v)) tags.push('zwak');
  if (v.prefix) tags.push('scheidbaar');
  if (v.aux === 'sein') tags.push('sein');
  return { inf: v.inf, nl: v.nl, tags };
};

export const deEngine: VerbEngine = {
  lang: 'de',
  persons: PRON_SHOW,
  tenses: deTenses,
  verbs: deVerbs.map(info),
  presets: [
    { id: 'sterk', label: 'Sterk en onregelmatig', filter: (v) => v.tags.includes('sterk') || v.tags.includes('onregelmatig') },
    { id: 'zwak', label: 'Zwak (regelmatig)', filter: (v) => v.tags.includes('zwak') },
    { id: 'modaal', label: 'Modale werkwoorden', filter: (v) => v.tags.includes('modaal') },
    { id: 'scheidbaar', label: 'Scheidbaar', filter: (v) => v.tags.includes('scheidbaar') },
    { id: 'sein', label: 'Perfekt met sein', filter: (v) => v.tags.includes('sein') },
  ],
  conjugate: (inf, tense) => bareForms(inf, tense).map((f, i) => display(tense, i, f)),
  answer: answers,
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain,
  sentence(_inf, tense, i) {
    if (tense === 'imperativ') return { before: '', after: `! (${['', 'du', '', '', 'ihr', 'Sie'][i]})` };
    const p = PRON[i]!;
    return { before: `${p.charAt(0).toUpperCase()}${p.slice(1)} `, after: ` (${hints[tense]})` };
  },
};
