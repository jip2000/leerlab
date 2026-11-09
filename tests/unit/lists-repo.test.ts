import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { db } from '@/db/db';
import {
  createFolder, createList, deleteFolder, deleteList, duplicateList, getWords, mergeInto, restoreList, reverseList, saveList,
} from '@/features/lists/repo';

const base = { title: 'Unité 1', langLeft: 'fr', langRight: 'nl', tags: [] } as const;

describe('lijsten', () => {
  it('maakt een lijst en slaat lege rijen over', async () => {
    const id = await createList({ ...base, tags: [] }, [
      { left: ' la maison ', right: 'het huis', article: '  ' },
      { left: '', right: '' },
      { left: 'le chien', right: 'de hond' },
    ]);
    const words = await getWords(id);
    expect(words.map((w) => w.left)).toEqual(['la maison', 'le chien']);
    expect(words[0]).not.toHaveProperty('article');
  });

  it('bewaart woord-ids bij opslaan zodat voortgang blijft', async () => {
    const id = await createList({ ...base, tags: [] }, [{ left: 'un', right: 'een' }, { left: 'deux', right: 'twee' }]);
    const [w1, w2] = await getWords(id);
    await db.reviews.bulkAdd([
      { id: `${w1!.id}:lr`, wordId: w1!.id, listId: id, direction: 'lr', box: 2, interval: 3, ease: 2.5, dueAt: 0, correctCount: 2, wrongCount: 0 },
      { id: `${w2!.id}:lr`, wordId: w2!.id, listId: id, direction: 'lr', box: 1, interval: 1, ease: 2.5, dueAt: 0, correctCount: 1, wrongCount: 0 },
    ]);
    await saveList(id, { title: 'Nieuw' }, [{ ...w1!, right: 'één' }, { left: 'trois', right: 'drie' }]);
    const words = await getWords(id);
    expect(words[0]!.id).toBe(w1!.id);
    expect(words.map((w) => w.right)).toEqual(['één', 'drie']);
    expect(await db.reviews.where('listId').equals(id).count()).toBe(1); // w2 is weg, dus ook zijn voortgang
    expect((await db.lists.get(id))!.title).toBe('Nieuw');
  });

  it('dupliceert, draait om en voegt samen', async () => {
    const a = await createList({ ...base, tags: [] }, [{ left: 'oui', right: 'ja' }]);
    const b = await duplicateList(a);
    expect((await db.lists.get(b))!.title).toBe('Unité 1 (kopie)');

    await reverseList(b);
    const rev = await db.lists.get(b);
    expect([rev!.langLeft, rev!.langRight]).toEqual(['nl', 'fr']);
    expect((await getWords(b))[0]).toMatchObject({ left: 'ja', right: 'oui' });

    const c = await createList({ ...base, tags: [] }, [{ left: 'oui', right: 'ja' }, { left: 'non', right: 'nee' }]);
    expect(await mergeInto(a, [c])).toBe(1); // "oui" zat er al in
    expect((await getWords(a)).map((w) => w.left)).toEqual(['oui', 'non']);
  });

  it('verwijdert en zet terug met ongedaan maken', async () => {
    const id = await createList({ ...base, tags: [] }, [{ left: 'au revoir', right: 'tot ziens' }]);
    const snapshot = await deleteList(id);
    expect(await db.lists.get(id)).toBeUndefined();
    await restoreList(snapshot!);
    expect((await getWords(id))[0]!.left).toBe('au revoir');
  });

  it('laat lijsten bestaan als hun map verwijderd wordt', async () => {
    const f = await createFolder({ name: 'Frans', color: '#2F6FDB', icon: 'languages' });
    const id = await createList({ ...base, tags: [], folderId: f }, [{ left: 'a', right: 'b' }]);
    await deleteFolder(f);
    expect((await db.lists.get(id))!.folderId).toBeUndefined();
  });
});
