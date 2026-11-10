import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpeakButton } from '@/components/ui/SpeakButton';
import type { Card } from '../engine';
import { shownAnswer } from '../choices';
import { WordImage } from '@/components/ui/WordImage';

/**
 * Flashcard: tik (of spatie) om om te draaien. Daarna "Wist ik" / "Wist ik niet",
 * of swipe naar rechts (wist ik) / links (wist ik niet). Pijltjestoetsen werken ook.
 */
export function FlashcardView({ card, onAnswer }: { card: Card; onAnswer: (knew: boolean) => void }) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const yesOpacity = useTransform(x, [20, 120], [0, 1]);
  const noOpacity = useTransform(x, [-120, -20], [1, 0]);

  useEffect(() => {
    setFlipped(false);
    x.set(0);
  }, [card.key, x]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target instanceof HTMLButtonElement && e.key === 'Enter') return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === 'ArrowRight' || e.key === '2')) onAnswer(true);
      else if (flipped && (e.key === 'ArrowLeft' || e.key === '1')) onAnswer(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, onAnswer]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (!flipped) return;
    if (info.offset.x > 100) onAnswer(true);
    else if (info.offset.x < -100) onAnswer(false);
  };

  const face = 'absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[28px] border border-line bg-surface p-6 text-center shadow-soft [backface-visibility:hidden]';

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        drag={flipped ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={onDragEnd}
        style={{ x, rotate }}
        className="relative w-full max-w-md touch-pan-y"
      >
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? `Antwoord: ${shownAnswer(card)}. Tik om terug te draaien.` : `Vraag: ${card.prompt}. Tik om om te draaien.`}
          className="relative block aspect-[4/3] w-full [perspective:1200px]"
        >
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className={face}>
              {card.imageId && <WordImage id={card.imageId} className="max-h-[40%] w-auto" alt="" />}
              <span className="text-[clamp(28px,8vw,44px)] leading-tight font-extrabold tracking-[-0.02em] break-words" lang={card.promptLang}>
                {card.prompt}
              </span>
              <span className="text-sm text-ink-soft">Tik of druk op spatie om om te draaien</span>
            </div>
            <div className={`${face} [transform:rotateY(180deg)]`}>
              <span className="text-[clamp(28px,8vw,44px)] leading-tight font-extrabold tracking-[-0.02em] text-primary-ink break-words" lang={card.answerLang}>
                {shownAnswer(card)}
              </span>
              {card.extra && <span className="max-w-[32ch] text-sm text-ink-soft">{card.extra}</span>}
            </div>
          </motion.div>
        </button>
        {/* Swipe-labels */}
        <motion.span style={{ opacity: yesOpacity }} className="pointer-events-none absolute top-4 left-4 rounded-full bg-primary px-3 py-1 font-bold text-on-primary">
          Wist ik
        </motion.span>
        <motion.span style={{ opacity: noOpacity }} className="pointer-events-none absolute top-4 right-4 rounded-full bg-danger px-3 py-1 font-bold text-white">
          Wist ik niet
        </motion.span>
      </motion.div>

      <div className="flex items-center gap-2">
        <SpeakButton text={flipped ? shownAnswer(card) : card.prompt} lang={flipped ? card.answerLang : card.promptLang} />
      </div>

      {flipped ? (
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          <Button size="lg" variant="secondary" className="justify-center" icon={<X size={20} aria-hidden="true" />} onClick={() => onAnswer(false)}>
            Wist ik niet
          </Button>
          <Button size="lg" className="justify-center" icon={<Check size={20} aria-hidden="true" />} onClick={() => onAnswer(true)}>
            Wist ik
          </Button>
        </div>
      ) : (
        <Button size="lg" variant="secondary" className="w-full max-w-md justify-center" onClick={() => setFlipped(true)}>
          Omdraaien
        </Button>
      )}
      <p className="hidden text-sm text-ink-soft lg:block">Spatie = omdraaien, ← wist ik niet, → wist ik. Op je telefoon kun je swipen.</p>
    </div>
  );
}
