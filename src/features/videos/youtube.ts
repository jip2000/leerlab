/** YouTube-links herkennen en tijden omzetten. */

/** Haalt het video-id uit allerlei YouTube-links (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string): string | null {
  const u = url.trim();
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = p.exec(u);
    if (m) return m[1]!;
  }
  return /^[\w-]{11}$/.test(u) ? u : null;
}

/** Starttijd uit de link (t=90, t=1m30s), in seconden. */
export function startTime(url: string): number {
  const m = /[?&#](?:t|start)=(\d+h)?(\d+m)?(\d+s?)?/.exec(url);
  if (!m) return 0;
  const n = (s: string | undefined) => (s ? parseInt(s, 10) : 0);
  return n(m[1]) * 3600 + n(m[2]) * 60 + n(m[3]);
}

export const embedUrl = (id: string, start = 0) =>
  `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1${start ? `&start=${start}` : ''}`;

/** 83 → "1:23", 3725 → "1:02:05" */
export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
}

/** "1:23" of "83" → 83 (of null als het geen tijd is). */
export function parseTime(text: string): number | null {
  const t = text.trim();
  if (/^\d+$/.test(t)) return Number(t);
  const m = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return null;
  return Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}
