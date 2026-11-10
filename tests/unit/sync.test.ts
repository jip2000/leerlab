import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db/db';
import { createList } from '@/features/lists/repo';
import { pushIfChanged, syncOnLogin, useCloudVersion, type CloudApi } from '@/features/account/sync';
import type { Backup } from '@/lib/backup';

function fakeCloud() {
  const store = new Map<string, { data: Backup; updated_at: string }>();
  let saves = 0;
  const api: CloudApi = {
    load: async (u) => store.get(u) ?? null,
    save: async (u, data) => {
      saves++;
      store.set(u, { data: JSON.parse(JSON.stringify(data)), updated_at: new Date().toISOString() });
    },
  };
  return { api, store, saves: () => saves };
}

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe('synchroniseren', () => {
  it('lege wolk: gegevens van dit apparaat worden opgestuurd', async () => {
    const c = fakeCloud();
    await createList({ title: 'Frans', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'oui', right: 'ja' }]);
    expect((await syncOnLogin('u1', c.api)).result).toBe('opgestuurd');
    expect(c.store.get('u1')!.data.tables.lists).toHaveLength(1);
  });

  it('leeg apparaat: gegevens uit de wolk worden opgehaald', async () => {
    const c = fakeCloud();
    await createList({ title: 'Duits', langLeft: 'de', langRight: 'nl', tags: [] }, [{ left: 'ja', right: 'ja' }]);
    await syncOnLogin('u2', c.api);
    await Promise.all(db.tables.map((t) => t.clear())); // "ander apparaat"
    expect((await syncOnLogin('u2', c.api)).result).toBe('opgehaald');
    expect((await db.lists.toArray())[0]!.title).toBe('Duits');
  });

  it('allebei iets anders: de gebruiker kiest', async () => {
    const c = fakeCloud();
    await createList({ title: 'A', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'a', right: 'a' }]);
    await syncOnLogin('u3', c.api);
    await Promise.all(db.tables.map((t) => t.clear()));
    await createList({ title: 'B', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'b', right: 'b' }]);
    const r = await syncOnLogin('u3', c.api);
    expect(r.result).toBe('kiezen');
    await useCloudVersion(r.cloudData!);
    expect((await db.lists.toArray()).map((l) => l.title)).toEqual(['A']);
  });

  it('stuurt alleen op als er iets veranderd is', async () => {
    const c = fakeCloud();
    await createList({ title: 'X', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'x', right: 'x' }]);
    await syncOnLogin('u4', c.api);
    const before = c.saves();
    expect(await pushIfChanged('u4', c.api)).toBe(false);
    await createList({ title: 'Y', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'y', right: 'y' }]);
    expect(await pushIfChanged('u4', c.api)).toBe(true);
    expect(c.saves()).toBe(before + 1);
  });

  it('foto’s blijven op het apparaat en gaan niet mee', async () => {
    const c = fakeCloud();
    await db.files.add({ id: 'f', name: 'x.jpg', createdAt: 1, blob: new Blob([new Uint8Array([1])]) });
    await createList({ title: 'Z', langLeft: 'fr', langRight: 'nl', tags: [] }, [{ left: 'z', right: 'z' }]);
    await syncOnLogin('u5', c.api);
    expect(c.store.get('u5')!.data.files).toEqual([]);
  });
});
