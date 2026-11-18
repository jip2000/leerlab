/**
 * ONDERDELEN per onderwerp, bijv. bij Duitse voorzetsels: "+ Akkusativ", "+ Dativ",
 * "Wisselvoorzetsels". Standaard staat alles aan; wat uit staat, verdwijnt uit de uitleg
 * en de oefeningen. Een onderwerp krijgt onderdelen door `parts` in te vullen en blokken
 * en oefeningen een `part` te geven.
 */
import type { Block, Exercise, TopicContent } from './types';

export const partKey = (lang: string, topicId: string) => `${lang}:${topicId}`;

export function selectedParts(topic: TopicContent, saved: string[] | undefined): Set<string> {
  const all = (topic.parts ?? []).map((p) => p.id);
  const mine = saved?.filter((id) => all.includes(id));
  return new Set(mine && mine.length > 0 ? mine : all);
}

const keep = (part: string | undefined, on: Set<string>) => !part || on.has(part);

export const filterBlocksByPart = (blocks: Block[], on: Set<string>) => blocks.filter((b) => keep(b.part, on));
export const filterExercisesByPart = (exercises: Exercise[], on: Set<string>) => exercises.filter((e) => keep(e.part, on));
