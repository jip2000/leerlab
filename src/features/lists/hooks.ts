import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { getWords } from './repo';

/** Deze hooks verversen vanzelf als er iets in de database verandert. */
export const useLists = () => useLiveQuery(() => db.lists.toArray(), []);
export const useFolders = () => useLiveQuery(() => db.folders.orderBy('name').toArray(), []);
export const useList = (id: string | undefined) => useLiveQuery(() => (id ? db.lists.get(id) : undefined), [id]);
export const useWords = (id: string | undefined) => useLiveQuery(() => (id ? getWords(id) : []), [id]);

/** Aantal woorden per lijst. */
export const useWordCounts = () =>
  useLiveQuery(async () => {
    const counts = new Map<string, number>();
    await db.words.each((w) => counts.set(w.listId, (counts.get(w.listId) ?? 0) + 1));
    return counts;
  }, []);
