/**
 * Datamodel van Woordwerk (zie docs/opdracht.md, hoofdstuk 13.5).
 * Alles wordt lokaal in de browser opgeslagen (IndexedDB).
 * Ids zijn strings (UUID's), zodat we later makkelijk kunnen synchroniseren met een server.
 */
import type { LanguageCode } from '@/data/languages';

export type Id = string;

export interface Folder {
  id: Id;
  name: string;
  color: string;
  icon: string;
  parentId?: Id; // voor hoofdstukken binnen een vak
  createdAt: number;
}

export interface WordList {
  id: Id;
  title: string;
  langLeft: LanguageCode;
  langRight: LanguageCode;
  folderId?: Id;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  photoIds: Id[];
}

export interface WordItem {
  id: Id;
  listId: Id;
  left: string;
  right: string;
  article?: string;
  extraForms?: string;
  example?: string;
  note?: string;
  imageId?: Id;
  position: number;
}

export type Direction = 'lr' | 'rl';

export interface ReviewState {
  id: string; // `${wordId}:${direction}`
  wordId: Id;
  listId: Id;
  direction: Direction;
  box: number; // Leitner-bakje of SM-2 herhaling
  interval: number; // dagen
  ease: number;
  dueAt: number;
  correctCount: number;
  wrongCount: number;
}

export interface SessionAnswer {
  wordId: Id;
  direction: Direction;
  given: string;
  correct: boolean;
  at: number;
}

export interface PracticeSession {
  id: Id;
  type: string; // 'flashcards' | 'typen' | 'meerkeuze' | 'toets' | ...
  listIds: Id[];
  startedAt: number;
  endedAt?: number;
  score?: number;
  answers: SessionAnswer[];
  /** Opgeslagen tussenstand, zodat je later verder kunt. */
  state?: unknown;
}

export interface GrammarProgress {
  id: string; // `${lang}:${topicId}`
  lang: LanguageCode;
  topicId: string;
  score: number;
  lastAt: number;
}

export interface VerbProgress {
  id: string; // `${lang}:${verb}:${tense}:${person}`
  lang: LanguageCode;
  verb: string;
  tense: string;
  person: string;
  correctCount: number;
  wrongCount: number;
}

export interface VideoNote {
  seconds: number;
  text: string;
}

export interface Video {
  id: Id;
  url: string;
  title: string;
  subject: string;
  chapter?: string;
  notes: VideoNote[];
  watched: boolean;
  linkedTo: { kind: 'list' | 'grammar'; id: string }[];
}

export interface PlannedTest {
  id: Id;
  subject: string;
  date: string; // YYYY-MM-DD
  listIds: Id[];
  topicIds: string[];
}

export interface Badge {
  id: string;
  earnedAt: number;
}

export interface StoredFile {
  id: Id;
  blob: Blob;
  name: string;
  createdAt: number;
}
