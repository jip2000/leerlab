/**
 * Vervoegingsmotor FRANS.
 *
 * Regelmatig (-er, -ir zoals finir, -re zoals vendre) met spellingsregels:
 *  - -cer: c → ç vóór a/o (nous commençons, je commençais)
 *  - -ger: g → ge vóór a/o (nous mangeons, je mangeais)
 *  - appeler/jeter: medeklinker dubbel in de "klemtoonvormen" (j'appelle) en in futur/conditionnel
 *  - acheter/lever: e → è (j'achète, j'achèterai)
 *  - préférer/espérer: é → è in de klemtoonvormen (je préfère), futur blijft é (je préférerai)
 *  - -oyer: y → i (je nettoie, je nettoierai); -ayer: beide mag (je paie / je paye)
 * Onregelmatig: zie src/data/verbs/fr.ts.
 */
import { frIrregular, frRegular, type FrIrregular, type FrRegular } from '@/data/verbs/fr';
import type { Tense, VerbEngine, VerbInfo } from './types';

const PRON = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const STRESSED = [0, 1, 2, 5]; // klemtoon op de stam: je, tu, il, ils

export const frTenses: Tense[] = [
  { id: 'present', label: 'présent' },
  { id: 'passe-compose', label: 'passé composé' },
  { id: 'imparfait', label: 'imparfait' },
  { id: 'plus-que-parfait', label: 'plus-que-parfait' },
  { id: 'futur-simple', label: 'futur simple' },
  { id: 'futur-proche', label: 'futur proche' },
  { id: 'passe-recent', label: 'passé récent' },
  { id: 'conditionnel', label: 'conditionnel présent' },
  { id: 'conditionnel-passe', label: 'conditionnel passé' },
  { id: 'subjonctif', label: 'subjonctif présent' },
  { id: 'imperatif', label: 'impératif', persons: [1, 3, 4] },
];

const DOUBLE = new Set(['appeler', 'rappeler', 'jeter', 'rejeter', 'épeler', 'renouveler', 'projeter', 'feuilleter']);
type ErKind = 'gewoon' | 'double' | 'grave' | 'acute' | 'oyer' | 'ayer';

function erKind(inf: string): ErKind {
  if (/[ou]yer$/.test(inf)) return 'oyer';
  if (/ayer$/.test(inf)) return 'ayer';
  if (DOUBLE.has(inf)) return 'double';
  if (/e[bcdfghjklmnpqrstvz]er$/.test(inf)) return 'grave';
  if (/é[bcdfghjklmnpqrstvz]{1,2}er$/.test(inf)) return 'acute';
  return 'gewoon';
}

/** Stam in een klemtoonvorm; kan twee varianten hebben (payer). */
function stressedStems(stem: string, kind: ErKind): string[] {
  switch (kind) {
    case 'double':
      return [stem + stem.slice(-1)];
    case 'grave':
      return [stem.replace(/e([^e]*)$/, 'è$1')];
    case 'acute':
      return [stem.replace(/é([^é]*)$/, 'è$1')];
    case 'oyer':
      return [stem.slice(0, -1) + 'i'];
    case 'ayer':
      return [stem.slice(0, -1) + 'i', stem];
    default:
      return [stem];
  }
}

/** Plakt stam en uitgang aan elkaar met de spellingsregels voor -cer en -ger. */
function join(stem: string, ending: string): string {
  const hard = /^[ao]/.test(ending);
  if (stem.endsWith('c') && hard) return stem.slice(0, -1) + 'ç' + ending;
  if (stem.endsWith('ç') && !hard) return stem.slice(0, -1) + 'c' + ending;
  if (stem.endsWith('g') && hard) return stem + 'e' + ending;
  if (stem.endsWith('ge') && /^[ie]/.test(ending)) return stem.slice(0, -1) + ending;
  return stem + ending;
}

const alt = (xs: string[]) => [...new Set(xs)].join(' / ');
const first = (s: string) => s.split(' / ')[0]!;

interface Built {
  inf: string;
  nl: string;
  aux: 'avoir' | 'être';
  pp: string;
  irregular: boolean;
  kind?: ErKind | 'ir' | 're';
  present: string[];
  futStem: string[];
  subj: string[];
  imp: string[] | null; // [tu, nous, vous]
  impfStem: string;
}

function buildRegular(v: FrRegular): Built {
  if (v.group === 'ir') {
    const stem = v.inf.slice(0, -2);
    const present = ['is', 'is', 'it', 'issons', 'issez', 'issent'].map((e) => stem + e);
    return finish(v.inf, v.nl, v.aux ?? 'avoir', stem + 'i', false, 'ir', present, [v.inf]);
  }
  if (v.inf.endsWith('re')) {
    const stem = v.inf.slice(0, -2);
    const present = ['s', 's', '', 'ons', 'ez', 'ent'].map((e) => stem + e);
    return finish(v.inf, v.nl, v.aux ?? 'avoir', stem + 'u', false, 're', present, [v.inf.slice(0, -1)]);
  }
  const stem = v.inf.slice(0, -2);
  const kind = erKind(v.inf);
  const endings = ['e', 'es', 'e', 'ons', 'ez', 'ent'];
  const present = endings.map((e, i) => alt((STRESSED.includes(i) ? stressedStems(stem, kind) : [stem]).map((s) => join(s, e))));
  // Futur: klemtoonregels gelden ook voor de hele infinitief (behalve é → è: traditioneel blijft é).
  const futStem = kind === 'acute' || kind === 'gewoon' ? [v.inf] : stressedStems(stem, kind).map((s) => s + 'er');
  return finish(v.inf, v.nl, v.aux ?? 'avoir', stem + 'é', false, kind, present, futStem);
}

function finish(inf: string, nl: string, aux: 'avoir' | 'être', pp: string, irregular: boolean, kind: Built['kind'], present: string[], futStem: string[]): Built {
  const impfStem = first(present[3]!).replace(/ons$/, '');
  // Subjonctif: je/tu/il/ils van de stam van "ils" (présent), nous/vous zoals de imparfait.
  const ilsStems = present[5]!.split(' / ').map((f) => f.replace(/ent$/, ''));
  const subj = [0, 1, 2, 3, 4, 5].map((i) =>
    i === 3 || i === 4 ? join(impfStem, i === 3 ? 'ions' : 'iez') : alt(ilsStems.map((s) => s + ['e', 'es', 'e', '', '', 'ent'][i]!)),
  );
  const imp = [1, 3, 4].map((i) => {
    const f = first(present[i]!);
    if (i !== 1) return f;
    if (f === 'vas') return 'va';
    return f.endsWith('es') ? f.slice(0, -1) : f;
  });
  return { inf, nl, aux, pp, irregular, kind, present, futStem, subj, imp, impfStem };
}

function buildIrregular(v: FrIrregular): Built {
  const b = finish(v.inf, v.nl, v.aux ?? 'avoir', v.pp, true, undefined, [...v.pres], [v.fut]);
  const impfStem = v.impf ?? b.impfStem;
  const subj = v.subjFull
    ? [...v.subjFull]
    : [0, 1, 2, 3, 4, 5].map((i) => (i === 3 || i === 4 ? join(impfStem, i === 3 ? 'ions' : 'iez') : v.subj! + ['e', 'es', 'e', '', '', 'ent'][i]!));
  return { ...b, futStem: [v.fut], subj, impfStem, imp: v.imp === undefined ? b.imp : v.imp };
}

const cache = new Map<string, Built>();
function build(inf: string): Built {
  let b = cache.get(inf);
  if (!b) {
    const irr = frIrregular.find((v) => v.inf === inf);
    const reg = frRegular.find((v) => v.inf === inf);
    if (!irr && !reg) throw new Error(`Onbekend Frans werkwoord: ${inf}`);
    b = irr ? buildIrregular(irr) : buildRegular(reg!);
    cache.set(inf, b);
  }
  return b;
}

const IMPF = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
const FUT = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];

/** Vormen zonder voornaamwoord, per tijd. */
function bareForms(inf: string, tense: string): string[] {
  const b = build(inf);
  const auxOf = (t: string) => bareForms(b.aux === 'être' ? 'être' : 'avoir', t);
  const agree = (i: number) => (b.aux === 'être' ? ['(e)', '(e)', '', '(e)s', '(e)(s)', 's'][i]! : '');
  const compound = (auxTense: string) => auxOf(auxTense).map((a, i) => `${a} ${b.pp}${agree(i)}`);
  switch (tense) {
    case 'present':
      return b.present;
    case 'imparfait':
      return IMPF.map((e) => join(b.impfStem, e));
    case 'futur-simple':
      return FUT.map((e) => alt(b.futStem.map((s) => s + e)));
    case 'conditionnel':
      return IMPF.map((e) => alt(b.futStem.map((s) => s + e)));
    case 'subjonctif':
      return b.subj;
    case 'imperatif':
      return b.imp ? ['', b.imp[0]!, '', b.imp[1]!, b.imp[2]!, ''] : ['', '', '', '', '', ''];
    case 'passe-compose':
      return compound('present');
    case 'plus-que-parfait':
      return compound('imparfait');
    case 'conditionnel-passe':
      return compound('conditionnel');
    case 'futur-proche':
      return build('aller').present.map((a) => `${a} ${inf}`);
    case 'passe-recent': {
      const de = /^[aeiouéèêhâîôû]/i.test(inf) ? "d'" : 'de ';
      return build('venir').present.map((v) => `${v} ${de}${inf}`);
    }
    default:
      throw new Error(`Onbekende tijd: ${tense}`);
  }
}

const startsWithVowel = (w: string) => /^[aeiouéèêëâàîïôûœhy]/i.test(w);
function withPron(pron: string, form: string): string {
  if (pron === 'je' && startsWithVowel(form)) return `j'${form}`;
  return `${pron} ${form}`;
}

const COMPOUND = /passe-compose|plus-que-parfait|conditionnel-passe/;
const que = (x: string) => (/^(il|ils|elle|elles)\b/.test(x) ? `qu'${x}` : `que ${x}`);

function display(inf: string, tense: string, i: number, f: string): string {
  if (!f) return '';
  const one = first(f);
  if (tense === 'imperatif') return `${one} !`;
  const pron = i === 2 ? 'il/elle' : i === 5 ? 'ils/elles' : PRON[i]!;
  let form = one;
  if (build(inf).aux === 'être' && COMPOUND.test(tense)) {
    if (i === 2) form = `${one}(e)`;
    if (i === 5) form = one.replace(/s$/, '(e)s');
  }
  const full = withPron(pron, form);
  return tense === 'subjonctif' ? que(full) : full;
}

/** Alles wat goed is: met/zonder voornaamwoord, il én elle, varianten (paie / paye). */
function answers(inf: string, tense: string, i: number): string {
  const f = bareForms(inf, tense)[i]!;
  if (!f) return '';
  const etre = build(inf).aux === 'être' && COMPOUND.test(tense);
  const out: string[] = [];
  for (const v of f.split(' / ')) {
    if (tense === 'imperatif') {
      out.push(v);
      continue;
    }
    const pairs: [string, string][] = [[PRON[i]!, v]];
    if (i === 2) pairs.push(['elle', etre ? `${v}e` : v]);
    if (i === 5) pairs.push(['elles', etre ? v.replace(/s$/, 'es') : v]);
    for (const [p, form] of pairs) {
      const full = withPron(p, form);
      out.push(full, form);
      if (tense === 'subjonctif') out.push(que(full));
    }
  }
  return [...new Set(out)].join(' / ');
}

function explain(inf: string, tense: string, i: number): string | undefined {
  const b = build(inf);
  const nous = first(b.present[3]!);
  if (/passe-compose|plus-que-parfait|conditionnel-passe/.test(tense)) {
    if (b.aux === 'être')
      return `${inf} vervoeg je met être. Dan krijgt het voltooid deelwoord (${b.pp}) de uitgang van het onderwerp: +e bij vrouwelijk, +s bij meervoud.`;
    return `Deze tijd maak je met een vorm van avoir + het voltooid deelwoord: ${b.pp}.`;
  }
  if (tense === 'imparfait') {
    if (inf === 'être') return 'être is de enige uitzondering in de imparfait: de stam is ét- (j’étais).';
    return `Imparfait = stam van nous in de présent (nous ${nous} → ${b.impfStem}-) + -ais, -ais, -ait, -ions, -iez, -aient.`;
  }
  if (tense === 'futur-simple' || tense === 'conditionnel') {
    const uitg = tense === 'futur-simple' ? '-ai, -as, -a, -ons, -ez, -ont' : '-ais, -ais, -ait, -ions, -iez, -aient';
    return b.irregular
      ? `${inf} heeft een onregelmatige stam: ${b.futStem[0]}-. Daar komen de uitgangen ${uitg} achter.`
      : `Stam = de infinitief${inf.endsWith('re') ? ' zonder -e' : ''} (${b.futStem[0]}-), plus ${uitg}.`;
  }
  if (tense === 'subjonctif')
    return b.irregular && !['dire', 'lire', 'mettre', 'partir', 'sortir', 'dormir', 'écrire', 'conduire', 'suivre', 'vivre'].includes(inf)
      ? `${inf} is onregelmatig in de subjonctif. Leer dit rijtje goed.`
      : 'Subjonctif = stam van ils in de présent + -e, -es, -e, -ions, -iez, -ent.';
  if (tense === 'present') {
    if (b.irregular) return `${inf} is onregelmatig in de présent. Leer dit rijtje uit je hoofd.`;
    if (inf.endsWith('cer') && i === 3) return 'Bij -cer wordt de c een ç vóór a en o, zodat je een s-klank blijft horen: nous commençons.';
    if (inf.endsWith('ger') && i === 3) return 'Bij -ger komt er een e na de g vóór a en o, zodat de g zacht blijft: nous mangeons.';
    if (STRESSED.includes(i)) {
      if (b.kind === 'double') return `Bij ${inf} wordt de medeklinker dubbel als de klemtoon op de stam valt (je, tu, il, ils).`;
      if (b.kind === 'grave') return `Bij ${inf} wordt de e een è als de klemtoon op de stam valt (je, tu, il, ils).`;
      if (b.kind === 'acute') return `Bij ${inf} wordt de é een è als de klemtoon op de stam valt (je, tu, il, ils).`;
      if (b.kind === 'oyer') return `Bij -oyer en -uyer wordt de y een i vóór een stomme e.`;
      if (b.kind === 'ayer') return `Bij -ayer mag de y een i worden vóór een stomme e: allebei goed.`;
    }
  }
  if (tense === 'futur-proche') return 'Futur proche = aller (présent) + infinitief.';
  if (tense === 'passe-recent') return 'Passé récent = venir (présent) + de + infinitief.';
  if (tense === 'imperatif' && i === 1 && inf.endsWith('er')) return 'Bij -er-werkwoorden valt de -s weg bij tu in de gebiedende wijs.';
  return undefined;
}

const frames: Record<string, [string, string]> = {
  present: ["Aujourd'hui, {p}", '.'],
  'passe-compose': ['Hier, {p}', '.'],
  imparfait: ['Quand j’étais petit, {p}', ' souvent.'],
  'plus-que-parfait': ['{P}', ' avant leur arrivée.'],
  'futur-simple': ['Demain, {p}', '.'],
  'futur-proche': ['Ce soir, {p}', '.'],
  'passe-recent': ['{P}', ' à l’instant.'],
  conditionnel: ['Avec plus de temps, {p}', '.'],
  'conditionnel-passe': ['Avec plus de temps, {p}', ' hier.'],
  subjonctif: ['Il faut que {p}', '.'],
};

const info = (inf: string): VerbInfo => {
  const b = build(inf);
  const tags = [b.irregular ? 'onregelmatig' : 'regelmatig'];
  if (!b.irregular) tags.push(b.kind === 'ir' ? 'regelmatig-ir' : b.kind === 're' ? 'regelmatig-re' : 'regelmatig-er');
  if (!b.irregular && b.kind !== 'gewoon' && b.kind !== 'ir' && b.kind !== 're') tags.push('spelling');
  if (b.aux === 'être') tags.push('etre');
  return { inf, nl: b.nl, tags };
};

export const frEngine: VerbEngine = {
  lang: 'fr',
  persons: ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'],
  tenses: frTenses,
  verbs: [...frIrregular.map((v) => v.inf), ...frRegular.map((v) => v.inf)].map(info),
  presets: [
    { id: 'top', label: 'Onregelmatig', filter: (v) => v.tags.includes('onregelmatig') },
    { id: 'er', label: 'Regelmatig op -er', filter: (v) => v.tags.includes('regelmatig-er') },
    { id: 'ir-re', label: 'Regelmatig op -ir en -re', filter: (v) => v.tags.includes('regelmatig-ir') || v.tags.includes('regelmatig-re') },
    { id: 'spelling', label: 'Met spellingsregels', filter: (v) => v.tags.includes('spelling') || /[cg]er$/.test(v.inf) },
    { id: 'etre', label: 'Met être', filter: (v) => v.tags.includes('etre') },
  ],
  conjugate: (inf, tense) => bareForms(inf, tense).map((f, i) => display(inf, tense, i, f)),
  answer: answers,
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain,
  sentence(inf, tense, i) {
    const fr = frames[tense];
    if (!fr) return tense === 'imperatif' ? { before: '', after: ` ! (${['', 'tu', '', 'nous', 'vous', ''][i]})` } : undefined;
    const form = first(bareForms(inf, tense)[i]!);
    let p = i === 2 ? 'il' : i === 5 ? 'ils' : PRON[i]!;
    if (p === 'je' && startsWithVowel(form)) p = 'j’';
    const before = fr[0].replace('{p}', p).replace('{P}', p.charAt(0).toUpperCase() + p.slice(1)).replace('que il', 'qu’il').replace('que ils', 'qu’ils');
    return { before: before + (p.endsWith('’') ? '' : ' '), after: fr[1] };
  },
};
