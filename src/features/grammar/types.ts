/**
 * Grammatica-inhoud: uitleg (blokken) + oefeningen.
 * Inhoud staat in src/data/grammar/<taal>.ts. Tekst mag **vet** bevatten.
 */
import type { LanguageCode } from '@/data/languages';

export type Block =
  | { type: 'text'; text: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'examples'; items: [string, string][] } // [vreemde taal, vertaling]
  | { type: 'tip'; text: string };

export type Exercise =
  /** Gat in een zin: "Je ___ au cinéma." */
  | { type: 'gap'; sentence: string; answer: string; hint?: string; explain?: string }
  /** Kiezen uit opties (answer = index van de goede). */
  | { type: 'choice'; question: string; options: string[]; answer: number; explain?: string }
  /** Tabel invullen. */
  | { type: 'table'; title: string; rows: { label: string; answer: string }[]; explain?: string }
  /** Zin vertalen (vanuit het Nederlands). */
  | { type: 'translate'; nl: string; answer: string; explain?: string }
  /** Fout zoeken en verbeteren: typ de goede zin. */
  | { type: 'fix'; sentence: string; answer: string; explain?: string }
  /** Woorden in de goede volgorde zetten. */
  | { type: 'order'; words: string[]; nl?: string; explain?: string };

export interface TopicContent {
  id: string;
  blocks: Block[];
  /** Vaste oefeningen, of een functie die ze maakt (bijv. met de werkwoordmotor). */
  exercises: Exercise[] | (() => Exercise[]);
}

export type GrammarContent = Partial<Record<LanguageCode, TopicContent[]>>;
