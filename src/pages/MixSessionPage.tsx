import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HomeButton, WellDone } from '@/components/ui/WellDone';
import { getLanguage, type LanguageCode } from '@/data/languages';
import { db, newId } from '@/db/db';
import { ExerciseView } from '@/features/grammar/components/ExerciseView';
import { Rich } from '@/features/grammar/components/Rich';
import { practiceTopics, type MixItem } from '@/features/grammar/mix';
import { prepareMix } from '@/features/grammar/startMix';
import type { Exercise } from '@/features/grammar/types';
import { finishRewards, getProfile, recordAnswer, type Profile } from '@/features/progress/repo';
import { XP_FINISH } from '@/features/progress/xp';
import { useVerbStore } from '@/features/verbs/store';
import { recordVerb } from '@/features/verbs/trainer';
import { celebrate, fireworks } from '@/lib/confetti';
import { splitAlternatives } from '@/lib/check';
import { useSettings } from '@/lib/settings';
import { toast } from '@/lib/toast';

/** Wat er bij een foute oefening het goede antwoord was (voor het lijstje aan het eind). */
function solution(ex: Exercise): { vraag: string; antwoord: string } {
  switch (ex.type) {
    case 'gap':
      return { vraag: ex.sentence, antwoord: splitAlternatives(ex.answer)[0]! };
    case 'choice':
      return { vraag: ex.question, antwoord: ex.options[ex.answer]! };
    case 'table':
      return { vraag: ex.title, antwoord: ex.rows.map((r) => splitAlternatives(r.answer)[0]).join(', ') };
    case 'translate':
      return { vraag: ex.nl, antwoord: splitAlternatives(ex.answer)[0]! };
    case 'fix':
      return { vraag: ex.sentence, antwoord: splitAlternatives(ex.answer)[0]! };
    case 'order':
      return { vraag: ex.nl ?? '', antwoord: ex.words.join(' ') };
  }
}

/** Een gemixte ronde: werkwoorden en grammatica door elkaar (#/grammatica/de/oefenen). */
export function MixSessionPage() {
  const { taal } = useParams();
  const lang = taal as LanguageCode;
  const navigate = useNavigate();
  const items = useVerbStore((s) => s.mix);
  const setStore = useVerbStore((s) => s.set);
  const dagdoel = useSettings((s) => s.dagdoel);
  const [index, setIndex] = useState(0);
  const [good, setGood] = useState(0);
  const [wrong, setWrong] = useState<MixItem[]>([]);
  const [round, setRound] = useState(0);
  const before = useRef<Profile | null>(null);
  const last = useRef(Date.now());
  const back = `/grammatica/${lang}`;
  const titles = new Map(practiceTopics(lang).map((t) => [t.id, t.title]));

  useEffect(() => {
    if (items.length === 0) navigate(back, { replace: true });
    void getProfile().then((p) => (before.current = p));
  }, []);
  if (items.length === 0) return null;

  const done = index >= items.length;
  const score = Math.round((good / items.length) * 100);
  const item = items[index];

  const answered = async (ok: boolean) => {
    const now = Date.now();
    await recordAnswer({ correct: ok, xp: ok ? 10 : 1, seconds: Math.min(now - last.current, 60_000) / 1000 });
    last.current = now;
    if (item?.q) await recordVerb(lang, item.q, ok);
    if (!ok && item) setWrong((w) => [...w, item]);
    const newGood = good + (ok ? 1 : 0);
    setGood(newGood);
    if (index + 1 >= items.length) {
      const pct = Math.round((newGood / items.length) * 100);
      await db.sessions.add({ id: newId(), type: `grammatica-mix-${lang}`, listIds: [], startedAt: now, endedAt: now, score: pct, answers: [] });
      const r = await finishRewards(before.current ?? (await getProfile()), { mode: 'grammatica', total: items.length, percentage: pct }, XP_FINISH, dagdoel);
      fireworks();
      if (pct === 100 || r.badges.length) celebrate(pct === 100);
      for (const b of r.badges) toast(`${b.emoji} Nieuwe badge: ${b.title}`);
    }
    setIndex((i) => i + 1);
  };

  const again = async () => {
    const mix = await prepareMix(lang);
    if (!mix.length) return navigate(back);
    setStore({ mix });
    before.current = await getProfile();
    last.current = Date.now();
    setIndex(0);
    setGood(0);
    setWrong([]);
    setRound((r) => r + 1);
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-5">
        <WellDone />
        <div className="rounded-[28px] border border-line bg-surface p-8 text-center shadow-soft">
          <p className="text-[56px] leading-none font-extrabold"><span className="marker">{good}/{items.length}</span></p>
          <p className="mt-2 text-lg font-bold">{score === 100 ? 'Alles goed!' : score >= 70 ? 'Lekker bezig!' : 'Goed geoefend. Nog een rondje?'}</p>
        </div>
        {wrong.length > 0 && (
          <section>
            <h2 className="mb-2 font-bold">Deze had je fout</h2>
            <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
              {wrong.map((w, i) => {
                const s = solution(w.ex);
                return (
                  <li key={i} className="px-4 py-2.5">
                    <span className="block text-sm text-ink-soft" lang={lang}><Rich text={s.vraag.replace('___', '…')} /></span>
                    <span className="block font-semibold" lang={lang}>{s.antwoord}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        <Button size="lg" className="justify-center" onClick={() => void again()}>Nog een ronde</Button>
        <Button size="lg" variant="secondary" className="justify-center" onClick={() => navigate(back)}>Terug naar {getLanguage(lang).name}</Button>
        <HomeButton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={() => navigate(back)} aria-label="Stoppen" className="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
          <X size={22} />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={index}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(index / items.length) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold text-ink-soft tabular-nums">{index}/{items.length}</span>
      </div>
      {item && (
        <>
          <p className="mb-2 inline-block rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink-soft">{titles.get(item.topic) ?? item.topic}</p>
          <ExerciseView key={`${round}-${index}`} ex={item.ex} lang={lang} onDone={(ok) => void answered(ok)} />
        </>
      )}
    </div>
  );
}
