import confetti from 'canvas-confetti';

/** Confetti! Staat uit voor mensen die minder beweging willen (prefers-reduced-motion). */
export function celebrate(big = false) {
  const colors = ['#08805F', '#3DD6A0', '#FFE066', '#2F6FDB', '#D33F3F'];
  void confetti({ particleCount: big ? 160 : 90, spread: big ? 100 : 70, origin: { y: 0.65 }, colors, disableForReducedMotion: true });
  if (big) {
    setTimeout(() => void confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true }), 250);
    setTimeout(() => void confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true }), 400);
  }
}

/** Confetti meteen weghalen (bijv. als je naar een andere pagina gaat). */
export function stopConfetti(): void {
  confetti.reset();
}
