/**
 * Van herkende woorden (met hun plek op de foto) naar woordparen.
 *
 * 1. Woorden die op dezelfde hoogte staan, vormen samen een regel.
 * 2. Staat er een scheidingsteken in de regel (=, -, :, …), dan splitsen we daarop.
 * 3. Anders zoeken we de "kolomgrens": de plek waar in de meeste regels een groot gat zit.
 *    Alles links daarvan is de linkerkolom, alles rechts de rechterkolom.
 * 4. Paginanummers, kopjes en losse tekens gaan eruit.
 */
import { parsePasted } from '@/lib/parse';

export interface OcrWord {
  text: string;
  conf: number; // 0..100
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface FoundPair {
  left: string;
  right: string;
  /** Lage herkenningszekerheid: geel markeren. */
  unsure: boolean;
}

export interface PairResult {
  pairs: FoundPair[];
  skipped: string[];
}

const UNSURE_BELOW = 70;

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

/**
 * Groepeert woorden in regels. Een woord hoort bij een regel als het in hoogte
 * flink overlapt met die regel (werkt ook bij een iets scheve foto).
 */
export function groupRows(words: OcrWord[]): OcrWord[][] {
  const clean = words.filter((w) => w.text.trim());
  if (clean.length === 0) return [];
  const sorted = [...clean].sort((a, b) => (a.y0 + a.y1) / 2 - (b.y0 + b.y1) / 2);
  const rows: { y0: number; y1: number; words: OcrWord[] }[] = [];
  for (const w of sorted) {
    const h = w.y1 - w.y0;
    let best: (typeof rows)[number] | undefined;
    let bestOverlap = 0;
    for (const r of rows) {
      const overlap = Math.min(r.y1, w.y1) - Math.max(r.y0, w.y0);
      const ratio = overlap / Math.min(h, r.y1 - r.y0);
      if (ratio > 0.45 && ratio > bestOverlap) {
        best = r;
        bestOverlap = ratio;
      }
    }
    if (best) {
      best.words.push(w);
      // Regelhoogte = mediaan van de woorden, zodat één hoge letter de regel niet oprekt.
      best.y0 = median(best.words.map((x) => x.y0));
      best.y1 = median(best.words.map((x) => x.y1));
    } else rows.push({ y0: w.y0, y1: w.y1, words: [w] });
  }
  return rows.sort((a, b) => a.y0 + a.y1 - (b.y0 + b.y1)).map((r) => r.words.sort((a, b) => a.x0 - b.x0));
}

/**
 * Zoekt de x-positie van de kolomgrens: de breedste verticale "witte strook" waar
 * (bijna) geen enkele regel tekst heeft. Een kopje dat over beide kolommen loopt, mag.
 */
export function findColumnBoundary(rows: OcrWord[][]): number | null {
  const words = rows.flat();
  if (rows.length < 2 || words.length === 0) return null;
  const h = median(words.map((w) => w.y1 - w.y0)) || 10;
  const minX = Math.min(...words.map((w) => w.x0));
  const maxX = Math.max(...words.map((w) => w.x1));
  const bin = 2;
  const n = Math.ceil((maxX - minX) / bin) + 1;
  const cover = new Array<number>(n).fill(0);
  for (const r of rows) {
    const seen = new Uint8Array(n);
    for (const w of r) for (let i = Math.floor((w.x0 - minX) / bin); i <= Math.floor((w.x1 - minX) / bin); i++) seen[i] = 1;
    for (let i = 0; i < n; i++) cover[i]! += seen[i]!;
  }
  const allowed = Math.max(1, Math.floor(rows.length * 0.15));
  let best: [number, number] | null = null;
  let runStart = -1;
  for (let i = 0; i <= n; i++) {
    const empty = i < n && cover[i]! <= allowed;
    if (empty && runStart < 0) runStart = i;
    if (!empty && runStart >= 0) {
      if (runStart > 0 && i < n && (!best || i - runStart > best[1] - best[0])) best = [runStart, i];
      runStart = -1;
    }
  }
  if (!best || (best[1] - best[0]) * bin < h * 1.5) return null;
  const x = minX + ((best[0] + best[1]) / 2) * bin;
  // Aan beide kanten moet in genoeg regels tekst staan.
  const both = rows.filter((r) => r.some((w) => w.x1 < x) || r.some((w) => w.x0 > x));
  const left = rows.filter((r) => r.some((w) => (w.x0 + w.x1) / 2 < x)).length;
  const right = rows.filter((r) => r.some((w) => (w.x0 + w.x1) / 2 >= x)).length;
  return both.length && left >= rows.length * 0.3 && right >= rows.length * 0.3 ? x : null;
}

const isJunk = (s: string) => {
  const t = s.trim();
  return t.length === 0 || /^[\d\s.,:;|/\\_—–-]+$/.test(t) || /^[^\p{L}]{1,2}$/u.test(t);
};

const join = (ws: OcrWord[]) => ws.map((w) => w.text).join(' ').replace(/\s+([,.;:!?)])/g, '$1').trim();

export function wordsToPairs(words: OcrWord[]): PairResult {
  const rows = groupRows(words);
  const boundary = findColumnBoundary(rows);
  const pairs: FoundPair[] = [];
  const skipped: string[] = [];

  const h = median(rows.flat().map((w) => w.y1 - w.y0)) || 10;
  const side = (r: OcrWord[]) =>
    boundary === null ? 'beide' : r.every((w) => (w.x0 + w.x1) / 2 < boundary) ? 'links' : r.every((w) => (w.x0 + w.x1) / 2 >= boundary) ? 'rechts' : 'beide';
  const yc = (r: OcrWord[]) => median(r.map((w) => (w.y0 + w.y1) / 2));
  const merged: OcrWord[][] = [];
  for (let i = 0; i < rows.length; i++) {
    const a = rows[i]!;
    const b = rows[i + 1];
    const prev = merged[merged.length - 1];
    if (b && side(a) !== side(b) && side(a) !== 'beide' && side(b) !== 'beide' && Math.abs(yc(a) - yc(b)) < h * 1.2) {
      merged.push([...a, ...b].sort((x, y) => x.x0 - y.x0));
      i++;
    } else if (prev && side(a) !== 'beide' && Math.abs(yc(a) - yc(prev)) < h * 0.8) {
      // Los woord dat net iets hoger of lager staat dan de vorige regel: hoort daar nog bij.
      merged[merged.length - 1] = [...prev, ...a].sort((x, y) => x.x0 - y.x0);
    } else merged.push(a);
  }

  for (const r of merged) {
    const text = join(r);
    if (isJunk(text)) continue;
    const unsure = r.some((w) => w.conf < UNSURE_BELOW);

    // Eerst: een scheidingsteken in de regel?
    const bySep = parsePasted(text).pairs[0];
    if (bySep) {
      pairs.push({ ...bySep, unsure });
      continue;
    }
    // Dan: twee kolommen.
    if (boundary !== null) {
      const left = join(r.filter((w) => (w.x0 + w.x1) / 2 < boundary));
      const right = join(r.filter((w) => (w.x0 + w.x1) / 2 >= boundary));
      if (left && right && !isJunk(left) && !isJunk(right)) {
        pairs.push({ left, right, unsure });
        continue;
      }
    }
    skipped.push(text);
  }
  return { pairs, skipped };
}
