import type { LanguageCode } from '@/data/languages';
import { deEngine } from './de';
import { enEngine } from './en';
import { esEngine } from './es';
import { frEngine } from './fr';
import { itEngine } from './it';
import { laEngine } from './la';
import { ptEngine } from './pt';
import type { VerbEngine } from './types';
import { daEngine, fyEngine, nlEngine, noEngine, svEngine } from './extra-noord';
import { csEngine, elEngine, fiEngine, plEngine, ruEngine, trEngine } from './extra-oost';
import { grcEngine } from './grc';

/** Talen met een werkwoordtrainer. Een nieuwe taal = een nieuwe motor hier toevoegen. */
export const verbEngines: Partial<Record<LanguageCode, VerbEngine>> = {
  fr: frEngine, de: deEngine, en: enEngine, es: esEngine, it: itEngine, pt: ptEngine, la: laEngine,
  // Kleinere tabellen met de belangrijkste werkwoorden:
  nl: nlEngine, grc: grcEngine, sv: svEngine, da: daEngine, no: noEngine, pl: plEngine, cs: csEngine,
  fi: fiEngine, el: elEngine, ru: ruEngine, tr: trEngine, fy: fyEngine,
};
export const verbLanguages = Object.keys(verbEngines) as LanguageCode[];
