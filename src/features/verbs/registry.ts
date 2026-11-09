import type { LanguageCode } from '@/data/languages';
import { deEngine } from './de';
import { enEngine } from './en';
import { esEngine } from './es';
import { frEngine } from './fr';
import type { VerbEngine } from './types';

/** Talen met een werkwoordtrainer. Een nieuwe taal = een nieuwe motor hier toevoegen. */
export const verbEngines: Partial<Record<LanguageCode, VerbEngine>> = { fr: frEngine, de: deEngine, en: enEngine, es: esEngine };
export const verbLanguages = Object.keys(verbEngines) as LanguageCode[];
