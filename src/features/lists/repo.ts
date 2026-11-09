/**
 * Alle handelingen op woordenlijsten in de database.
 * Pagina's roepen deze functies aan; ze praten zelf niet direct met Dexie.
 */
import { db, newId } from '@/db/db';
import type { Folder, ReviewState, WordItem, WordList } from '@/db/types';

export type WordInput = Omit<WordItem, 'id' | 'listId' | 'position'> & { id?: string };
export type ListInput = Omit<WordList, 'id' | 'createdAt' | 'updatedAt' | 'photoIds'> & { photoIds?: string[] };

/** Gooit lege optionele velden weg, zodat de database schoon blijft. */
function cleanWord(w: WordInput): WordInput {
  const out: WordInput = { ...w, left: w.left.trim(), right: w.right.trim() };
  for (const k of ['article', 'extraForms', 'example', 'note'] as const) {
    const v = out[k]?.trim();
    if (v) out[k] = v;
    else delete out[k];
  }
  return out;
}

export async function createList(input: ListInput, words: WordInput[]): Promise<string> {
  const id = newId();
  const now = Date.now();
  await db.transaction('rw', db.lists, db.words, async () => {
    await db.lists.add({ photoIds: [], ...input, id, createdAt: now, updatedAt: now });
    await db.words.bulkAdd(
      words
        .map(cleanWord)
        .filter((w) => w.left && w.right)
        .map((w, i) => ({ ...w, id: newId(), listId: id, position: i })),
    );
  });
  return id;
}

/**
 * Slaat een bewerkte lijst op. Woorden die hun id houden, houden ook hun voortgang;
 * verwijderde woorden verliezen hun voortgang.
 */
export async function saveList(id: string, input: Partial<ListInput>, words: WordInput[]): Promise<void> {
  await db.transaction('rw', db.lists, db.words, db.reviews, async () => {
    const existing = await db.words.where('listId').equals(id).primaryKeys();
    const rows: WordItem[] = words
      .map(cleanWord)
      .filter((w) => w.left && w.right)
      .map((w, i) => ({ ...w, id: w.id ?? newId(), listId: id, position: i }));
    const keep = new Set(rows.map((r) => r.id));
    const removed = existing.filter((k) => !keep.has(k));
    await db.words.bulkDelete(removed);
    if (removed.length) await db.reviews.where('wordId').anyOf(removed).delete();
    await db.words.bulkPut(rows);
    await db.lists.update(id, { ...input, updatedAt: Date.now() });
  });
}

export async function getWords(listId: string): Promise<WordItem[]> {
  return db.words.where('[listId+position]').between([listId, -Infinity], [listId, Infinity]).toArray();
}

export async function duplicateList(id: string): Promise<string> {
  const list = await db.lists.get(id);
  if (!list) throw new Error('Lijst niet gevonden');
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = list;
  const words = await getWords(id);
  return createList({ ...rest, title: `${list.title} (kopie)` }, words.map(({ id: _w, listId: _l, position: _p, ...w }) => w));
}

/** Wisselt links en rechts om (ook de talen). Voortgang wordt gewist, want de vragen zijn anders. */
export async function reverseList(id: string): Promise<void> {
  await db.transaction('rw', db.lists, db.words, db.reviews, async () => {
    const list = await db.lists.get(id);
    if (!list) return;
    await db.lists.update(id, { langLeft: list.langRight, langRight: list.langLeft, updatedAt: Date.now() });
    await db.words.where('listId').equals(id).modify((w) => {
      [w.left, w.right] = [w.right, w.left];
    });
    await db.reviews.where('listId').equals(id).delete();
  });
}

/** Voegt de woorden van andere lijsten toe aan het eind van deze lijst (dubbele woorden worden overgeslagen). */
export async function mergeInto(targetId: string, sourceIds: string[]): Promise<number> {
  const target = await getWords(targetId);
  const seen = new Set(target.map((w) => `${w.left}\u0000${w.right}`));
  const extra: WordInput[] = [];
  for (const sid of sourceIds) {
    for (const { id: _i, listId: _l, position: _p, ...w } of await getWords(sid)) {
      const key = `${w.left}\u0000${w.right}`;
      if (!seen.has(key)) {
        seen.add(key);
        extra.push(w);
      }
    }
  }
  await saveList(targetId, {}, [...target, ...extra]);
  return extra.length;
}

export interface DeletedList {
  list: WordList;
  words: WordItem[];
  reviews: ReviewState[];
}

/** Verwijdert een lijst en geeft alles terug wat nodig is om het ongedaan te maken. */
export async function deleteList(id: string): Promise<DeletedList | undefined> {
  return db.transaction('rw', db.lists, db.words, db.reviews, async () => {
    const list = await db.lists.get(id);
    if (!list) return undefined;
    const words = await db.words.where('listId').equals(id).toArray();
    const reviews = await db.reviews.where('listId').equals(id).toArray();
    await db.words.where('listId').equals(id).delete();
    await db.reviews.where('listId').equals(id).delete();
    await db.lists.delete(id);
    return { list, words, reviews };
  });
}

export async function restoreList(d: DeletedList): Promise<void> {
  await db.transaction('rw', db.lists, db.words, db.reviews, async () => {
    await db.lists.put(d.list);
    await db.words.bulkPut(d.words);
    await db.reviews.bulkPut(d.reviews);
  });
}

// ---------- Mappen ----------

export async function createFolder(input: Pick<Folder, 'name' | 'color' | 'icon'>): Promise<string> {
  const id = newId();
  await db.folders.add({ ...input, id, createdAt: Date.now() });
  return id;
}

export async function updateFolder(id: string, patch: Partial<Pick<Folder, 'name' | 'color' | 'icon'>>) {
  await db.folders.update(id, patch);
}

/** Verwijdert een map; de lijsten erin blijven bestaan (zonder map). */
export async function deleteFolder(id: string): Promise<void> {
  await db.transaction('rw', db.folders, db.lists, async () => {
    await db.lists.where('folderId').equals(id).modify((l) => {
      delete l.folderId;
    });
    await db.folders.delete(id);
  });
}
