/**
 * GEMIXTE OEFENRONDE: werkwoorden vervoegen én grammatica-onderwerpen door elkaar,
 * in de tijden die je kiest. Alles wordt een gewone grammatica-oefening (Exercise),
 * zodat één oefenscherm alles kan tonen.
 *
 * Een onderwerp oefen je op een van deze manieren:
 *  - 'werkwoorden':     werkwoorden vervoegen (zoals de werkwoordtrainer)
 *  - 'sjablonen':       zinnen met een gat, in de gekozen tijd (zie templates.ts)
 *  - 'werkwoordgroep':  een groep werkwoorden (scheidbaar, modaal …) in de gekozen tijd
 *  - 'geen':            de vaste oefeningen van het onderwerp (los van de tijd)
 */
import type { LanguageCode } from '@/data/languages';
import { getLanguage } from '@/data/languages';
import { exercisesOf, getTopic, grammar } from '@/data/grammar';
import { verbEngines } from '@/features/verbs/registry';
import { candidates, pickQuestions, type Stat, type VerbMode, type VerbQuestion } from '@/features/verbs/trainer';
import { levelSentence, type Level } from '@/features/verbs/levels';
import { shuffled } from '@/features/practice/engine';
import { filterExercises } from './cases';
import { filterExercisesByPart } from './parts';
import { templateExercise, templatesFor } from './templates';
import { explanationTopicIds } from './tenseLinks';
import type { Exercise } from './types';

export const WERKWOORDEN = 'werkwoorden';

export interface MixItem {
  ex: Exercise;
  /** Bij een werkwoordvraag: welke (voor je voortgang per tijd). */
  q?: VerbQuestion;
  topic: string;
}

export type TenseUse = 'werkwoorden' | 'sjablonen' | 'werkwoordgroep' | 'geen';

/** Hoe dit onderwerp met tijden omgaat. */
export function tenseUse(lang: LanguageCode, id: string): TenseUse {
  if (id === WERKWOORDEN) return 'werkwoorden';
  if (templatesFor(lang, id).length) return 'sjablonen';
  if (getTopic(lang, id)?.tenses && verbEngines[lang]) return 'werkwoordgroep';
  return 'geen';
}
export const usesTenses = (lang: LanguageCode, id: string) => tenseUse(lang, id) !== 'geen';

/** Wat je bovenaan kunt kiezen: werkwoorden vervoegen, en de grammatica (de uitleg van tijden staat al bij de tijden). */
export function practiceTopics(lang: LanguageCode): { id: string; title: string }[] {
  const skip = explanationTopicIds(lang);
  const topics = getLanguage(lang)
    .grammarTopics.filter((t) => !skip.has(t.id) && getTopic(lang, t.id))
    .map((t) => ({ id: t.id, title: t.title }));
  return verbEngines[lang] ? [{ id: WERKWOORDEN, title: 'Werkwoorden vervoegen' }, ...topics] : topics;
}

const label = (lang: LanguageCode, tense: string) => verbEngines[lang]?.tenses.find((t) => t.id === tense)?.label ?? tense;

/** Een werkwoordvraag als oefening, in de gekozen oefenvorm. */
export function verbExercise(lang: LanguageCode, q: VerbQuestion, mode: VerbMode, level: Level, pool: VerbQuestion[] = []): Exercise {
  const engine = verbEngines[lang]!;
  const tense = engine.tenses.find((t) => t.id === q.tense)!;
  const explain = engine.explain(q.verb, q.tense, q.person);
  if (mode === 'rijtje') {
    const persons = (tense.persons ?? [0, 1, 2, 3, 4, 5]).filter((p) => engine.bare(q.verb, q.tense, p));
    return {
      type: 'table',
      title: `${q.verb} · ${tense.label}`,
      rows: persons.map((p) => ({ label: engine.persons[p]!, answer: engine.answer(q.verb, q.tense, p) })),
      explain: engine.explain(q.verb, q.tense, persons[0] ?? 0),
    };
  }
  if (mode === 'omgekeerd') {
    const shown = engine.conjugate(q.verb, q.tense)[q.person]!;
    const key = (x: VerbQuestion) => `${x.verb} · ${label(lang, x.tense)} · ${engine.persons[x.person]}`;
    const right = key(q);
    // Geen foute keuzes die toevallig dezelfde vorm hebben (parle = je én il).
    const wrong = [...new Set(shuffled(pool).filter((x) => key(x) !== right && engine.conjugate(x.verb, x.tense)[x.person] !== shown).map(key))];
    if (wrong.length >= 1) {
      const options = shuffled([right, ...wrong.slice(0, 3)]);
      return { type: 'choice', question: `Welke vorm is dit? «${shown}»`, options, answer: options.indexOf(right), explain };
    }
  }
  const s = mode === 'zin' ? levelSentence(lang, engine.sentence(q.verb, q.tense, q.person), q, level) : undefined;
  return {
    type: 'gap',
    sentence: s ? `${s.before}___${s.after}` : `${engine.persons[q.person]} ___`,
    answer: engine.answer(q.verb, q.tense, q.person),
    hint: `${q.verb} · ${tense.label}`,
    explain,
  };
}

export interface MixOptions {
  lang: LanguageCode;
  /** Gekozen onderwerpen, eventueel met WERKWOORDEN. */
  topics: string[];
  tenses: string[];
  verbs: string[];
  persons: number[];
  mode: VerbMode;
  level: Level;
  count: number;
  /** Gekozen naamvallen (alleen voor talen met naamvallen). */
  cases: Set<string>;
  /** Gekozen onderdelen per onderwerp. */
  parts: (topicId: string) => Set<string>;
  stats?: Map<string, Stat>;
}

function itemsFor(o: MixOptions, id: string): MixItem[] {
  const engine = verbEngines[o.lang];
  const use = tenseUse(o.lang, id);
  const tenses = o.tenses.length ? o.tenses : engine ? [engine.tenses[0]!.id] : [];

  if ((use === 'werkwoorden' || use === 'werkwoordgroep') && engine) {
    const topic = getTopic(o.lang, id);
    const verbs = use === 'werkwoorden' ? o.verbs : engine.verbs.filter((v) => !topic?.verbFilter || topic.verbFilter(v.inf, v.tags)).map((v) => v.inf);
    const persons = use === 'werkwoorden' ? o.persons : [0, 1, 2, 3, 4, 5];
    const pool = candidates(engine, verbs, tenses, persons);
    const qs = o.mode === 'rijtje'
      ? pickQuestions([...new Map(pool.map((q) => [`${q.verb}:${q.tense}`, { ...q, person: 0 }])).values()], o.count, o.stats ?? new Map(), o.lang)
      : pickQuestions(pool, o.count, o.stats ?? new Map(), o.lang);
    return qs.map((q) => ({ ex: verbExercise(o.lang, q, o.mode, o.level, pool), q, topic: id }));
  }

  if (use === 'sjablonen') {
    const parts = o.parts(id);
    const exs = templatesFor(o.lang, id)
      .filter((t) => !t.part || parts.has(t.part))
      .flatMap((t) => tenses.map((tense) => templateExercise(o.lang, t, tense)))
      .filter((e): e is Exercise => !!e);
    return shuffled(filterExercises(o.lang, exs, o.cases)).slice(0, o.count).map((ex) => ({ ex, topic: id }));
  }

  const topic = getTopic(o.lang, id);
  if (!topic) return [];
  const exs = filterExercises(o.lang, filterExercisesByPart(exercisesOf(topic), o.parts(id)), o.cases);
  return shuffled(exs).slice(0, o.count).map((ex) => ({ ex, topic: id }));
}

/** Stelt een ronde samen: om en om uit elk gekozen onderwerp, tot het gevraagde aantal. */
export function buildMix(o: MixOptions): MixItem[] {
  const queues = o.topics.map((id) => itemsFor(o, id));
  const out: MixItem[] = [];
  for (let i = 0; out.length < o.count && queues.some((q) => q.length); i++) {
    const q = queues[i % queues.length]!;
    if (q.length) out.push(q.shift()!);
  }
  return shuffled(out);
}

/** Bestaat dit onderwerp in deze taal? (Voor bewaarde keuzes van een oudere versie.) */
export const validTopic = (lang: LanguageCode, id: string) => id === WERKWOORDEN || !!grammar[lang]?.some((t) => t.id === id);
