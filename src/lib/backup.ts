/**
 * BACK-UP: alles in één JSON-bestand, en weer terugzetten.
 * Foto's worden als tekst (base64) in het bestand gezet.
 */
import { db } from '@/db/db';

export const BACKUP_VERSION = 1;
const TABLES = ['folders', 'lists', 'words', 'reviews', 'sessions', 'grammarProgress', 'verbProgress', 'videos', 'tests', 'badges', 'days', 'meta'] as const;
const LOCAL_KEYS = ['woordwerk-instellingen', 'woordwerk-werkwoorden'];

export interface Backup {
  app: 'woordwerk';
  version: number;
  exportedAt: string;
  tables: Record<string, unknown[]>;
  files: { id: string; name: string; createdAt: number; type: string; data: string }[];
  local: Record<string, string>;
}

async function blobToBase64(b: Blob): Promise<string> {
  const bytes = new Uint8Array(await b.arrayBuffer());
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export async function exportAll(): Promise<Backup> {
  const tables: Record<string, unknown[]> = {};
  for (const t of TABLES) tables[t] = await db.table(t).toArray();
  const files = await Promise.all(
    (await db.files.toArray()).map(async (f) => ({ id: f.id, name: f.name, createdAt: f.createdAt, type: f.blob.type, data: await blobToBase64(f.blob) })),
  );
  const local: Record<string, string> = {};
  for (const k of LOCAL_KEYS) {
    try {
      const v = localStorage.getItem(k);
      if (v !== null) local[k] = v;
    } catch {
      /* geen localStorage */
    }
  }
  return { app: 'woordwerk', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables, files, local };
}

export function validateBackup(data: unknown): Backup {
  const b = data as Backup;
  if (!b || b.app !== 'woordwerk' || typeof b.version !== 'number' || typeof b.tables !== 'object') {
    throw new Error('Dit is geen back-upbestand van Woordwerk.');
  }
  if (b.version > BACKUP_VERSION) throw new Error('Deze back-up is gemaakt met een nieuwere versie van Woordwerk.');
  return b;
}

/** Zet een back-up terug. Alles wat er nu staat, wordt vervangen. */
export async function importAll(data: unknown): Promise<{ lists: number; words: number }> {
  const b = validateBackup(data);
  await db.transaction('rw', [...TABLES.map((t) => db.table(t)), db.files], async () => {
    for (const t of TABLES) {
      await db.table(t).clear();
      const rows = b.tables[t];
      if (Array.isArray(rows) && rows.length) await db.table(t).bulkAdd(rows);
    }
    await db.files.clear();
    for (const f of b.files ?? []) {
      const bin = atob(f.data);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      await db.files.add({ id: f.id, name: f.name, createdAt: f.createdAt, blob: new Blob([bytes], { type: f.type }) });
    }
  });
  for (const [k, v] of Object.entries(b.local ?? {})) {
    try {
      if (LOCAL_KEYS.includes(k)) localStorage.setItem(k, v);
    } catch {
      /* geen localStorage */
    }
  }
  return { lists: b.tables.lists?.length ?? 0, words: b.tables.words?.length ?? 0 };
}
