import type { LanguageCode } from '@/data/languages';
import type { TopicContent } from '@/features/grammar/types';
import { deGrammar } from './de';
import { enGrammar } from './en';
import { esGrammar } from './es';
import { frGrammar } from './fr';

/** Alle grammatica-inhoud per taal. Een taal toevoegen = een bestand + een regel hier. */
export const grammar: Partial<Record<LanguageCode, TopicContent[]>> = { fr: frGrammar, de: deGrammar, en: enGrammar, es: esGrammar };

export function getTopic(lang: LanguageCode, id: string): TopicContent | undefined {
  return grammar[lang]?.find((t) => t.id === id);
}

export function exercisesOf(t: TopicContent) {
  return typeof t.exercises === 'function' ? t.exercises() : t.exercises;
}
