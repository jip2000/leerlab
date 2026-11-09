import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CharBar } from '@/components/ui/CharBar';
import type { LanguageCode } from '@/data/languages';
import { shuffled } from '@/features/practice/engine';
import { AnswerDiff, Verdict } from '@/features/practice/components/Feedback';
import { checkAnswer, splitAlternatives } from '@/lib/check';
import { insertAtCursor } from '@/lib/insert';
import { useSettings } from '@/lib/settings';
import { play } from '@/lib/sounds';
import { cn } from '@/lib/cn';
import type { Exercise } from '../types';
import { Rich } from './Rich';

const title: Record<Exercise['type'], string> = {
  gap: 'Vul in',
  choice: 'Kies het goede antwoord',
  table: 'Vul de tabel in',
  translate: 'Vertaal',
  fix: 'Zoek de fout en schrijf de goede zin',
  order: 'Zet de woorden in de goede volgorde',
};

/** Eén grammatica-oefening met nakijken en uitleg. */
export function ExerciseView({ ex, lang, onDone }: { ex: Exercise; lang: LanguageCode; onDone: (correct: boolean) => void }) {
  const rules = useSettings((s) => s.nakijkregels);
  const [value, setValue] = useState('');
  const [rows, setRows] = useState<string[]>(ex.type === 'table' ? ex.rows.map(() => '') : []);
  const [picked, setPicked] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [result, setResult] = useState<null | { ok: boolean; expected: string; rowsOk?: boolean[] }>(null);
  const [active, setActive] = useState<HTMLInputElement | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const tiles = useMemo(() => (ex.type === 'order' ? shuffled(ex.words.map((w, i) => ({ w, i }))) : []), [ex]);

  useEffect(() => (result ? next.current?.focus() : input.current?.focus()), [result]);

  const finish = (ok: boolean, expected: string, rowsOk?: boolean[]) => {
    play(ok ? 'goed' : 'fout');
    setResult({ ok, expected, rowsOk });
  };

  const check = () => {
    switch (ex.type) {
      case 'gap':
      case 'translate':
      case 'fix':
        return finish(checkAnswer(value, ex.answer, rules).result === 'goed', splitAlternatives(ex.answer)[0]!);
      case 'choice':
        return picked !== null && finish(picked === ex.answer, ex.options[ex.answer]!);
      case 'table': {
        const ok = ex.rows.map((r, i) => checkAnswer(rows[i]!, r.answer, rules).result === 'goed');
        return finish(ok.every(Boolean), '', ok);
      }
      case 'order': {
        const sentence = order.map((i) => ex.words[i]).join(' ');
        return finish(sentence === ex.words.join(' '), ex.words.join(' '));
      }
    }
  };

  const typed = ex.type === 'gap' || ex.type === 'translate' || ex.type === 'fix';
  const canCheck = typed ? value.trim() !== '' : ex.type === 'choice' ? picked !== null : ex.type === 'order' ? order.length === ex.words.length : true;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-ink-soft">{title[ex.type]}</p>
      <div className="rounded-[24px] border border-line bg-surface px-5 py-6 text-center shadow-soft">
        {ex.type === 'gap' && (
          <p className="text-xl font-semibold" lang={lang}>
            {ex.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="mx-1 inline-block min-w-14 border-b-2 border-ink-soft text-primary-ink">{result ? splitAlternatives(ex.answer)[0] : ' '}</span>}
              </span>
            ))}
            {ex.hint && <span className="mt-1 block text-sm font-normal text-ink-soft">({ex.hint})</span>}
          </p>
        )}
        {ex.type === 'choice' && <p className="text-xl font-semibold" lang={lang}>{ex.question}</p>}
        {ex.type === 'translate' && <p className="text-xl font-semibold">{ex.nl}</p>}
        {ex.type === 'fix' && <p className="text-xl font-semibold text-danger" lang={lang}><span className="sr-only">Foute zin: </span>{ex.sentence}</p>}
        {ex.type === 'table' && <p className="text-xl font-semibold" lang={lang}>{ex.title}</p>}
        {ex.type === 'order' && (
          <>
            {ex.nl && <p className="mb-3 text-ink-soft">{ex.nl}</p>}
            <p className="min-h-12 rounded-xl border-2 border-dashed border-line p-2 text-lg font-semibold" lang={lang} aria-live="polite">
              {order.length ? order.map((i) => ex.words[i]).join(' ') : <span className="font-normal text-ink-soft">Tik de woorden in de goede volgorde</span>}
            </p>
          </>
        )}
      </div>

      {!result && typed && (
        <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (canCheck) check(); }}>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            lang={lang}
            aria-label="Jouw antwoord"
            autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
            className="h-14 w-full rounded-2xl border-2 border-line bg-surface px-4 text-center text-lg font-semibold focus-visible:border-primary"
          />
          <CharBar lang={lang} onPick={(c) => input.current && insertAtCursor(input.current, c)} className="justify-center" />
          <Button type="submit" size="lg" className="justify-center" disabled={!canCheck}>Controleren</Button>
        </form>
      )}

      {ex.type === 'choice' && (
        <ul className="grid gap-2">
          {ex.options.map((o, i) => (
            <li key={o}>
              <button
                type="button"
                disabled={!!result}
                onClick={() => setPicked(i)}
                aria-pressed={picked === i}
                lang={lang}
                className={cn(
                  'min-h-13 w-full rounded-2xl border-2 px-4 py-2.5 text-left text-lg font-semibold',
                  result && i === ex.answer ? 'border-primary bg-primary-soft' : result && picked === i ? 'border-danger bg-danger/10' : picked === i ? 'border-primary' : 'border-line bg-surface',
                )}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}

      {ex.type === 'table' && (
        <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (!result) check(); }}>
          {ex.rows.map((r, i) => (
            <label key={i} className={cn('grid grid-cols-[120px_1fr] items-center gap-2 rounded-xl p-1', result?.rowsOk && (result.rowsOk[i] ? 'bg-primary-soft' : 'bg-danger/10'))}>
              <span className="pl-2 font-semibold text-ink-soft">{r.label}</span>
              <span>
                <input
                  autoFocus={i === 0}
                  value={rows[i]}
                  readOnly={!!result}
                  onFocus={(e) => setActive(e.currentTarget)}
                  onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? e.target.value : x)))}
                  lang={lang}
                  aria-label={r.label}
                  autoComplete="off" autoCapitalize="off" spellCheck={false}
                  className="h-11 w-full rounded-xl border border-line bg-surface px-3 font-semibold"
                />
                {result?.rowsOk && !result.rowsOk[i] && <span className="mt-0.5 block text-sm font-semibold text-danger" lang={lang}>✗ {splitAlternatives(r.answer)[0]}</span>}
              </span>
            </label>
          ))}
          {!result && (
            <>
              <CharBar lang={lang} onPick={(c) => active && insertAtCursor(active, c)} className="justify-center" />
              <Button type="submit" size="lg" className="justify-center">Nakijken</Button>
            </>
          )}
        </form>
      )}

      {ex.type === 'order' && !result && (
        <>
          <div className="flex flex-wrap justify-center gap-2">
            {tiles.map(({ w, i }) => (
              <button
                key={i}
                type="button"
                disabled={order.includes(i)}
                onClick={() => setOrder((o) => [...o, i])}
                className="min-h-11 rounded-xl border-2 border-line bg-surface px-3 font-semibold disabled:opacity-30"
                lang={lang}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setOrder((o) => o.slice(0, -1))} disabled={order.length === 0}>Laatste weg</Button>
            <Button className="flex-1 justify-center" onClick={check} disabled={!canCheck}>Controleren</Button>
          </div>
        </>
      )}
      {ex.type === 'choice' && !result && <Button size="lg" className="justify-center" onClick={check} disabled={!canCheck}>Controleren</Button>}

      {result && (
        <>
          <Verdict kind={result.ok ? 'goed' : 'fout'}>
            {!result.ok && typed && <AnswerDiff given={value} expected={result.expected} />}
            {!result.ok && (ex.type === 'choice' || ex.type === 'order') && <p>Goed is: <strong lang={lang}>{result.expected}</strong></p>}
            {ex.explain && <p className="mt-1 text-sm">💡 <Rich text={ex.explain} /></p>}
          </Verdict>
          <Button ref={next} size="lg" className="justify-center" onClick={() => onDone(result.ok)}>Volgende</Button>
        </>
      )}
    </div>
  );
}
