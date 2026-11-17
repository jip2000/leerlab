import { motion } from 'motion/react';
import { House } from 'lucide-react';
import { ButtonLink } from './ButtonLink';

/** "Goed gedaan!" bovenaan het eindscherm van elke oefening. */
export function WellDone({ text = 'Goed gedaan!' }: { text?: string }) {
  return (
    <motion.h1
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className="text-center text-[32px] leading-tight font-extrabold tracking-[-0.025em]"
    >
      🎉 {text}
    </motion.h1>
  );
}

/** Knop terug naar het hoofdmenu (Home). */
export function HomeButton() {
  return (
    <ButtonLink to="/" variant="secondary" className="h-13 justify-center gap-2">
      <House size={18} aria-hidden="true" /> Naar het hoofdmenu
    </ButtonLink>
  );
}
