import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { WoordwerkDB, newId } from '@/db/db';

describe('database', () => {
  it('slaat een lijst met woorden op en leest ze terug', async () => {
    const db = new WoordwerkDB('test-' + newId());
    const listId = newId();
    await db.lists.add({
      id: listId, title: 'Unité 1', langLeft: 'nl', langRight: 'fr',
      tags: ['toets week 12'], createdAt: 1, updatedAt: 1, photoIds: [],
    });
    await db.words.bulkAdd([
      { id: newId(), listId, left: 'het huis', right: 'la maison', position: 1 },
      { id: newId(), listId, left: 'de school', right: "l'école", position: 0 },
    ]);
    const words = await db.words.where('[listId+position]').between([listId, 0], [listId, Infinity]).toArray();
    expect(words.map((w) => w.right)).toEqual(["l'école", 'la maison']);
    expect(await db.lists.where('tags').equals('toets week 12').count()).toBe(1);
    db.close();
  });
});
