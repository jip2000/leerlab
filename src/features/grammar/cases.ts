/**
 * NAAMVALLEN KIEZEN
 * Niet iedereen hoeft alle naamvallen te leren. Per taal kies je welke je wilt zien;
 * standaard staan ze allemaal aan. Uitleg-tabellen en oefeningen met een naamval die
 * uit staat, worden weggelaten.
 *
 * Een taal met naamvallen toevoegen = hieronder een rijtje toevoegen.
 */
import type { LanguageCode } from '@/data/languages';
import type { Block, Exercise, TopicContent } from './types';

export interface Case {
  id: string;
  label: string;
  /** Zoals op school, bijv. "1e naamval". */
  nr?: string;
  /** Hoe de naamval in tabellen kan heten (kleine letters), bijv. 'akk' of 'acc.'. */
  short: string[];
}

const latijns = (extra: Case[] = []): Case[] => [
  { id: 'nom', nr: '1e naamval', label: 'nominativus', short: ['nominativus', 'nom'] },
  { id: 'gen', nr: '2e naamval', label: 'genitivus', short: ['genitivus', 'gen'] },
  { id: 'dat', nr: '3e naamval', label: 'dativus', short: ['dativus', 'dat'] },
  { id: 'acc', nr: '4e naamval', label: 'accusativus', short: ['accusativus', 'acc'] },
  ...extra,
];

export const casesByLang: Partial<Record<LanguageCode, Case[]>> = {
  // Volgorde zoals op Nederlandse scholen: 1e = Nominativ, 2e = Genitiv, 3e = Dativ, 4e = Akkusativ.
  de: [
    { id: 'nom', nr: '1e naamval', label: 'Nominativ', short: ['nominativ', 'nom'] },
    { id: 'gen', nr: '2e naamval', label: 'Genitiv', short: ['genitiv', 'gen'] },
    { id: 'dat', nr: '3e naamval', label: 'Dativ', short: ['dativ', 'dat'] },
    { id: 'akk', nr: '4e naamval', label: 'Akkusativ', short: ['akkusativ', 'akk'] },
  ],
  la: latijns([
    { id: 'abl', nr: '5e naamval', label: 'ablativus', short: ['ablativus', 'abl'] },
    { id: 'voc', nr: '6e naamval', label: 'vocativus', short: ['vocativus', 'voc'] },
  ]),
  grc: latijns(),
};

export const casesOf = (lang: LanguageCode): Case[] => casesByLang[lang] ?? [];

/** Gekozen naamvallen; niets bewaard = alles aan. */
export function selectedCases(lang: LanguageCode, saved: Partial<Record<LanguageCode, string[]>>): Set<string> {
  const all = casesOf(lang).map((c) => c.id);
  const mine = saved[lang]?.filter((id) => all.includes(id));
  return new Set(mine && mine.length > 0 ? mine : all);
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Tabelcel die mét een naamval begint ("Akkusativ", "acc. ev", "Dat"). */
function caseOfCell(lang: LanguageCode, cell: string): string | undefined {
  const c = cell.trim().toLowerCase();
  return casesOf(lang).find((k) => k.short.some((s) => new RegExp(`^${esc(s)}(?![a-zäöü])`).test(c)))?.id;
}

/** Naamvallen die in een stuk tekst genoemd worden (voluit, bijv. "Dativ" of "genitivus"). */
function casesInText(lang: LanguageCode, text: string): string[] {
  const t = text.toLowerCase();
  return casesOf(lang)
    .filter((k) => new RegExp(`(^|[^a-zäöü])${esc(k.label.toLowerCase())}([^a-zäöü]|$)`).test(t))
    .map((k) => k.id);
}

/** Over welke naamvallen gaat deze oefening? Leeg = niet aan een naamval gebonden. */
export function casesOfExercise(lang: LanguageCode, ex: Exercise): string[] {
  if (ex.cases) return ex.cases;
  const parts: string[] = [ex.explain ?? ''];
  switch (ex.type) {
    case 'gap': parts.push(ex.sentence, ex.hint ?? ''); break;
    case 'choice': parts.push(ex.question, ex.options[ex.answer] ?? ''); break;
    case 'table': parts.push(ex.title); break;
    case 'translate': parts.push(ex.nl); break;
    case 'fix': parts.push(ex.sentence); break;
    case 'order': parts.push(ex.nl ?? ''); break;
  }
  return [...new Set(parts.flatMap((p) => casesInText(lang, p)))];
}

const keep = (cases: string[], on: Set<string>) => cases.length === 0 || cases.some((c) => on.has(c));

function filterTable(lang: LanguageCode, head: string[] | undefined, rows: string[][], on: Set<string>) {
  // Rijen die met een uitgezette naamval beginnen weg.
  let r = rows.filter((row) => {
    const c = caseOfCell(lang, row[0] ?? '');
    return !c || on.has(c);
  });
  let h = head;
  // Kolommen met een uitgezette naamval als kop weg (maar nooit allemaal).
  if (head) {
    const drop = head.map((cell) => {
      const c = caseOfCell(lang, cell);
      return !!c && !on.has(c);
    });
    if (drop.some(Boolean) && drop.some((d) => !d)) {
      h = head.filter((_, i) => !drop[i]);
      r = r.map((row) => row.filter((_, i) => !drop[i]));
    }
  }
  return { head: h, rows: r };
}

export function filterBlocks(lang: LanguageCode, blocks: Block[], on: Set<string>): Block[] {
  if (!casesByLang[lang]) return blocks;
  return blocks.flatMap((b): Block[] => {
    if (b.type === 'table') {
      const t = filterTable(lang, b.head, b.rows, on);
      return t.rows.length === 0 ? [] : [{ ...b, head: t.head ?? b.head, rows: t.rows }];
    }
    if (b.type === 'examples') {
      const items = b.items.filter(([, nl]) => keep(casesInText(lang, nl), on));
      return items.length === 0 ? [] : [{ ...b, items }];
    }
    return [b];
  });
}

export function filterExercises(lang: LanguageCode, exercises: Exercise[], on: Set<string>): Exercise[] {
  if (!casesByLang[lang]) return exercises;
  return exercises.flatMap((ex): Exercise[] => {
    if (!keep(casesOfExercise(lang, ex), on)) return [];
    if (ex.type === 'table') {
      const rows = ex.rows.filter((r) => {
        const c = caseOfCell(lang, r.label);
        return !c || on.has(c);
      });
      return rows.length === 0 ? [] : [{ ...ex, rows }];
    }
    if (ex.type === 'choice') {
      // Foute antwoorden die alleen over uitgezette naamvallen gaan, weglaten (als er genoeg overblijven).
      const right = ex.options[ex.answer]!;
      const options = ex.options.filter((o, i) => i === ex.answer || keep(casesInText(lang, o), on));
      return options.length >= 2 ? [{ ...ex, options, answer: options.indexOf(right) }] : [ex];
    }
    return [ex];
  });
}

/** Heeft dit onderwerp iets met naamvallen te maken? (Dan tonen we de keuze.) */
export function topicUsesCases(lang: LanguageCode, topic: TopicContent): boolean {
  if (!casesByLang[lang]) return false;
  const all = new Set<string>();
  const tableHit = topic.blocks.some((b) => b.type === 'table' && (b.rows.some((r) => caseOfCell(lang, r[0] ?? '')) || (b.head ?? []).some((h) => caseOfCell(lang, h))));
  if (tableHit) return true;
  if (typeof topic.exercises === 'function') return false;
  for (const ex of topic.exercises) for (const c of casesOfExercise(lang, ex)) all.add(c);
  return all.size > 0;
}
