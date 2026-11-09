import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { CharBar } from '@/components/ui/CharBar';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { checkAnswer, type CheckResult } from '@/lib/check';
import { insertAtCursor } from '@/lib/insert';
import { useSettings } from '@/lib/settings';
import { play } from '@/lib/sounds';
import type { Card } from '../engine';
import { AnswerDiff, Verdict } from './Feedback';

type Phase = { kind: 'vraag' } | { kind: 'uitslag'; check: CheckResult; given: string } | { kind: 'overtypen'; check: CheckResult; given: string };

/**
 * Typen: je ziet het woord en typt de vertaling.
 * In de toets-modus krijg je geen uitslag tussendoor en hoef je niets over te typen.
 */
export function TypeView({ card, test, onAnswer }: { card: Card; test: boolean; onAnswer: (correct: boolean, given: string) => void }) {
  const rules = useSettings((s) => s.nakijkregels);
  const [value, setValue] = useState('');
  const [phase, setPhase] = useState<Phase>({ kind: 'vraag' });
  const [retypeError, setRetypeError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const shake = useAnimationControls();

  useEffect(() => {
    setValue('');
    setPhase({ kind: 'vraag' });
    setRetypeError(false);
    input.current?.focus();
  }, [card.key]);

  useEffect(() => {
    if (phase.kind === 'uitslag') next.current?.focus();
    else input.current?.focus();
  }, [phase.kind]);

  const submit = () => {
    if (phase.kind === 'vraag') {
      const given = value;
      const check = checkAnswer(given, card.answer, rules, card.answerArticle);
      if (test) return onAnswer(check.result === 'goed', given);
      if (check.result === 'goed') {
        play('goed');
        if (!check.note) return onAnswer(true, given); // meteen door
        return setPhase({ kind: 'uitslag', check, given });
      }
      if (check.result === 'bijna') return setPhase({ kind: 'uitslag', check, given });
      play('fout');
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
      setValue('');
      return setPhase({ kind: 'overtypen', check, given });
    }
    if (phase.kind === 'overtypen') {
      // Eerst het goede antwoord één keer goed overtypen.
      const again = checkAnswer(value, card.answer, rules, card.answerArticle);
      if (again.result === 'goed') return onAnswer(false, phase.given);
      setRetypeError(true);
      void shake.start({ x: [0, -8, 8, 0], transition: { duration: 0.3 } });
    }
  };

  const showInput = phase.kind !== 'uitslag';

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5">
      <div className="flex w-full flex-col items-center gap-1 rounded-[28px] border border-line bg-surface px-6 py-8 text-center shadow-soft">
        <span className="text-[clamp(26px,7vw,40px)] leading-tight font-extrabold tracking-[-0.02em] break-words" lang={card.promptLang}>
          {card.prompt}
        </span>
        {!test && <SpeakButton text={card.prompt} lang={card.promptLang} />}
      </div>

      {phase.kind === 'uitslag' && phase.check.result === 'goed' && (
        <Verdict kind="goed">
          Let op het accent: <strong lang={card.answerLang}>{phase.check.expected}</strong>
        </Verdict>
      )}
      {phase.kind === 'uitslag' && phase.check.result === 'bijna' && (
        <Verdict kind="bijna">
          <AnswerDiff given={phase.given} expected={phase.check.expected} />
          <p className="mt-2 text-sm">Eén letter verschil. Jij beslist: telt het als goed?</p>
        </Verdict>
      )}
      {phase.kind === 'overtypen' && (
        <Verdict kind="fout">
          <AnswerDiff given={phase.given} expected={phase.check.expected} />
          <p className="mt-2 text-sm">Typ het goede antwoord één keer over. Dit woord komt straks nog terug.</p>
        </Verdict>
      )}

      {showInput && (
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <motion.div animate={shake}>
            <input
              ref={input}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setRetypeError(false);
              }}
              lang={card.answerLang}
              aria-label={phase.kind === 'overtypen' ? 'Typ het goede antwoord over' : `Vertaling in het ${card.answerLang === 'nl' ? 'Nederlands' : 'antwoord'}`}
              aria-invalid={retypeError}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={phase.kind === 'overtypen' ? 'Typ het goede antwoord over' : 'Typ je antwoord'}
              className="h-14 w-full rounded-2xl border-2 border-line bg-surface px-4 text-center text-xl font-semibold text-ink placeholder:text-ink-soft placeholder:font-normal focus-visible:border-primary aria-[invalid=true]:border-danger"
            />
          </motion.div>
          {retypeError && <p className="text-center text-sm font-semibold text-danger">Nog niet helemaal. Kijk goed naar het antwoord hierboven.</p>}
          <CharBar lang={card.answerLang} onPick={(c) => input.current && insertAtCursor(input.current, c)} className="justify-center" />
          <Button type="submit" size="lg" className="justify-center">
            {phase.kind === 'overtypen' ? 'Verder' : test ? 'Volgende' : 'Controleren'}
          </Button>
        </form>
      )}

      {phase.kind === 'uitslag' && phase.check.result === 'goed' && (
        <Button ref={next} size="lg" className="w-full justify-center" onClick={() => onAnswer(true, phase.given)}>
          Volgende
        </Button>
      )}
      {phase.kind === 'uitslag' && phase.check.result === 'bijna' && (
        <div className="grid w-full grid-cols-2 gap-3">
          <Button size="lg" variant="secondary" className="justify-center" onClick={() => onAnswer(false, phase.given)}>
            Telt als fout
          </Button>
          <Button ref={next} size="lg" className="justify-center" onClick={() => { play('goed'); onAnswer(true, phase.given); }}>
            Telt als goed
          </Button>
        </div>
      )}
    </div>
  );
}
