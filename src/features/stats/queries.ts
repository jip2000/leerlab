import { db } from '@/db/db';
import { getLanguage, type LanguageCode } from '@/data/languages';

/** Woorden die je het vaakst fout had. */
export async function hardestWords(n = 10) {
  const reviews = (await db.reviews.toArray()).filter((r) => r.wrongCount > 0);
  const byWord = new Map<string, number>();
  for (const r of reviews) byWord.set(r.wordId, (byWord.get(r.wordId) ?? 0) + r.wrongCount);
  const top = [...byWord.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  const words = await db.words.bulkGet(top.map(([id]) => id));
  const lists = new Map((await db.lists.toArray()).map((l) => [l.id, l]));
  return top.flatMap(([, wrong], i) => {
    const w = words[i];
    return w ? [{ id: w.id, left: w.left, right: w.right, article: w.article, list: lists.get(w.listId)?.title ?? '', wrong }] : [];
  });
}

/** Per taal: hoeveel procent van je antwoorden goed was. */
export async function bestSubjects() {
  const lists = new Map((await db.lists.toArray()).map((l) => [l.id, l]));
  const per = new Map<LanguageCode, { ok: number; total: number }>();
  await db.reviews.each((r) => {
    const l = lists.get(r.listId);
    if (!l) return;
    const lang = l.langLeft === 'nl' ? l.langRight : l.langLeft;
    const e = per.get(lang) ?? { ok: 0, total: 0 };
    per.set(lang, { ok: e.ok + r.correctCount, total: e.total + r.correctCount + r.wrongCount });
  });
  return [...per.entries()]
    .filter(([, v]) => v.total > 0)
    .map(([lang, v]) => ({ lang, name: getLanguage(lang).name, pct: Math.round((v.ok / v.total) * 100), total: v.total }))
    .sort((a, b) => b.pct - a.pct);
}

export async function knownWords() {
  const best = new Map<string, number>();
  await db.reviews.each((r) => best.set(r.wordId, Math.max(best.get(r.wordId) ?? 0, r.box)));
  return [...best.values()].filter((b) => b >= 4).length;
}
