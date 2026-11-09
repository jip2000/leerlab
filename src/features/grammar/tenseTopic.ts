/**
 * Grammatica-onderwerpen over tijden: de tabel en de oefeningen worden gemaakt met
 * de werkwoordmotor, zodat alle vormen kloppen (en getest zijn).
 */
import type { LanguageCode } from '@/data/languages';
import { verbEngines } from '@/features/verbs/registry';
import { shuffled } from '@/features/practice/engine';
import type { Block, Exercise, TopicContent } from './types';

interface Options {
  id: string;
  lang: LanguageCode;
  tenses: string[];
  /** Voorbeeldwerkwoorden voor de tabel. */
  models: string[];
  /** Werkwoorden om mee te oefenen (standaard: alle). */
  verbs?: (inf: string, tags: string[]) => boolean;
  blocks: Block[];
}

export function tenseTopic(o: Options): TopicContent {
  const engine = verbEngines[o.lang]!;
  const tables: Block[] = o.tenses.flatMap((t) => {
    const tense = engine.tenses.find((x) => x.id === t)!;
    const persons = tense.persons ?? [0, 1, 2, 3, 4, 5];
    return [{
      type: 'table' as const,
      caption: tense.label,
      head: ['', ...o.models],
      rows: persons.map((p) => [engine.persons[p]!, ...o.models.map((m) => engine.bare(m, t, p))]),
    }];
  });
  return {
    id: o.id,
    blocks: [...o.blocks, ...tables],
    exercises: () => {
      // Alleen werkwoorden die in deze tijden ook echt vormen hebben (pouvoir heeft geen impératif).
      const verbs = engine.verbs
        .filter((v) => !o.verbs || o.verbs(v.inf, v.tags))
        .map((v) => v.inf)
        .filter((inf) => o.tenses.every((t) => [0, 1, 2, 3, 4, 5].some((p) => engine.bare(inf, t, p))));
      const out: Exercise[] = [];
      for (const verb of shuffled(verbs).slice(0, 8)) {
        const tense = o.tenses[Math.floor(Math.random() * o.tenses.length)]!;
        const t = engine.tenses.find((x) => x.id === tense)!;
        const persons = (t.persons ?? [0, 1, 2, 3, 4, 5]).filter((p) => engine.bare(verb, tense, p));
        const p = persons[Math.floor(Math.random() * persons.length)]!;
        const s = engine.sentence(verb, tense, p);
        const kind = out.length % 3;
        if (kind === 0 && s) {
          out.push({ type: 'gap', sentence: `${s.before}___${s.after}`, answer: engine.answer(verb, tense, p), hint: `${verb}, ${t.label}`, explain: engine.explain(verb, tense, p) });
        } else if (kind === 1) {
          const right = engine.bare(verb, tense, p);
          const wrong = new Set<string>();
          for (const tt of engine.tenses) for (let q = 0; q < 6; q++) {
            const f = engine.bare(verb, tt.id, q);
            if (f && f !== right && (q === p || tt.id === tense)) wrong.add(f);
          }
          const opts = shuffled([right, ...shuffled([...wrong]).slice(0, 3)]);
          if (opts.length < 3) {
            out.push({ type: 'gap', sentence: `${engine.persons[p]}: ___`, answer: engine.answer(verb, tense, p), hint: `${verb}, ${t.label}` });
            continue;
          }
          out.push({ type: 'choice', question: `${verb} · ${t.label} · ${engine.persons[p]}`, options: opts, answer: opts.indexOf(right), explain: engine.explain(verb, tense, p) });
        } else {
          out.push({
            type: 'table',
            title: `${verb} · ${t.label}`,
            rows: persons.map((q) => ({ label: engine.persons[q]!, answer: engine.answer(verb, tense, q) })),
            explain: engine.explain(verb, tense, persons[0]!),
          });
        }
      }
      return out;
    },
  };
}
