import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import { diffChars } from '@/lib/diff';
import { levenshtein } from '@/lib/levenshtein';

/** Laat zien wat je typte en wat het goede antwoord is, met de verschillen gemarkeerd. */
export function AnswerDiff({ given, expected }: { given: string; expected: string }) {
  // Alleen per letter markeren als je antwoord er echt op lijkt; anders is dat verwarrend.
  const similar = given && levenshtein(given.toLowerCase(), expected.toLowerCase()) <= Math.max(2, Math.ceil(expected.length * 0.4));
  const parts = similar ? diffChars(given, expected) : [{ text: given, kind: 'teveel' as const }, { text: expected, kind: 'mist' as const }];
  return (
    <div className="grid gap-1 text-left">
      {given && (
        <p>
          <span className="text-sm text-ink-soft">Jij typte: </span>
          <span className="font-semibold">
            {parts.map((p, i) =>
              p.kind === 'mist' ? null : (
                <span key={i} className={p.kind === 'teveel' ? 'text-danger line-through decoration-2' : undefined}>
                  {p.text}
                </span>
              ),
            )}
          </span>
        </p>
      )}
      <p>
        <span className="text-sm text-ink-soft">Goed is: </span>
        <span className="font-bold">
          {parts.map((p, i) =>
            p.kind === 'teveel' ? null : (
              <span key={i} className={p.kind === 'mist' ? 'rounded bg-marker px-0.5 text-marker-ink' : undefined}>
                {p.text}
              </span>
            ),
          )}
        </span>
      </p>
    </div>
  );
}

/** Goed/fout-melding met icoon én tekst (nooit alleen kleur). */
export function Verdict({ kind, children }: { kind: 'goed' | 'bijna' | 'fout'; children?: React.ReactNode }) {
  const map = {
    goed: { Icon: CircleCheck, label: 'Goed!', cls: 'bg-primary-soft text-primary-ink' },
    bijna: { Icon: TriangleAlert, label: 'Bijna goed', cls: 'bg-marker/40 text-ink' },
    fout: { Icon: CircleX, label: 'Helaas, fout', cls: 'bg-danger/12 text-danger' },
  }[kind];
  return (
    <div role="status" className={`flex w-full flex-col gap-2 rounded-2xl p-4 ${map.cls}`}>
      <p className="flex items-center gap-2 font-extrabold">
        <map.Icon size={20} aria-hidden="true" /> {map.label}
      </p>
      {children && <div className="text-ink">{children}</div>}
    </div>
  );
}
