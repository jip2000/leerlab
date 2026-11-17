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

/**
 * Vuurwerk als je een oefening afrondt: een paar seconden knallen op willekeurige plekken.
 * Ook dit staat uit bij prefers-reduced-motion.
 */
export function fireworks(seconds = 2.5): void {
  const colors = ['#08805F', '#3DD6A0', '#FFE066', '#2F6FDB', '#D33F3F', '#C23A6B'];
  const end = Date.now() + seconds * 1000;
  const burst = () => {
    for (const side of [[0.1, 0.35], [0.65, 0.9]] as const) {
      void confetti({
        particleCount: 45,
        startVelocity: 32,
        spread: 360,
        ticks: 70,
        gravity: 0.9,
        zIndex: 70,
        origin: { x: side[0] + Math.random() * (side[1] - side[0]), y: 0.15 + Math.random() * 0.3 },
        colors,
        disableForReducedMotion: true,
      });
    }
  };
  burst();
  const timer = setInterval(() => (Date.now() > end ? clearInterval(timer) : burst()), 320);
}
