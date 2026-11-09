/**
 * Gemeenschappelijke vorm van een vervoegingsmotor per taal.
 * Elke taal (fr, de, en, es) heeft een eigen bestand met regels + onregelmatige werkwoorden.
 */
import type { LanguageCode } from '@/data/languages';

export interface Tense {
  id: string;
  label: string;
  /** Welke personen bestaan in deze tijd (bijv. de gebiedende wijs). Standaard alle 6. */
  persons?: number[];
}

export interface VerbInfo {
  inf: string;
  nl: string;
  /** Bijv. 'onregelmatig', 'regelmatig-er', 'top'. */
  tags: string[];
}

export interface Preset {
  id: string;
  label: string;
  filter: (v: VerbInfo) => boolean;
}

export interface VerbEngine {
  lang: LanguageCode;
  /** Persoonslabels zoals ze in de oefening staan, bijv. "je", "tu", "il/elle". */
  persons: string[];
  tenses: Tense[];
  verbs: VerbInfo[];
  presets: Preset[];
  /**
   * De 6 vormen om te tónen, inclusief voornaamwoord (bijv. "je suis allé(e)").
   * '' als een vorm niet bestaat.
   */
  conjugate(inf: string, tense: string): string[];
  /**
   * Alles wat als goed telt voor deze persoon, gescheiden met " / "
   * (met en zonder voornaamwoord, varianten zoals "paie / paye").
   */
  answer(inf: string, tense: string, person: number): string;
  /** Alleen het werkwoorddeel, zonder voornaamwoord (voor het gat in een zin). */
  bare(inf: string, tense: string, person: number): string;
  /** Korte uitleg waarom een vorm zo is (voor de feedback). */
  explain(inf: string, tense: string, person: number): string | undefined;
  /** Een zin met een gat, voor oefenvorm C. */
  sentence(inf: string, tense: string, person: number): { before: string; after: string } | undefined;
}

export const ALL_PERSONS = [0, 1, 2, 3, 4, 5];
