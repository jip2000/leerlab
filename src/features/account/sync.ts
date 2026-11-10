/**
 * SYNCHRONISEREN: je gegevens als back-up in je account, zodat je op een ander apparaat
 * verder kunt. Foto's van je boek gaan niet mee (die zijn te groot); woordplaatjes ook niet.
 *
 * - Na inloggen: is je apparaat leeg → gegevens ophalen. Is de wolk leeg → opsturen.
 *   Staat er op allebei iets → de gebruiker kiest.
 * - Daarna: elke minuut (en bij het wegklikken van de app) opsturen als er iets veranderd is.
 */
import { db } from '@/db/db';
import { exportAll, importAll, type Backup } from '@/lib/backup';
import { supabase } from '@/lib/supabase';

export interface CloudApi {
  load(userId: string): Promise<{ data: Backup; updated_at: string } | null>;
  save(userId: string, data: Backup): Promise<void>;
}

export const supabaseCloud: CloudApi = {
  async load(userId) {
    const { data, error } = await supabase!.from('backups').select('data, updated_at').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data as { data: Backup; updated_at: string } | null;
  },
  async save(userId, data) {
    const { error } = await supabase!.from('backups').upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
};

/** Gegevens zonder foto's en zonder tijdstip, om te vergelijken en op te sturen. */
export async function snapshot(): Promise<Backup> {
  const b = await exportAll();
  // De sync-gegevens zelf horen er niet in (anders verandert de vingerafdruk door het synchroniseren).
  const meta = (b.tables.meta as { key: string }[] | undefined)?.filter((m) => !m.key.startsWith('sync')) ?? [];
  return { ...b, tables: { ...b.tables, meta }, files: [], exportedAt: '' };
}

/** Eenvoudige vingerafdruk om te zien of er iets veranderd is. */
export function fingerprint(b: Backup): string {
  const s = JSON.stringify(b.tables) + JSON.stringify(b.local);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `${s.length}:${h}`;
}

const hasData = (b: Backup) => (b.tables.lists?.length ?? 0) > 0 || (b.tables.days?.length ?? 0) > 0;

export type StartResult = 'opgehaald' | 'opgestuurd' | 'gelijk' | 'kiezen';

/** Bij inloggen: bepalen wat er moet gebeuren. */
export async function syncOnLogin(userId: string, cloud: CloudApi = supabaseCloud): Promise<{ result: StartResult; cloudData?: Backup }> {
  const local = await snapshot();
  const remote = await cloud.load(userId);
  if (!remote || !hasData(remote.data)) {
    await cloud.save(userId, local);
    await rememberPushed(local);
    return { result: 'opgestuurd' };
  }
  if (!hasData(local)) {
    await importAll({ ...remote.data, files: [] }, { keepFiles: true });
    await rememberPushed(remote.data);
    return { result: 'opgehaald' };
  }
  if (fingerprint(local) === fingerprint(remote.data)) {
    await rememberPushed(local);
    return { result: 'gelijk' };
  }
  return { result: 'kiezen', cloudData: remote.data };
}

async function rememberPushed(b: Backup) {
  await db.meta.put({ key: 'syncFingerprint', value: fingerprint(b) });
  await db.meta.put({ key: 'syncedAt', value: Date.now() });
}

/** Opsturen als er iets veranderd is sinds de vorige keer. Geeft true als er iets verstuurd is. */
export async function pushIfChanged(userId: string, cloud: CloudApi = supabaseCloud): Promise<boolean> {
  const local = await snapshot();
  const prev = (await db.meta.get('syncFingerprint'))?.value;
  if (prev === fingerprint(local)) return false;
  await cloud.save(userId, local);
  await rememberPushed(local);
  return true;
}

/** Keuze bij een conflict. */
export async function useCloudVersion(data: Backup) {
  await importAll({ ...data, files: [] }, { keepFiles: true });
  await rememberPushed(data);
}
export async function useDeviceVersion(userId: string, cloud: CloudApi = supabaseCloud) {
  const local = await snapshot();
  await cloud.save(userId, local);
  await rememberPushed(local);
}
