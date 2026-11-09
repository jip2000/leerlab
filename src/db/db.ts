import Dexie, { type EntityTable } from 'dexie';
import type {
  Badge, DayActivity, Folder, MetaEntry, GrammarProgress, PlannedTest, PracticeSession, ReviewState,
  StoredFile, VerbProgress, Video, WordItem, WordList,
} from './types';

/**
 * De lokale database. Instellingen staan niet hier maar in localStorage (zie lib/settings.ts).
 * Bij een wijziging van de structuur: voeg een nieuwe `this.version(n)` toe, verander de oude niet.
 */
export class WoordwerkDB extends Dexie {
  folders!: EntityTable<Folder, 'id'>;
  lists!: EntityTable<WordList, 'id'>;
  words!: EntityTable<WordItem, 'id'>;
  reviews!: EntityTable<ReviewState, 'id'>;
  sessions!: EntityTable<PracticeSession, 'id'>;
  grammarProgress!: EntityTable<GrammarProgress, 'id'>;
  verbProgress!: EntityTable<VerbProgress, 'id'>;
  videos!: EntityTable<Video, 'id'>;
  tests!: EntityTable<PlannedTest, 'id'>;
  badges!: EntityTable<Badge, 'id'>;
  files!: EntityTable<StoredFile, 'id'>;
  days!: EntityTable<DayActivity, 'id'>;
  meta!: EntityTable<MetaEntry, 'key'>;

  constructor(name = 'woordwerk') {
    super(name);
    this.version(1).stores({
      folders: 'id, name, parentId',
      lists: 'id, title, folderId, updatedAt, *tags',
      words: 'id, listId, [listId+position]',
      reviews: 'id, wordId, listId, dueAt',
      sessions: 'id, type, startedAt',
      grammarProgress: 'id, lang',
      verbProgress: 'id, lang, verb',
      videos: 'id, subject',
      tests: 'id, date',
      badges: 'id',
      files: 'id',
    });
    // Versie 2 (fase 3): dagactiviteit voor streak/XP en losse waarden.
    this.version(2).stores({
      days: 'id',
      meta: 'key',
      sessions: 'id, type, startedAt, endedAt',
    });
  }
}

export const db = new WoordwerkDB();

export const newId = (): string => crypto.randomUUID();
