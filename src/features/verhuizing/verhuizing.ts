/**
 * VERHUIZING naar woordwerk.online
 * Het oude adres (jip2000.github.io/leerlab) bestaat nog. Wie daar niets bewaard heeft,
 * sturen we meteen door. Wie daar wél lijsten heeft, krijgt eerst de kans ze mee te nemen:
 * de gegevens staan in de browser bij het oude adres en verhuizen niet vanzelf.
 */
import { db } from '@/db/db';

export const NIEUW_ADRES = 'https://woordwerk.online/';

export const opOudAdres = (host = location.hostname) => host.endsWith('.github.io');

/** Staat er op dit adres iets dat de moeite waard is om mee te nemen? */
export async function heeftEigenGegevens(): Promise<boolean> {
  try {
    return (await db.lists.count()) > 0 || (await db.sessions.count()) > 0;
  } catch {
    return false;
  }
}

/** Zelfde pagina op het nieuwe adres (#/lijsten blijft #/lijsten). */
export const nieuwAdresVoor = (hash = location.hash) => NIEUW_ADRES + (hash || '');
