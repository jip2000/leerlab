/**
 * BEZOEKERSTELLER (GoatCounter): telt alleen welke pagina bekeken wordt.
 * Geen cookies, geen persoonsgegevens. Staat alleen aan als VITE_GOATCOUNTER is ingesteld
 * (de naam van je GoatCounter-site, bijv. "woordwerk") en de gebruiker het niet heeft uitgezet.
 */
import { useSettings } from './settings';

const CODE = import.meta.env.VITE_GOATCOUNTER as string | undefined;
export const analyticsConfigured = !!CODE;

type Gc = { count: (o: { path: string; title?: string }) => void };

/**
 * Maakt een pad veilig om te tellen: geen ids, geen zoekparameters
 * (een deellink bevat de hele woordenlijst!).
 */
export function sanitizePath(hashPath: string): string {
  const path = hashPath.replace(/^#/, '').split('?')[0] || '/';
  return path
    .split('/')
    .map((seg) => (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(seg) || /^start-/.test(seg) ? ':id' : seg))
    .join('/');
}

let loaded = false;

function load() {
  if (loaded || !CODE) return;
  loaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
  s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
  document.head.appendChild(s);
}

/** Telt een paginabezoek (als de teller aan staat). */
export function trackPage(hash: string) {
  if (!CODE || !useSettings.getState().meetellen) return;
  load();
  const path = sanitizePath(hash);
  const send = () => (window as unknown as { goatcounter?: Gc }).goatcounter?.count({ path, title: path });
  if ((window as unknown as { goatcounter?: Gc }).goatcounter?.count) send();
  else setTimeout(send, 1500); // script nog aan het laden
}
