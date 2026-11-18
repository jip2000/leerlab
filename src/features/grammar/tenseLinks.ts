/**
 * Welk grammatica-onderwerp is "de uitleg" van een werkwoordstijd?
 * Per tijd het eerste onderwerp dat over die tijd gaat. Onderwerpen die óók werkwoorden
 * gebruiken maar over iets anders gaan (scheidbare of modale werkwoorden, klinkerwisseling)
 * zijn dan geen uitleg-onderwerp en blijven gewoon in het leerpad staan.
 */
import type { LanguageCode } from '@/data/languages';
import { grammar } from '@/data/grammar';
import { verbEngines } from '@/features/verbs/registry';

export function tenseExplanations(lang: LanguageCode): Map<string, string> {
  const m = new Map<string, string>();
  const engine = verbEngines[lang];
  if (!engine) return m;
  const topics = grammar[lang] ?? [];
  for (const t of engine.tenses) {
    const topic = topics.find((x) => x.tenses?.includes(t.id));
    if (topic) m.set(t.id, topic.id);
  }
  return m;
}

/** Onderwerpen die als uitleg bij een tijd horen (die staan al bij de tijden, niet nog eens in het leerpad). */
export const explanationTopicIds = (lang: LanguageCode) => new Set(tenseExplanations(lang).values());
