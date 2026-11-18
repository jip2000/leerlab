/**
 * TABELMOTOR: werkwoorden als kant-en-klare rijtjes.
 * Voor talen waar we (nog) geen regels uitschrijven, staan per werkwoord en tijd de zes vormen
 * gewoon in een tabel. Een vorm mag varianten hebben ("sa / sade") en een los stukje tussen
 * haakjes ("λύουσι(ν)" = λύουσι of λύουσιν). '' = deze vorm bestaat niet.
 */
import type { LanguageCode } from '@/data/languages';
import type { Preset, Tense, VerbEngine, VerbInfo } from './types';

export type Six = [string, string, string, string, string, string];

export interface TableVerb {
  inf: string;
  nl: string;
  tags?: string[];
  /** Vormen per tijd-id. */
  forms: Record<string, Six>;
}

export interface TableOptions {
  lang: LanguageCode;
  /** Zoals ze in de oefening staan, bijv. "ik", "hij/zij", of "1 ev (ik)". */
  persons: string[];
  tenses: Tense[];
  verbs: TableVerb[];
  presets?: Preset[];
  /** Mag je het voornaamwoord meetypen ("jag är")? Standaard ja. */
  pronouns?: boolean;
  /** Ook goed zonder accenten/spiritus (voor Oudgrieks). */
  lenientAccents?: boolean;
  /** Russisch: е mag ook voor ё. */
  yo?: boolean;
  explain?: (v: TableVerb, tense: string, person: number) => string | undefined;
}

/** "a / b(ν)" → ["a", "b", "bν"] */
export function variants(form: string): string[] {
  return form
    .split(' / ')
    .map((f) => f.trim())
    .filter(Boolean)
    .flatMap((f) => {
      const m = /^(.*)\((.+?)\)(.*)$/.exec(f);
      return m ? [`${m[1]}${m[3]}`, `${m[1]}${m[2]}${m[3]}`] : [f];
    });
}

const stripMarks = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');

/** Zelfde vorm voor alle zes personen (Zweeds, Deens, Noors). */
export const same = (f: string): Six => [f, f, f, f, f, f];

export function tableEngine(o: TableOptions): VerbEngine {
  const byInf = new Map(o.verbs.map((v) => [v.inf, v]));
  const withPronoun = o.pronouns !== false;
  const form = (inf: string, tense: string, i: number) => byInf.get(inf)?.forms[tense]?.[i] ?? '';
  const first = (f: string) => f.split(' / ')[0]!.trim();

  return {
    lang: o.lang,
    persons: o.persons,
    tenses: o.tenses,
    verbs: o.verbs.map((v): VerbInfo => ({ inf: v.inf, nl: v.nl, tags: v.tags ?? [] })),
    presets: o.presets ?? [],
    conjugate: (inf, tense) =>
      o.persons.map((p, i) => {
        const f = form(inf, tense, i);
        return !f ? '' : withPronoun ? `${p.split('/')[0]} ${first(f)}` : first(f);
      }),
    answer(inf, tense, i) {
      const f = form(inf, tense, i);
      if (!f) return '';
      let out = variants(f);
      if (withPronoun) {
        const prons = o.persons[i]!.split('/').map((p) => p.trim());
        out = out.flatMap((v) => [v, ...prons.map((p) => `${p} ${v}`)]);
      }
      if (o.lenientAccents) out = out.flatMap((v) => [v, stripMarks(v)]);
      if (o.yo) out = out.flatMap((v) => [v, v.replace(/ё/g, 'е')]);
      return [...new Set(out)].join(' / ');
    },
    bare: (inf, tense, i) => first(form(inf, tense, i)),
    explain: (inf, tense, i) => {
      const v = byInf.get(inf);
      return v && o.explain ? o.explain(v, tense, i) : undefined;
    },
    sentence: (inf, tense, i) =>
      withPronoun
        ? { before: `(${o.persons[i]}) `, after: '' }
        : { before: '', after: ` (${inf}; ${o.tenses.find((t) => t.id === tense)?.label}, ${o.persons[i]})` },
  };
}
