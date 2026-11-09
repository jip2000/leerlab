import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { db, newId } from '@/db/db';
import { createList, getWords } from '@/features/lists/repo';
import { exportAll, importAll, validateBackup } from '@/lib/backup';

describe('back-up', () => {
  it('exporteert alles en zet het precies terug (ook foto’s)', async () => {
    const id = await createList({ title: 'Back-up test', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'la mer', right: 'de zee' }]);
    await db.days.put({ id: '2026-11-09', xp: 50, answers: 5, correct: 4, seconds: 100 });
    await db.files.add({ id: 'f1', name: 'foto.jpg', createdAt: 1, blob: new Blob([new Uint8Array([1, 2, 3, 250])], { type: 'image/jpeg' }) });
    const backup = JSON.parse(JSON.stringify(await exportAll()));

    // Alles weg en iets anders erin…
    await db.lists.clear();
    await db.words.clear();
    await db.files.clear();
    await db.lists.add({ id: newId(), title: 'Weg ermee', langLeft: 'de', langRight: 'nl', tags: [], createdAt: 0, updatedAt: 0, photoIds: [] });

    const r = await importAll(backup);
    expect(r.lists).toBeGreaterThanOrEqual(1);
    expect((await db.lists.get(id))!.title).toBe('Back-up test');
    expect((await getWords(id))[0]!.right).toBe('de zee');
    expect(await db.lists.where('title').equals('Weg ermee').count()).toBe(0);
    expect((await db.days.get('2026-11-09'))!.xp).toBe(50);
    const f = await db.files.get('f1');
    expect([...new Uint8Array(await f!.blob.arrayBuffer())]).toEqual([1, 2, 3, 250]);
  });

  it('weigert een verkeerd bestand', () => {
    expect(() => validateBackup({ hallo: 1 })).toThrow(/geen back-upbestand/);
    expect(() => validateBackup({ app: 'woordwerk', version: 99, tables: {} })).toThrow(/nieuwere versie/);
  });
});
