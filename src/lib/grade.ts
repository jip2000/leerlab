/**
 * Cijfer zoals op school: 1 + 9 × (aantal goed / totaal), afgerond op één decimaal.
 * Alles goed = 10, niets goed = 1.
 */
export function grade(correct: number, total: number): number {
  if (total <= 0) return 1;
  return Math.round((1 + 9 * (correct / total)) * 10) / 10;
}

/** Cijfer met komma, zoals in Nederland: 7,3 */
export const formatGrade = (g: number) => g.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
