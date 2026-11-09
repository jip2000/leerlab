import type { LanguageCode } from '@/data/languages';
import type { TopicContent } from '@/features/grammar/types';
import { deGrammar } from './de';
import { enGrammar } from './en';
import { esGrammar } from './es';
import { frGrammar } from './fr';
import { itGrammar } from './it';
import { laGrammar } from './la';
import { nlGrammar } from './nl';
import { ptGrammar } from './pt';
import { basisGrammar } from './basis';

/** Alle grammatica-inhoud per taal. Een taal toevoegen = een bestand + een regel hier. */
export const grammar: Partial<Record<LanguageCode, TopicContent[]>> = {
  fr: frGrammar,
  de: deGrammar,
  en: enGrammar,
  es: esGrammar,
  nl: nlGrammar,
  la: laGrammar,
  it: itGrammar,
  pt: ptGrammar,
  ...basisGrammar,
};

export function getTopic(lang: LanguageCode, id: string): TopicContent | undefined {
  return grammar[lang]?.find((t) => t.id === id);
}

export function exercisesOf(t: TopicContent) {
  return typeof t.exercises === 'function' ? t.exercises() : t.exercises;
}
